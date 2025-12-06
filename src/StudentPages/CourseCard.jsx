function CourseCard({ course, courseOffering }) {
  return (
    <div
      style={{
        background: "#f5f7ff",
        borderRadius: "10px",
        overflow: "hidden",
        border: "1px solid #ddd",
        cursor: "pointer",
        transition: "0.2s",
      }}
      onClick={() =>
        (window.location.href = `/student/course/${courseOffering.offering_id}`)
      }
    >
      <div
        style={{
          height: "120px",
          backgroundColor: courseOffering.color || "#6B7BEE",
        }}
      ></div>
      <div style={{ padding: "15px", fontSize: "14px" }}>
        <p style={{ color: "blue" }}>
          {courseOffering &&
            courseOffering.course_name + "_" + courseOffering.section}
        </p>
      </div>
    </div>
  );
}

export default CourseCard;
