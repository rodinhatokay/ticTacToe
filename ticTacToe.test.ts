import { Errors } from "./errors";
import { TicTacToe } from "./ticTacToe";
import { PlayerType } from "./types";

describe("tic tac toe game:", () => {
  let ticTacToe: TicTacToe;

  beforeEach(() => {
    ticTacToe = new TicTacToe();
  });

  it("it should have empty board", () => {
    expect(ticTacToe.gameBoard).toEqual([
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ]);
  });

  describe("providing custom game board to constrcutor", () => {
    it("should create custom game board", () => {
      const ticTacToe = new TicTacToe([
        [PlayerType.X, "", ""],
        ["", PlayerType.O, ""],
        ["", "", ""],
      ]);
      expect(ticTacToe.gameBoard).toEqual([
        [PlayerType.X, "", ""],
        ["", PlayerType.O, ""],
        ["", "", ""],
      ]);
    });

    it("should select PlayerType.O as the second player by initalizing with custom board", () => {
      const ticTacToe = new TicTacToe([
        [PlayerType.X, "", ""],
        ["", "", ""],
        ["", "", ""],
      ]);
      expect(ticTacToe.curentPlayer).toEqual(PlayerType.O);
    });

    it("throws if provided board is invalid", () => {
      expect(() => {
        const ticTacToe = new TicTacToe([
          [PlayerType.X, PlayerType.X, ""],
          ["", "", ""],
          ["", "", ""],
        ]);
      }).toThrow(Errors.invalidGameBoardInitalProvided);

      expect(() => {
        const ticTacToe = new TicTacToe([
          [PlayerType.X, PlayerType.O, PlayerType.X],
          [PlayerType.X, "", ""],
          ["", "", ""],
        ]);
      }).toThrow(Errors.invalidGameBoardInitalProvided);
    });

    it("should set winner if provided game ended", () => {
      const ticTacToe = new TicTacToe([
        [PlayerType.X, PlayerType.O, ""],
        ["", PlayerType.X, PlayerType.O],
        ["", "", PlayerType.X],
      ]);
      expect(ticTacToe.getWinner()).toEqual(PlayerType.X);
    });
  });

  describe("validations on player moves", () => {
    it("player can make a move", () => {
      const player = PlayerType.X;
      ticTacToe.makeMove(0, 0, player);
      expect(ticTacToe.gameBoard[0][0]).toEqual(player);
    });

    it("throws error when moving to a taken spot", () => {
      ticTacToe.makeMove(0, 0, PlayerType.X);
      expect(() => {
        ticTacToe.makeMove(0, 0, PlayerType.X);
      }).toThrow(Errors.spotAlreadyTaken);
    });

    it("should throw error when trying to play 2 or more rounds as same player", () => {
      ticTacToe.makeMove(0, 0, PlayerType.X);
      expect(() => {
        ticTacToe.makeMove(0, 1, PlayerType.X);
      }).toThrow(Errors.otherPlayersTurnToMakeMove);
    });

    it("player can't make a move outside the game board", () => {
      // each move can be refactored and called to function something like: makeMoveUpperBandRow etc..
      expect(() => {
        ticTacToe.makeMove(-1, 2, PlayerType.X); // row upper band
      }).toThrow(Errors.invalidMoveCoordinates);

      expect(() => {
        ticTacToe.makeMove(4, 2, PlayerType.O); // row lower band
      }).toThrow(Errors.invalidMoveCoordinates);

      expect(() => {
        ticTacToe.makeMove(0, 5, PlayerType.X); // col upper band
      }).toThrow(Errors.invalidMoveCoordinates);

      expect(() => {
        ticTacToe.makeMove(0, -5, PlayerType.O); // col lower band
      }).toThrow(Errors.invalidMoveCoordinates);
    });
  });

  it("game switches players", () => {
    const firstPlayer = ticTacToe.curentPlayer;
    ticTacToe.makeMove(0, 0, firstPlayer);
    expect(ticTacToe.curentPlayer).not.toEqual(firstPlayer);
  });

  describe("winning direction possiblites", () => {
    let firstPlayer: PlayerType;

    beforeEach(() => {
      firstPlayer = ticTacToe.curentPlayer;
    });

    it("first player wins the game diagonlly", () => {
      ticTacToe = new TicTacToe([
        [PlayerType.X, PlayerType.O, ""],
        [PlayerType.O, PlayerType.X, ""],
        ["", "", ""],
      ]);
      ticTacToe.makeMove(2, 2, PlayerType.X);
      expect(ticTacToe.getWinner()).toEqual(firstPlayer);
    });

    it("first player wins the game by row", () => {
      ticTacToe = new TicTacToe([
        [PlayerType.X, PlayerType.X, ""],
        [PlayerType.O, PlayerType.O, ""],
        ["", "", ""],
      ]);
      ticTacToe.makeMove(0, 2, PlayerType.X);
      expect(ticTacToe.getWinner()).toEqual(firstPlayer);
    });

    it("first player wins the game by col", () => {
      ticTacToe = new TicTacToe([
        [PlayerType.X, PlayerType.O, ""],
        [PlayerType.X, PlayerType.O, ""],
        ["", "", ""],
      ]);

      ticTacToe.makeMove(2, 0, PlayerType.X); // first player
      expect(ticTacToe.getWinner()).toEqual(firstPlayer);
    });
  });

  const createDrawGame = () => {
    const ticTacToe = new TicTacToe([
      [PlayerType.X, PlayerType.O, PlayerType.X],
      [PlayerType.X, PlayerType.O, PlayerType.O],
      [PlayerType.O, PlayerType.X, ""],
    ]);

    ticTacToe.makeMove(2, 2, PlayerType.X);
    return ticTacToe;
  };

  it("game ended in draw", () => {
    const ticTacToe = createDrawGame();
    expect(ticTacToe.getWinner()).toEqual("None");
  });

  it("cant make moves after someone wins", () => {
    const ticTacToe = new TicTacToe([
      [PlayerType.X, PlayerType.O, PlayerType.O],
      ["", PlayerType.X, ""],
      ["", "", ""],
    ]);
    ticTacToe.makeMove(2, 2, PlayerType.X);
    expect(() => {
      ticTacToe.makeMove(1, 2, PlayerType.O);
    }).toThrow(Errors.cantMakeMovesAfterGameEnd);
  });
});
