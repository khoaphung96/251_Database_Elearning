import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import IntructorCoursesGrid from "./IntructorCoursesGrid";

function IntructorCourse() {
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

    const loadInstructorClasses = async () => {
      const response = await fetch(
        `${API_URL}/administration/instructors/${payload.userId}/classes`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      const classes = Array.isArray(result) ? result : [result];
      console.log("instructor class: ", classes);

      setCoursesOffering(classes);
    };

    loadInstructorClasses();
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
      <IntructorCoursesGrid coursesOffering={coursesOffering} />
    </div>
  );
}

export default IntructorCourse;
