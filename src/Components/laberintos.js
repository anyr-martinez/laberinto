import React, { useState } from "react";

const questions = [
  {
    question: "¿Cuál es la principal plaga del café en Honduras?",
    answers: ["Broca del café", "Gorgojo del maíz", "Mosca blanca", "Araña roja"],
    correct: 0
  },
  {
    question: "COHORSIL es una cooperativa que se dedica a:",
    answers: ["Venta de café y productos agrícolas", "Venta de electrodomésticos", "Educación", "Textiles"],
    correct: 0
  },
  {
    question: "Bayer es una compañía conocida por:",
    answers: ["Agroquímicos y salud", "Solo café", "Solo fertilizantes orgánicos", "Textiles"],
    correct: 0
  },
  {
    question: "¿Cuál es una práctica recomendada para mejorar la calidad del café?",
    answers: ["Poda y sombra adecuada", "Riego excesivo", "No cosechar nunca", "Abono químico indiscriminado"],
    correct: 0
  },
  {
    question: "La fermentación del café se realiza para:",
    answers: ["Eliminar la pulpa y mejorar sabor", "Incrementar agua en grano", "Aumentar plagas", "Secar los granos en sombra"],
    correct: 0
  }
];

function shuffle(array) {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

const TriviaCafe = () => {
  const [currentQ, setCurrentQ] = useState(null);
  const [shuffledAnswers, setShuffledAnswers] = useState([]);
  const [result, setResult] = useState("");
  const [resultColor, setResultColor] = useState("");

  // Mostrar una pregunta aleatoria
  const showQuestion = () => {
    setResult("");
    setResultColor("");
    const q = questions[Math.floor(Math.random() * questions.length)];
    setCurrentQ(q);
    const answers = shuffle(q.answers.map((a, index) => ({ text: a, index })));
    setShuffledAnswers(answers);
  };

  // Al cargar el componente, mostrar la primera pregunta
  React.useEffect(() => {
    showQuestion();
    // eslint-disable-next-line
  }, []);

  const checkAnswer = (selectedIdx) => {
    if (!currentQ) return;
    if (selectedIdx === currentQ.correct) {
      setResult("✅ Correcto!");
      setResultColor("green");
    } else {
      setResult("❌ Incorrecto");
      setResultColor("red");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f4f4f4]">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-lg w-full text-center">
        <h2 className="text-2xl font-bold mb-6">{currentQ ? currentQ.question : "Pregunta"}</h2>
        <div className="flex flex-col gap-3 mb-4">
          {shuffledAnswers.map((ans) => (
            <button
              key={ans.text}
              className="answer-btn block w-full py-3 px-4 bg-[#6c4f3d] text-white rounded-lg text-lg font-semibold transition hover:bg-[#a67855]"
              style={{ cursor: result ? "not-allowed" : "pointer" }}
              disabled={!!result}
              onClick={() => checkAnswer(ans.index)}
            >
              {ans.text}
            </button>
          ))}
        </div>
        <div id="result" className="mt-4 font-bold text-xl" style={{ color: resultColor }}>{result}</div>
        <button
          className="mt-6 py-2 px-6 bg-[#6c4f3d] text-white rounded-lg text-base font-semibold hover:bg-[#a67855]"
          style={{ display: result ? "inline-block" : "none" }}
          onClick={showQuestion}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default TriviaCafe;
