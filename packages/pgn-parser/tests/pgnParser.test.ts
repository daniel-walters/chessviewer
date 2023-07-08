import { readFile } from "fs/promises";
import PGNParser from "../src/pgnParser/pgnParser";
import { PGNMovesByTurn } from "../src/pgnParser/utils";

async function readTestFile(path: string): Promise<string> {
  try {
    return readFile(path, { encoding: "utf8" });
  } catch (e) {
    if (e instanceof Error) {
      throw e;
    } else {
      throw new Error(e as any);
    }
  }
}

describe("PGNParser", () => {
  describe("PGNMovesByTurn", () => {
    it("should split PGN into an array of turns", async () => {
      const pgn = await readTestFile("testFiles/basic.pgn");

      expect(PGNMovesByTurn(pgn)).toEqual([
        "d4 d5",
        "Nc3 e6",
        "Bf4 Bb4",
        "e3 Nf6",
      ]);
    });
  });

  describe("Pawn movement", () => {
    it("should correctly handle moving and capturing", async () => {
      const pgn = await readTestFile("testFiles/pawnCapture.pgn");
      const parser = new PGNParser(pgn);
      const board = parser.chess;

      expect(board.getPieceAt("a4")?.type).toBe("Pawn");
      expect(board.getPieceAt("a4")?.colour).toBe("White");
      expect(board.getPieceAt("e5")?.type).toBe("Pawn");
      expect(board.getPieceAt("e5")?.colour).toBe("Black");
      expect(board.getPieceAt("e4")).toBeNull();
      expect(board.getPieceAt("d5")?.type).toBe("Pawn");
      expect(board.getPieceAt("d5")?.colour).toBe("White");
    });
  });

  describe("Piece movement", () => {
    it("should correctly handle moving and capturing", async () => {
      const pgn = await readTestFile("testFiles/pieceCapture.pgn");
      const parser = new PGNParser(pgn);
      const board = parser.chess;

      expect(board.getPieceAt("c3")?.type).toBe("Knight");
      expect(board.getPieceAt("c3")?.colour).toBe("White");
      expect(board.getPieceAt("c4")?.type).toBe("Bishop");
      expect(board.getPieceAt("c4")?.colour).toBe("White");
      expect(board.getPieceAt("c5")?.type).toBe("Bishop");
      expect(board.getPieceAt("c5")?.colour).toBe("Black");
      expect(board.getPieceAt("c6")?.type).toBe("Knight");
      expect(board.getPieceAt("c6")?.colour).toBe("Black");
      expect(board.getPieceAt("g8")?.type).toBe("Knight");
      expect(board.getPieceAt("g8")?.colour).toBe("Black");
      expect(board.getPieceAt("g4")).toBeNull();
      expect(board.getPieceAt("g7")).toBeNull();
    });
  });
});
