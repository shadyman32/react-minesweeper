import React from 'react'

export function Square({ state, rowId, columnId, handleClick }) {
    const getState = () => {
        if (!state.open) {
            if (state.flagged) return '!';
            if (state.questionMark) return '?';
        };

        if (state.minesNearby) return state.minesNearby;
        if (state.mine) return 'X';
    }

    return (
        <button className='square' onClick={() => handleClick(rowId, columnId)}>
            {getState()}
        </button>
    )
}