import { Errors } from "./errors";

export type CellType = "" | "X" | "O";

export type GameBoard = Array<Array<CellType>>;

export class TicTacToe {
  private gameBoard: GameBoard = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];
  private curentPlayer: CellType = "X";
  private winner: CellType | "None" = "";
  private countMoves = 0;

  getWinner() {
    return this.winner;
  }

  makeMove(row: number, col: number) {
    if (!this.checkIfValidCoordinates(row, col)) {
      throw new Error(Errors.invalidMoveCoordinates);
    }

    if (!this.isCellEmpty(row, col)) {
      throw new Error(Errors.spotAlreadyTaken);
    }
    if (this.winner) {
      throw new Error(Errors.cantMakeMovesAfterGameEnd);
    }
    this.gameBoard[row][col] = this.curentPlayer;
    this.curentPlayer = this.curentPlayer === "X" ? "O" : "X";
    this.winner = this.checkIfThereIsWinner();
    this.countMoves++;
    if (this.countMoves === 9 && !this.winner) {
      this.winner = "None";
    }
  }

  checkIfThereIsWinner(): CellType {
    // Check rows, columns, and diagonals for a win
    for (let i = 0; i < 3; i++) {
      // Check rows
      if (
        this.gameBoard[i][0] === this.gameBoard[i][1] &&
        this.gameBoard[i][0] === this.gameBoard[i][2] &&
        this.gameBoard[i][0] !== ""
      ) {
        return this.gameBoard[i][0];
      }

      // Check columns
      if (
        this.gameBoard[0][i] === this.gameBoard[1][i] &&
        this.gameBoard[0][i] === this.gameBoard[2][i] &&
        this.gameBoard[0][i] !== ""
      ) {
        return this.gameBoard[0][i];
      }
    }

    // Check main diagonal
    if (
      this.gameBoard[0][0] === this.gameBoard[1][1] &&
      this.gameBoard[0][0] === this.gameBoard[2][2] &&
      this.gameBoard[0][0] !== ""
    ) {
      return this.gameBoard[0][0];
    }

    // Check secondary diagonal
    if (
      this.gameBoard[0][2] === this.gameBoard[1][1] &&
      this.gameBoard[0][2] === this.gameBoard[2][0] &&
      this.gameBoard[0][2] !== ""
    ) {
      return this.gameBoard[0][2];
    }

    return "";
  }

  getCurrentPlayerTurn() {
    return this.curentPlayer;
  }

  private checkIfValidCoordinates(row: number, col: number): boolean {
    return row < 3 && row > -1 && col < 3 && col > -1;
  }

  private isCellEmpty(row: number, col: number) {
    return this.gameBoard[row][col] === "";
  }

  getBoardGame(): GameBoard {
    return this.gameBoard;
  }
}
