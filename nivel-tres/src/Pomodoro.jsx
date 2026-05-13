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

    const savePartialSession = () => {
        const tiempoTotal = mode === "work" ? workMins * 60 : breakMins * 60;
        const tiempoTranscurrido = tiempoTotal - timeLeft;

        if (tiempoTranscurrido <= 0) {
            return;
        }

        setSessions((prevSessions) => [
            ...prevSessions,
            {
                id: Date.now(),
                type: mode === "work" ? "work (parcial)" : "break (parcial)",
                duration: tiempoTranscurrido,
                completedAt: new Date(),
            },
        ]);
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
    // Barra de progreso
    const progress = mode === "work" ? (workMins * 60 - timeLeft) / (workMins * 60) : (breakMins * 60 - timeLeft) / (breakMins * 60);
    const percentage = Math.floor(progress * 100);

    // useEffect para reproducir sonido al finalizar el timer
    useEffect(() => {
        if (timeLeft === 0) {
            try {
                const sound = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");
                sound.play();
            } catch (error) {
                console.error("Error al reproducir el sonido:", error);
            }
        }
    }, [timeLeft]);
    // Return
    return (
        <div>
            <h1>Timer Pomodoro</h1>
            <h3>Modo: {mode === "work" ? 'Trabajo' : 'Descanso'}</h3>
            <h2>{formatTime(timeLeft)}</h2>
            <div style={{ background: '#fff', borderRadius: '10px', overflow: 'hidden', margin: '0 auto', marginBottom: '20px', width: '50%' }}>
                <div style={{ width: `${percentage}%`, background: mode === "work" ? '#e25f89' : '#81c9ea', height: '20px' }}></div>
            </div>
            <button className="timer-btn" onClick={toggleTimer}>
                {isRunning ? 'Pausar' : 'Iniciar'}
            </button>
            <button className="timer-btn" onClick={resetTimer}>
                Reiniciar
            </button>
            <button className="timer-btn" onClick={savePartialSession}>
                Guardar sesion
            </button>
            <h2>Configurar:</h2>
            <span><b>Minutos de trabajo: {minutesInput(isRunning, workMins, "work")}</b></span><br></br>
            <span><b>Minutos de descanso: {minutesInput(isRunning, breakMins, "break")}</b></span>
            <h3>Historial de Sesiones:</h3>
            <ul>
                {sessions.map((session, index) => (
                    <li key={session.id}>
                        <span><b>Sesión {index + 1}</b></span>
                        <span> | <i>Tipo:</i> {session.type} | </span>
                        <span> | <i>Duración:</i> {formatTime(session.duration)} | </span>
                        <span><i>Hora de finalización:</i> {session.completedAt.toLocaleTimeString()} </span>
                    </li>
                ))}
            </ul>
            <h3>Estadisticas:</h3>
            <p><b>Sesiones de trabajo:</b> {sessions.filter((s) => s.mode === "work").length}</p>
            <p><b>Duración total de trabajo:</b> {formatTime(sessions.filter((s) => s.mode === "work").reduce((total, s) => total + s.duration, 0))}</p>
        </div>
    );
}
export default Pomodoro;