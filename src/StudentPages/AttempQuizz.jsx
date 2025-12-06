import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

export default function AttempQuizz() {
  const { id, quizzId } = useParams();
  const [quizz, setQuizz] = useState([]);
  const [error, setError] = useState(null);
  const API_URL = "https://canxphung.dev/api";
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AbG1zLmNvbSIsInVzZXJDb2RlIjoiQURNSU4wMDEiLCJyb2xlIjoic3RhZmYiLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzY1MDA0OTc4LCJleHAiOjE3NjUwMDg1Nzh9.xdgbuCmdhFb3GMuhUUI00Ou3HL2POQ2oOf12KI8FjtE";

  useEffect(() => {
    const loadQuizzByOfferingAndQuizzId = async (path) => {
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
        setQuizz(data.data);
      } catch (error) {
        setError(true);
      }
    };

    loadQuizzByOfferingAndQuizzId(`/assessment/quizzes/${id}/1/${quizzId}`);
  }, []);

  const formatDateVN = (dateInput) => {
    if (!dateInput) return "";

    const d = new Date(dateInput);

    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();

    const hour = d.getHours().toString().padStart(2, "0");
    const minute = d.getMinutes().toString().padStart(2, "0");

    return `${day}/${month}/${year} ${hour}:${minute}`;
  };

  return (
    <div>
      <h1>{quizz.title}</h1>
      <div>
        <p>
          <strong>Opened: </strong>
          {formatDateVN(quizz.available_from)}
        </p>
        <p>
          <strong>Closed: </strong>
          {formatDateVN(quizz.available_until)}
        </p>
      </div>
      <button>Attempt Quizz</button>
      <div>
        <p>Attempts allowed: {quizz.max_attempts}</p>
        <p>Time limit: {quizz.time_limit_minutes} mins</p>
      </div>
    </div>
  );
}
