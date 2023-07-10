"use client";

import { useEffect, useRef, useState } from "react";
import classNames from "classnames";

import { Move, PGNParser } from "@chessviewer/parser";
import { Piece, PieceColour, PieceName, Square } from "@chessviewer/types";
import { getNumericFile, isDefined, splitSquare } from "@chessviewer/utils";

import UsageModal from "./components/Usage";
import Chessboard from "./components/Chessboard";

import QuestionMark from "../../public/question-mark.svg?svgr";

import styles from "./page.module.scss";
import pgn from "../test";
import MoveInfo from "./components/MoveInfo";

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
  type: Move,
  direction: "NEXT" | "PREV",
  capturedPiece?: PieceName,
  colour?: PieceColour,
  promoteTo?: PieceName,
  enpassant?: boolean,
  capturedSquare?: Square
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
      case Move.CASTLE_SHORT:
      case Move.PROMOTE: {
        clonedBoard[fromIdx] = toSquare;
        clonedBoard[toIdx] = fromSquare;
        if (promoteTo && colour) {
          if (direction === "NEXT") {
            clonedBoard[toIdx]!.piece = `${colour}${promoteTo}`;
            if (capturedPiece) {
              clonedBoard[fromIdx]!.piece = null;
            }
          } else {
            clonedBoard[fromIdx]!.piece = `${colour}Pawn`;
            if (capturedPiece) {
              clonedBoard[toIdx] = {
                piece: `${
                  colour === "White" ? "Black" : "White"
                }${capturedPiece}` as Piece,
                id: String(Math.random()),
              };
            }
          }
        }
        break;
      }
      case Move.CAPTURE: {
        if (direction === "NEXT") {
          toSquare.piece = null;
          clonedBoard[fromIdx] = toSquare;
          clonedBoard[toIdx] = fromSquare;
          if (enpassant) {
            const deleteAt = squareToIdx(capturedSquare!, "White");
            clonedBoard[deleteAt]!.piece = null;
          }
        } else {
          if (enpassant) {
            const temp = clonedBoard[fromIdx];
            clonedBoard[fromIdx] = toSquare;
            clonedBoard[toIdx] = temp!;
            const addTo = squareToIdx(capturedSquare!, "White");
            clonedBoard[addTo] = {
              piece: `${colour === "White" ? "Black" : "White"}Pawn` as Piece,
              id: String(Math.random() + "asd"),
            };
            clonedBoard[toIdx]!.piece = null;
          } else {
            clonedBoard[fromIdx] = toSquare;
            clonedBoard[toIdx] = {
              piece: `${
                colour === "White" ? "Black" : "White"
              }${capturedPiece}` as Piece,
              id: String(Math.random()),
            };
          }
        }

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
  const [showModal, setShowModal] = useState(false);
  const [chessboard, setChessboard] = useState(setupBoard());
  const [moves, setMoves] = useState(parser.moves.flat());
  const [meta, setMeta] = useState(parser.meta);
  const [highlightMoves, setHighlightMoves] = useState<number[]>([]);

  const handleReset = (pgn: string) => {
    const pgnParser = new PGNParser(pgn);
    setMoves(pgnParser.moves.flat());
    setMeta(pgnParser.meta);
    setCurMove(-1);
    setHighlightMoves([]);
    setChessboard(setupBoard());
  };

  const handleMove = (direction: "NEXT" | "PREV") => {
    const dirConst = direction === "NEXT" ? 1 : -1;
    const displayMove = moves[curMove + (direction === "NEXT" ? 1 : 0)];

    switch (displayMove?.type) {
      case Move.MOVE:
      case Move.CAPTURE:
      case Move.PROMOTE: {
        const { from, to } = displayMove;

        if (isDefined(from) && isDefined(to)) {
          const updatedBoard = movePiece(
            from,
            to,
            chessboard,
            displayMove.type,
            direction,
            displayMove.capturedPiece,
            displayMove.player,
            displayMove.promoteTo,
            displayMove.enpassant,
            displayMove.capturedSquare
          );
          setHighlightMoves([
            squareToIdx(from, "White"),
            squareToIdx(to, "White"),
          ]);
          setChessboard(updatedBoard);
        }

        break;
      }
      case Move.CASTLE_LONG: {
        if (displayMove.player === "White") {
          const boardChangeOne = movePiece(
            "e1",
            "c1",
            chessboard,
            displayMove.type,
            direction
          );
          const updatedBoard = movePiece(
            "a1",
            "d1",
            boardChangeOne,
            displayMove.type,
            direction
          );

          setHighlightMoves([
            squareToIdx("e1", "White"),
            squareToIdx("c1", "White"),
          ]);
          setChessboard(updatedBoard);
        } else {
          const boardChangeOne = movePiece(
            "e8",
            "c8",
            chessboard,
            displayMove.type,
            direction
          );
          const updatedBoard = movePiece(
            "a8",
            "d8",
            boardChangeOne,
            displayMove.type,
            direction
          );

          setHighlightMoves([
            squareToIdx("e8", "White"),
            squareToIdx("c8", "White"),
          ]);
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
            displayMove.type,
            direction
          );
          const updatedBoard = movePiece(
            "h1",
            "f1",
            boardChangeOne,
            displayMove.type,
            direction
          );

          setHighlightMoves([
            squareToIdx("e1", "White"),
            squareToIdx("g1", "White"),
          ]);
          setChessboard(updatedBoard);
        } else {
          const boardChangeOne = movePiece(
            "e8",
            "g8",
            chessboard,
            displayMove.type,
            direction
          );
          const updatedBoard = movePiece(
            "h8",
            "f8",
            boardChangeOne,
            displayMove.type,
            direction
          );

          setHighlightMoves([
            squareToIdx("e8", "White"),
            squareToIdx("g8", "White"),
          ]);
          setChessboard(updatedBoard);
        }
        break;
      }
    }

    setCurMove(curMove + dirConst);
  };

  const layoutRef = useRef<HTMLDivElement>(null);

  const listener = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const refClone = layoutRef.current?.cloneNode();

    if (layoutRef.current) {
      if (showModal) {
        layoutRef.current.addEventListener("click", listener);
      } else {
        layoutRef.current.removeEventListener("click", listener);
      }
    }

    return () => refClone?.removeEventListener("click", listener);
  }, [showModal]);

  const handleUsage = () => {
    setShowModal(!showModal);
  };

  return (
    <main>
      {showModal && <UsageModal />}
      <div
        ref={layoutRef}
        className={classNames(
          styles["main-layout"],
          showModal && styles["dim"]
        )}
      >
        <Chessboard
          meta={meta}
          board={chessboard}
          highlightMoves={highlightMoves}
        />
        <div>
          <div className={styles["usage-button"]}>
          <button onClick={handleUsage}>
            <QuestionMark /> Usage
          </button>
          </div>
          <MoveInfo
            handleReset={handleReset}
            handleMove={handleMove}
            moves={moves}
            curMove={curMove}
          />
        </div>
      </div>
    </main>
  );
}
