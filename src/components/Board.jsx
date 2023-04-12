import { BoardRow } from "./BoardRow"

export function Board({ squares, setSquares }) {
    function handleClick(rowId, columnId) {
        const updateSquares = squares.slice();
        updateSquares[rowId][columnId] = "!";
        setSquares(updateSquares);
    }

    return (
        squares.map((row, i) => {
            return (
                <BoardRow key={i} rowId={i} row={row} handleClick={handleClick} />
            )
        })
    )
}