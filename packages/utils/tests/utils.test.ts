import {
  filterInvalidSquares,
  getNextChar,
  getNumericFile,
  getPrevChar,
  splitSquare,
  squareToIdx,
} from "../src/utils";

describe("Utils", () => {
  describe("splitSquare", () => {
    it("should split a square into file and rank", () => {
      expect(splitSquare("b5")).toEqual(["b", "5"]);
    });
  });

  describe("getNextChar", () => {
    it("should get the next char", () => {
      expect(getNextChar("a")).toBe("b");
    });

    it("should get the next <x> chars", () => {
      expect(getNextChar("a", 3)).toBe("d");
    });
  });

  describe("getPrevChar", () => {
    it("should get the prev char", () => {
      expect(getPrevChar("b")).toBe("a");
    });

    it("should get the prev <x> chars", () => {
      expect(getPrevChar("d", 3)).toBe("a");
    });
  });

  describe("getNumericFile", () => {
    it("should convert a file to a number 1-8", () => {
      expect(getNumericFile("a")).toBe(1);
      expect(getNumericFile("h")).toBe(8);
    });
  });

  describe("filterInvalidSquares", () => {
    it("should remove invalid squares from an array", () => {
      expect(
        filterInvalidSquares(["asd", "d4", "e3", "k5", "a100", "c4"])
      ).toEqual(["d4", "e3", "c4"]);
    });
  });

  describe("squareToIdx", () => {
    it("should convert a square to its index value in a 1D array", () => {
      expect(squareToIdx("a1")).toBe(0);
      expect(squareToIdx("h8")).toBe(63);
      expect(squareToIdx("d4")).toBe(27);
    });
  });
});
