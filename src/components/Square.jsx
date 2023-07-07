import React from 'react'

export function Square({ state, rowId, columnId, handleClick }) {
    let output;
    if (!state.open) {
        if (state.flagged) output = '🚩';
        if (state.questionMark) output = '?';
    };
    if (state.open) {
        if (state.mine) output = 'X';
        if (state.minesNearby > 0) output = state.minesNearby;
    }

    return (
        <button
            className={`square 
            ${state.open ? `square-${state.minesNearby} square-open` : ``}
            ${state.highlight && !state.flagged ? `btnDown` : ``}
            `}
            onMouseDown={(e) => handleClick(e, state)}
            onMouseUp={(e) => handleClick(e, state)}
            onMouseEnter={(e) => handleClick(e, state)}
            onMouseLeave={(e) => handleClick(e, state)}
            onClick={(e) => handleClick(e, state)}
            onContextMenu={(e) => handleClick(e, state)}
            onAuxClick={(e) => handleClick(e, state)}
        >
            {output}
        </button>
    )
}