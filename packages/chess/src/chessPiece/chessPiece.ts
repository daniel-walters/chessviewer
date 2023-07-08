import { PieceColour, PieceName, Square } from "@chessviewer/types";

import getPossibleMoves from "./getPossibleMoves";

export default class ChessPiece {
  #currentSquare;
  type;
  readonly colour;
  #possibleMoves;
  constructor(colour: PieceColour, type: PieceName, startingSquare: Square) {
    this.colour = colour;
    this.type = type;
    this.#currentSquare = startingSquare;
    this.#possibleMoves = this.#getPossibleMoves(this);
  }

  get possibleMoves() {
    return this.#possibleMoves;
  }
  get currentSquare() {
    return this.#currentSquare;
  }

  movePiece(square: Square): void {
    this.#currentSquare = square;
    this.#updatePossibleMoves();
  }

  promoteTo(piece: PieceName): void {
    this.type = piece;
    this.#updatePossibleMoves();
  }

  #getPossibleMoves = getPossibleMoves;

  #updatePossibleMoves(): void {
    this.#possibleMoves = this.#getPossibleMoves(this);
  }
}
