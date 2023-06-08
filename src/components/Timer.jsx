import React from 'react'
import { useEffect, useState } from "react";

export function Timer({ isGameStarted }) {
    const [time, setTime] = useState(0);

    useEffect(() => {
        let intervalId;
        if (isGameStarted) {
            intervalId = setInterval(() => setTime((oldTime) => oldTime + 1), 1000);
        }
        return () => clearInterval(intervalId);
    });

    return (
        <div className="timer">
            Timer: {time}
        </div>
    );
}
