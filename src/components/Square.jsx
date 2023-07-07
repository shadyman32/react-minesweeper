import React from 'react'

export function Square({ state, rowId, columnId, handleClick }) {
    function getState() {
        if (!state.open) {
            if (state.flagged) return '🚩';
            if (state.questionMark) return '?';
        };
        if (state.open) {
            if (state.mine) return 'X';
            if (state.minesNearby > 0) return state.minesNearby;
        }
    }

    const buttonClass = state.open ? `square square-${state.minesNearby} square-open` : `square`;

    return (
        <button
            className={buttonClass}
            onClick={(e) => handleClick(e, state)}
            onContextMenu={(e) => handleClick(e, state)}
            onAuxClick={(e) => handleClick(e, state)}
        >
            {getState()}
        </button>
    )
}