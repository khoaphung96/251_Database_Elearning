import CourseCard from "./CourseCard";

function CoursesGrid({ coursesOffering }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "20px",
      }}
    >
      {coursesOffering.map((courseOffering) => (
        <CourseCard
          key={courseOffering.data.offering_id}
          courseOffering={courseOffering.data}
        />
      ))}
    </div>
  );
}

export default CoursesGrid;
