import { Square } from "./Square";

export function Board({ squares, handleClick }) {
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