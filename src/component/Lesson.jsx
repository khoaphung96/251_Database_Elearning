import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "../css/courseDetail.css";

export default function Section({}) {
  const { id } = useParams();
  const [contents, setContents] = useState([]);
  const [error, setError] = useState(null);
  const API_URL = "https://canxphung.dev/api";
  const token = localStorage.getItem("token");
  const payload = jwtDecode(token);

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
        setContents(data.data);
        console.log(data.data)
      } catch (error) {
        setError(true);
      }
    };

    loadContentList(`/teaching/content/${id}/1`);
  }, []);

  return (
    <div className="section">
      {<h1 className="section-header">Lectures</h1>}
      {contents &&
        (!contents.length ? (
          contents.url ? (
            <a
              className="section-body_content"
              key={contents.seq_no}
              href={`/student/course/${id}/1${contents.url}`}
            >
              {contents.title}
            </a>
          ) : (
            <p className="section-body_content" key={contents.seq_no}>
              {contents.title}
            </p>
          )
        ) : (
          contents.map((content) => {
            return content.url ? (
              <a
                className="section-body_content"
                key={content.seq_no}
                href={`/student/course/${id}/1${content.url}`}
              >
                {content.title}
              </a>
            ) : (
              <p className="section-body_content" key={content.seq_no}>
                {content.title}
              </p>
            );
          })
        ))}
    </div>
  );
}
