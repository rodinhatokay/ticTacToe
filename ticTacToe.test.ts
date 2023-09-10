import { Errors } from "./errors";
import { CellType, TicTacToe } from "./ticTacToe";

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
    it("should create empty game board by providing to consturctor", () => {
      const ticTacToe = new TicTacToe([
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
      ]);
      expect(ticTacToe.gameBoard).toEqual([
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
      ]);
    });

    it("it should select the correct players turn by given custom game board", () => {
      const ticTacToe = new TicTacToe([
        ["X", "", ""],
        ["", "", ""],
        ["", "", ""],
      ]);
      expect(ticTacToe.curentPlayer).toEqual("O");
    });

    it("checks if game board providied is valid", () => {
      expect(() => {
        const ticTacToe = new TicTacToe([
          ["X", "X", ""],
          ["", "", ""],
          ["", "", ""],
        ]);
      }).toThrow(Errors.invalidGameBoardInitalProvided);

      expect(() => {
        const ticTacToe = new TicTacToe([
          ["X", "O", "X"],
          ["X", "", ""],
          ["", "", ""],
        ]);
      }).toThrow(Errors.invalidGameBoardInitalProvided);
    });

    it("should set winner if provided game ended", () => {
      const ticTacToe = new TicTacToe([
        ["X", "O", ""],
        ["", "X", "O"],
        ["", "", "X"],
      ]);
      expect(ticTacToe.getWinner()).toEqual("X");
    });
  });

  describe("validations on player moves", () => {
    it("player can make a move", () => {
      const player = "X";
      ticTacToe.makeMove(0, 0, player);
      expect(ticTacToe.gameBoard[0][0]).toEqual(player);
    });

    it("player cant make a move on same place", () => {
      ticTacToe.makeMove(0, 0, "X");
      expect(() => {
        ticTacToe.makeMove(0, 0, "X");
      }).toThrow(Errors.spotAlreadyTaken);
    });

    it("should throw error when trying to play 2 or more rounds as same player", () => {
      ticTacToe.makeMove(0, 0, "X");
      expect(() => {
        ticTacToe.makeMove(0, 1, "X");
      }).toThrow(Errors.otherPlayersTurnToMakeMove);
    });

    it("player can't make a move outside the game board", () => {
      // each move can be refactored and called to function something like: makeMoveUpperBandRow etc..
      expect(() => {
        ticTacToe.makeMove(-1, 2, "X"); // row upper band
      }).toThrow(Errors.invalidMoveCoordinates);

      expect(() => {
        ticTacToe.makeMove(4, 2, "O"); // row lower band
      }).toThrow(Errors.invalidMoveCoordinates);

      expect(() => {
        ticTacToe.makeMove(0, 5, "X"); // col upper band
      }).toThrow(Errors.invalidMoveCoordinates);

      expect(() => {
        ticTacToe.makeMove(0, -5, "O"); // col lower band
      }).toThrow(Errors.invalidMoveCoordinates);
    });
  });

  it("game switches players", () => {
    const firstPlayer = ticTacToe.curentPlayer;
    ticTacToe.makeMove(0, 0, firstPlayer);
    expect(ticTacToe.curentPlayer).not.toEqual(firstPlayer);
  });

  describe("winning direction possiblites", () => {
    let firstPlayer: CellType;

    beforeEach(() => {
      firstPlayer = ticTacToe.curentPlayer;
    });

    it("first player wins the game diagonlly", () => {
      ticTacToe = new TicTacToe([
        ["X", "O", ""],
        ["O", "X", ""],
        ["", "", ""],
      ]);
      ticTacToe.makeMove(2, 2, "X");
      expect(ticTacToe.getWinner()).toEqual(firstPlayer);
    });

    it("first player wins the game by row", () => {
      ticTacToe = new TicTacToe([
        ["X", "X", ""],
        ["O", "O", ""],
        ["", "", ""],
      ]);
      ticTacToe.makeMove(0, 2, "X");
      expect(ticTacToe.getWinner()).toEqual(firstPlayer);
    });

    it("first player wins the game by col", () => {
      ticTacToe = new TicTacToe([
        ["X", "O", ""],
        ["X", "O", ""],
        ["", "", ""],
      ]);

      ticTacToe.makeMove(2, 0, "X"); // first player
      expect(ticTacToe.getWinner()).toEqual(firstPlayer);
    });
  });

  const createDrawGame = () => {
    const ticTacToe = new TicTacToe([
      ["X", "O", "X"],
      ["X", "O", "O"],
      ["O", "X", ""],
    ]);

    ticTacToe.makeMove(2, 2, "X");
    return ticTacToe;
  };

  it("game ended in draw", () => {
    const ticTacToe = createDrawGame();
    expect(ticTacToe.getWinner()).toEqual("None");
  });

  it("cant make moves after someone wins", () => {
    const ticTacToe = new TicTacToe([
      ["X", "O", "O"],
      ["", "X", ""],
      ["", "", ""],
    ]);
    ticTacToe.makeMove(2, 2, "X");
    expect(() => {
      ticTacToe.makeMove(1, 2, "O");
    }).toThrow(Errors.cantMakeMovesAfterGameEnd);
  });
});
