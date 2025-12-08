import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import QuizTimer from "../component/QuizTimer";
import QuizSidebar from "../component/QuizSibar";
import QuizQuestionContent from "../component/QuizQuestion";
import NavigationButtons from "../component/QuizNavigaition";
import "../css/quizz.css";

export default function DoQuizz() {
  const { id, quizzId } = useParams();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  // const [questions, setQuestions] = useState({});
  const [answers, setAnswers] = useState(() => {
    const saved = localStorage.getItem("quiz_answers");
    return saved ? JSON.parse(saved) : {};
  });
  const [quizzAndQuestion, setQuizzAndQuestion] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [error, setError] = useState(null);
  const API_URL = "https://canxphung.dev/api";
  const token = localStorage.getItem("token");
  const attemptId = localStorage.getItem("attempt_id");
  const payload = jwtDecode(token);

  useEffect(() => {
    const loadQuizzAndQuestion = async (path) => {
      try {
        const response = await fetch(`${API_URL}${path}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Lỗi API: " + response.status);

        const data = await response.json();

        setQuizzAndQuestion(data.data);
      } catch (error) {
        setError(true);
      }
    };

    loadQuizzAndQuestion(`/assessment/quizzes/${id}/1/${quizzId}/questions`);
  }, []);

  const goNext = () => {
    if (currentIndex < quizzAndQuestion.questions.length - 1)
      setCurrentIndex(currentIndex + 1);
  };

  const goPrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const submitAttempt = async () => {
    try {
      const response = await fetch(
        `${API_URL}/assessment/attempts/${id}/1/${quizzId}/${payload.userId}/submit`,
        {
          method: "PUT",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "submitted",
            answers: answers,
            // score: 10,
            time_spent: 0,
          }),
        }
      );

      const data = await response.json();
      return data;
    } catch (err) {
      console.error("Lỗi submit attempt:", err);
    }
  };

  const handleSubmit = async () => {
    console.log(answers);
    try {
      await submitAttempt();

      localStorage.removeItem("attempt_id");
      // localStorage.removeItem("quiz_answers");

      navigate(`/student/course/${id}/Quizzes/${quizzId}`);
    } catch (err) {
      alert("Submit thất bại!");
    }
  };

  return (
    <div className="quiz-container">
      <div className="quiz-body">
        {quizzAndQuestion.quiz && <h1>{quizzAndQuestion.quiz.title}</h1>}
        {quizzAndQuestion.quiz && (
          <QuizTimer time_limit={quizzAndQuestion.quiz.time_limit_minutes} />
        )}
        {quizzAndQuestion.questions && (
          <div className="quizz-content">
            <QuizQuestionContent
              question={quizzAndQuestion.questions[currentIndex]}
              // answer={answers[`q${currentIndex + 1}`]}
              answers={answers}
              onAnswer={(val) => {
                setAnswers({
                  ...answers,
                  [`q${val.id}`]: val.val,
                });
                // const newAnswers = { ...answers, [currentIndex]: val };
                // setAnswers(newAnswers);
                // localStorage.setItem(
                //   "quiz_answers",
                //   JSON.stringify(newAnswers)
                // );
              }}
            />
            <NavigationButtons
              current={currentIndex}
              total={quizzAndQuestion.questions.length}
              onPrev={goPrev}
              onNext={goNext}
            />
          </div>
        )}
        <button className="submit-btn" onClick={handleSubmit}>
          Submit Attempt
        </button>
      </div>
      <div className="quizz-sidebar">
        {quizzAndQuestion.questions && (
          <QuizSidebar
            questions={quizzAndQuestion.questions}
            current={currentIndex}
            onJump={setCurrentIndex}
          />
        )}
      </div>
    </div>
  );
}
