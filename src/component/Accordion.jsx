import { useState, useEffect, useRef } from "react";
import "../css/courseDetail.css";
// import Section from "./Section";

export default function Accordion({ label, open, secId, courseOfferingId }) {
  const [show, setShow] = useState(open);
  const [contents, setContents] = useState({});
  const [quizs, setQuizs] = useState({});
  const ref = useRef(null);
  const API_URL = "https://canxphung.dev/api";
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AbG1zLmNvbSIsInVzZXJDb2RlIjoiQURNSU4wMDEiLCJyb2xlIjoic3RhZmYiLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzY0NzU5OTczLCJleHAiOjE3NjQ3NjM1NzN9.rnEy7ly_XSZiB0-q2yfxHyCmKjBSL0WgsH-18pGIUe0";

  useEffect(() => setShow(open), [open]);

  useEffect(() => {
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
        setContents(data);
        console.log(data);
      } catch (error) {
        setError(true);
      }
    };

    loadContentList(`/teaching/content/${courseOfferingId}/1`);
  }, []);

  // useEffect(() => {
  //   const loadQuizsList = async () => {
  //     try {
  //       const response = await fetch("/quiz.json");

  //       if (!response.ok) throw new Error("Lỗi API: " + response.status);

  //       const data = await response.json();
  //       setQuizs(data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   loadQuizsList();
  // }, []);

  if (!contents.length) {
    return;
  }

  // if (!quizs.length) {
  //   return;
  // }

  // const lessonsByCourseOffering = lessons.filter((lesson) => {
  //   return lesson.course_offering_id == courseOfferingId;
  // });

  // const quizsByCourseOffering = quizs.filter((quiz) => {
  //   return quiz.course_offering_id == courseOfferingId;
  // });

  // const lessonByCatogory = lessonsByCourseOffering.filter(
  //   (lesson) => lesson.section_id == secId
  // );

  // const quizByCatogory = quizsByCourseOffering.filter(
  //   (quiz) => quiz.section_id == secId
  // );

  return (
    <div ref={ref} className="accordion">
      <div className="acc-header">
        <span className="arrow" onClick={() => setShow(!show)}>
          {show ? "▾" : "▸"}
        </span>
        <span
          className="acc-header_title"
          onClick={() =>
            (window.location.href = `/course/${courseOfferingId}/${secId}`)
          }
        >
          {label}
        </span>
      </div>

      {show && (
        <div className="acc-body">
          {/* {lessonByCatogory &&
            lessonByCatogory.map((lesson) => {
              return lesson.url ? (
                <a
                  className="acc-body_content"
                  key={lesson.content_id}
                  href={`/course/${courseOfferingId}/${secId}/${lesson.url}`}
                >
                  {lesson.title}
                </a>
              ) : (
                <p className="acc-body_content" key={lesson.content_id}>
                  {lesson.title}
                </p>
              );
            })} */}
          {/* {quizByCatogory &&
            quizByCatogory.map((quiz) => {
              return quiz.url ? (
                <a
                  className="acc-body_content"
                  key={quiz.quiz_id}
                  href={`/course/${courseOfferingId}/${secId}/${quiz.url}`}
                >
                  {quiz.title}
                </a>
              ) : (
                <p className="acc-body_content" key={quiz.quiz_id}>
                  {quiz.title}
                </p>
              );
            })} */}
        </div>
      )}
    </div>
  );
}
