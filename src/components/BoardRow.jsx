import { Square } from "./Square";

export function BoardRow({ rowId, row, handleClick }) {
    return (
        <div className="board-row">
            {row.map((square, i) => {
                return (
                    <Square key={i} state={square} rowId={rowId} columnId={i} handleClick={handleClick}></Square>
                );
            })}
        </div>
    )
}