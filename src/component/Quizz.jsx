import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "../css/courseDetail.css";

export default function Quizz({}) {
  const { id } = useParams();
  const [quizzes, setQuizzes] = useState([]);
  const [error, setError] = useState(null);
  const API_URL = "https://canxphung.dev/api";
  const token = localStorage.getItem("token");
  const payload = jwtDecode(token);

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

  let quizzByOffering = quizzes.filter((quizz) => quizz.offering_id == id);

  quizzByOffering = Array.isArray(quizzByOffering)
    ? quizzByOffering
    : [quizzByOffering];

  return (
    <div className="section">
      {<h1 className="section-header">Quizzes</h1>}
      {quizzes &&
        (!quizzByOffering.length ? (
          quizzByOffering.url ? (
            <a
              className="section-body_content"
              key={quizzByOffering.seq_no}
              href={`/student/course/${id}/1${quizzByOffering.url}`}
            >
              {quizzByOffering.title}
            </a>
          ) : (
            <p
              className="section-body_content"
              key={quizzByOffering.seq_no}
              onClick={() =>
                (window.location.href = `/student/course/${id}/Quizzes/${quizzByOffering.seq_no}`)
              }
            >
              {quizzByOffering.title}
            </p>
          )
        ) : (
          quizzByOffering.map((quizz) => {
            return quizz.url ? (
              <a
                className="section-body_content"
                key={quizz.seq_no}
                href={`/student/course/${id}/1${quizz.url}`}
              >
                {quizz.title}
              </a>
            ) : (
              <p
                className="section-body_content"
                key={quizz.seq_no}
                onClick={() =>
                  (window.location.href = `/student/course/${id}/Quizzes/${quizz.seq_no}`)
                }
              >
                {quizz.title}
              </p>
            );
          })
        ))}
    </div>
  );
}
