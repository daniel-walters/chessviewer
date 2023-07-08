export type PieceName =
  | "Pawn"
  | "Rook"
  | "Knight"
  | "Bishop"
  | "Queen"
  | "King";
export type PieceColour = "White" | "Black";
export type Piece = `${PieceColour}${PieceName}`;

export type Rank = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8";
export type File = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h";
export type Square = `${File}${Rank}`;
export type PGNPieceName = "K" | "N" | "Q" | "R" | "B";
export type PieceMap = Record<PGNPieceName, PieceName>;
