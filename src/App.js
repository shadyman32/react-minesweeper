import { useState } from "react";
import { Board } from "./components/Board";

let isGameStarted = false;

export default function App() {
  const boardSize = 8;
  const maxMines = 9;

  const [squares, setSquares] = useState(Array(boardSize).fill().map(() => Array(boardSize).fill().map(() => {
    return {
      open: false,
      mine: false,
      minesNearby: 0,
      flagged: false,
      questionMark: false
    }
  })));

  function countMines() {
    const updateSquares = squares.slice();

    updateSquares.forEach((row, yPos) => {
      row.forEach((square, xPos) => {
        if (square < -10) return;

        if (row[xPos + 1] < -10) row[xPos] += 1;
        if (row[xPos - 1] < -10) row[xPos] += 1;
        if (updateSquares[yPos - 1]) {
          if (updateSquares[yPos - 1][xPos] < -10) {
            updateSquares[yPos][xPos] += 1;
          }
          if (updateSquares[yPos - 1][xPos - 1] < -10) {
            updateSquares[yPos][xPos] += 1;
          }
          if (updateSquares[yPos - 1][xPos + 1] < -10) {
            updateSquares[yPos][xPos] += 1;
          }
        }
        if (updateSquares[yPos + 1]) {
          if (updateSquares[yPos + 1][xPos] < -10) {
            updateSquares[yPos][xPos] += 1;
          }
          if (updateSquares[yPos + 1][xPos - 1] < -10) {
            updateSquares[yPos][xPos] += 1;
          }
          if (updateSquares[yPos + 1][xPos + 1] < -10) {
            updateSquares[yPos][xPos] += 1;
          }
        }
      });
    });

    setSquares(updateSquares);
  }

  function placeMines(boardSize) {
    if (isGameStarted) return;

    const updateSquares = squares.slice();

    const mines = Array(maxMines);

    for (let i = 0; i < mines.length; i++) {
      let duplicate = false;
      const newMine = {
        y: Math.floor(Math.random() * boardSize),
        x: Math.floor(Math.random() * boardSize)
      }

      mines.forEach((mine) => {
        if (mine.y === newMine.y && mine.x === newMine.x) duplicate = true;
      });

      if (!duplicate) {
        mines[i] = newMine;
      } else {
        duplicate = false;
        i -= 1;
        continue;
      }
    }

    mines.forEach(position => {
      updateSquares[position.y][position.x].mine = true; // was -1, may cause problems
    });

    setSquares(updateSquares);
    countMines();

    isGameStarted = true;
  }

  return (
    <>
      <Board squares={squares} setSquares={setSquares} />
      <button onClick={() => placeMines(boardSize)}>Set a lot of mines</button>
    </>
  );
}