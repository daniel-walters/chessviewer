"use client";

import { motion } from "framer-motion";
import { Piece, PieceColour, Square } from "@chessviewer/types";
import { Move, PGNParser } from "@chessviewer/parser";

import pgn from "../test";
import bPSVG from "../../public/bP.svg";
import bRSVG from "../../public/bR.svg";
import bNSVG from "../../public/bN.svg";
import bBSVG from "../../public/bB.svg";
import bKSVG from "../../public/bK.svg";
import bQSVG from "../../public/bQ.svg";
import wPSVG from "../../public/wP.svg";
import wRSVG from "../../public/wR.svg";
import wNSVG from "../../public/wN.svg";
import wBSVG from "../../public/wB.svg";
import wKSVG from "../../public/wK.svg";
import wQSVG from "../../public/wQ.svg";

import styles from "./page.module.scss";
import { useState } from "react";
import Image from "next/image";
import { getNumericFile, isDefined, splitSquare } from "@chessviewer/utils";
import classNames from "classnames";

const PieceMap: Record<Piece, string> = {
  BlackPawn: bPSVG,
  BlackRook: bRSVG,
  BlackKnight: bNSVG,
  BlackBishop: bBSVG,
  BlackKing: bKSVG,
  BlackQueen: bQSVG,
  WhitePawn: wPSVG,
  WhiteRook: wRSVG,
  WhiteKnight: wNSVG,
  WhiteBishop: wBSVG,
  WhiteKing: wKSVG,
  WhiteQueen: wQSVG,
};

type IDPiece = {
  piece: Piece | null;
  id: string;
};

type Chessboard = IDPiece[];

const getInitPieces = (colour: PieceColour): Chessboard => {
  const row: Chessboard = [];
  const isBlack = colour === "Black";

  row.push({ piece: `${colour}Rook`, id: isBlack ? "0" : "56" });
  row.push({ piece: `${colour}Knight`, id: isBlack ? "1" : "57" });
  row.push({ piece: `${colour}Bishop`, id: isBlack ? "2" : "58" });
  row.push({ piece: `${colour}Queen`, id: isBlack ? "3" : "59" });
  row.push({ piece: `${colour}King`, id: isBlack ? "4" : "60" });
  row.push({ piece: `${colour}Bishop`, id: isBlack ? "5" : "61" });
  row.push({ piece: `${colour}Knight`, id: isBlack ? "6" : "62" });
  row.push({ piece: `${colour}Rook`, id: isBlack ? "7" : "63" });

  return row;
};

const getInitPawns = (colour: PieceColour): Chessboard => {
  const row: Chessboard = [];
  const offset = colour === "Black" ? 8 : 48;

  for (let i = 0; i < 8; i++) {
    row.push({ piece: `${colour}Pawn`, id: String(i + offset) });
  }

  return row;
};

const setupBoard = (): Chessboard => {
  const chessboard: Chessboard = [];

  chessboard.push(...getInitPieces("Black"));
  chessboard.push(...getInitPawns("Black"));

  for (let i = 0; i < 32; i++) {
    chessboard.push({ piece: null, id: String(i + 16) });
  }

  chessboard.push(...getInitPawns("White"));
  chessboard.push(...getInitPieces("White"));

  return chessboard;
};

const squareToIdx = (square: Square, orientation: PieceColour): number => {
  const [file, rank] = splitSquare(square);

  const rankNum = Math.abs(8 - Number(rank));
  const fileNum = getNumericFile(file) - 1;

  if (orientation === "White") {
    return 8 * rankNum + fileNum;
  }

  return 0;
};

const movePiece = (
  from: Square,
  to: Square,
  chessboard: Chessboard,
  type: Move
): Chessboard => {
  const fromIdx = squareToIdx(from, "White");
  const toIdx = squareToIdx(to, "White");

  const clonedBoard = [...chessboard];

  const fromSquare = clonedBoard[fromIdx];
  const toSquare = clonedBoard[toIdx];

  if (isDefined(fromSquare) && isDefined(toSquare)) {
    switch (type) {
      case Move.MOVE:
      case Move.CASTLE_LONG:
      case Move.CASTLE_SHORT: {
        clonedBoard[fromIdx] = toSquare;
        clonedBoard[toIdx] = fromSquare;
        break;
      }
      case Move.CAPTURE: {
        toSquare.piece = null;
        clonedBoard[fromIdx] = toSquare;
        clonedBoard[toIdx] = fromSquare;
        break;
      }
    }
  } else {
    throw new Error("Cant move");
  }

  return clonedBoard;
};

export default function Home() {
  const parser = new PGNParser(pgn);

  const [curMove, setCurMove] = useState(-1);
  const [chessboard, setChessboard] = useState(setupBoard());
  const [curPgn, setCurPgn] = useState<string>(pgn);
  const [moves, setMoves] = useState(parser.moves.flat());

  const handleMove = (direction: "NEXT" | "PREV") => {
    const dirConst = direction === "NEXT" ? 1 : -1;

    const displayMove = moves[curMove + dirConst];

    switch (displayMove?.type) {
      case Move.MOVE:
      case Move.CAPTURE: {
        const { from, to } = displayMove;

        if (isDefined(from) && isDefined(to)) {
          const updatedBoard = movePiece(
            from,
            to,
            chessboard,
            displayMove.type
          );
          setChessboard(updatedBoard);
        }

        break;
      }
      case Move.RESULT: {
        alert("GAME OVER");
        break;
      }
      case Move.CASTLE_LONG: {
        if (displayMove.player === "White") {
          const boardChangeOne = movePiece(
            "e1",
            "c1",
            chessboard,
            displayMove.type
          );
          const updatedBoard = movePiece(
            "a1",
            "d1",
            boardChangeOne,
            displayMove.type
          );

          setChessboard(updatedBoard);
        } else {
          const boardChangeOne = movePiece(
            "e8",
            "c8",
            chessboard,
            displayMove.type
          );
          const updatedBoard = movePiece(
            "a8",
            "d8",
            boardChangeOne,
            displayMove.type
          );

          setChessboard(updatedBoard);
        }
        break;
      }
      case Move.CASTLE_SHORT: {
        if (displayMove.player === "White") {
          const boardChangeOne = movePiece(
            "e1",
            "g1",
            chessboard,
            displayMove.type
          );
          const updatedBoard = movePiece(
            "h1",
            "f1",
            boardChangeOne,
            displayMove.type
          );

          setChessboard(updatedBoard);
        } else {
          const boardChangeOne = movePiece(
            "e8",
            "g8",
            chessboard,
            displayMove.type
          );
          const updatedBoard = movePiece(
            "h8",
            "f8",
            boardChangeOne,
            displayMove.type
          );

          setChessboard(updatedBoard);
        }
        break;
      }
    }

    setCurMove(curMove + dirConst);
  };

  return (
    <main>
      <div className={styles["chess-board"]}>
        {chessboard.map((_, i) => {
          return <div key={i} className={styles["chess-board--square"]} />;
        })}
      </div>
      <div
        className={classNames(styles["chess-board"], styles["inner-pieces"])}
      >
        {chessboard.map((piece) => {
          return (
            <motion.div
              key={piece.id}
              className={styles["chess-board--square__inner"]}
              transition={{
                layout: { duration: 0.3, ease: "linear" },
              }}
              layout
            >
              {piece.piece && <Image src={PieceMap[piece.piece]} alt="" />}
            </motion.div>
          );
        })}
      </div>
      <button disabled={curMove <= 0} onClick={() => handleMove("PREV")}>
        Prev move
      </button>
      <button
        disabled={curMove === moves.length - 1}
        onClick={() => handleMove("NEXT")}
      >
        Next move
      </button>
      <textarea value={curPgn} onChange={(e) => setCurPgn(e.target.value)} />
      <button
        onClick={() => {
          setCurMove(-1);
          setChessboard(setupBoard());
          const pgnParser = new PGNParser(curPgn);
          setMoves(pgnParser.moves.flat());
          console.log(curPgn);
        }}
      >
        Load game
      </button>
    </main>
  );
}
