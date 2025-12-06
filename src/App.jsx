import "./App.css";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Home from "./StudentPages/Home";
import About from "./StudentPages/About";
import Course from "./StudentPages/Course";
import CourseDetail from "./StudentPages/CourseDetail";
import Section from "./component/Lesson";
import Quizz from "./component/Quizz";
import AttempQuizz from "./StudentPages/AttempQuizz";
import DoQuizz from "./StudentPages/DoQuizz";
import Login from "./StudentPages/Login";

function App() {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc muốn đăng xuất không?")) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          background: "white",
          borderBottom: "1px solid #e5e5e5",
          zIndex: 1000,
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "15px 25px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", gap: 20 }}>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/student/courses">My Courses</Link>
          </div>
          <button
            onClick={handleLogout}
            style={{
              background: "transparent",
              border: "1px solid #ccc",
              padding: "6px 12px",
              borderRadius: "4px",
              cursor: "pointer",
              color: "black",
            }}
          >
            Logout
          </button>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/student/courses" element={<Course />} />
        <Route path="/student/course/:id" element={<CourseDetail />} />
        <Route path="/student/course/:id/Lectures" element={<Section />} />
        <Route path="/student/course/:id/Quizzes" element={<Quizz />} />
        <Route
          path="/student/course/:id/Quizzes/:quizzId"
          element={<AttempQuizz />}
        />
        <Route
          path="/student/course/:id/Quizzes/:quizzId/doQuizz"
          element={<DoQuizz />}
        />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
