import { Square } from "./Square";

export function Board({ squares, setSquares, placeMines }) {
    function handleClick(e, y, x) {
        const updateSquares = squares.slice();
        if (e.type === 'click') {
            if (!updateSquares[y][x].flagged) {
                placeMines(updateSquares, y, x);
                updateSquares[y][x].open = true;
                openField(updateSquares, y, x);
            }
        } else if (e.type === 'contextmenu') {
            e.preventDefault()
            if (!updateSquares[y][x].flagged) {
                updateSquares[y][x].flagged = true;
            } else {
                updateSquares[y][x].flagged = false;
            }
        }
        setSquares(updateSquares);
    }

    function openField(updateSquares, y, x) {
        const currentRow = updateSquares[y];
        if (!currentRow[x].open && !currentRow[x].flagged) {
            currentRow[x].open = true;
        }

        if (currentRow[x].minesNearby > 0 || currentRow[x].mine) return;

        if (x < currentRow.length - 1 && !currentRow[x + 1].open) {
            openField(updateSquares, y, x + 1);
        }

        if (x > 0 && !currentRow[x - 1].open) {
            openField(updateSquares, y, x - 1);
        }

        const topRow = updateSquares[y - 1];
        if (topRow && !topRow[x].open) {
            openField(updateSquares, y - 1, x);
        }

        if (topRow && x < topRow.length - 1 && !topRow[x + 1].open) {
            openField(updateSquares, y - 1, x + 1);
        }

        if (topRow && x > 0 && !topRow[x - 1].open) {
            openField(updateSquares, y - 1, x - 1);
        }

        const bottomRow = updateSquares[y + 1];
        if (bottomRow && !bottomRow[x].open) {
            openField(updateSquares, y + 1, x);
        }

        if (bottomRow && x < bottomRow.length - 1 && !bottomRow[x + 1].open) {
            openField(updateSquares, y + 1, x + 1);
        }

        if (bottomRow && x > 0 && !bottomRow[x - 1].open) {
            openField(updateSquares, y + 1, x - 1);
        }

        setSquares(updateSquares);
    }

    return (
        squares.map((row, rowId) => {
            return (
                <div key={rowId} className="board-row">
                    {row.map((squareState, columnId) => {
                        return (
                            <Square key={columnId} state={squareState} rowId={rowId} columnId={columnId} handleClick={handleClick}></Square>
                        );
                    })}
                </div>
            )
        })
    )
}