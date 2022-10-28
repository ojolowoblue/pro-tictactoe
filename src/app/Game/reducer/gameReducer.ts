import { Dispatch } from "react";

const actionTypes = {
  squareClicked: "squareClicked",
  gameReset: "gameReset",
};

const markX = "X";
const markO = "O";

const winningCombos: number[][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export type Type = keyof typeof actionTypes;

export const initialState = {
  gameBoard: Array(9).fill(""),
  playerMark: markX,
  winningPlayer: null,
  gameOver: false,
};

export const useActions = (
  dispatch: Dispatch<{ type: Type; payload?: number }>,
  state: unknown
) => ({
  squareClicked: (idx: number) =>
    dispatch({
      type: actionTypes.squareClicked as Type,
      payload: idx,
    }),
  gameReset: () =>
    dispatch({
      type: actionTypes.gameReset as Type,
    }),
});

const gameReducer = (
  state: typeof initialState,
  { type, payload }: { type: Type; payload?: number }
) => {
  switch (type) {
    case actionTypes.squareClicked:
      const idx = payload;

      const squarePlayedAlready = state.gameBoard[Number(idx)];
      if (state.winningPlayer || squarePlayedAlready) {
        return state;
      }

      const gameBoard = [...state.gameBoard];
      gameBoard[Number(idx)] = state.playerMark;

      let winningPlayer = state.winningPlayer;

      const havingWinningCombo = winningCombos.some((combo) => {
        const [idx1, idx2, idx3] = combo;

        const marks = [gameBoard[idx1], gameBoard[idx2], gameBoard[idx3]];

        const [firstMark] = marks;

        const isWinningCombo =
          firstMark && marks.every((mark) => mark === firstMark);

        if (isWinningCombo) {
          winningPlayer = firstMark;
          return true;
        }

        return false;
      });

      const gameOver = havingWinningCombo || gameBoard.every((mark) => !!mark);

      const playerMark = state.playerMark === markX ? markO : markX;

      return {
        gameBoard,
        playerMark,
        winningPlayer,
        gameOver,
      };

    case actionTypes.gameReset:
      return { ...initialState };

    default:
      throw new Error(`Unknwon action ${type}`);
  }
};

export default gameReducer;
