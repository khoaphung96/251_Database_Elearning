import "../css/quizz.css";

function QuizQuestionContent({ question, answer, onAnswer }) {
  return (
    <div className="question-box">
      <p className="question-text">{question.stem}</p>

      <div className="choices-list">
        {question.options.map((c) => {
          const isSelected = answer === c;

          return (
            <label key={c} className="choice-item">
              <input
                type="radio"
                name={`question-${question.i}`}
                value={c}
                checked={isSelected}
                onChange={() => onAnswer(c)}
              />

              <span className="choice-label">
                <b>{c}</b>
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

export default QuizQuestionContent;
