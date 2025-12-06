import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import Accordion from "../component/Accordion";
import "../css/courseDetail.css";

function CourseDetail() {
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
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AbG1zLmNvbSIsInVzZXJDb2RlIjoiQURNSU4wMDEiLCJyb2xlIjoic3RhZmYiLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzY0OTg2NzIwLCJleHAiOjE3NjQ5OTAzMjB9.1E6gBpLcFZW8QncP5UX97u6V4xmWqMurcWXY6Ap9g2w";

  useEffect(() => {
    const loadCourseOfferingList = async (path) => {
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
        setCoursesOffering(data);
      } catch (error) {
        setError(true);
      }
    };

    loadCourseOfferingList("/academic/offerings");

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

    loadQuizzList(`/assessment/quizzes`);
  }, []);

  if (coursesOffering.length == 0) return <p>Đang tải...</p>;

  const courseOffering = coursesOffering.find(
    (courseOffering) => courseOffering.id == id
  );

  const quizzByOffering = quizzs.filter((quizz) => quizz.offering_id == id);

  return (
    <div className="course-wrapper">
      <div className="course-header">
        <h1 className="course-title">
          {courseOffering &&
            courseOffering.course_name + "_" + courseOffering.section}
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

          <div ref={ref} className="accordion">
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
                  (window.location.href = `/course/${id}/${secId}`)
                }
              >
                {"General"}
              </span>
            </div>

            {showGeneral && <div className="acc-body"></div>}
          </div>

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
                  (window.location.href = `/course/${id}/Lectures`)
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
                        href={`/course/${id}/1${contents.url}`}
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
                          href={`/course/${id}/1${content.url}`}
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
                onClick={() => (window.location.href = `/course/${id}/Quizzes`)}
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
                        href={`/course/${id}/${quizzByOffering.url}`}
                      >
                        {quizzByOffering.title}
                      </a>
                    ) : (
                      <p
                        className="acc-body_content"
                        key={quizzByOffering.seq_no}
                        onClick={() =>
                          (window.location.href = `/course/${id}/Quizzes/${quizzByOffering.seq_no}`)
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
                          href={`/course/${id}/${quizz.url}`}
                        >
                          {quizz.title}
                        </a>
                      ) : (
                        <p
                          className="acc-body_content"
                          key={quizz.seq_no}
                          onClick={() =>
                            (window.location.href = `/course/${id}/Quizzes/${quizz.seq_no}`)
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

export default CourseDetail;
