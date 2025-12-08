import "../css/quizz.css";

function QuizQuestionContent({ question, answers, onAnswer }) {
  return (
    <div className="question-box">
      <p className="question-text">{question.stem}</p>

      <div className="choices-list">
        {question.options.map((c) => {
          let isSelected = false;

          if (answers) {
            isSelected = answers[`q${question.id}`] === c[0];
          }

          return (
            <label key={c} className="choice-item">
              <input
                type="radio"
                name={`question-${c}`}
                value={c}
                checked={isSelected}
                onChange={() => onAnswer({ val: c[0], id: question.id })}
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
