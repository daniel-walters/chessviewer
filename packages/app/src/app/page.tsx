"use client";
import classNames from "classnames";
import { useState } from "react";
import Image from "next/image";

import { Piece, PieceColour, Square } from "@chessviewer/types";
import { PGNParser, Move } from "@chessviewer/parser";
import { Chess } from "@chessviewer/chess";

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
import { squareToIdx } from "@chessviewer/utils";

console.log(pgn);

const formatBoard = (board: Chess["board"]): Chess["board"] => {
  const one = board.slice(0, 8);
  const two = board.slice(8, 16);
  const three = board.slice(16, 24);
  const four = board.slice(24, 32);
  const five = board.slice(32, 40);
  const six = board.slice(40, 48);
  const seven = board.slice(48, 56);
  const eight = board.slice(56, 64);

  return [
    ...one.reverse(),
    ...two.reverse(),
    ...three.reverse(),
    ...four.reverse(),
    ...five.reverse(),
    ...six.reverse(),
    ...seven.reverse(),
    ...eight.reverse(),
  ];
};

const adjustIndexForView = (idx: number): number => {
  const startOfRow = Math.floor(idx / 8) * 8;

  return startOfRow + 7 - (idx - startOfRow);
};

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

const getPlayer = (move: number): PieceColour => {
  if (move === 0) {
    return "White";
  } else if (move === 1) {
    return "Black";
  } else {
    return move % 2 ? "White" : "Black";
  }
};

export default function Home() {
  const parser = new PGNParser(pgn);
  const moves = parser.moves;

  const [chess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board);
  const [turn, setTurn] = useState(0);
  const [move, setMove] = useState(0);
  const [highlightSquares, setHighlightSquares] = useState<number[]>([]);

  const handleMove = () => {
    const turnToShow = moves[turn];
    const player: PieceColour = getPlayer(move);
    const moveToShow = turnToShow?.[player === "White" ? 0 : 1];

    if (moveToShow) {
      switch (moveToShow.type) {
        case Move.MOVE: {
          if (moveToShow.from && moveToShow.to) {
            chess.movePiece(moveToShow.from, moveToShow.to);
          }
          const toHighlight = [
            adjustIndexForView(Number(squareToIdx(moveToShow.to as Square))) ??
              -1,
            adjustIndexForView(
              Number(squareToIdx(moveToShow.from as Square))
            ) ?? -1,
          ];
          setHighlightSquares(toHighlight);
          break;
        }
        case Move.CAPTURE: {
          if (moveToShow.from && moveToShow.to) {
            chess.movePiece(moveToShow.from, moveToShow.to);
          }
          const toHighlight = [
            adjustIndexForView(Number(squareToIdx(moveToShow.to as Square))) ??
              -1,
            adjustIndexForView(
              Number(squareToIdx(moveToShow.from as Square))
            ) ?? -1,
          ];
          setHighlightSquares(toHighlight);
          break;
        }
        case Move.RESULT: {
          alert("GAME FINISHED");
          break;
        }
        case Move.CASTLE_LONG: {
          if (player === "White") {
            chess.movePiece("e1", "c1");
            chess.movePiece("a1", "d1");
            setHighlightSquares([
              adjustIndexForView(squareToIdx("e1")),
              adjustIndexForView(squareToIdx("c1")),
            ]);
          } else if (player === "Black") {
            chess.movePiece("e8", "c8");
            chess.movePiece("a8", "d8");
            setHighlightSquares([
              adjustIndexForView(squareToIdx("e8")),
              adjustIndexForView(squareToIdx("c8")),
            ]);
          }
          break;
        }
        case Move.CASTLE_SHORT: {
          if (player === "White") {
            chess.movePiece("e1", "g1");
            chess.movePiece("h1", "f1");
            setHighlightSquares([
              adjustIndexForView(squareToIdx("e1")),
              adjustIndexForView(squareToIdx("g1")),
            ]);
          } else if (player === "Black") {
            chess.movePiece("e8", "g8");
            chess.movePiece("h8", "f8");
            setHighlightSquares([
              adjustIndexForView(squareToIdx("e8")),
              adjustIndexForView(squareToIdx("g8")),
            ]);
          }
          break;
        }
      }
      setBoard([...chess.board]);
      setMove(move + 1);
      if (player === "Black") {
        setTurn(turn + 1);
      }
    }
  };

  return (
    <main>
      <div className={styles["chess-board"]}>
        {formatBoard(board).map((piece, i) => {
          return (
            <div
              key={`${i}`}
              className={classNames(
                styles["chess-board--square"],
                highlightSquares.includes(i) &&
                  styles["chess-board--square__highlight"]
              )}
            >
              {piece && (
                <Image alt="" src={PieceMap[`${piece.colour}${piece.type}`]} />
              )}
            </div>
          );
        })}
        <button onClick={handleMove}>Next Move</button>
      </div>
    </main>
  );
}
