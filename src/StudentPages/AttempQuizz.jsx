import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import StartAttemptModal from "../component/StartAttemptModel";
import AttemptCard from "./AttemptCard";
import "../css/courseDetail.css";

export default function AttempQuizz() {
  const { id, quizzId } = useParams();
  const [quizz, setQuizz] = useState([]);
  const [attempt, setAttempt] = useState([]);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const API_URL = "https://canxphung.dev/api";
  const token = localStorage.getItem("token");
  const payload = jwtDecode(token);

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

    const loadAttemptById = async (path) => {
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
        setAttempt(data);
      } catch (error) {
        setError(true);
      }
    };

    loadAttemptById(`/assessment/students/${payload.userId}/attempts`);
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
      <button
        className="attempt-btn"
        disabled={quizz.max_attempts === attempt.length}
        onClick={() => setShowPopup(true)}
      >
        {attempt.length === 0 && "Attempt Quizz"}
        {attempt.length > 0 &&
          attempt.length < quizz.max_attempts &&
          " Re-Attempt Quizz"}
        {quizz.max_attempts === attempt.length && "No Attempts Left"}
      </button>
      {showPopup && (
        <StartAttemptModal
          offering_id={id}
          quizz_id={quizzId}
          time_limit={quizz.time_limit_minutes}
          onClose={() => setShowPopup(false)}
        />
      )}
      <div>
        <p>Attempts allowed: {quizz.max_attempts}</p>
        <p>Time limit: {quizz.time_limit_minutes} mins</p>
      </div>
      <AttemptCard attempt={attempt} quizz={quizz}></AttemptCard>
    </div>
  );
}
