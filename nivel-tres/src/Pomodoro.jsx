import { useState, useEffect, useRef } from 'react';

const WORK_TIME = 1500;
const BREAK_TIME = 300;

function Pomodoro() {
    // Declara los estados timeLeft e isRunning
    const [workMins, setWorkMins] = useState(25);
    const [breakMins, setBreakMins] = useState(5);
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isRunning, setIsRunning] = useState(false);
    // Declara estados mode y sessions
    const [mode, setMode] = useState("work");
    const [sessions, setSessions] = useState([]);

    // Implementa useEffect para timeLeft
    useEffect(() => {
        if (timeLeft === 0) {
            if (mode === "work") {
                setSessions((prevSessions) => [...prevSessions, { id: Date.now(), type: "work", duration: workMins * 60, completedAt: new Date() }]);
                setMode("break");
                setTimeLeft(breakMins * 60);
                setIsRunning(true);
            } else if (mode === "break") {
                setMode("work");
                setTimeLeft(workMins * 60);
                setIsRunning(true);
            }
        }
    }, [timeLeft, mode, workMins, breakMins]);

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
    // Funciones toggleTimer y resetTimer
    const toggleTimer = () => {
        setIsRunning(!isRunning);
    };

    const resetTimer = () => {
        setIsRunning(false);
        setTimeLeft(workMins * 60);
        setMode("work");
        setSessions([]);
    };
    // Funcion para mostrar inputs
    function minutesInput(isRunning, value, type) {
        if (isRunning === false) {
            return <input type="number" min="1" max="60" value={value} onChange={(e) => readInputs(e, type)} />;
        } else {
            return <input type="number" min="1" max="60" value={value} disabled />;
        };
    };
    // Funcion para leer los inputs
    function readInputs(e, type) {
        const newValue = parseInt(e.target.value, 10);

        if (isNaN(newValue) || newValue < 1 || newValue > 60) {
            return;
        }

        if (type === "work") {
            setWorkMins(newValue);
            if (mode === "work") {
                setTimeLeft(newValue * 60);
            }
        } else if (type === "break") {
            setBreakMins(newValue);
            if (mode === "break") {
                setTimeLeft(newValue * 60);
            }
        }
    }
    return (
        <div>
            <h1>Timer Pomodoro</h1>
            <h3>Modo: {mode === "work" ? 'Trabajo' : 'Descanso'}</h3>
            <h2>{formatTime(timeLeft)}</h2>
            <button className="timer-btn" onClick={toggleTimer}>
                {isRunning ? 'Pausar' : 'Iniciar'}
            </button>
            <button className="timer-btn" onClick={resetTimer}>
                Reiniciar
            </button>
            <h2>Configurar:</h2>
            <span><b>Minutos de trabajo: {minutesInput(isRunning, workMins, "work")}</b></span><br></br>
            <span><b>Minutos de descanso: {minutesInput(isRunning, breakMins, "break")}</b></span>
            <h3>Historial de Sesiones:</h3>
            <ul>
                {sessions.map((session, index) => (
                    <li key={session.id}>
                        <span><b>Sesión {index + 1}</b></span>
                        <span> | <i>Duración:</i> {formatTime(session.duration)} | </span>
                        <span><i>Hora de finalización:</i> {session.completedAt.toLocaleTimeString()} </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
export default Pomodoro;