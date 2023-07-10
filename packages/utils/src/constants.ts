import { File, PieceMap, Rank } from "@chessviewer/types";

export const Ranks: readonly Rank[] = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
] as const;

export const Files: readonly File[] = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
] as const;

export const PGNPieceMap: PieceMap = {
  B: "Bishop",
  N: "Knight",
  K: "King",
  Q: "Queen",
  R: "Rook",
};

export const Results = ["1-0", "0-1", "1/2-1/2", "*"] as const;
