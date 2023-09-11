export type CellType = "" | PlayerType;

export enum PlayerType {
  X = "X",
  O = "O ",
}

export type GameBoard = Array<Array<CellType>>;

export const MAX_MOVES_IN_GAME = 9;
