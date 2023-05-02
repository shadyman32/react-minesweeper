import React from 'react'

export function Square({ state, rowId, columnId, handleClick }) {
    function getState() {
        if (!state.open) {
            if (state.flagged) return '!';
            if (state.questionMark) return '?';
        };
        if (state.mine) return 'X';
        if (state.minesNearby > 0) return state.minesNearby;
    }

    return (
        <button className='square' onClick={(e) => handleClick(e, rowId, columnId)} onContextMenu={(e) => handleClick(e, rowId, columnId)}>
            {getState()}
        </button>
    )
}