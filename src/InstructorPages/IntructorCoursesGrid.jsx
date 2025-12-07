import IntructorCourseCard from "./IntructorCourseCard";

function IntructorCoursesGrid({ coursesOffering }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "20px",
      }}
    >
      {coursesOffering.map((courseOffering, index) => (
        <IntructorCourseCard
          key={index}
          courseOffering={courseOffering}
        />
      ))}
    </div>
  );
}

export default IntructorCoursesGrid;
