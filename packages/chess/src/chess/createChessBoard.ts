import { getCharFile, isSquare } from "@chessviewer/utils";

import ChessPiece from "../chessPiece/chessPiece";

export type Chessboard = (ChessPiece | null)[];

export function getInitialBoard(): Chessboard {
  const chessboard: Chessboard = [];

  chessboard.push(new ChessPiece("White", "Rook", "a1"));
  chessboard.push(new ChessPiece("White", "Knight", "b1"));
  chessboard.push(new ChessPiece("White", "Bishop", "c1"));
  chessboard.push(new ChessPiece("White", "Queen", "d1"));
  chessboard.push(new ChessPiece("White", "King", "e1"));
  chessboard.push(new ChessPiece("White", "Bishop", "f1"));
  chessboard.push(new ChessPiece("White", "Knight", "g1"));
  chessboard.push(new ChessPiece("White", "Rook", "h1"));

  for (let i = 1; i <= 8; i++) {
    const square = `${getCharFile(i)}2`;

    if (isSquare(square)) {
      chessboard.push(new ChessPiece("White", "Pawn", square));
    }
  }

  for (let i = 0; i < 32; i++) {
    chessboard.push(null);
  }

  for (let i = 1; i <= 8; i++) {
    const square = `${getCharFile(i)}7`;

    if (isSquare(square)) {
      chessboard.push(new ChessPiece("Black", "Pawn", square));
    }
  }

  chessboard.push(new ChessPiece("Black", "Rook", "a8"));
  chessboard.push(new ChessPiece("Black", "Knight", "b8"));
  chessboard.push(new ChessPiece("Black", "Bishop", "c8"));
  chessboard.push(new ChessPiece("Black", "Queen", "d8"));
  chessboard.push(new ChessPiece("Black", "King", "e8"));
  chessboard.push(new ChessPiece("Black", "Bishop", "f8"));
  chessboard.push(new ChessPiece("Black", "Knight", "g8"));
  chessboard.push(new ChessPiece("Black", "Rook", "h8"));

  return chessboard;
}
