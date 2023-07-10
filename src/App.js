import { useEffect, useState } from "react";
import { Board } from "./components/Board";
import { Timer } from "./components/Timer";

export default function App() {
    const BEGINNER = { y: 9, x: 9, maxMines: 10 };
    const INTERMEDIATE = { y: 16, x: 16, maxMines: 40 };
    const EXPERT = { y: 16, x: 30, maxMines: 99 };

    const [boardSize, setBoardSize] = useState(BEGINNER);
    const [maxMines, setMaxMines] = useState(BEGINNER.maxMines);
    const [isGameStarted, setGameStarted] = useState(false);
    const [isGameOver, setGameIsOver] = useState(false);
    const [win, setWin] = useState(false);
    const [squares, setSquares] = useState(new Array(boardSize.y).fill().map((y, yIndex) => new Array(boardSize.x).fill().map((x, xIndex) => {
        return {
            y: yIndex,
            x: xIndex,
            open: false,
            mine: false,
            minesNearby: 0,
            flagged: false,
            questionMark: false,
            middleDown: false
        }
    })));
    const [mines, setMines] = useState(BEGINNER.maxMines);
    const [closedSquares, setClosedSquares] = useState(boardSize.y * boardSize.x);
    const [middleDown, setMiddleDown] = useState(false);

    useEffect(() => {
        setSquares(new Array(boardSize.y).fill().map((y, yIndex) => new Array(boardSize.x).fill().map((x, xIndex) => {
            return {
                y: yIndex,
                x: xIndex,
                open: false,
                mine: false,
                minesNearby: 0,
                flagged: false,
                questionMark: false,
                highlight: false
            }
        })));
    }, [boardSize]);

    useEffect(() => {
        if (closedSquares === 0 && mines === 0) {
            setWin(true);
            setGameIsOver(true);
        }
    }, [closedSquares, mines]);

    useEffect(() => {
        setGameStarted(false);
        if (win) alert('You have won!');
    }, [isGameOver, win]);

    function placeMines(firstSquare) {
        const updateSquares = squares.slice();
        let numberOfMines = maxMines;

        for (let i = 0; i < numberOfMines; i++) {
            let y = Math.floor(Math.random() * boardSize.y);
            let x = Math.floor(Math.random() * boardSize.x);

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

        const countMines = (square) => {
            if (!square.mine) square.minesNearby += 1;
        }

        updateSquares.forEach((row, y) => {
            row.forEach((square, x) => {
                if (square.mine) {
                    const list = getNeighbors(square, updateSquares);
                    list.forEach(neighbor => countMines(neighbor));
                }
            });
        });

        setSquares(updateSquares);
    }

    function getNeighbors(square, updateSquares) {
        const list = [];
        const minX = Math.max(0, square.x - 1);
        const maxX = Math.min(updateSquares[square.y].length - 1, square.x + 1);
        const minY = Math.max(0, square.y - 1);
        const maxY = Math.min(updateSquares.length - 1, square.y + 1);

        for (let y = minY; y <= maxY; y++) {
            for (let x = minX; x <= maxX; x++) {
                if (y !== square.y || x !== square.x) {
                    list.push(updateSquares[y][x]);
                }
            }
        }
        return list;
    }

    function handleClick(e, square) {
        const updateSquares = squares.slice();

        function openField(square) {
            if (square.open) return;
            square.open = true;

            setClosedSquares((squares) => squares - 1);

            if (square.mine) {
                setGameIsOver(true);
                updateSquares.forEach(row => {
                    row.forEach(square => {
                        if (square.mine && !square.flagged) square.open = true;
                    });
                });
                return;
            }

            if (square.minesNearby > 0) return;

            const list = getNeighbors(square, updateSquares);
            list.forEach(neighbor => {
                updateSquares[neighbor.y][neighbor.x] = neighbor;
                openField(neighbor)
            });

            setSquares(updateSquares);
        }

        if (e.type === 'click') {
            if (isGameOver) return;

            if (!isGameStarted && !isGameOver) {
                placeMines(square);
                setGameStarted(true);
            }

            if (!square.open && !square.flagged) {
                openField(square);
            }
        }

        if (e.type === 'contextmenu') {
            e.preventDefault()
            if (isGameOver) return;
            if (square.open) return;

            square.flagged = !square.flagged;

            if (square.flagged) {
                setMines(mines => mines - 1);
                setClosedSquares((squares) => squares - 1);
            } else {
                setMines(mines => mines + 1);
                setClosedSquares((squares) => squares + 1);
            }
        }

        if (e.type === 'auxclick' && e.button === 1) {
            if (!square.open || square.minesNearby === 0) return;

            let minesNearby = 0;
            let flagsAreSet = false;

            const list = getNeighbors(square, updateSquares);
            list.forEach(neighbor => {
                if (neighbor.flagged) minesNearby += 1;
            });

            if (square.minesNearby === minesNearby) {
                flagsAreSet = true;
            }

            list.forEach(neighbor => {
                if (neighbor.flagged) return;
                if (flagsAreSet) openField(neighbor);
            });
        }

        const list = getNeighbors(square, updateSquares);

        if (e.type === 'mousedown' && e.button === 1) {
            if (isGameOver) return;
            list.forEach(neighbor => neighbor.highlight = true);
            setMiddleDown(true);
        }

        if (e.type === 'mouseup' && e.button === 1) {
            list.forEach(neighbor => neighbor.highlight = false);
            setMiddleDown(false);
        }

        if (e.type === 'mouseenter' && middleDown) {
            list.forEach(neighbor => neighbor.highlight = true);
        }

        if (e.type === 'mouseleave' && middleDown) {
            list.forEach(neighbor => neighbor.highlight = false);
        }

        setSquares(updateSquares);
    }

    function setUpGame(settings) {
        setBoardSize(settings);
        setMaxMines(settings.maxMines);
        setClosedSquares(settings.y * settings.x);
        setGameStarted(false);
        setGameIsOver(false);
        setWin(false);
        setMines(settings.maxMines);
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
            <button onClick={() => setUpGame(BEGINNER)} >Beginner</button>
            <button onClick={() => setUpGame(INTERMEDIATE)}>Intermediate</button>
            <button onClick={() => setUpGame(EXPERT)}>Expert</button>
            <button>Custom</button>
        </>
    );
}