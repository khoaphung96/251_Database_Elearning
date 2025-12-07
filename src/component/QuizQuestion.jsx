import "../css/quizz.css";

function QuizQuestionContent({ question, answer, onAnswer }) {
  return (
    <div className="question-box">
      <p className="question-text">{question.stem}</p>

      <div className="choices-list">
        {question.options.map((c) => {
          let isSelected = false;

          if (answer) {
            isSelected = answer.c === c;
          }

          return (
            <label key={c} className="choice-item">
              <input
                type="radio"
                name={`question-${c}`}
                value={c}
                checked={isSelected}
                onChange={() => onAnswer({ c, question_id: question.id })}
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
