import * as React from "react";
import gameReducer, { initialState, useActions } from "./reducer/gameReducer";
import "./styles.css";

const NextPlayer = React.memo<{ playerMark: string }>(({ playerMark }) => (
  <div className="instruction">Your Turn: Player {playerMark}</div>
));

const WinningPlayer = React.memo<{ winningPlayer: string }>(
  ({ winningPlayer }) => (
    <div className="instruction">
      <h2>You Won</h2>
      <p>Player {winningPlayer}, Congratulations</p>
    </div>
  )
);

const Reset = React.memo<{ onClick: () => void }>(({ onClick }) => (
  <div>
    <button onClick={onClick}>Play again</button>
  </div>
));

interface SquareProps {
  playerMark: string;
  squareId: number;
  onClick: (idx: number) => void;
}

const Square = React.memo<SquareProps>(({ playerMark, squareId, onClick }) => {
  const callBack = React.useCallback(
    () => onClick(squareId),
    [squareId, onClick]
  );
  return (
    <div
      className={`square square-${playerMark}`}
      role="button"
      onClick={callBack}
    >
      <span> {playerMark}</span>
    </div>
  );
});

interface BoardProps {
  gameBoard: string[];
  playerMark: string;
  winningPlayer: string | null;
  gameOver: boolean;
  onSquareClick: (idx: number) => void;
  onReset: () => void;
}

const Board = ({
  gameBoard,
  gameOver,
  playerMark,
  winningPlayer,
  onSquareClick,
  onReset,
}: BoardProps) => {
  return (
    <div>
      {!gameOver && <NextPlayer playerMark={playerMark} />}

      {winningPlayer && <WinningPlayer winningPlayer={winningPlayer} />}

      <Reset onClick={onReset} />

      <div className="board">
        {gameBoard.map((playerMark, idx) => (
          <Square
            key={idx.toString()}
            squareId={idx}
            playerMark={playerMark}
            onClick={onSquareClick}
          />
        ))}
      </div>
    </div>
  );
};

export function Game() {
  const [state, dispatch] = React.useReducer(gameReducer, initialState);

  const actions = useActions(dispatch, state);

  const { gameBoard, playerMark, winningPlayer, gameOver } = state;

  return (
    <div className="game-box">
      <Board
        gameBoard={gameBoard}
        playerMark={playerMark}
        winningPlayer={winningPlayer}
        gameOver={gameOver}
        onReset={actions.gameReset}
        onSquareClick={actions.squareClicked}
      />
    </div>
  );
}
