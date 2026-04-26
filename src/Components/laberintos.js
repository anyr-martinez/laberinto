// ===============================
// IMPORTACIONES
// ===============================

// React y hooks necesarios para manejar estado, efectos y referencias
import React, { useState, useEffect, useRef } from "react";

// Imágenes de los logos que aparecen en la parte superior
import BayerLogo from "../Assets/BAYER.png";
import cohorsil from "../Assets/cohorsil.png";
import syngenta from "../Assets/syngenta.png";

// Icono de flecha izquierda de la librería lucide
import { ChevronLeft } from "lucide-react";


// ===============================
// BASE DE DATOS DE PREGUNTAS
// ===============================

// Aquí se guardan todas las preguntas del juego
// correct indica el índice de la respuesta correcta
const QUESTIONS = [
  {
    question: "¿Qué se necesita para una nutrición estratégica del café?",
    answers: [
      "Análisis de suelo y fertilización",
      "Aplicación empírica",
      "Solo abono orgánico",
      "Fertilización sin análisis"
    ],
    correct: 0
  },

  {
    question: "¿En qué etapa (semanas) el fruto del café alcanza su madurez fisiológica?",
    answers: [
      "Semana 26-32",
      "Semana 14-20",
      "Semana 20-26",
      "Semana 32-40"
    ],
    correct: 0
  },

  // Puedes seguir agregando más preguntas aquí
];


// ===============================
// FUNCIÓN PARA MEZCLAR ARREGLOS
// ===============================

// Esta función mezcla las preguntas o respuestas
// para que el juego sea aleatorio cada vez
function shuffle(array) {
  const newArray = [...array];

  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }

  return newArray;
}


// ===============================
// CONFIGURACIÓN DEL JUEGO
// ===============================

// Número de preguntas por partida
const TOTAL_QUESTIONS = 5;


// ===============================
// COMPONENTE PRINCIPAL
// ===============================

const TriviaCafe = () => {

  // ===============================
  // ESTADOS DEL JUEGO
  // ===============================

  // Orden aleatorio de preguntas
  const [questionOrder, setQuestionOrder] = useState([]);

  // Índice de la pregunta actual
  const [currentIdx, setCurrentIdx] = useState(0);

  // Respuestas mezcladas
  const [shuffledAnswers, setShuffledAnswers] = useState([]);

  // Respuesta seleccionada
  const [selected, setSelected] = useState(null);

  // Mostrar resultado correcto / incorrecto
  const [showResult, setShowResult] = useState(false);

  // Contador de respuestas correctas
  const [correctCount, setCorrectCount] = useState(0);

  // Contador de errores
  const [wrongCount, setWrongCount] = useState(0);

  // Mostrar pantalla final
  const [showFinal, setShowFinal] = useState(false);

  // Estado de respuesta (correct / incorrect)
  const [answerStatus, setAnswerStatus] = useState(null);

  // Control de animaciones
  const [animating, setAnimating] = useState(false);

  // Referencia al botón "Siguiente pregunta"
  const nextBtnRef = useRef();


  // ===============================
  // INICIALIZAR JUEGO
  // ===============================

  // Se ejecuta cuando el componente se monta
  useEffect(() => {

    // Genera orden aleatorio de preguntas
    const order = shuffle(
      Array.from({ length: QUESTIONS.length }, (_, i) => i)
    ).slice(0, TOTAL_QUESTIONS);

    setQuestionOrder(order);
    setCurrentIdx(0);
    setCorrectCount(0);
    setWrongCount(0);
    setShowFinal(false);
    setSelected(null);
    setShowResult(false);
    setAnswerStatus(null);
    setAnimating(false);

  }, []);


  // ===============================
  // MEZCLAR RESPUESTAS
  // ===============================

  useEffect(() => {

    if (questionOrder.length && currentIdx < TOTAL_QUESTIONS) {

      const q = QUESTIONS[questionOrder[currentIdx]];

      // Mezcla las respuestas
      setShuffledAnswers(
        shuffle(q.answers.map((a, i) => ({ text: a, index: i })))
      );

      // Limpia selección
      setSelected(null);
      setShowResult(false);
      setAnswerStatus(null);
      setAnimating(false);
    }

  }, [questionOrder, currentIdx]);


  // ===============================
  // CUANDO EL USUARIO RESPONDE
  // ===============================

  const handleAnswer = (ansIdx) => {

    if (selected !== null || animating) return;

    setSelected(ansIdx);

    const q = QUESTIONS[questionOrder[currentIdx]];

    // Validar si la respuesta es correcta
    if (ansIdx === q.correct) {

      setCorrectCount((c) => c + 1);
      setAnswerStatus("correct");

    } else {

      setWrongCount((w) => w + 1);
      setAnswerStatus("incorrect");

    }

    setShowResult(true);
    setAnimating(true);

    // Si es la última pregunta mostrar pantalla final
    setTimeout(() => {

      setAnimating(false);

      if (currentIdx === TOTAL_QUESTIONS - 1) {
        setShowFinal(true);
      }

    }, 500);
  };


  // ===============================
  // SIGUIENTE PREGUNTA
  // ===============================

  const handleNext = () => {

    if (currentIdx < TOTAL_QUESTIONS - 1) {

      setCurrentIdx((i) => i + 1);

      setSelected(null);
      setShowResult(false);
      setAnswerStatus(null);
      setAnimating(false);
    }
  };


  // ===============================
  // REINICIAR JUEGO
  // ===============================

  const handleRestart = () => {

    const order = shuffle(
      Array.from({ length: QUESTIONS.length }, (_, i) => i)
    ).slice(0, TOTAL_QUESTIONS);

    setQuestionOrder(order);
    setCurrentIdx(0);
    setCorrectCount(0);
    setWrongCount(0);
    setShowFinal(false);
  };


  // ===============================
  // CALCULAR PROGRESO
  // ===============================

  const progressPercent =
    ((currentIdx + (showFinal ? 1 : 0)) / TOTAL_QUESTIONS) * 100;


  // ===============================
  // PANTALLA FINAL DEL JUEGO
  // ===============================

  if (showFinal) {

    const win = correctCount >= 5;

    return (

      <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#6d4c41] to-[#3e2723]">

        {/* TARJETA FINAL */}
        <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-xl w-full text-center">

          {/* ICONO RESULTADO */}
          <div className="text-6xl mb-4">
            {win ? "🏆" : "😢"}
          </div>

          {/* MENSAJE FINAL */}
          <h2 className="text-3xl font-bold mb-4">
            {win ? "¡Felicidades!" : "¡Casi lo logras!"}
          </h2>

          {/* BOTÓN REINICIAR */}
          <button
            onClick={handleRestart}
            className="py-3 px-10 bg-gradient-to-br from-[#8d6e63] to-[#6d4c41] text-white rounded-xl"
          >
            Jugar de Nuevo
          </button>

        </div>

      </div>
    );
  }


  // ===============================
  // PREGUNTA ACTUAL
  // ===============================

  const q = questionOrder.length
    ? QUESTIONS[questionOrder[currentIdx]]
    : null;


  // ===============================
  // INTERFAZ PRINCIPAL DEL JUEGO
  // ===============================

  return (

    // FONDO GENERAL DEL JUEGO
    <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#6d4c41] to-[#3e2723]">


      {/* TARJETA PRINCIPAL DEL JUEGO */}
      <div className="relative bg-white p-6 sm:p-8 rounded-2xl shadow-2xl max-w-xl w-full">


        {/* TÍTULO */}
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-[#3e2723] mb-4">
          ☕ Trivia del Café ☕
        </h1>


        {/* BARRA DE PROGRESO */}
        <div className="mb-4">

          <div className="bg-[#e0e0e0] h-6 rounded-full overflow-hidden">

            <div
              className="bg-gradient-to-r from-[#8d6e63] to-[#6d4c41] h-full"
              style={{ width: `${progressPercent}%` }}
            />

          </div>

        </div>


        {/* CONTADOR DE ACIERTOS Y ERRORES */}
        <div className="text-center mb-6 text-lg text-[#5d4037] font-bold">

          Aciertos: {correctCount} | Errores: {wrongCount}

        </div>


        {/* PREGUNTA */}
        <h2 className="text-xl font-semibold text-center mb-6">

          {q?.question}

        </h2>


        {/* LISTA DE RESPUESTAS */}
        <div className="flex flex-col gap-3">

          {shuffledAnswers.map((ans) => (

            <button
              key={ans.text}
              onClick={() => handleAnswer(ans.index)}
              className="py-4 px-4 bg-gradient-to-br from-[#8d6e63] to-[#6d4c41] text-white rounded-xl"
            >

              {ans.text}

            </button>

          ))}

        </div>
        {/* BOTON DE REGRESO */}
        <button
        type="button"
        className="boton-volver"
        onClick={() => window.location.href = "https://juegos-cohorsil-libreria.vercel.app/"}
        >
        <ChevronLeft size={40} />
        </button>
        

      </div>

    </div>
  );
};

export default TriviaCafe;