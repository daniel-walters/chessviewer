export function PGNMovesByTurn(pgn: string): string[] {
  return pgn
    .replaceAll("\n", " ")
    .split(/\d+\./)
    .filter(Boolean)
    .map((turn) => turn.trim());
}
