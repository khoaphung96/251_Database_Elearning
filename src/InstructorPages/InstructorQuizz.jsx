import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../css/courseDetail.css";

export default function InstructorQuizz() {
  const { id } = useParams(); // id = offering_id
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seqNoCurrent, setSeqNoCurrent] = useState(0);

  // --- STATE CHO MODAL THÊM QUIZ ---
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration_minutes: 15,
    total_points: 10,
    status: "draft",
    type: "quiz",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_URL = "https://canxphung.dev/api";
  const token = localStorage.getItem("token");

  // Hàm load danh sách Quiz
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
      // Logic tính seqNo tiếp theo (lấy max seq_no hiện tại + 1 hoặc length + 1)
      const maxSeq = filteredQuizzes.reduce(
        (max, q) => (q.seq_no > max ? q.seq_no : max),
        0
      );
      setSeqNoCurrent(maxSeq);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) loadQuizzList();
  }, [id, token]);

  const handleDelete = async (seq_no) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bài kiểm tra này không?")) {
      return;
    }

    try {
      // Gọi API Delete: /api/assessment/quizzes/{offering_id}/1/{seq_no}
      const response = await fetch(
        `${API_URL}/assessment/quizzes/${id}/1/${seq_no}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        alert("Xóa thành công!");
        loadQuizzList(); // Tải lại danh sách
      } else {
        const errData = await response.json();
        alert("Lỗi: " + (errData.message || "Không thể xóa bài kiểm tra"));
      }
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
      alert("Đã có lỗi xảy ra khi xóa.");
    }
  };

  // --- XỬ LÝ FORM ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === "duration_minutes" || name === "total_points"
          ? Number(value)
          : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title) {
      alert("Vui lòng nhập tên bài kiểm tra");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      offering_id: Number(id),
      section_no: 1,
      seq_no: Number(seqNoCurrent + 1),
      title: formData.title,
      description: formData.description,
      duration_minutes: formData.duration_minutes,
      total_points: formData.total_points,
      status: formData.status,
      type: formData.type,
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
        setFormData({
          title: "",
          description: "",
          duration_minutes: 15,
          total_points: 10,
          status: "draft",
          type: "quiz",
        });
        loadQuizzList();
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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: 'column'
        }}
      >
        <h1 className="section-header">Quizzes</h1>
        <button className="btn-add" onClick={() => setShowModal(true)}>
          + Thêm Quiz
        </button>
      </div>

      {/* --- DANH SÁCH QUIZ --- */}
      <div className="quiz-list" style={{ marginTop: "15px" }}>
        {quizzes.length === 0 ? (
          <p className="section-body_content">Chưa có bài kiểm tra nào.</p>
        ) : (
          quizzes.map((quizz) => (
            <div
              key={quizz.seq_no}
              className="section-body_content"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "default",
              }}
            >
              {quizz.url ? (
                <a
                  href={`/student/course/${id}/1${quizz.url}`}
                  style={{ flex: 1, textDecoration: "none", color: "inherit" }}
                >
                  {quizz.title}
                </a>
              ) : (
                <span
                  onClick={() => handleNavigate(quizz.seq_no)}
                  style={{
                    flex: 1,
                    cursor: "pointer",
                    fontWeight: "500",
                  }}
                >
                  {quizz.title}
                </span>
              )}

              {/* Nút Xóa */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(quizz.seq_no);
                }}
                style={{
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  padding: "5px 10px",
                  marginLeft: "10px",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
                title="Xóa bài kiểm tra này"
              >
                Xóa
              </button>
            </div>
          ))
        )}
      </div>

      {/* --- MODAL POPUP THÊM QUIZ --- */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">Tạo bài kiểm tra mới</div>

            <form onSubmit={handleSubmit}>
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

              <div className="form-group">
                <label>Loại bài kiểm tra</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #ddd",
                  }}
                >
                  <option value="quiz">Quiz (Thường xuyên)</option>
                  <option value="midterm">Midterm (Giữa kỳ)</option>
                  <option value="final">Final (Cuối kỳ)</option>
                  <option value="practice">Practice (Luyện tập)</option>
                </select>
              </div>

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

              <div
                className="modal-actions"
                style={{
                  justifyContent: "flex-end",
                }}
              >
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