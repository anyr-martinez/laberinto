import React, { useRef, useEffect, useState } from "react";
const CELL_SIZE = 20;
const SIZE = 19;
const START_POS = { x: 1, y: 1 };
const GOAL_POS = { x: SIZE - 2, y: SIZE - 2 };
const INITIAL_TIME = 60;

function getUnvisitedNeighbors(pos, visited) {
    const neighbors = [];
    const directions = [
        { x: 0, y: -2 },
        { x: 2, y: 0 },
        { x: 0, y: 2 },
        { x: -2, y: 0 },
    ];
    for (const dir of directions) {
        const newX = pos.x + dir.x;
        const newY = pos.y + dir.y;
        if (
            newX > 0 &&
            newX < SIZE - 1 &&
            newY > 0 &&
            newY < SIZE - 1 &&
            !visited[newY][newX]
        ) {
            neighbors.push({ x: newX, y: newY });
        }
    }
    return neighbors;
}

function generateMaze() {
    // Inicializar con todas las paredes
    const maze = Array(SIZE)
        .fill()
        .map(() => Array(SIZE).fill(1));
    const stack = [];
    const visited = Array(SIZE)
        .fill()
        .map(() => Array(SIZE).fill(false));
    let current = { ...START_POS };
    maze[current.y][current.x] = 0;
    visited[current.y][current.x] = true;
    stack.push(current);
    while (stack.length > 0) {
        const neighbors = getUnvisitedNeighbors(current, visited);
        if (neighbors.length > 0) {
            const next = neighbors[Math.floor(Math.random() * neighbors.length)];
            const wallX = Math.floor((current.x + next.x) / 2);
            const wallY = Math.floor((current.y + next.y) / 2);
            maze[wallY][wallX] = 0;
            maze[next.y][next.x] = 0;
            visited[next.y][next.x] = true;
            stack.push(next);
            current = next;
        } else {
            current = stack.pop();
        }
    }
    maze[GOAL_POS.y][GOAL_POS.x] = 0;
    // Añadir caminos adicionales
    for (let i = 0; i < 8; i++) {
        const x = Math.floor(Math.random() * (SIZE - 2)) + 1;
        const y = Math.floor(Math.random() * (SIZE - 2)) + 1;
        if (Math.random() < 0.4) {
            maze[y][x] = 0;
        }
    }
    return maze;
}

const Laberinto = () => {
    const canvasRef = useRef(null);
    const [maze, setMaze] = useState(generateMaze());
    const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
    const [gameActive, setGameActive] = useState(true);
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentPath, setCurrentPath] = useState([]);
    const [status, setStatus] = useState({ message: "Dibuja una línea desde 🔴 hasta 🎯 sin tocar las paredes", type: "" });
    const [showGameOver, setShowGameOver] = useState(false);
    const [gameOverTitle, setGameOverTitle] = useState("");
    const [gameOverMessage, setGameOverMessage] = useState("");
    const timerRef = useRef();

    // Render maze and path
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Draw maze
        for (let y = 0; y < SIZE; y++) {
            for (let x = 0; x < SIZE; x++) {
                const cellX = x * CELL_SIZE;
                const cellY = y * CELL_SIZE;
                if (maze[y][x] === 1) {
                    ctx.fillStyle = "#2c3e50";
                    ctx.fillRect(cellX, cellY, CELL_SIZE, CELL_SIZE);
                } else {
                    ctx.fillStyle = "#ecf0f1";
                    ctx.fillRect(cellX, cellY, CELL_SIZE, CELL_SIZE);
                }
            }
        }
        // Draw start
        const startX = START_POS.x * CELL_SIZE + CELL_SIZE / 2;
        const startY = START_POS.y * CELL_SIZE + CELL_SIZE / 2;
        ctx.fillStyle = "#e74c3c";
        ctx.beginPath();
        ctx.arc(startX, startY, CELL_SIZE / 3, 0, 2 * Math.PI);
        ctx.fill();
        // Draw goal
        const goalX = GOAL_POS.x * CELL_SIZE + CELL_SIZE / 2;
        const goalY = GOAL_POS.y * CELL_SIZE + CELL_SIZE / 2;
        ctx.fillStyle = "#f1c40f";
        ctx.beginPath();
        ctx.arc(goalX, goalY, CELL_SIZE / 3, 0, 2 * Math.PI);
        ctx.fill();
        // Draw path
        if (currentPath.length > 1) {
            ctx.strokeStyle = "#3498db";
            ctx.lineWidth = 3;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.beginPath();
            ctx.moveTo(currentPath[0].x, currentPath[0].y);
            for (let i = 1; i < currentPath.length; i++) {
                ctx.lineTo(currentPath[i].x, currentPath[i].y);
            }
            ctx.stroke();
        }
    }, [maze, currentPath]);

    // Timer
    useEffect(() => {
        if (!gameActive) return;
        timerRef.current = setInterval(() => {
            setTimeLeft((t) => t - 1);
        }, 1000);
        return () => clearInterval(timerRef.current);
    }, [gameActive]);

    useEffect(() => {
        if (timeLeft <= 0 && gameActive) {
            setGameActive(false);
            setShowGameOver(true);
            setGameOverTitle("⏰ ¡Tiempo Agotado!");
            setGameOverMessage(`¡Mejor suerte la próxima vez!`);
        }
    }, [timeLeft, gameActive]);

    // Mouse/touch events
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const getMousePos = (e) => {
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            return {
                x: (e.clientX - rect.left) * scaleX,
                y: (e.clientY - rect.top) * scaleY,
            };
        };
        const startDrawing = (e) => {
            if (!gameActive) return;
            let pos = getMousePos(e);
            const startX = START_POS.x * CELL_SIZE + CELL_SIZE / 2;
            const startY = START_POS.y * CELL_SIZE + CELL_SIZE / 2;
            const distance = Math.sqrt((pos.x - startX) ** 2 + (pos.y - startY) ** 2);
            if (distance <= CELL_SIZE / 2) {
                setIsDrawing(true);
                setCurrentPath([{ x: startX, y: startY }]);
                setStatus({ message: "¡Dibujando! Mantén el dedo presionado", type: "" });
            }
        };
        const draw = (e) => {
            if (!isDrawing || !gameActive) return;
            let pos = getMousePos(e);
            setCurrentPath((path) => {
                const newPath = [...path, pos];
                // Check wall collision
                const cellX = Math.floor(pos.x / CELL_SIZE);
                const cellY = Math.floor(pos.y / CELL_SIZE);
                if (
                    cellX < 0 ||
                    cellX >= SIZE ||
                    cellY < 0 ||
                    cellY >= SIZE ||
                    maze[cellY][cellX] === 1
                ) {
                    setStatus({ message: "¡Tocaste una pared! Inténtalo de nuevo", type: "error" });
                    setIsDrawing(false);
                    setTimeout(() => {
                        setCurrentPath([]);
                        setStatus({ message: "Línea borrada. Empieza desde 🔴", type: "" });
                    }, 800);
                    return [];
                }
                // Check goal
                const goalX = GOAL_POS.x * CELL_SIZE + CELL_SIZE / 2;
                const goalY = GOAL_POS.y * CELL_SIZE + CELL_SIZE / 2;
                const distance = Math.sqrt((pos.x - goalX) ** 2 + (pos.y - goalY) ** 2);
                if (distance <= CELL_SIZE / 2) {
                    setIsDrawing(false);
                    setGameActive(false);
                    clearInterval(timerRef.current);
                    setStatus({ message: "¡Felicidades! Has completado el laberinto", type: "success" });
                    setShowGameOver(true);
                    setGameOverTitle("🎉 ¡Victoria!");
                    setGameOverMessage(`¡Has trazado la ruta perfecta!<br/>Tiempo usado: ${INITIAL_TIME - timeLeft} segundos`);
                }
                return newPath;
            });
        };
        const stopDrawing = () => {
            setIsDrawing(false);
            if (currentPath.length > 0) {
                setStatus({ message: "Línea terminada. ¿Llegaste al objetivo?", type: "" });
            }
        };
        // Mouse
        canvas.addEventListener("mousedown", startDrawing);
        canvas.addEventListener("mousemove", draw);
        canvas.addEventListener("mouseup", stopDrawing);
        canvas.addEventListener("mouseleave", stopDrawing);
        // Touch
        canvas.addEventListener("touchstart", (e) => {
            e.preventDefault();
            startDrawing(e.touches[0]);
        });
        canvas.addEventListener("touchmove", (e) => {
            e.preventDefault();
            draw(e.touches[0]);
        });
        canvas.addEventListener("touchend", (e) => {
            e.preventDefault();
            stopDrawing();
        });
        return () => {
            canvas.removeEventListener("mousedown", startDrawing);
            canvas.removeEventListener("mousemove", draw);
            canvas.removeEventListener("mouseup", stopDrawing);
            canvas.removeEventListener("mouseleave", stopDrawing);
            canvas.removeEventListener("touchstart", (e) => {
                e.preventDefault();
                startDrawing(e.touches[0]);
            });
            canvas.removeEventListener("touchmove", (e) => {
                e.preventDefault();
                draw(e.touches[0]);
            });
            canvas.removeEventListener("touchend", (e) => {
                e.preventDefault();
                stopDrawing();
            });
        };
        // eslint-disable-next-line
    }, [gameActive, isDrawing, currentPath, maze, timeLeft]);

    // New game
    const handleNewGame = () => {
        setMaze(generateMaze());
        setTimeLeft(INITIAL_TIME);
        setGameActive(true);
        setIsDrawing(false);
        setCurrentPath([]);
        setStatus({ message: "Dibuja una línea desde 🔴 hasta 🎯 sin tocar las paredes", type: "" });
        setShowGameOver(false);
        setGameOverTitle("");
        setGameOverMessage("");
    };

    // Clear path
    const handleClearPath = () => {
        setCurrentPath([]);
        setStatus({ message: "Línea borrada. Empieza desde 🔴", type: "" });
    };


        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-400 to-purple-600 text-white">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-0 shadow-2xl border border-white/20 w-full max-w-screen-lg h-full min-h-screen flex flex-col">
                <div className="flex flex-col flex-grow h-0">
                        <div className="pt-6 pb-2 px-4">
                            <h1 className="text-3xl sm:text-4xl font-bold text-center text-white drop-shadow mb-2">🖊️ Laberinto - Traza la Ruta</h1>
                            <div className="flex justify-between items-center mb-2 gap-4">
                                <div className={`bg-white/20 px-6 py-3 rounded-xl font-bold text-lg border border-white/30 backdrop-blur ${timeLeft <= 10 ? 'bg-red-200/30 animate-pulse' : ''}`}>⏰ Tiempo: {timeLeft}s</div>
                            </div>
                            <div className={`bg-white/20 px-4 py-2 rounded-xl text-center border border-white/30 backdrop-blur ${status.type === 'success' ? 'bg-green-200/30 border-green-400/50' : ''} ${status.type === 'error' ? 'bg-red-200/30 border-red-400/50' : ''}`}>{status.message}</div>
                        </div>
                        <div className="flex-grow flex items-center justify-center w-full">
                            <div className="relative bg-gray-800 border-4 border-white rounded-xl cursor-crosshair flex items-center justify-center w-full h-full max-w-full max-h-full aspect-square">
                                <canvas
                                    ref={canvasRef}
                                    width={SIZE * CELL_SIZE}
                                    height={SIZE * CELL_SIZE}
                                    className="block rounded-lg w-full h-full max-w-[90vw] max-h-[70vh] aspect-square"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        aspectRatio: '1/1',
                                    }}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col items-center gap-4 pb-6 pt-2">
                            <div>
                                <button
                                    className="bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-3 px-6 rounded-full shadow-lg mr-2 hover:scale-105 transition"
                                    onClick={handleNewGame}
                                >
                                    🔄 Nuevo Laberinto
                                </button>
                                <button
                                    className="bg-gradient-to-r from-red-500 to-red-600 text-white font-bold py-2 px-4 rounded-full shadow-lg ml-2 hover:scale-105 transition"
                                    onClick={handleClearPath}
                                >
                                    🗑️ Limpiar Línea
                                </button>
                            </div>
                            <div className="text-center opacity-90 text-base max-w-xs leading-relaxed">
                                Mantén presionado y arrastra desde el punto rojo hasta el objetivo dorado.<br />
                                ¡No toques las paredes negras! Tienes 60 segundos.
                            </div>
                        </div>
                    </div>
                </div>
                {showGameOver && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                        <div className="bg-gradient-to-br from-purple-700 to-purple-500 p-10 rounded-2xl text-center border-2 border-white/30 shadow-2xl">
                            <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-white drop-shadow" dangerouslySetInnerHTML={{ __html: gameOverTitle }} />
                            <p className="text-lg mb-4 text-white" dangerouslySetInnerHTML={{ __html: gameOverMessage }} />
                            <button
                                className="bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:scale-105 transition"
                                onClick={handleNewGame}
                            >
                                🎮 Jugar de Nuevo
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
};

export default Laberinto;