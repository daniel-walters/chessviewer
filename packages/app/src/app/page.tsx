"use client";
import styles from "./page.module.scss";

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
import Image from "next/image";

type Piece = "Pawn" | "Rook" | "Knight" | "Bishop" | "King" | "Queen";

type Colour = "Black" | "White";

type Pieces = `${Colour}${Piece}`;

const PieceMap: Record<Pieces, string> = {
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

function getDefaultBlackSetup(): Pieces[] {
  const setup: Pieces[] = [
    "BlackRook",
    "BlackKnight",
    "BlackBishop",
    "BlackQueen",
    "BlackKing",
    "BlackBishop",
    "BlackKnight",
    "BlackRook",
  ];

  for (let i = 0; i < 8; i++) {
    setup.push("BlackPawn");
  }

  return setup;
}

function getDefaultWhiteSetup(): Pieces[] {
  const setup: Pieces[] = [];

  for (let i = 0; i < 8; i++) {
    setup.push("WhitePawn");
  }

  setup.push(
    "WhiteRook",
    "WhiteKnight",
    "WhiteBishop",
    "WhiteQueen",
    "WhiteKing",
    "WhiteBishop",
    "WhiteKnight",
    "WhiteRook"
  );

  return setup;
}

function initBoard() {
  const board: (null | Pieces)[] = [];
  const blackSetup = getDefaultBlackSetup();
  const whiteSetup = getDefaultWhiteSetup();

  board.push(...blackSetup);

  for (let i = 0; i < 32; i++) {
    board.push(null);
  }

  board.push(...whiteSetup);

  return board;
}

export default function Home() {
  const board = initBoard();

  return (
    <main>
      <div className={styles["chess-board"]}>
        {board.map((piece, i) => {
          return (
            <div key={`${i}`} className={styles["chess-board--square"]}>
              {piece && <Image alt="" src={PieceMap[piece]} />}
            </div>
          );
        })}
      </div>
    </main>
  );
}
