import { Chess, ChessPiece, Chessboard } from "@chessviewer/chess";
import { File, PieceName, Square } from "@chessviewer/types";
import {
  assertIsSquare,
  getCharFile,
  getNextChar,
  getNumericFile,
  getPrevChar,
  splitSquare,
} from "@chessviewer/utils";

export function PGNMovesByTurn(pgn: string): string[] {
  return pgn
    .replaceAll("\n", " ")
    .split(/\d+\./)
    .filter(Boolean)
    .map((turn) => turn.trim());
}

export function filterTakenSquares(
  pieceKind: PieceName,
  possibleSquares: Chessboard,
  targetSquare: Square,
  board: Chess
): ChessPiece {
  const [tFile, tRank] = splitSquare(targetSquare);

  const pieceNotBlocked = possibleSquares.find((square) => {
    if (square) {
      const [pFile, pRank] = splitSquare(square.currentSquare);

      switch (pieceKind) {
        case "Pawn": {
          if (Math.abs(Number(tRank) - Number(pRank)) === 2) {
            let testSquare;

            if (square.colour === "White") {
              testSquare = `${pFile}${Number(tRank) - 1}`;
            } else {
              testSquare = `${pFile}${Number(tRank) + 1}`;
            }

            assertIsSquare(testSquare);
            if (board.getPieceAt(testSquare)) {
              return false;
            }
          }
          return true;
        }
        case "Rook": {
          const squaresInBetween: Square[] = [];

          if (pFile === tFile) {
            if (pRank > tRank) {
              for (let i = Number(tRank) + 1; i < Number(pRank); i++) {
                const testSquare = `${pFile}${i}`;
                assertIsSquare(testSquare);
                squaresInBetween.push(testSquare);
              }
            } else {
              for (let i = Number(pRank) + 1; i < Number(tRank); i++) {
                const testSquare = `${pFile}${i}`;
                assertIsSquare(testSquare);
                squaresInBetween.push(testSquare);
              }
            }
          } else if (pRank === tRank) {
            const numPFile = getNumericFile(pFile);
            const numTFile = getNumericFile(tFile);

            if (numPFile > numTFile) {
              for (let i = numTFile + 1; i < numPFile; i++) {
                const testSquare = `${getCharFile(i)}${pRank}`;
                assertIsSquare(testSquare);
                squaresInBetween.push(testSquare);
              }
            } else {
              for (let i = numPFile + 1; i < numTFile; i++) {
                const testSquare = `${getCharFile(i)}${pRank}`;
                assertIsSquare(testSquare);
                squaresInBetween.push(testSquare);
              }
            }
          }
          for (let i = 0; i < squaresInBetween.length; i++) {
            if (board.getPieceAt(squaresInBetween[i]!)) {
              return false;
            }
          }

          return true;
        }
        case "Bishop": {
          const squaresInBetween: Square[] = [];
          const numPFile = getNumericFile(pFile);
          const numTFile = getNumericFile(tFile);

          if (pRank > tRank) {
            //bottom half
            if (numPFile > numTFile) {
              // bottom left
              for (
                let i = Number(tRank) + 1, j = tFile as string;
                i < Number(pRank);
                i++
              ) {
                const testSquare = `${j}${i}`;
                assertIsSquare(testSquare);
                squaresInBetween.push(testSquare);
                j = getNextChar(j as File);
              }
            } else {
              // bottom right
              for (
                let i = Number(tRank) + 1, j = tFile as string;
                i < Number(pRank);
                i++
              ) {
                const testSquare = `${j}${i}`;
                assertIsSquare(testSquare);
                squaresInBetween.push(testSquare);
                j = getPrevChar(j as File);
              }
            }
          } else if (pRank < tRank) {
            // top half
            if (numPFile > numTFile) {
              // top left
              for (
                let i = Number(pRank) + 1, j = tFile as string;
                i < Number(tRank);
                i++
              ) {
                const testSquare = `${j}${i}`;
                assertIsSquare(testSquare);
                squaresInBetween.push(testSquare);
                j = getPrevChar(j as File);
              }
            } else {
              // top right
              for (
                let i = Number(pRank) + 1, j = tFile as string;
                i < Number(tRank);
                i++
              ) {
                const testSquare = `${j}${i}`;
                assertIsSquare(testSquare);
                squaresInBetween.push(testSquare);
                j = getNextChar(j as File);
              }
            }
          }

          for (let i = 0; i < squaresInBetween.length; i++) {
            if (board.getPieceAt(squaresInBetween[i]!)) {
              return false;
            }
          }

          return true;
        }
        case "Queen": {
          const squaresInBetween: Square[] = [];
          const numPFile = getNumericFile(pFile);
          const numTFile = getNumericFile(tFile);

          if (pRank > tRank) {
            //bottom half
            if (numPFile > numTFile) {
              // bottom left
              for (
                let i = Number(tRank) + 1, j = tFile as string;
                i < Number(pRank);
                i++
              ) {
                const testSquare = `${j}${i}`;
                assertIsSquare(testSquare);
                squaresInBetween.push(testSquare);
                j = getNextChar(j as File);
              }
            } else {
              // bottom right
              for (
                let i = Number(tRank) + 1, j = tFile as string;
                i < Number(pRank);
                i++
              ) {
                const testSquare = `${j}${i}`;
                assertIsSquare(testSquare);
                squaresInBetween.push(testSquare);
                j = getPrevChar(j as File);
              }
            }
          } else if (pRank < tRank) {
            // top half
            if (numPFile > numTFile) {
              // top left
              for (
                let i = Number(pRank) + 1, j = tFile as string;
                i < Number(tRank);
                i++
              ) {
                const testSquare = `${j}${i}`;
                assertIsSquare(testSquare);
                squaresInBetween.push(testSquare);
                j = getPrevChar(j as File);
              }
            } else {
              // top right
              for (
                let i = Number(pRank) + 1, j = tFile as string;
                i < Number(tRank);
                i++
              ) {
                const testSquare = `${j}${i}`;
                assertIsSquare(testSquare);
                squaresInBetween.push(testSquare);
                j = getNextChar(j as File);
              }
            }
          }

          for (let i = 0; i < squaresInBetween.length; i++) {
            if (board.getPieceAt(squaresInBetween[i]!)) {
              return false;
            }
          }

          return true;
        }
      }
    }
    return false;
  });

  if (!pieceNotBlocked) {
    throw new Error("Cannot narrow down pieces");
  }

  return pieceNotBlocked;
}
