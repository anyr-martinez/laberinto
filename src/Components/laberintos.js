
import React, { useState, useEffect, useRef } from "react";
import BayerLogo from "../Assets/BAYER.png";
import Logo2 from "../Assets/logo2.png";
import syngenta from "../Assets/syngenta.png";

const QUESTIONS = [
  {
    question: "¿Qué se necesita para una nutrición estratégica del café?",
    answers: ["Análisis de suelo y fertilización", "Aplicación empírica",
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
  {
    question: "COHORSIL exporta café a mercados internacionales directamente desde el año:",
    answers: [
      "2001",
      "1998",
      "2005",
      "2010"
    ],
    correct: 0
  },
  {
    question: "La palabra \"café\" proviene del árabe \"qahwah\", que significaba:",
    answers: [
      "Vino o estimulante",
      "Bebida caliente",
      "Extracto medicinal",
      "Infusión fermentada"
    ],
    correct: 0
  },
  {
    question: "Bayer es una compañía conocida por:",
    answers: [
      "Agroquímicos y salud",
      "Exportación de café",
      "Maquinaria pesada",
      "Ropa deportiva"
    ],
    correct: 0
  },
  {
    question: "Syngenta es una compañía conocida por:",
    answers: [
      "Tecnología agrícola",
      "Exportación de café",
      "Ropa deportiva",
      "Electrónica"
    ],
    correct: 0
  },
  {
    question: "¿En qué etapa se desarrollan principalmente los compuestos aromáticos del café?",
    answers: [
      "Tueste",
      "Secado",
      "Fermentación",
      "Almacenamiento"
    ],
    correct: 0
  },
  {
    question: "¿En qué etapa se define el potencial de frutos del café?",
    answers: [
      "Floración",
      "Crecimiento vegetativo",
      "Llenado de grano",
      "Postcosecha"
    ],
    correct: 0
  },
  {
    question: "¿Qué práctica mejora la calidad en taza del café?",
    answers: [
      "Cosecha selectiva",
      "Cosecha general",
      "Más fertilizante",
      "Menos sombra"
    ],
    correct: 0
  },
  {
    question: "¿Por qué controlar la fermentación del café?",
    answers: [
      "Evitar defectos y mejorar sabor",
      "Aumentar humedad",
      "Secar más rápido",
      "Aumentar peso"
    ],
    correct: 0
  },
  {
    question: "¿Qué función cumple el buen lavado del café?",
    answers: [
      "Eliminar pulpa y mucílago",
      "Ocultar defectos",
      "Reducir el peso del grano",
      "Iniciar secado"
    ],
    correct: 0
  },
  {
    question: "¿Por qué es importante un secado uniforme del café?",
    answers: [
      "Evita hongos y conserva calidad",
      "Eliminar la cáscara pergamino",
      "Reduce la acidez",
      "Mejora color"
    ],
    correct: 0
  },
  {
    question: "¿Qué práctica reduce pérdidas en el cultivo de café?",
    answers: [
      "Manejo de plagas",
      "Eliminar sombra",
      "Aplicar abono sin monitoreo",
      "Cosecha temprana"
    ],
    correct: 0
  },
  {
    question: "¿Cómo influye la altitud en el cultivo de café?",
    answers: [
      "Mejora sabor por maduración lenta",
      "Aumenta tamaño del grano",
      "Amplifica el aroma",
      "No influye"
    ],
    correct: 0
  },
  {
    question: "¿Cual es la Importancia del almacenamiento adecuado del café?",
    answers: [
      "Conservar la calidad",
      "Aumentar el peso",
      "Reducir acidez",
      "Mejorar color"
    ],
    correct: 0
  },
  {
    question: "¿Qué define la estrategia de COHORSIL en el sector cafetalero?",
    answers: [
      "Todas",
      "Mejora de Calidad y trazabilidad",
      "Fortalecimiento productivo y comercial",
      "Cumplimiento de Estándares internacionales"
    ],
    correct: 0
  }
];

function shuffle(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

const TOTAL_QUESTIONS = 10;

const TriviaCafe = () => {
  const [questionOrder, setQuestionOrder] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [shuffledAnswers, setShuffledAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [showFinal, setShowFinal] = useState(false);
  const [answerStatus, setAnswerStatus] = useState(null); // 'correct' | 'incorrect' | null
  const [animating, setAnimating] = useState(false);
  const nextBtnRef = useRef();

  // Inicializar el orden de preguntas al montar
  useEffect(() => {
    const order = shuffle(Array.from({ length: QUESTIONS.length }, (_, i) => i)).slice(0, TOTAL_QUESTIONS);
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

  // Cuando cambia la pregunta, barajar respuestas
  useEffect(() => {
    if (questionOrder.length && currentIdx < TOTAL_QUESTIONS) {
      const q = QUESTIONS[questionOrder[currentIdx]];
      setShuffledAnswers(shuffle(q.answers.map((a, i) => ({ text: a, index: i }))));
      setSelected(null);
      setShowResult(false);
      setAnswerStatus(null);
      setAnimating(false);
    }
  }, [questionOrder, currentIdx]);

  const handleAnswer = (ansIdx) => {
    if (selected !== null || animating) return;
    setSelected(ansIdx);
    const q = QUESTIONS[questionOrder[currentIdx]];
    if (ansIdx === q.correct) {
      setCorrectCount((c) => c + 1);
      setAnswerStatus('correct');
    } else {
      setWrongCount((w) => w + 1);
      setAnswerStatus('incorrect');
    }
    setShowResult(true);
    setAnimating(true);
    // Si es la última pregunta, mostrar pantalla final tras un breve delay
    setTimeout(() => {
      setAnimating(false);
      if (currentIdx === TOTAL_QUESTIONS - 1) {
        setShowFinal(true);
      }
    }, 500);
  };

  const handleNext = () => {
    if (currentIdx < TOTAL_QUESTIONS - 1) {
      setCurrentIdx((i) => i + 1);
      setSelected(null);
      setShowResult(false);
      setAnswerStatus(null);
      setAnimating(false);
    }
  };

  const handleRestart = () => {
    const order = shuffle(Array.from({ length: QUESTIONS.length }, (_, i) => i)).slice(0, TOTAL_QUESTIONS);
    setQuestionOrder(order);
    setCurrentIdx(0);
    setCorrectCount(0);
    setWrongCount(0);
    setShowFinal(false);
    setSelected(null);
    setShowResult(false);
    setAnswerStatus(null);
    setAnimating(false);
  };

  // Progreso
  const progressPercent = ((currentIdx + (showFinal ? 1 : 0)) / TOTAL_QUESTIONS) * 100;

  // Pantalla final
  if (showFinal) {
    const win = correctCount >= 7;
    return (
      <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#6d4c41] to-[#3e2723]">
        <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-xl w-full animate-fadeIn text-center">
          {/* Logos centrados arriba del título */}
          <div className="w-full grid grid-cols-3 gap-8 sm:gap-12 lg:gap-16 mb-10 bg-white py-8 px-2 rounded-t-2xl overflow-hidden max-w-4xl mx-auto">            <img
              src={BayerLogo}
              alt="Bayer"
              className="w-40 h-24 sm:w-56 sm:h-32 lg:w-72 lg:h-40 object-contain max-w-full"
              style={{ maxWidth: '100%', maxHeight: '160px' }}
            />
            <img
              src={Logo2}
              alt="COHORSIL"
              className="w-40 h-24 sm:w-56 sm:h-32 lg:w-72 lg:h-40 object-contain max-w-full"
              style={{ maxWidth: '100%', maxHeight: '160px' }}
            />
            <img
              src={syngenta}
              alt="Syngenta"
              className="w-40 h-24 sm:w-56 sm:h-32 lg:w-72 lg:h-40 object-contain max-w-full"
              style={{ maxWidth: '100%', maxHeight: '160px' }}
            />
          </div>
          <div className="text-6xl mb-4">{win ? '🏆' : '😢'}</div>
          <h2 className={`text-3xl font-bold mb-4 ${win ? 'text-green-700' : 'text-red-600'}`}>{win ? '¡Felicidades!' : '¡Casi lo logras!'}</h2>
          <div className="text-2xl mb-8 leading-relaxed" style={{ color: win ? '#43a047' : '#5d4037' }}>
            {win ? (
              <>
                Has ganado con <strong>{correctCount}</strong> respuestas correctas de 10.<br />
                ¡Eres todo un experto del café! ☕
              </>
            ) : (
              <>
                Obtuviste <strong>{correctCount}</strong> respuestas correctas de 10.<br />
                Necesitabas 7 para ganar. ¡Inténtalo de nuevo!
              </>
            )}
          </div>
          <button
            className="py-3 px-10 bg-gradient-to-br from-[#8d6e63] to-[#6d4c41] text-white rounded-xl text-lg font-bold transition hover:scale-105 hover:shadow-lg"
            onClick={handleRestart}
          >
            Jugar de Nuevo
          </button>
        </div>
      </div>
    );
  }

  // Pregunta actual
  const q = questionOrder.length ? QUESTIONS[questionOrder[currentIdx]] : null;

  return (
  <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#6d4c41] to-[#3e2723]">
  <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl max-w-xl w-full animate-fadeIn">
        {/* Logos centrados arriba del título */}
        <div className="w-full grid grid-cols-3 gap-8 sm:gap-12 lg:gap-16 mb-10 bg-white py-8 px-2 rounded-t-2xl overflow-hidden max-w-4xl mx-auto">          <img
            src={BayerLogo}
            alt="Bayer"
            className="w-40 h-24 sm:w-56 sm:h-32 lg:w-72 lg:h-40 object-contain max-w-full"
            style={{ maxWidth: '100%', maxHeight: '160px' }}
          />
          <img
            src={Logo2}
            alt="Logo2"
            className="w-40 h-24 sm:w-56 sm:h-32 lg:w-72 lg:h-40 object-contain max-w-full"
            style={{ maxWidth: '100%', maxHeight: '160px' }}
          />
          <img
              src={syngenta}
              alt="Syngenta"
              className="w-40 h-24 sm:w-56 sm:h-32 lg:w-72 lg:h-40 object-contain max-w-full"
              style={{ maxWidth: '100%', maxHeight: '160px' }}
            />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-[#3e2723] mb-4">☕ Trivia del Café ☕</h1>
        {/* Barra de progreso */}
        <div className="mb-4">
          <div className="bg-[#e0e0e0] h-6 rounded-full overflow-hidden relative">
            <div
              className="bg-gradient-to-r from-[#8d6e63] to-[#6d4c41] h-full flex items-center justify-center text-white font-bold text-sm transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            >
              {currentIdx}/{TOTAL_QUESTIONS}
            </div>
          </div>
        </div>
        {/* Score info */}
        <div className="text-center mb-6 text-lg text-[#5d4037] font-bold">
          Aciertos: <span>{correctCount}</span> | Errores: <span>{wrongCount}</span>
        </div>
        {/* Pregunta y respuestas */}
        <div className="mb-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-[#3e2723] mb-6 text-center min-h-[56px]">{q?.question}</h2>
          <div className="flex flex-col gap-3">
            {shuffledAnswers.map((ans, idx) => {
              let btnClass = "answer-btn py-4 px-4 bg-gradient-to-br from-[#8d6e63] to-[#6d4c41] text-white rounded-xl text-base sm:text-lg font-medium text-left transition-all duration-300 cursor-pointer";
              if (selected !== null) {
                if (ans.index === q.correct) btnClass += " correct bg-gradient-to-br from-green-400 to-green-700 animate-pulse";
                else if (ans.index === selected && answerStatus === 'incorrect') btnClass += " incorrect bg-gradient-to-br from-red-400 to-red-700 animate-shake";
                else btnClass += " opacity-70";
              }
              return (
                <button
                  key={ans.text}
                  className={btnClass}
                  disabled={selected !== null || animating}
                  onClick={() => handleAnswer(ans.index)}
                  style={{
                    transition: 'all 0.3s',
                    ...(selected !== null && ans.index === q.correct && answerStatus === 'correct' ? { animation: 'pulse 0.5s' } : {}),
                    ...(selected !== null && ans.index === selected && answerStatus === 'incorrect' ? { animation: 'shake 0.5s' } : {})
                  }}
                >
                  {ans.text}
                </button>
              );
            })}
          </div>
          {/* Feedback */}
          <div className="mt-5 text-center font-bold text-2xl min-h-[32px]" style={{ color: answerStatus === 'correct' ? '#43a047' : answerStatus === 'incorrect' ? '#e53935' : undefined }}>
            {showResult && (answerStatus === 'correct' ? '✅ ¡Correcto!' : '❌ Incorrecto')}
          </div>
          {/* Siguiente pregunta */}
          {selected !== null && !animating && currentIdx < TOTAL_QUESTIONS - 1 && (
            <button
              ref={nextBtnRef}
              className="block mx-auto mt-6 py-3 px-10 bg-gradient-to-br from-[#ffb74d] to-[#ff9800] text-white rounded-xl text-lg font-bold transition hover:scale-105 hover:shadow-lg"
              onClick={handleNext}
            >
              Siguiente Pregunta →
            </button>
          )}
        </div>
      </div>
      {/* Animaciones keyframes para pulse y shake */}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-pulse { animation: pulse 0.5s; }
        .animate-shake { animation: shake 0.5s; }
        .animate-fadeIn { animation: fadeIn 0.5s; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default TriviaCafe;
