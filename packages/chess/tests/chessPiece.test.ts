import ChessPiece from "../src/chessPiece/chessPiece";

describe("ChessPiece", () => {
  describe("movePiece", () => {
    it("should update the piece's currentSquare", () => {
      const pawn = new ChessPiece("White", "Pawn", "e2");
      const beforeMove = pawn.currentSquare;
      pawn.movePiece("e4");
      const afterMove = pawn.currentSquare;

      expect(beforeMove).not.toEqual(afterMove);
    });

    it("should update the piece's possibleMoves", () => {
      const pawn = new ChessPiece("White", "Pawn", "e2");
      const beforeMove = pawn.possibleMoves;
      pawn.movePiece("e4");
      const afterMove = pawn.possibleMoves;

      expect(beforeMove).not.toEqual(afterMove);
    });
  });
});
