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
  const [answers, setAnswers] = useState({});
  const [quizzAndQuestion, setQuizzAndQuestion] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [error, setError] = useState(null);
  const API_URL = "https://canxphung.dev/api";
  const token = localStorage.getItem("token");
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

  const handleSubmit = () => {
    console.log("User answers:", answers);
    // let score = 0;

    // quizzAndQuestion.questions.forEach((q, idx) => {
    //   if (answers[idx] === q.correct) {
    //     score++;
    //   }
    // });

    // console.log("Final score:", score);

    // setScore(score);

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
              score: 0,
              time_spent: 0,
            }),
          }
        );

        const data = await response.json();
        console.log("Submit thành công:", data);
        return data;
      } catch (err) {
        console.error("Lỗi submit attempt:", err);
      }
    };

    submitAttempt();

    navigate(`/student/course/${id}/Quizzes/${quizzId}`);
  };

  return (
    <div className="quiz-container">
      <div className="quiz-body">
        {quizzAndQuestion.quiz && <h1>{quizzAndQuestion.quiz.title}</h1>}
        <QuizTimer />
        {quizzAndQuestion.questions && (
          <div className="quizz-content">
            <QuizQuestionContent
              question={quizzAndQuestion.questions[currentIndex]}
              answer={answers[currentIndex]}
              onAnswer={(val) => {
                setAnswers({ ...answers, [currentIndex]: val });
              }}
              showResult={submitted}
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
