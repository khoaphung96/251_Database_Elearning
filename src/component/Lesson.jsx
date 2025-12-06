import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import "../css/courseDetail.css";

export default function Section({}) {
  const { id } = useParams();
  const [contents, setContents] = useState([]);
  const [error, setError] = useState(null);
  const API_URL = "https://canxphung.dev/api";
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AbG1zLmNvbSIsInVzZXJDb2RlIjoiQURNSU4wMDEiLCJyb2xlIjoic3RhZmYiLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzY1MDA0OTc4LCJleHAiOjE3NjUwMDg1Nzh9.xdgbuCmdhFb3GMuhUUI00Ou3HL2POQ2oOf12KI8FjtE";

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
              href={`/course/${id}/1${contents.url}`}
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
                href={`/course/${id}/1${content.url}`}
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
