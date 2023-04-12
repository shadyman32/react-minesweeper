import { useState } from "react";
import { Board } from "./components/Board";

let isGameStarted = false;

export default function App() {
  const boardSize = 8;
  const maxMines = 9;

  const [squares, setSquares] = useState(Array(boardSize).fill(0).map(() => Array(boardSize).fill(0)));

  function calcNumbers() {
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

  function placeManyMines(boardSize) {
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
      updateSquares[position.y][position.x] = -100; // was -1, may cause problems
    });

    setSquares(updateSquares);
    calcNumbers();

    isGameStarted = true;
  }

  return (
    <>
      <Board squares={squares} setSquares={setSquares} />
      <button onClick={() => placeManyMines(boardSize)}>Set a lot of mines</button>
    </>
  );
}