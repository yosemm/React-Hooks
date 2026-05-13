import { useState, useEffect, useRef } from 'react';

function Pomodoro() {
    // Declara los estados timeLeft e isRunning
    const [timeLeft, setTimeLeft] = useState(1500);
    const [isRunning, setIsRunning] = useState(false);
    // Declara intervalRef con useRef
    intervalRef = useRef(null);
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

    return (
        <div>
            {/* TODO 6: Muestra el tiempo y los botones */}
        </div>
    );
}

export default Pomodoro;