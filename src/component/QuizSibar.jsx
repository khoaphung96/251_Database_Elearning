import "../css/quizz.css";

function QuizSidebar({ questions, current, onJump }) {
  return (
    <div className="sidebar">
      {questions.map((question, i) => (
        <div
          key={i}
          className={`question-nav ${current === i ? "active" : ""}`}
          onClick={() => onJump(i)}
        >
          {i + 1}
        </div>
      ))}
    </div>
  );
}

export default QuizSidebar;
