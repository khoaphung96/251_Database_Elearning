import { useState, useEffect } from "react";
import "../css/quizz.css";

function QuizTimer({ time_limit }) {
  const [timeLeft, setTimeLeft] = useState(time_limit * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((t) => (t > 0 ? t - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const format = (sec) => {
    const h = String(Math.floor(sec / 3600)).padStart(2, "0");
    const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  return (
    <div className="timer-box">
      <span>Time left {format(timeLeft)}</span>
      <button className="hide-btn">Hide</button>
    </div>
  );
}

export default QuizTimer;
