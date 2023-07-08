import { Square } from "@chessviewer/types";

export enum SquareErrors {
  "LENGTH",
  "RANK",
  "FILE",
}

export class NotASquareError extends Error {
  constructor(kind: SquareErrors, data: any) {
    let msg;
    switch (kind) {
      case SquareErrors.LENGTH:
        msg = `Square has invalid length ${data}`;
        break;
      case SquareErrors.RANK:
        msg = `Square has invalid rank ${data}`;
        break;
      case SquareErrors.FILE:
        msg = `Square has invalid file ${data}`;
        break;
    }

    super(msg);
  }
}

export class NotAFileError extends Error {
  constructor(public file: string) {
    super(`${file} is not a valid file`);
  }
}

export class NotARankError extends Error {
  constructor(public rank: string) {
    super(`${rank} is not a valid rank`);
  }
}

export class PieceNotFoundError extends Error {
  constructor(public square: Square) {
    super(`No piece found at ${square}`);
  }
}
