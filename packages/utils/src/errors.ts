import { Square } from "@chessviewer/types";

export class SquareFormatError extends Error {
  constructor(public square: Square) {
    super(`Cannot read Square: ${square}`);
  }
}
