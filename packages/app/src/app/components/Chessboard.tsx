import classNames from "classnames";
import { motion } from "framer-motion";
import React from "react";
import Image from "next/image";

import { ParsedMeta } from "@chessviewer/parser";
import { Piece } from "@chessviewer/types";

import bPSVG from "../../../public/bP.svg";
import bRSVG from "../../../public/bR.svg";
import bNSVG from "../../../public/bN.svg";
import bBSVG from "../../../public/bB.svg";
import bKSVG from "../../../public/bK.svg";
import bQSVG from "../../../public/bQ.svg";
import wPSVG from "../../../public/wP.svg";
import wRSVG from "../../../public/wR.svg";
import wNSVG from "../../../public/wN.svg";
import wBSVG from "../../../public/wB.svg";
import wKSVG from "../../../public/wK.svg";
import wQSVG from "../../../public/wQ.svg";

import styles from "./chessboard.module.scss";

type ChessboardProps = {
  meta: ParsedMeta;
  board: Chessboard;
  highlightMoves: number[];
};

type IDPiece = {
  piece: Piece | null;
  id: string;
};

type Chessboard = IDPiece[];

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

function Chessboard({ meta, board, highlightMoves }: ChessboardProps) {
  return (
    <div className={styles["chess-board"]}>
      <h2>
        {meta.white} (W) Vs. {meta.black} (B)
      </h2>
      <div className={styles["chess-board--board"]}>
        {board.map((_, i) => {
          return (
            <div
              key={i}
              className={classNames(
                styles["chess-board--board--square"],
                highlightMoves.includes(i) && styles["highlight"]
              )}
            />
          );
        })}
        <div
          className={classNames(
            styles["chess-board--board"],
            styles["inner-pieces"]
          )}
        >
          {board.map((piece) => {
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
      </div>
    </div>
  );
}

export default Chessboard;
