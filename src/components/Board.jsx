import { Square } from "./Square";

export function Board({ squares, setSquares }) {
    function handleClick(e, rowId, columnId) {
        if (e.type === 'click') {
            console.log('Left click');
        } else if (e.type === 'contextmenu') {
            e.preventDefault()

            const updateSquares = squares.slice();
            updateSquares[rowId][columnId].flagged = true;
            setSquares(updateSquares);
        }
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