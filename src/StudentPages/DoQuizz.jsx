import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function DoQuizz() {
  const { id, quizzId } = useParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState(null);
  const API_URL = "https://canxphung.dev/api";
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AbG1zLmNvbSIsInVzZXJDb2RlIjoiQURNSU4wMDEiLCJyb2xlIjoic3RhZmYiLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzY1MDA0OTc4LCJleHAiOjE3NjUwMDg1Nzh9.xdgbuCmdhFb3GMuhUUI00Ou3HL2POQ2oOf12KI8FjtE";

  useEffect(() => {
    const loadQuestionByQuizz = async (path) => {
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
        setAnswers(data.data);
        console.log(data);
      } catch (error) {
        setError(true);
      }
    };

    loadQuestionByQuizz(`/assessment/quizzes/${id}/1/${quizzId}`);
  }, []);

  const goNext = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const goPrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  return (
    // <div className="quiz-container">
    //   <QuizTimer />

    //   <div className="quiz-body">
    //     <QuizSidebar
    //       questions={questions}
    //       current={currentIndex}
    //       onJump={setCurrentIndex}
    //     />

    //     <QuizQuestionContent
    //       question={questions[currentIndex]}
    //       answer={answers[currentIndex]}
    //       onAnswer={(val) => setAnswers({ ...answers, [currentIndex]: val })}
    //     />
    //   </div>

    //   <NavigationButtons
    //     current={currentIndex}
    //     total={questions.length}
    //     onPrev={goPrev}
    //     onNext={goNext}
    //   />
    // </div>
    <h1>Hi</h1>
  );
}
