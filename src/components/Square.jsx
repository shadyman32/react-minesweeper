import React from 'react'

export function Square({ state, rowId, columnId, handleClick }) {
    let output;
    if (state < 0) {
        output = 'X';
    } else if (state > 100) {
        output = '!'
    } else {
        output = state;
    }

    const className = state < 0 ? "square-mine" : "square";
    return (
        <button className={className} onClick={() => handleClick(rowId, columnId)}>
            {output}
        </button>
    )
}