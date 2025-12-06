import "./App.css";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./StudentPages/Home";
import About from "./StudentPages/About";
import Course from "./StudentPages/Course";
import CourseDetail from "./StudentPages/CourseDetail";
import Section from "./component/Lesson";
import Quizz from "./component/Quizz";

function App() {
  return (
    <>
      <nav
        style={{
          display: "flex",
          gap: 20,
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          padding: "15px 25px",
          background: "white",
          borderBottom: "1px solid #e5e5e5",
          zIndex: 1000,
        }}
      >
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/courses">My Courses</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/courses" element={<Course />} />
        <Route path="/course/:id" element={<CourseDetail />} />
        <Route path="/course/:id/Lectures" element={<Section />} />
        <Route path="/course/:id/Quizzes" element={<Quizz />} />
      </Routes>
    </>
  );
}

export default App;
