import { Square } from "./Square";

export function Board({ squares, setSquares }) {
    function handleClick(e, rowId, columnId) {
        const updateSquares = squares.slice();
        if (e.type === 'click') {
            updateSquares[rowId][columnId].open = true;
        } else if (e.type === 'contextmenu') {
            e.preventDefault()
            updateSquares[rowId][columnId].flagged = true;
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