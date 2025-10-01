
import React, { useState, useEffect, useRef } from "react";
import BayerLogo from "../Assets/BAYER.png";
import Logo2 from "../Assets/logo2.png";

const QUESTIONS = [
  {
    question: "¿Cuál es la principal plaga del café en Honduras?",
    answers: ["Broca del café", "Gorgojo del maíz", "Mosca blanca", "Araña roja"],
    correct: 0
  },
  {
    question: "¿A qué altitud se cultiva el mejor café de altura en Honduras?",
    answers: ["1200-1700 metros sobre el nivel del mar", "0-500 metros", "500-800 metros", "2500-3000 metros"],
    correct: 0
  },
  {
    question: "¿Qué enfermedad del café causó grandes pérdidas en Centroamérica en 2012?",
    answers: ["Roya del café", "Ojo de gallo", "Antracnosis", "Mal de hilachas"],
    correct: 0
  },
  {
    question: "COHORSIL es una cooperativa que se dedica a:",
    answers: ["Venta de café y productos agrícolas", "Venta de electrodomésticos", "Educación", "Textiles"],
    correct: 0
  },
  {
    question: "¿Cuántos años tarda aproximadamente una planta de café en dar su primera cosecha?",
    answers: ["3-4 años", "1 año", "6 meses", "10 años"],
    correct: 0
  },
  {
    question: "La fermentación del café se realiza para:",
    answers: ["Eliminar el mucílago y mejorar el sabor", "Aumentar el peso del grano", "Incrementar plagas", "Acelerar el secado"],
    correct: 0
  },
  {
    question: "¿Qué tipo de café es más apreciado en el mercado internacional?",
    answers: ["Arábica", "Robusta", "Liberica", "Excelsa"],
    correct: 0
  },
  {
    question: "¿Cuál es una práctica recomendada para mejorar la calidad del café?",
    answers: ["Poda y sombra adecuada", "Riego excesivo", "No fertilizar nunca", "Cosechar frutos verdes"],
    correct: 0
  },
  {
    question: "¿Qué porcentaje de humedad debe tener el café pergamino seco?",
    answers: ["10-12%", "25-30%", "5%", "40%"],
    correct: 0
  },
  {
    question: "Bayer es una compañía conocida por:",
    answers: ["Agroquímicos y productos para la salud", "Solo exportación de café", "Maquinaria pesada", "Ropa deportiva"],
    correct: 0
  },
  {
    question: "¿Qué nutriente es esencial para el crecimiento del Café?",
    answers: ["Nitrógeno", "Helio", "Sodio", "Cloro"],
    correct: 0
  },
  {
    question: "¿En qué mes inicia la cosecha de café en Honduras?",
    answers: ["Octubre", "Enero", "Mayo", "Agosto"],
    correct: 0
  },
  {
    question: "¿Cuál es el color del grano de café maduro?",
    answers: ["Rojo o amarillo", "Verde oscuro", "Café claro", "Negro"],
    correct: 0
  },
  {
    question: "¿Cómo se llama el proceso de quitar la cáscara del café seco?",
    answers: ["Trillado o pilado", "Tostado", "Molido", "Fermentación"],
    correct: 0
  },
  {
    question: "¿Qué certificación garantiza prácticas sostenibles en el cultivo de café?",
    answers: ["Rainforest Alliance o UTZ", "ISO 9001", "CE", "FDA"],
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
    if (selected !== null) return;
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
    if (currentIdx === TOTAL_QUESTIONS - 1) {
      setTimeout(() => setShowFinal(true), 1200);
    }
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
    const win = correctCount >= 6;
    return (
      <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#6d4c41] to-[#3e2723]">
        <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-xl w-full animate-fadeIn text-center">
          {/* Logos centrados arriba del título */}
          <div className="w-full max-w-full flex justify-center items-center gap-10 mb-10 bg-white py-10 px-2 rounded-t-2xl overflow-hidden">
            <img
              src={BayerLogo}
              alt="Bayer"
              className="w-56 h-36 sm:w-72 sm:h-48 lg:w-[22rem] lg:h-[10rem] object-contain max-w-full"
              style={{ maxWidth: '100%', maxHeight: '180px' }}
            />
            <img
              src={Logo2}
              alt="Logo2"
              className="w-56 h-36 sm:w-72 sm:h-48 lg:w-[22rem] lg:h-[10rem] object-contain max-w-full"
              style={{ maxWidth: '100%', maxHeight: '180px' }}
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
                Necesitabas 6 para ganar. ¡Inténtalo de nuevo!
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
  <div className="w-full max-w-full flex justify-center items-center gap-10 mb-8 bg-white py-8 px-2 rounded-t-2xl overflow-hidden">
          <img
            src={BayerLogo}
            alt="Bayer"
            className="w-40 h-28 sm:w-56 sm:h-36 lg:w-[22rem] lg:h-[10rem] object-contain max-w-full"
            style={{ maxWidth: '100%', maxHeight: '180px' }}
          />
          <img
            src={Logo2}
            alt="Logo2"
            className="w-40 h-28 sm:w-56 sm:h-36 lg:w-[22rem] lg:h-[10rem] object-contain max-w-full"
            style={{ maxWidth: '100%', maxHeight: '180px' }}
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
                  disabled={selected !== null}
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
          {selected !== null && currentIdx < TOTAL_QUESTIONS - 1 && (
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
