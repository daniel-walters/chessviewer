import { Chess } from "@chessviewer/chess";
import {
  PGNPieceMap,
  Results,
  assertIsDefined,
  assertIsFile,
  assertIsSquare,
  isDefined,
  splitSquare,
} from "@chessviewer/utils";
import { PGNMovesByTurn, filterTakenSquares } from "./utils";
import {
  PGNPieceName,
  PieceColour,
  PieceName,
  Square,
} from "@chessviewer/types";

export enum Move {
  "MOVE",
  "CAPTURE",
  "RESULT",
  "CASTLE_LONG",
  "CASTLE_SHORT",
  "PROMOTE",
}
export enum CaptureType {
  "PAWN",
  "PIECE",
}
export enum MoveType {
  "PAWN",
  "PIECE",
}
export enum CastleType {
  "SHORT",
  "LONG",
}
export type MoveInformation = {
  from: Square | null;
  to: Square | null;
  type: Move;
  player: PieceColour;
  promoteTo?: PieceName;
  capturedPiece?: PieceName;
  rawPGN: string;
  enpassant?: boolean;
  capturedSquare?: Square
};
export type TurnInformation = [MoveInformation, MoveInformation]; // [white, black]
export type ParsedMoves = TurnInformation[];
export type ParsedMeta = {
  white?: string;
  black?: string;
  result?: string;
};

export default class PGNParser {
  readonly meta;
  readonly moves;
  readonly chess;
  tempCounter = 0;

  constructor(pgn: string) {
    this.chess = new Chess();

    const [meta, moves] = this.#parse(pgn);

    this.meta = meta;
    this.moves = moves;
  }

  #parse(pgn: string): [ParsedMeta, ParsedMoves] {
    const split = pgn.split("\n\n");
    const rawMeta = split[0] || "";
    const rawMoves = split[1] || "";
    const turns: TurnInformation[] = [];

    const PGNTurns = this.#PGNMovesByTurn(
      split.length === 1 ? rawMeta : rawMoves
    );

    PGNTurns.forEach((turn) => {
      turns.push(this.#parseTurn(turn));
    });

    const meta = this.#parseMeta(rawMeta);

    return [meta, turns];
  }

  #parseMeta(rawMeta: string): ParsedMeta {
    const lines = rawMeta.split("\n");
    const meta: ParsedMeta = {} as any;

    lines.forEach((line) => {
      if (line.toLowerCase().includes("white ")) {
        const data = line.match(/(".*?")/)?.[0].replaceAll('"', "");
        meta.white = data;
      }
      if (line.toLowerCase().includes("black ")) {
        const data = line.match(/(".*?")/)?.[0].replaceAll('"', "");
        meta.black = data;
      }
      if (line.toLowerCase().includes("result ")) {
        const data = line.match(/(".*?")/)?.[0].replaceAll('"', "");
        meta.result = data;
      }
    });

    return meta;
  }

  #parseTurn(turn: string): TurnInformation {
    const moves = turn.split(" ");
    const white = moves[0];
    const black = moves[1];
    const turnInfo: TurnInformation = [] as any;

    if (isDefined(white) && isDefined(black)) {
      turnInfo.push(this.#parseMove(white, "White"));
      turnInfo.push(this.#parseMove(black, "Black"));
    }

    this.tempCounter++;
    return turnInfo;
  }

  #parseMove(move: string, player: PieceColour): MoveInformation {
    if (move.includes("x")) {
      return this.#parseCapture(move, player);
    } else if (move === "O-O-O" || move === "O-O") {
      const type = move === "O-O" ? CastleType.SHORT : CastleType.LONG;
      return this.#handleCastle(player, type, move);
    } else if (Results.includes(move as any)) {
      return { type: Move.RESULT, from: null, to: null, player, rawPGN: move };
    } else {
      return this.#parseMovement(move, player);
    }
  }

  #parseMovement(move: string, player: PieceColour): MoveInformation {
    let moveType: MoveType;

    if (move.match(/^[a-h][1-8]/)) {
      moveType = MoveType.PAWN;
    } else if (move.match(/^[KQBRN][a-g]/)) {
      moveType = MoveType.PIECE;
    } else {
      throw new Error("MoveType could not be determined: " + move);
    }

    return this.#handleMove(move, player, moveType);
  }

  #handleCastle(
    player: PieceColour,
    type: CastleType,
    move: string
  ): MoveInformation {
    const info: MoveInformation = {
      to: null,
      from: null,
      player,
      rawPGN: move,
    } as any;

    if (type === CastleType.SHORT) {
      info.type = Move.CASTLE_SHORT;
      if (player === "White") {
        this.chess.movePiece("e1", "g1");
        this.chess.movePiece("h1", "f1");
      } else {
        this.chess.movePiece("e8", "g8");
        this.chess.movePiece("h8", "f8");
      }
    } else {
      info.type = Move.CASTLE_LONG;
      if (player === "White") {
        this.chess.movePiece("e1", "c1");
        this.chess.movePiece("a1", "d1");
      } else {
        this.chess.movePiece("e8", "c8");
        this.chess.movePiece("a8", "d8");
      }
    }

    return info;
  }

  #handleMove(
    move: string,
    player: PieceColour,
    type: MoveType
  ): MoveInformation {
    const info: MoveInformation = {
      type: Move.MOVE,
      player,
      rawPGN: move,
    } as any;

    switch (type) {
      case MoveType.PAWN: {
        const square = move.substring(0, 2);
        assertIsSquare(square);

        const originFile = square.charAt(0);
        assertIsFile(originFile);

        let originSquare: Square = undefined as any;
        const possibleSquares = this.chess.findPiece(
          "Pawn",
          player,
          square,
          originFile
        );

        if (possibleSquares.length === 1) {
          originSquare = possibleSquares[0]!.currentSquare;
        } else {
          originSquare = filterTakenSquares("Pawn", possibleSquares, square, this.chess).currentSquare;
        }

        assertIsDefined(originSquare);

        info.from = originSquare;
        info.to = square;
        this.chess.movePiece(originSquare, square);

        if (move.includes("=")) {
          const promoteTo = move.match(/[QNRB]/)?.[0];
          assertIsDefined(promoteTo);
          info.type = Move.PROMOTE;
          info.promoteTo = PGNPieceMap[promoteTo as PGNPieceName];
          this.chess.promotePiece(square, info.promoteTo);
        }

        break;
      }
      case MoveType.PIECE: {
        const pgnPiece = move.charAt(0) as PGNPieceName;
        const piece = PGNPieceMap[pgnPiece];
        const data = move.substring(1);

        if (data.match(/^[a-g][a-g][1-8]/)) {
          const originFile = data.charAt(0);
          const targetSquare = data.substring(1);

          assertIsFile(originFile);
          assertIsSquare(targetSquare);

          let originSquare: Square = undefined as any;
          const possibleSquares = this.chess.findPiece(
            piece,
            player,
            targetSquare,
            originFile
          );

          if (possibleSquares.length === 1) {
            originSquare = possibleSquares[0]!.currentSquare;
          } else {
            originSquare = filterTakenSquares(
              piece,
              possibleSquares,
              targetSquare,
              this.chess
            ).currentSquare;
          }

          assertIsDefined(originSquare);

          info.from = originSquare;
          info.to = targetSquare;

          this.chess.movePiece(originSquare, targetSquare);
        } else if (data.match(/[a-g][1-8]/)) {
          const targetSquare = data.substring(0, 2);

          assertIsSquare(targetSquare);

          let originSquare: Square = undefined as any;
          const possibleSquares = this.chess.findPiece(
            piece,
            player,
            targetSquare
          );

          if (possibleSquares.length === 1) {
            originSquare = possibleSquares[0]!.currentSquare;
          } else {
            originSquare = filterTakenSquares(
              piece,
              possibleSquares,
              targetSquare,
              this.chess
            ).currentSquare;
          }

          assertIsDefined(originSquare);

          info.from = originSquare;
          info.to = targetSquare;

          this.chess.movePiece(originSquare, targetSquare);
        } else {
          throw new Error(
            "Target square for piece movement could not be determined"
          );
        }
        break;
      }
    }

    return info;
  }

  #parseCapture(move: string, player: PieceColour): MoveInformation {
    let captureType: CaptureType;

    if (move.match(/^[a-h]x/)) {
      captureType = CaptureType.PAWN;
    } else if (move.match(/^[KQRBN]/)) {
      captureType = CaptureType.PIECE;
    } else {
      throw new Error("CaptureType could not be determined");
    }

    return this.#handleCapture(move, player, captureType);
  }

  #handleCapture(
    move: string,
    player: PieceColour,
    type: CaptureType
  ): MoveInformation {
    const info: MoveInformation = {
      type: Move.CAPTURE,
      player,
      rawPGN: move,
    } as any;

    switch (type) {
      case CaptureType.PAWN: {
        const data = move.split("x");
        const pawnFile = data[0];
        const captureSquare = data[1]?.substring(0, 2);

        assertIsDefined(pawnFile);
        assertIsDefined(captureSquare);
        assertIsSquare(captureSquare);
        assertIsFile(pawnFile);

        const originSquare = this.chess.findPiece(
          "Pawn",
          player,
          captureSquare,
          pawnFile
        )[0]?.currentSquare;

        assertIsDefined(originSquare);

        info.from = originSquare;
        info.to = captureSquare;

        info.capturedPiece = this.chess.getPieceAt(captureSquare)?.type;

        if (!this.chess.getPieceAt(captureSquare)) {
          const [epFile, epRank] = splitSquare(captureSquare);
          const direction = player === "White" ? -1 : +1;

          const enPassantSquare = `${epFile}${Number(epRank) + direction}`;
          assertIsSquare(enPassantSquare);

          this.chess.deletePiece(enPassantSquare);
          info.capturedPiece = "Pawn";
          info.enpassant = true;
          info.capturedSquare = enPassantSquare;
        }

        this.chess.movePiece(originSquare, captureSquare);

        if (move.includes("=")) {
          const promoteTo = move.match(/[QNRB]/)?.[0];
          assertIsDefined(promoteTo);
          info.type = Move.PROMOTE;
          info.promoteTo = PGNPieceMap[promoteTo as PGNPieceName];
          this.chess.promotePiece(captureSquare, info.promoteTo);
        }

        break;
      }
      case CaptureType.PIECE: {
        const pgnPiece = move.charAt(0) as PGNPieceName;
        const piece = PGNPieceMap[pgnPiece];
        const data = move.substring(1);

        if (data.match(/^x/)) {
          const targetSquare = data.substring(1, 3);

          assertIsSquare(targetSquare);

          let originSquare: Square = undefined as any;
          const possibleSquares = this.chess.findPiece(
            piece,
            player,
            targetSquare
          );

          if (possibleSquares.length === 1) {
            originSquare = possibleSquares[0]!.currentSquare;
          } else {
            originSquare = filterTakenSquares(
              piece,
              possibleSquares,
              targetSquare,
              this.chess
            ).currentSquare;
          }

          assertIsDefined(originSquare);

          info.from = originSquare;
          info.to = targetSquare;
          info.capturedPiece = this.chess.getPieceAt(targetSquare)?.type;
          this.chess.movePiece(originSquare, targetSquare);
        } else if (data.match(/^[a-h]x/)) {
          const originFile = data.charAt(0);
          const targetSquare = data.substring(2);

          assertIsFile(originFile);
          assertIsFile(originFile);
          assertIsSquare(targetSquare);

          let originSquare: Square = undefined as any;
          const possibleSquares = this.chess.findPiece(
            piece,
            player,
            targetSquare,
            originFile
          );

          if (possibleSquares.length === 1) {
            originSquare = possibleSquares[0]!.currentSquare;
          } else {
            originSquare = filterTakenSquares(
              piece,
              possibleSquares,
              targetSquare,
              this.chess
            ).currentSquare;
          }

          assertIsDefined(originSquare);

          info.from = originSquare;
          info.to = targetSquare;

          info.capturedPiece = this.chess.getPieceAt(targetSquare)?.type;
          this.chess.movePiece(originSquare, targetSquare);
        } else {
          throw new Error("Error capturing piece");
        }

        break;
      }
    }

    return info;
  }

  #PGNMovesByTurn = PGNMovesByTurn;
}
