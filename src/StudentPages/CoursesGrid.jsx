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
        <CourseCard key={courseOffering.id} courseOffering={courseOffering} />
      ))}
    </div>
  );
}

export default CoursesGrid;
