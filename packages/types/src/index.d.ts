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
export enum Move {
  "MOVE",
  "CAPTURE",
  "RESULT",
  "CASTLE_LONG",
  "CASTLE_SHORT",
}
export enum CaptureType {
  "PAWN",
  "PIECE",
}
export enum MoveType {
  "PAWN",
  "PIECE",
}
export enum CastleType {
  "SHORT",
  "LONG",
}
export type MoveInformation = {
  from: Square | null;
  to: Square | null;
  type: Move;
  player: PieceColour;
};
export type TurnInformation = [MoveInformation, MoveInformation]; // [white, black]
export type ParsedMoves = TurnInformation[];
export type ParsedMeta = string;
export enum SquareErrors {
  "LENGTH",
  "RANK",
  "FILE",
}
