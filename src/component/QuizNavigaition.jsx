import "../css/quizz.css";

function NavigationButtons({ current, total, onPrev, onNext }) {
  return (
    <div className="nav-buttons">
      <button disabled={current === 0} onClick={onPrev}>
        Previous page
      </button>

      <button disabled={current === total - 1} onClick={onNext}>
        Next page
      </button>
    </div>
  );
}

export default NavigationButtons;
