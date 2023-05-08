import { Square } from "./Square";

export function Board({ squares, setSquares }) {
    function handleClick(e, y, x) {
        const updateSquares = squares.slice();
        if (e.type === 'click') {
            updateSquares[y][x].open = true;
            openField(updateSquares, y, x)
        } else if (e.type === 'contextmenu') {
            e.preventDefault()
            updateSquares[y][x].flagged = true;
        }
        setSquares(updateSquares);
    }

    function openField(updateSquares, y, x) {
        const currentRow = updateSquares[y];
        if (!currentRow[x].open) {
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

        const bottomRow = updateSquares[y + 1];
        if (bottomRow) {
            openField(updateSquares, y + 1, x);
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