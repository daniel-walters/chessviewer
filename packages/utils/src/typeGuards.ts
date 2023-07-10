import { File, Rank, Square } from "@chessviewer/types";
import { Files, Ranks } from "./constants";
import { NotAFileError, NotARankError, NotASquareError, SquareErrors } from ".";

export function assertIsRank(maybeRank: string): asserts maybeRank is Rank {
  if (!Ranks.includes(maybeRank as any)) {
    throw new NotARankError(maybeRank);
  }
}

export function assertIsFile(maybeFile: string): asserts maybeFile is File {
  if (!Files.includes(maybeFile as any)) {
    throw new NotAFileError(maybeFile);
  }
}

export function assertIsSquare(
  maybeSquare: string,
): asserts maybeSquare is Square {
  const maybeFile = maybeSquare.charAt(0);
  const maybeRank = maybeSquare.charAt(1);

  try {
    if (maybeSquare.length !== 2) {
      throw new Error();
    }

    assertIsFile(maybeFile);
    assertIsRank(maybeRank);
  } catch (e) {
    if (e instanceof NotARankError) {
      throw new NotASquareError(SquareErrors.RANK, maybeRank);
    } else if (e instanceof NotAFileError) {
      throw new NotASquareError(SquareErrors.FILE, maybeFile);
    } else {
      throw new NotASquareError(SquareErrors.LENGTH, maybeSquare.length);
    }
  }
}

export function isSquare(maybeSquare: string): maybeSquare is Square {
  try {
    assertIsSquare(maybeSquare);
    return true;
  } catch {
    return false;
  }
}

export function isDefined<T>(x: T | undefined | null): x is T {
  try {
    assertIsDefined(x);
    return true;
  } catch {
    return false;
  }
}

export function assertIsDefined<T>(x: T | undefined | null): asserts x is T {
  if (typeof x === "undefined") {
    throw new Error("Variable should be defined");
  }
}
