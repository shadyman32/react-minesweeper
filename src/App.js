import { useEffect, useState } from "react";
import { Board } from "./components/Board";
import { Timer } from "./components/Timer";

export default function App() {
    const boardSize = 8;
    const maxMines = 10;

    const [isGameStarted, setGameStarted] = useState(false);
    const [isGameOver, setGameIsOver] = useState(false);
    const [squares, setSquares] = useState(new Array(boardSize).fill().map(() => new Array(boardSize).fill().map(() => {
        return {
            open: false,
            mine: false,
            minesNearby: 0,
            flagged: false,
            questionMark: false
        }
    })));
    const [mines, setMines] = useState(maxMines);
    const [closedSquares, setClosedSquares] = useState(boardSize * boardSize);

    useEffect(() => {
        setGameStarted(false);
    }, [isGameOver]);

    useEffect(() => {
        if (closedSquares === 0) {
            alert('You have won!');
        }
    }, [closedSquares]);

    function countMines() {
        const updateSquares = squares.slice();

        updateSquares.forEach((row, yPos) => {
            row.forEach((square, xPos) => {
                if (square.mine) return;

                if (row[xPos + 1] && row[xPos + 1].mine) {
                    square.minesNearby += 1;
                }

                if (row[xPos - 1] && row[xPos - 1].mine) {
                    square.minesNearby += 1;
                }

                const topRow = updateSquares[yPos - 1];
                if (topRow) {
                    if (topRow[xPos].mine) {
                        square.minesNearby += 1;
                    }
                    if (topRow[xPos - 1] && topRow[xPos - 1].mine) {
                        square.minesNearby += 1;
                    }
                    if (topRow[xPos + 1] && topRow[xPos + 1].mine) {
                        square.minesNearby += 1;
                    }
                }

                const bottomRow = updateSquares[yPos + 1];
                if (bottomRow) {
                    if (bottomRow[xPos] && bottomRow[xPos].mine) {
                        square.minesNearby += 1;
                    }
                    if (bottomRow[xPos - 1] && bottomRow[xPos - 1].mine) {
                        square.minesNearby += 1;
                    }
                    if (bottomRow[xPos + 1] && bottomRow[xPos + 1].mine) {
                        square.minesNearby += 1;
                    }
                }
            });
        });

        setSquares(updateSquares);
    }

    function placeMines(updateSquares, y, x) {
        const mines = new Array(maxMines);

        for (let i = 0; i < mines.length; i++) {
            let duplicate = false;
            const newMine = {
                y: Math.floor(Math.random() * boardSize),
                x: Math.floor(Math.random() * boardSize)
            }

            mines.forEach((mine) => {
                if (mine.y === newMine.y && mine.x === newMine.x) {
                    duplicate = true;
                }
            });

            if (y === newMine.y && x === newMine.x) {
                duplicate = true;
            }

            if (!duplicate) {
                mines[i] = newMine;
            } else {
                duplicate = false;
                i -= 1;
                continue;
            }
        }
        mines.forEach(position => {
            updateSquares[position.y][position.x].mine = true;
        });

        setSquares(updateSquares);
        countMines();

        setGameStarted(true);
    }

    function handleClick(e, y, x) {
        const updateSquares = squares.slice();

        if (e.type === 'click') {
            if (!isGameStarted && !isGameOver) placeMines(updateSquares, y, x);
            if (!updateSquares[y][x].open && !updateSquares[y][x].flagged) {
                openField(y, x);
            }

            function openField(y, x) {
                if (!updateSquares[y]?.[x] || updateSquares[y][x].open) return;
                updateSquares[y][x].open = true;

                setClosedSquares((squares) => squares - 1);
                if (updateSquares[y][x].mine) {
                    setGameIsOver(true);
                    updateSquares.forEach(row => {
                        row.forEach(square => {
                            if (square.mine && !square.flagged) square.open = true;
                        });
                    });
                    return;
                }

                if (updateSquares[y][x].minesNearby > 0) return;

                openField(y, x + 1);
                openField(y, x - 1);
                openField(y - 1, x);
                openField(y + 1, x);
                openField(y - 1, x + 1);
                openField(y - 1, x - 1);
                openField(y + 1, x + 1);
                openField(y + 1, x - 1);

                setSquares(updateSquares);
            }
        }

        if (e.type === 'contextmenu') {
            e.preventDefault()
            if (updateSquares[y][x].open) return;

            updateSquares[y][x].flagged = !updateSquares[y][x].flagged;

            if (updateSquares[y][x].flagged) {
                setMines(mines - 1);
                setClosedSquares((squares) => squares - 1);
            } else {
                setMines(mines + 1);
                setClosedSquares((squares) => squares + 1);
            }
        }
        setSquares(updateSquares);
    }

    return (
        <>
            <div>Total mines: {maxMines}</div>
            <div>Mines left: {mines}</div>
            {
                JSON.stringify(closedSquares)
            }
            <Timer isGameStarted={isGameStarted} />
            <Board squares={squares} handleClick={handleClick} />
        </>
    );
}