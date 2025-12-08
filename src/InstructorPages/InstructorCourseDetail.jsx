import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { jwtDecode } from "jwt-decode";
// import Accordion from "../component/Accordion";
import "../css/courseDetail.css";

function IntructorCourseDetail() {
  const { id } = useParams();
  const [tab, setTab] = useState("course");
  const [expandedAll, setExpandedAll] = useState(false);
  const [error, setError] = useState(null);
  const [coursesOffering, setCoursesOffering] = useState([]);
  const [showGeneral, setShowGeneral] = useState(open);
  const [showLecture, setShowLecture] = useState(open);
  const [showQuizz, setShowQuizz] = useState(open);
  const [contents, setContents] = useState([]);
  const [quizzs, setQuizzs] = useState([]);
  const ref = useRef(null);
  const API_URL = "https://canxphung.dev/api";
  const token = localStorage.getItem("token");
  const payload = jwtDecode(token);

  useEffect(() => {
    const loadStudentClasses = async () => {
      const response = await fetch(
        `${API_URL}/administration/instructors/${payload.userId}/classes`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      let result = await response.json();

      const classes = Array.isArray(result) ? result : [result];

      const detailedClasses = await Promise.all(
        classes.map(async (c) => {
          const res = await fetch(
            `${API_URL}/classes/${c.offering_id}/${c.section_no}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          return res.json();
        })
      );

      setCoursesOffering(detailedClasses);
    };

    loadStudentClasses();

    const loadContentList = async (path) => {
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
        setContents(data.data);
        console.log("content", data)
      } catch (error) {
        setError(true);
      }
    };

    loadContentList(`/teaching/content/${id}/1`);

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
        setQuizzs(data.data);
      } catch (error) {
        setError(true);
      }
    };

    loadQuizzList(`/assessment/quizzes/offering/${id}`);
  }, []);

  if (coursesOffering.length == 0) return <p>Đang tải...</p>;

  const courseOffering = coursesOffering.find(
    (courseOffering) => courseOffering.data.offering_id == id
  );

  const quizzByOffering = quizzs.filter((quizz) => quizz.offering_id == id);

  return (
    <div className="course-wrapper">
      <div className="course-header">
        <h1 className="course-title">
          {courseOffering &&
            courseOffering.data.course_name + "_" + courseOffering.data.section}
        </h1>
        <div className="tabs">
          <button
            className={tab === "course" ? "active" : ""}
            onClick={() => setTab("course")}
          >
            Course
          </button>
          <button
            className={tab === "grades" ? "active" : ""}
            onClick={() => setTab("grades")}
          >
            Grades
          </button>
          <button
            className={tab === "comp" ? "active" : ""}
            onClick={() => setTab("comp")}
          >
            Competencies
          </button>
        </div>
      </div>

      {tab === "course" && (
        <div className="section-list">
          <div className="expand-all" onClick={() => setExpandedAll((e) => !e)}>
            {expandedAll ? "Collapse all" : "Expand all"}
          </div>

          {/* <div ref={ref} className="accordion">
            <div className="acc-header">
              <span
                className="arrow"
                onClick={() => setShowGeneral(!showGeneral)}
              >
                {showGeneral ? "▾" : "▸"}
              </span>
              <span
                className="acc-header_title"
                onClick={() =>
                  (window.location.href = `/student/course/${id}/General`)
                }
              >
                {"General"}
              </span>
            </div>

            {showGeneral && <div className="acc-body"></div>}
          </div> */}

          <div ref={ref} className="accordion">
            <div className="acc-header">
              <span
                className="arrow"
                onClick={() => setShowLecture(!showLecture)}
              >
                {showLecture ? "▾" : "▸"}
              </span>
              <span
                className="acc-header_title"
                onClick={() =>
                  (window.location.href = `/instructor/course/${id}/Lectures`)
                }
              >
                {"Lectures"}
              </span>
            </div>

            {showLecture && (
              <div className="acc-body">
                {contents &&
                  (!contents.length ? (
                    contents.url ? (
                      <a
                        className="acc-body_content"
                        key={contents.seq_no}
                        href={`/student/course/${id}/1${contents.url}`}
                      >
                        {contents.title}
                      </a>
                    ) : (
                      <p className="acc-body_content" key={contents.seq_no}>
                        {contents.title}
                      </p>
                    )
                  ) : (
                    contents.map((content) => {
                      return content.url ? (
                        <a
                          className="acc-body_content"
                          key={content.seq_no}
                          href={`/student/course/${id}/1${content.url}`}
                        >
                          {content.title}
                        </a>
                      ) : (
                        <p className="acc-body_content" key={content.seq_no}>
                          {content.title}
                        </p>
                      );
                    })
                  ))}
              </div>
            )}
          </div>

          <div ref={ref} className="accordion">
            <div className="acc-header">
              <span className="arrow" onClick={() => setShowQuizz(!showQuizz)}>
                {showQuizz ? "▾" : "▸"}
              </span>
              <span
                className="acc-header_title"
                onClick={() =>
                  (window.location.href = `/instructor/course/${id}/Quizzes`)
                }
              >
                {"Quizzes"}
              </span>
            </div>

            {showQuizz && (
              <div className="acc-body">
                {quizzs &&
                  (!quizzByOffering.length ? (
                    quizzByOffering.url ? (
                      <a
                        className="acc-body_content"
                        key={quizzByOffering.seq_no}
                        href={`/student/course/${id}/${quizzByOffering.url}`}
                      >
                        {quizzByOffering.title}
                      </a>
                    ) : (
                      <p
                        className="acc-body_content"
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
                          className="acc-body_content"
                          key={quizz.seq_no}
                          href={`/student/course/${id}/${quizz.url}`}
                        >
                          {quizz.title}
                        </a>
                      ) : (
                        <p
                          className="acc-body_content"
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
            )}
          </div>
        </div>
      )}

      {tab === "grades" && (
        <p className="placeholder">📊 Chức năng điểm số chưa triển khai</p>
      )}
      {tab === "comp" && (
        <p className="placeholder">📌 Competencies future feature</p>
      )}
    </div>
  );
}

export default IntructorCourseDetail;
