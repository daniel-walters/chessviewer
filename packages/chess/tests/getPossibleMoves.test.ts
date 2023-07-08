import ChessPiece from "../src/chessPiece/chessPiece";
import getPossibleMoves from "../src/chessPiece/getPossibleMoves";

describe("getPossibleMoves", () => {
  describe("Pawn", () => {
    it("should return correct squares for black", () => {
      const startingPawn = new ChessPiece("Black", "Pawn", "d7");
      const otherPawn = new ChessPiece("Black", "Pawn", "d5");

      expect(getPossibleMoves(startingPawn).sort()).toEqual(
        ["d6", "d5", "c6", "e6"].sort()
      );
      expect(getPossibleMoves(otherPawn).sort()).toEqual(
        ["d4", "c4", "e4"].sort()
      );
    });

    it("should return correct squares for white", () => {
      const startingPawn = new ChessPiece("White", "Pawn", "d2");
      const otherPawn = new ChessPiece("White", "Pawn", "d5");

      expect(getPossibleMoves(startingPawn).sort()).toEqual(
        ["d3", "d4", "c3", "e3"].sort()
      );
      expect(getPossibleMoves(otherPawn).sort()).toEqual(
        ["d6", "e6", "c6"].sort()
      );
    });
  });

  describe("Knight", () => {
    it("should return correct squares when in the middle of the board", () => {
      const knight = new ChessPiece("Black", "Knight", "d5");

      expect(getPossibleMoves(knight).sort()).toEqual(
        ["c7", "e7", "f6", "f4", "e3", "c3", "b4", "b6"].sort()
      );
    });

    it("should return correct squares when on the edge of the board", () => {
      const knightOnEdge = new ChessPiece("Black", "Knight", "d8");

      expect(getPossibleMoves(knightOnEdge).sort()).toEqual(
        ["b7", "c6", "f7", "e6"].sort()
      );
    });
  });

  describe("Bishop", () => {
    it("should return correct squares for black", () => {
      const darkBishop = new ChessPiece("Black", "Bishop", "c3");

      expect(getPossibleMoves(darkBishop).sort()).toEqual(
        [
          "a1",
          "b2",
          "d4",
          "e5",
          "f6",
          "g7",
          "h8",
          "a5",
          "b4",
          "d2",
          "e1",
        ].sort()
      );
    });

    it("should return correct squares for white", () => {
      const lightBishop = new ChessPiece("White", "Bishop", "d3");

      expect(getPossibleMoves(lightBishop).sort()).toEqual(
        [
          "b1",
          "c2",
          "e4",
          "f5",
          "g6",
          "h7",
          "f1",
          "e2",
          "c4",
          "b5",
          "a6",
        ].sort()
      );
    });
  });

  describe("Rook", () => {
    it("should return correct squares", () => {
      const rook = new ChessPiece("White", "Rook", "c2");

      expect(getPossibleMoves(rook).sort()).toEqual(
        [
          "c1",
          "c3",
          "c4",
          "c5",
          "c6",
          "c7",
          "c8",
          "a2",
          "b2",
          "d2",
          "e2",
          "f2",
          "g2",
          "h2",
        ].sort()
      );
    });
  });

  describe("Queen", () => {
    it("should return correct squares", () => {
      const queen = new ChessPiece("White", "Queen", "d3");

      expect(getPossibleMoves(queen).sort()).toEqual(
        [
          "d1",
          "d2",
          "d4",
          "d5",
          "d6",
          "d7",
          "d8",
          "a3",
          "b3",
          "c3",
          "e3",
          "f3",
          "g3",
          "h3",
          "b1",
          "c2",
          "e4",
          "f5",
          "g6",
          "h7",
          "f1",
          "e2",
          "c4",
          "b5",
          "a6",
        ].sort()
      );
    });
  });

  describe("King", () => {
    it("should return correct squares when in the middle of the board", () => {
      const king = new ChessPiece("White", "King", "c5");

      expect(getPossibleMoves(king).sort()).toEqual(
        ["c6", "d6", "d5", "d4", "c4", "b4", "b5", "b6"].sort()
      );
    });

    it("should return correct squares when on the edge of the board", () => {
      const kingOnEdge = new ChessPiece("White", "King", "h5");

      expect(getPossibleMoves(kingOnEdge).sort()).toEqual(
        ["h6", "h4", "g4", "g5", "g6"].sort()
      );
    });
  });
});
