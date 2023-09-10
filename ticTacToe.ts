import { Errors } from "./errors";

export type CellType = "" | "X" | "O";

export type GameBoard = Array<Array<CellType>>;

export class TicTacToe {
  private winner: CellType | "None" = "";
  private countMoves = 0;
  public gameBoard: GameBoard;
  public curentPlayer: CellType = "X";

  constructor(gameBoard?: GameBoard) {
    this.gameBoard = gameBoard || [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ];
    if (gameBoard) {
      this.setCurrentPlayerByGameBoard(gameBoard);
      this.calculateWinner();
    }
  }

  private setCurrentPlayerByGameBoard(gameBoard: GameBoard) {
    let countPlayerXMoves = 0;
    let countPlayerYMoves = 0;
    for (let row = 0; row < gameBoard.length; row++) {
      for (let col = 0; col < gameBoard[row].length; col++) {
        if (gameBoard[row][col]) {
          this.countMoves++;

          gameBoard[row][col] === "X"
            ? countPlayerXMoves++
            : countPlayerYMoves++;
        }
      }
    }
    if (
      !this.isValidGameBoardProvided(
        countPlayerXMoves,
        countPlayerYMoves,
        this.countMoves
      )
    ) {
      throw new Error(Errors.invalidGameBoardInitalProvided);
    }
    this.curentPlayer = this.countMoves % 2 === 0 ? "X" : "O";
  }

  private isValidGameBoardProvided(
    countPlayerXMoves: number,
    countPlayersYMoves: number,
    countAllMoves: number
  ) {
    if (countAllMoves % 2 === 0) {
      //they should have the same amount of moves
      return countPlayerXMoves === countPlayersYMoves;
    } else {
      return countPlayerXMoves - 1 === countPlayersYMoves;
    }
  }

  public getWinner() {
    return this.winner;
  }

  private validateMove(
    row: number,
    col: number,
    player: CellType
  ): string | null {
    if (!this.checkIfValidCoordinates(row, col)) {
      return Errors.invalidMoveCoordinates;
    }

    if (!this.isCellEmpty(row, col)) {
      return Errors.spotAlreadyTaken;
    }

    if (this.curentPlayer !== player) {
      return Errors.otherPlayersTurnToMakeMove;
    }

    if (this.winner) {
      return Errors.cantMakeMovesAfterGameEnd;
    }

    return null;
  }

  public makeMove(row: number, col: number, player: CellType) {
    const validationError = this.validateMove(row, col, player);

    if (validationError) {
      throw new Error(validationError);
    }

    this.gameBoard[row][col] = player;
    this.curentPlayer = player === "X" ? "O" : "X";
    this.countMoves++;
    this.calculateWinner();
  }

  private checkRowForWinner(row: number) {
    return (
      this.gameBoard[row][0] !== "" &&
      this.gameBoard[row][0] === this.gameBoard[row][1] &&
      this.gameBoard[row][0] === this.gameBoard[row][2]
    );
  }
  private checkColForWinner(col: number) {
    return (
      this.gameBoard[0][col] !== "" &&
      this.gameBoard[0][col] === this.gameBoard[1][col] &&
      this.gameBoard[0][col] === this.gameBoard[2][col]
    );
  }

  private checkDiaonalWinner() {
    return (
      (this.gameBoard[0][0] !== "" &&
        this.gameBoard[0][0] === this.gameBoard[1][1] &&
        this.gameBoard[0][0] === this.gameBoard[2][2]) ||
      (this.gameBoard[0][2] !== "" &&
        this.gameBoard[0][2] === this.gameBoard[1][1] &&
        this.gameBoard[0][2] === this.gameBoard[2][0])
    );
  }

  private calculateWinner() {
    // Check rows, columns, and diagonals for a win
    for (let i = 0; i < 3; i++) {
      // Check rows
      if (this.checkRowForWinner(i)) {
        this.winner = this.gameBoard[i][0];
      }

      // Check columns
      if (this.checkColForWinner(i)) {
        this.winner = this.gameBoard[0][i];
      }
    }

    if (this.checkDiaonalWinner()) {
      this.winner = this.gameBoard[1][1];
    }

    if (this.countMoves === 9 && !this.winner) {
      this.winner = "None";
    }
  }

  private checkIfValidCoordinates(row: number, col: number): boolean {
    return row < 3 && row > -1 && col < 3 && col > -1;
  }

  private isCellEmpty(row: number, col: number) {
    return this.gameBoard[row][col] === "";
  }
}
