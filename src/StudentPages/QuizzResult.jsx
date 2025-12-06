import { useLocation } from "react-router-dom";

export default function QuizzResult() {
  const location = useLocation();
  const { score, answers } = location.state || {};

  return (
    <div>
      <h1>Score:{score}</h1>
    </div>
  );
}
