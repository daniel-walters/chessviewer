import Chess from "../src/chess/chess";
import { getInitialBoard } from "../src/chess/createChessBoard";

describe("Chess", () => {
  describe("constructor", () => {
    it("should initialise with the default board", () => {
      const chess = new Chess();

      expect(chess.board).toEqual(getInitialBoard());
    });
  });

  describe("getPieceAt", () => {
    it("should return the piece at a given square", () => {
      const chess = new Chess();
      const piece = chess.getPieceAt("e2");

      expect(piece?.type).toBe("Pawn");
      expect(piece?.colour).toBe("White");
      expect(piece?.currentSquare).toBe("e2");
    });

    it("should return null if no piece is found", () => {
      const chess = new Chess();
      const piece = chess.getPieceAt("d4");

      expect(piece).toBeNull();
    });
  });
});
