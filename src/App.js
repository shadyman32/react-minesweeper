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

    function placeMines(firstSquare) {
        const updateSquares = squares.slice();
        let numberOfMines = maxMines;

        for (let i = 0; i < numberOfMines; i++) {
            let y = Math.floor(Math.random() * boardSize);
            let x = Math.floor(Math.random() * boardSize);

            if (firstSquare.y === y && firstSquare.x === x) {
                i = i - 1;
                continue;
            }

            if (updateSquares[y][x].mine) {
                i = i - 1;
                continue;
            }

            updateSquares[y][x].mine = true;
        }

        const countMines = (y, x) => {
            if (!updateSquares[y]?.[x] || updateSquares[y][x].mine) return;
            updateSquares[y][x].minesNearby += 1;
        }

        updateSquares.forEach((row, y) => {
            row.forEach((square, x) => {
                if (!square.mine) return;

                countMines(y, x + 1);
                countMines(y, x - 1);
                countMines(y + 1, x);
                countMines(y - 1, x);
                countMines(y + 1, x + 1);
                countMines(y + 1, x - 1);
                countMines(y - 1, x + 1);
                countMines(y - 1, x - 1);
            });
        });

        setSquares(updateSquares);
    }

    function handleClick(e, y, x) {
        const updateSquares = squares.slice();

        if (e.type === 'click') {
            if (!isGameStarted && !isGameOver) {
                placeMines({ y, x });
                setGameStarted(true);
            }

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