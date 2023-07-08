import { File, Rank, Square } from "@chessviewer/types";
import { Files, Ranks } from "./constants";

export function isRank(maybeRank: string): maybeRank is Rank {
  return Ranks.includes(maybeRank as any);
}

export function isFile(maybeFile: string): maybeFile is File {
  return Files.includes(maybeFile as any);
}

export function isSquare(maybeSquare: string): maybeSquare is Square {
  return (
    maybeSquare.length === 2 &&
    isFile(maybeSquare.charAt(0)) &&
    isRank(maybeSquare.charAt(1))
  );
}

export function isDefined<T>(x: T | undefined | null): x is T {
  return typeof x !== "undefined";
}
