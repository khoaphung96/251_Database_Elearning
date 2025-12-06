import "../css/courseDetail.css";

export default function StartAttemptModal({
  time_limit,
  onClose,
  offering_id,
  quizz_id,
}) {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-header">
          <h2>Start attempt</h2>
          <span className="close-btn" onClick={onClose}>
            ×
          </span>
        </div>
        <h3>Time limit</h3>
        <p>
          Your attempt will have a time limit of {time_limit} mins. When you
          start, the timer will begin to count down and cannot be paused. You
          must finish your attempt before it expires. Are you sure you wish to
          start now?
        </p>

        <hr />

        <div className="modal-actions">
          <button
            className="start-btn"
            onClick={() =>
              (window.location.href = `/student/course/${offering_id}/Quizzes/${quizz_id}/doQuizz`)
            }
          >
            Start attempt
          </button>
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
