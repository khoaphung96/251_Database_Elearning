import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import CoursesGrid from "./CoursesGrid";

function Course() {
  const [coursesOffering, setCoursesOffering] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const API_URL = "https://canxphung.dev/api";
  const token = localStorage.getItem("token");

  if (!token) {
    return (
      <div>
        <a href="/login">Đăng nhập để tiếp tục</a>
      </div>
    );
  }

  const payload = jwtDecode(token);

  useEffect(() => {
    setLoading(true);

    const loadStudentClasses = async () => {
      const response = await fetch(
        `${API_URL}/classes/students/${payload.userId}/classes`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      let result = await response.json();

      let classes = result.data;

      classes = Array.isArray(classes) ? classes : [classes];

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
    setLoading(false);
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
