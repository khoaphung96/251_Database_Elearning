import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import CoursesGrid from "./CoursesGrid";

function Course() {
  const [coursesOffering, setCoursesOffering] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const API_URL = "https://canxphung.dev/api";
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AbG1zLmNvbSIsInVzZXJDb2RlIjoiQURNSU4wMDEiLCJyb2xlIjoic3RhZmYiLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzY1MDA0OTc4LCJleHAiOjE3NjUwMDg1Nzh9.xdgbuCmdhFb3GMuhUUI00Ou3HL2POQ2oOf12KI8FjtE";

  useEffect(() => {
    const loadCourseOfferingList = async (path) => {
      try {
        setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };

    loadCourseOfferingList("/academic/offerings");
  }, []);

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "30px 70px" }}>
      <h1 style={{ fontSize: "32px", color: "#0046d5", fontWeight: 600 }}>
        My Courses
      </h1>

      {/* <FiltersBar /> */}
      <CoursesGrid coursesOffering={coursesOffering} />
    </div>
  );
}

export default Course;
