import { File, PieceColour, Rank, Square } from "@chessviewer/types";
import {
  splitSquare,
  getNextChar,
  getPrevChar,
  Ranks,
  Files,
  getNumericFile,
  filterInvalidSquares,
} from "@chessviewer/utils";

import ChessPiece from "./chessPiece";

export default function getPossibleMoves(piece: ChessPiece): Square[] {
  let possibleMoves: Square[] = [];
  const [file, rank] = splitSquare(piece.currentSquare);

  switch (piece.type) {
    case "Pawn":
      possibleMoves = getPawnMoves(file, rank, piece.colour);
      break;
    case "Rook":
      possibleMoves = getRookMoves(file, rank);
      break;
    case "Knight":
      possibleMoves = getKnightMoves(file, rank);
      break;
    case "Bishop":
      possibleMoves = getBishopMoves(file, rank);
      break;
    case "Queen":
      possibleMoves = getQueenMoves(file, rank);
      break;
    case "King":
      possibleMoves = getKingMoves(file, rank);
      break;
  }

  return possibleMoves;
}

function getPawnMoves(file: File, rank: Rank, colour: PieceColour): Square[] {
  const maybeMoves: string[] = [];

  const direction = colour === "White" ? 1 : -1;
  const firstMove = `${file}${Number(rank) + direction}`;
  const captureLeft = `${getNextChar(file)}${Number(rank) + direction}`;
  const captureRight = `${getPrevChar(file)}${Number(rank) + direction}`;

  maybeMoves.push(firstMove, captureLeft, captureRight);

  if (
    (colour === "White" && rank === "2") ||
    (colour === "Black" && rank === "7")
  ) {
    const secondMove = `${file}${Number(rank) + direction * 2}`;
    maybeMoves.push(secondMove);
  }

  return filterInvalidSquares(maybeMoves);
}

function getRookMoves(file: File, rank: Rank): Square[] {
  const maybeMoves: string[] = [];

  Ranks.forEach((i) => {
    if (i !== rank) {
      maybeMoves.push(`${file}${i}`);
    }
  });

  Files.forEach((i) => {
    if (i !== file) {
      maybeMoves.push(`${i}${rank}`);
    }
  });

  return filterInvalidSquares(maybeMoves);
}

function getKnightMoves(file: File, rank: Rank): Square[] {
  const minRank = Number(rank) - 2;
  const maxRank = Number(rank) + 2;

  const maybeMoves: string[] = [];

  for (let i = minRank; i <= maxRank; i++) {
    if (Math.abs(Number(rank) - i) === 1) {
      maybeMoves.push(`${getNextChar(file, 2)}${i}`);
      maybeMoves.push(`${getPrevChar(file, 2)}${i}`);
    }

    if (Math.abs(Number(rank) - i) === 2) {
      maybeMoves.push(`${getNextChar(file)}${i}`);
      maybeMoves.push(`${getPrevChar(file)}${i}`);
    }
  }

  return filterInvalidSquares(maybeMoves);
}

function getKingMoves(file: File, rank: Rank): Square[] {
  const nextFile = getNextChar(file);
  const prevFile = getPrevChar(file);
  const nextRank = Number(rank) + 1;
  const prevRank = Number(rank) - 1;

  const maybeMoves = [
    `${file}${nextRank}`,
    `${nextFile}${nextRank}`,
    `${nextFile}${rank}`,
    `${nextFile}${prevRank}`,
    `${file}${prevRank}`,
    `${prevFile}${nextRank}`,
    `${prevFile}${rank}`,
    `${prevFile}${prevRank}`,
  ];

  return filterInvalidSquares(maybeMoves);
}

function getBishopMoves(file: File, rank: Rank): Square[] {
  const maybeMoves: string[] = [];
  const numericFile = getNumericFile(file);

  Files.forEach((f, i) => {
    const offset = numericFile - i - 1;

    if (f !== file) {
      maybeMoves.push(`${f}${Number(rank) - offset}`);
      maybeMoves.push(`${f}${Number(rank) + offset}`);
    }
  });

  return filterInvalidSquares(maybeMoves);
}

function getQueenMoves(file: File, rank: Rank): Square[] {
  return [...getRookMoves(file, rank), ...getBishopMoves(file, rank)];
}
