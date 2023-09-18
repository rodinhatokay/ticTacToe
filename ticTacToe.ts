import { Errors } from "./errors";
import { CellType, GameBoard, MAX_MOVES_IN_GAME, PlayerType } from "./types";

export class TicTacToe {
  private winner: CellType | "None" = "";
  private countMoves = 0;
  public gameBoard: GameBoard;
  public curentPlayer: PlayerType = PlayerType.X;

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
      !this.isValidGameBoardProvided({
        countPlayerXMoves,
        countPlayerYMoves,
        countAllMoves: this.countMoves,
      })
    ) {
      throw new Error(Errors.invalidGameBoardInitalProvided);
    }
    this.curentPlayer = this.countMoves % 2 === 0 ? PlayerType.X : PlayerType.O;
  }

  private isValidGameBoardProvided(args: {
    countPlayerXMoves: number;
    countPlayerYMoves: number;
    countAllMoves: number;
  }) {
    const { countAllMoves, countPlayerXMoves, countPlayerYMoves } = args;
    if (countAllMoves % 2 === 0) {
      //they should have the same amount of moves
      return countPlayerXMoves === countPlayerYMoves;
    } else {
      return countPlayerXMoves - 1 === countPlayerYMoves;
    }
  }

  public getWinner() {
    return this.winner;
  }

  private validateMove(row: number, col: number, player: CellType) {
    if (!this.checkIfValidCoordinates(row, col)) {
      throw Error(Errors.invalidMoveCoordinates);
    }

    if (!this.isCellEmpty(row, col)) {
      throw Error(Errors.spotAlreadyTaken);
    }

    if (this.curentPlayer !== player) {
      throw Error(Errors.otherPlayersTurnToMakeMove);
    }

    if (this.winner) {
      throw Error(Errors.cantMakeMovesAfterGameEnd);
    }
  }

  public makeMove(row: number, col: number, player: CellType) {
    this.validateMove(row, col, player);

    this.gameBoard[row][col] = player;
    this.curentPlayer = player === PlayerType.X ? PlayerType.O : PlayerType.X;
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
      if (this.checkRowForWinner(i)) {
        this.winner = this.gameBoard[i][0];
      }
      if (this.checkColForWinner(i)) {
        this.winner = this.gameBoard[0][i];
      }
    }

    if (this.checkDiaonalWinner()) {
      this.winner = this.gameBoard[1][1];
    }

    if (this.countMoves === MAX_MOVES_IN_GAME && !this.winner) {
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
