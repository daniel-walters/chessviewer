import { File, Rank, Square } from "@chessviewer/types";

import { assertIsFile, assertIsRank, isSquare } from "./typeGuards";

export function splitSquare(square: Square): [File, Rank] {
  const file = square.charAt(0);
  const rank = square.charAt(1);

  assertIsRank(rank);
  assertIsFile(file);

  return [file, rank];
}

export function getNextChar(char: string, distance = 1): string {
  return String.fromCharCode(char.charCodeAt(0) + distance);
}

export function getPrevChar(char: string, distance = 1): string {
  return String.fromCharCode(char.charCodeAt(0) - distance);
}

export function getNumericFile(file: File): number {
  return file.charCodeAt(0) - 96;
}

export function getCharFile(num: number): File {
  const char = String.fromCharCode(96 + num);
  assertIsFile(char);

  return char;
}

export function filterInvalidSquares(maybeSquares: string[]): Square[] {
  return maybeSquares.filter(isSquare);
}

export function squareToIdx(square: Square): number {
  const fileNum = getNumericFile(square.charAt(0) as File);
  const rank = Number(square.charAt(1));

  return rank * 8 - (8 - fileNum) - 1;
}
