import { Errors } from "./errors";
import { CellType, TicTacToe } from "./ticTacToe";

describe("tic tac toe game:", () => {
  let ticTacToe: TicTacToe;

  beforeEach(() => {
    ticTacToe = new TicTacToe();
  });

  test("it should have empty board", () => {
    expect(ticTacToe.getBoardGame()).toEqual([
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ]);
  });

  test("player can make a move", () => {
    const player = "X";
    ticTacToe.makeMove(0, 0);
    expect(ticTacToe.getBoardGame()[0][0]).toEqual(player);
  });

  test("player cant make a move on same place", () => {
    ticTacToe.makeMove(0, 0);
    expect(() => {
      ticTacToe.makeMove(0, 0);
    }).toThrow(Errors.spotAlreadyTaken);
  });

  test("player can't make a move outside the game board", () => {
    // each move can be refactored and called to function something like: makeMoveUpperBandRow etc..
    expect(() => {
      ticTacToe.makeMove(-1, 2); // row upper band
    }).toThrow(Errors.invalidMoveCoordinates);

    expect(() => {
      ticTacToe.makeMove(4, 2); // row lower band
    }).toThrow(Errors.invalidMoveCoordinates);

    expect(() => {
      ticTacToe.makeMove(0, 5); // col upper band
    }).toThrow(Errors.invalidMoveCoordinates);

    expect(() => {
      ticTacToe.makeMove(0, -5); // col lower band
    }).toThrow(Errors.invalidMoveCoordinates);
  });

  test("game switches players", () => {
    const firstPlayer = ticTacToe.getCurrentPlayerTurn();
    ticTacToe.makeMove(0, 0);
    expect(ticTacToe.getCurrentPlayerTurn()).not.toEqual(firstPlayer);
  });

  describe("winning direction possiblites", () => {
    let firstPlayer: CellType;

    beforeEach(() => {
      firstPlayer = ticTacToe.getCurrentPlayerTurn();
    });

    test("first player wins the game diagonlly", () => {
      ticTacToe.makeMove(0, 0);
      ticTacToe.makeMove(0, 2);
      ticTacToe.makeMove(1, 1);
      ticTacToe.makeMove(2, 0);
      ticTacToe.makeMove(2, 2);
      expect(ticTacToe.getWinner()).toEqual(firstPlayer);
    });

    test("first player wins the game by row", () => {
      ticTacToe.makeMove(0, 0); // first player
      ticTacToe.makeMove(1, 1);
      ticTacToe.makeMove(0, 1); // first player
      ticTacToe.makeMove(2, 0);
      ticTacToe.makeMove(0, 2); // first player
      expect(ticTacToe.getWinner()).toEqual(firstPlayer);
    });

    test("first player wins the game by col", () => {
      ticTacToe.makeMove(0, 0); // first player
      ticTacToe.makeMove(1, 1);
      ticTacToe.makeMove(1, 0); // first player
      ticTacToe.makeMove(2, 2);
      ticTacToe.makeMove(2, 0); // first player
      expect(ticTacToe.getWinner()).toEqual(firstPlayer);
    });
  });

  const createDrawGame = () => {
    ticTacToe.makeMove(0, 0); // first
    ticTacToe.makeMove(0, 1);
    ticTacToe.makeMove(0, 2); // first
    ticTacToe.makeMove(1, 1);
    ticTacToe.makeMove(1, 0); // first
    ticTacToe.makeMove(1, 2);
    ticTacToe.makeMove(2, 1); // first
    ticTacToe.makeMove(2, 0);
    ticTacToe.makeMove(2, 2); // first
  };

  test("game ended in draw", () => {
    createDrawGame();
    expect(ticTacToe.getWinner()).toEqual("None");
  });

  test("cant make moves after someone wins", () => {
    ticTacToe.makeMove(0, 0);
    ticTacToe.makeMove(0, 2);
    ticTacToe.makeMove(1, 1);
    ticTacToe.makeMove(2, 0);
    ticTacToe.makeMove(2, 2);
    expect(() => {
      ticTacToe.makeMove(1, 2);
    }).toThrow(Errors.cantMakeMovesAfterGameEnd);
  });
});
