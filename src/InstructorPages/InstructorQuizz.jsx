import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../css/courseDetail.css";

export default function InstructorQuizz() {
  const { id } = useParams(); // id = offering_id
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- STATE CHO MODAL THÊM QUIZ ---
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration_minutes: 15,
    total_points: 10,
    status: "draft",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_URL = "https://canxphung.dev/api";
  const token = localStorage.getItem("token");

  // Hàm load danh sách Quiz (Tách ra để gọi lại sau khi thêm mới)
  const loadQuizzList = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/assessment/quizzes`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Lỗi API: " + response.status);

      const data = await response.json();
      // Lọc quiz theo offering_id hiện tại
      const filteredQuizzes = data.data.filter(
        (q) => String(q.offering_id) === String(id)
      );
      setQuizzes(filteredQuizzes);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) loadQuizzList();
  }, [id, token]);

  // --- XỬ LÝ FORM ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      // Nếu là số thì parse về Number, ngược lại giữ nguyên string
      [name]:
        name === "duration_minutes" || name === "total_points"
          ? Number(value)
          : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate cơ bản
    if (!formData.title) {
      alert("Vui lòng nhập tên bài kiểm tra");
      return;
    }

    setIsSubmitting(true);

    // Payload theo đúng yêu cầu JSON bạn đưa
    const payload = {
      offering_id: Number(id),
      section_no: 1, // Hardcoded
      seq_no: 1, // Hardcoded
      title: formData.title,
      description: formData.description,
      duration_minutes: formData.duration_minutes,
      total_points: formData.total_points,
      status: formData.status,
    };

    try {
      const response = await fetch(`${API_URL}/assessment/quizzes`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Tạo Quiz thành công!");
        setShowModal(false);
        // Reset form về mặc định
        setFormData({
          title: "",
          description: "",
          duration_minutes: 15,
          total_points: 10,
          status: "draft",
        });
        loadQuizzList(); // Refresh danh sách
      } else {
        const errData = await response.json();
        alert("Lỗi: " + (errData.message || "Không thể tạo quiz"));
      }
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Đã có lỗi xảy ra");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNavigate = (seq_no) => {
    navigate(`/student/course/${id}/Quizzes/${seq_no}`);
  };

  if (loading) return <div>Đang tải danh sách Quiz...</div>;

  return (
    <div className="section">
      <h1 className="section-header">Quizzes</h1>
      <button className="btn-add" onClick={() => setShowModal(true)}>
        + Thêm Quiz
      </button>

      {/* --- DANH SÁCH QUIZ --- */}
      {quizzes.length === 0 ? (
        <p className="section-body_content">Chưa có bài kiểm tra nào.</p>
      ) : (
        quizzes.map((quizz) =>
          quizz.url ? (
            <a
              className="section-body_content"
              key={quizz.seq_no}
              href={`/student/course/${id}/1${quizz.url}`}
            >
              {quizz.title}
            </a>
          ) : (
            <p
              className="section-body_content"
              key={quizz.seq_no}
              onClick={() => handleNavigate(quizz.seq_no)}
              style={{ cursor: "pointer" }}
            >
              {quizz.title}
            </p>
          )
        )
      )}

      {/* --- MODAL POPUP THÊM QUIZ --- */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">Tạo bài kiểm tra mới</div>

            <form onSubmit={handleSubmit}>
              {/* Title */}
              <div className="form-group">
                <label>Tên bài kiểm tra *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Ví dụ: Bài kiểm tra giữa kỳ"
                  required
                />
              </div>

              {/* Description */}
              <div className="form-group">
                <label>Mô tả</label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Nhập mô tả ngắn..."
                />
              </div>

              {/* Duration & Points (Cùng 1 hàng cho gọn) */}
              <div style={{ display: "flex", gap: "15px" }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Thời gian (phút)</label>
                  <input
                    type="number"
                    name="duration_minutes"
                    value={formData.duration_minutes}
                    onChange={handleInputChange}
                    min="1"
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Điểm số</label>
                  <input
                    type="number"
                    name="total_points"
                    value={formData.total_points}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
              </div>

              {/* Status */}
              <div className="form-group">
                <label>Trạng thái</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #ddd",
                  }}
                >
                  <option value="draft">Bản nháp (Draft)</option>
                  <option value="published">Công khai (Published)</option>
                  <option value="archived">Lưu trữ (Archived)</option>
                </select>
              </div>

              <div className="modal-actions" style={{
                justifyContent: 'flex-end'
              }}>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowModal(false)}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="btn-submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Đang tạo..." : "Tạo mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
