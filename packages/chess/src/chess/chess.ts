import { File, PieceColour, PieceName, Square } from "@chessviewer/types";
import { PieceNotFoundError, isDefined, squareToIdx } from "@chessviewer/utils";

import ChessPiece from "../chessPiece/chessPiece";
import { getInitialBoard } from "./createChessBoard";

export default class Chess {
  readonly board;
  constructor() {
    this.board = getInitialBoard();
  }

  getPieceAt(space: Square): ChessPiece | null {
    const idx = squareToIdx(space);

    return this.board[idx] ?? null;
  }

  findPiece(
    type: PieceName,
    colour: PieceColour,
    destination: Square,
    startingFile?: File
  ): ChessPiece | null {
    return (
      this.board.find((square) => {
        return (
          square &&
          (startingFile
            ? square.currentSquare.charAt(0) === startingFile
            : true) &&
          square.type === type &&
          square.colour === colour &&
          square.possibleMoves.includes(destination)
        );
      }) ?? null
    );
  }

  movePiece(from: Square, to: Square): void {
    const piece = this.getPieceAt(from);

    if (!isDefined(piece)) {
      throw new PieceNotFoundError(from);
    }

    piece.movePiece(to);
    this.board[squareToIdx(to)] = piece;
    this.board[squareToIdx(from)] = null;

    return;
  }
}
