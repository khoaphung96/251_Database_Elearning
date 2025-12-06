import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import "../css/courseDetail.css";

export default function Quizz({}) {
  const { id } = useParams();
  const [quizzes, setQuizzes] = useState([]);
  const [error, setError] = useState(null);
  const API_URL = "https://canxphung.dev/api";
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AbG1zLmNvbSIsInVzZXJDb2RlIjoiQURNSU4wMDEiLCJyb2xlIjoic3RhZmYiLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzY1MDA0OTc4LCJleHAiOjE3NjUwMDg1Nzh9.xdgbuCmdhFb3GMuhUUI00Ou3HL2POQ2oOf12KI8FjtE";

  useEffect(() => {
    const loadQuizzList = async (path) => {
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
        setQuizzes(data.data);
      } catch (error) {
        setError(true);
      }
    };

    loadQuizzList(`/assessment/quizzes`);
  }, []);

  const quizzByOffering = quizzes.filter((quizz) => quizz.offering_id == id);

  return (
    <div className="section">
      {<h1 className="section-header">Lectures</h1>}
      {quizzes &&
        (!quizzByOffering.length ? (
          quizzByOffering.url ? (
            <a
              className="section-body_content"
              key={quizzByOffering.seq_no}
              href={`/course/${id}/1${quizzByOffering.url}`}
            >
              {quizzByOffering.title}
            </a>
          ) : (
            <p className="section-body_content" key={quizzByOffering.seq_no}>
              {quizzByOffering.title}
            </p>
          )
        ) : (
          quizzByOffering.map((quizz) => {
            return quizz.url ? (
              <a
                className="section-body_content"
                key={quizz.seq_no}
                href={`/course/${id}/1${quizz.url}`}
              >
                {quizz.title}
              </a>
            ) : (
              <p className="section-body_content" key={quizz.seq_no}>
                {quizz.title}
              </p>
            );
          })
        ))}
    </div>
  );
}
