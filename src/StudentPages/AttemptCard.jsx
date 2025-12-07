import "../css/quizz.css";

export default function AttemptCard({ attempt, onReview, quizz }) {
  const formatDate = (iso) =>
    new Date(iso).toLocaleString("en-US", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    });

  const duration = (a) => {
    const start = new Date(a.started_at);
    const end = new Date(a.submitted_at);
    const mins = Math.floor((end - start) / 60000);
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h} hours ${m} mins`;
  };

  return (
    <>
      {attempt.map((a) => (
        <div className="attempt-card" key={a.attempt_no}>
          <h3>Attempt {a.attempt_no}</h3>

          <table className="attempt-table">
            <tbody>
              <tr>
                <td>
                  <b>Status</b>
                </td>
                <td>
                  {a.status === "graded" && "Finished"}
                  {a.status === "in_progress" && "Processing"}
                </td>
              </tr>
              <tr>
                <td>
                  <b>Started</b>
                </td>
                <td>{formatDate(a.started_at)}</td>
              </tr>
              <tr>
                <td>
                  <b>Completed</b>
                </td>
                <td>{formatDate(a.submitted_at)}</td>
              </tr>
              <tr>
                <td>
                  <b>Duration</b>
                </td>
                <td>{duration(a)}</td>
              </tr>
              <tr>
                <td>
                  <b>Marks</b>
                </td>
                <td>
                  {/* {a.total_score && `${a.total_score}/${quizz.max_score}`} */}
                  {`${a.total_score ? a.total_score : "0.00"}/${
                    quizz.max_score
                  }`}
                </td>
              </tr>
              <tr>
                <td>
                  <b>Grade</b>
                </td>
                <td>
                  <b>{a.total_score}</b> out of {quizz.max_score} (
                  <b>{((a.total_score / a.total_score) * 100).toFixed(2)}%</b>)
                </td>
              </tr>
            </tbody>
          </table>

          <button className="review-btn" onClick={onReview}>
            Review
          </button>
        </div>
      ))}
    </>
  );
}
