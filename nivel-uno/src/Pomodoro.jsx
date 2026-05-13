import { useState, useEffect, useRef } from 'react';

function Pomodoro() {
    // Declara los estados timeLeft e isRunning
    const [timeLeft, setTimeLeft] = useState(1500);
    const [isRunning, setIsRunning] = useState(false);
    // Declara intervalRef con useRef
    const intervalRef = useRef(null);
    // Implementa el useEffect para el timer
    //   - Crea el intervalo si isRunning && timeLeft > 0
    //   - Detén si timeLeft === 0
    //   - Retorna la funcion de limpieza
    useEffect(() => {
        if (isRunning && timeLeft > 0) {
            intervalRef.current = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
        }

        if (timeLeft === 0) {
            setIsRunning(false);
        };

        return () => {
            clearInterval(intervalRef.current);
        };
    }, [isRunning, timeLeft]);

    // Funcion formatTime(seconds) => "MM:SS"
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secondsLeft = seconds % 60;

        const displayMins = String(minutes).padStart(2, '0');
        const displaySecs = String(secondsLeft).padStart(2, '0');
        return `${displayMins}:${displaySecs}`;
    };
    // TODO 5: Funciones toggleTimer y resetTimer
    const toggleTimer = () => {
        setIsRunning(!isRunning);
    };

    const resetTimer = () => {
        setIsRunning(false);
        setTimeLeft(1500);
    };

    return (
        <div>
            <h1>Timer Pomodoro</h1>
            <h2>{formatTime(timeLeft)}</h2>
            <button onClick={toggleTimer}>
                {isRunning ? 'Pausar' : 'Iniciar'}
            </button>
            <button onClick={resetTimer}>
                Reiniciar
            </button>
        </div>
    );
}

export default Pomodoro;