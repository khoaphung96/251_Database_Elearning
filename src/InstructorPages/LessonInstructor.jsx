import { useState, useEffect } from "react"; // Bỏ useRef nếu không dùng
import { useParams } from "react-router-dom";
// import { jwtDecode } from "jwt-decode"; // Nếu chỉ dùng để lấy token string thì không cần decode ở đây
import "../css/courseDetail.css";

export default function SectionIntructor({}) {
  const { id } = useParams(); // id này chính là offering_id
  const [contents, setContents] = useState([]);
  // const [error, setError] = useState(null); // (Tạm ẩn nếu chưa dùng kỹ)
  const [seqNo, setSeqNo] = useState(0);
  
  // --- STATE CHO MODAL THÊM LECTURE ---
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    tags: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_URL = "https://canxphung.dev/api";
  const token = localStorage.getItem("token");

  // Hàm load dữ liệu (được tách ra để tái sử dụng sau khi thêm mới)
  const loadContentList = async () => {
    try {
      const response = await fetch(`${API_URL}/teaching/content/${id}/1`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Lỗi API: " + response.status);

      const data = await response.json();
      setContents(data.data);
      console.log(data.data)
      setSeqNo(data.data.length);
    } catch (error) {
      console.error(error);
      // setError(true);
    }
  };

  useEffect(() => {
    loadContentList();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]); // Thêm id vào dependency

  // --- XỬ LÝ FORM ---
  
  // Xử lý thay đổi input text
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Xử lý thay đổi checkbox tags
  const handleTagChange = (e) => {
    const { value, checked } = e.target;
    let newTags = [...formData.tags];
    if (checked) {
      newTags.push(value);
    } else {
      newTags = newTags.filter((tag) => tag !== value);
    }
    setFormData({ ...formData, tags: newTags });
  };

  // Xử lý Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || formData.tags.length === 0) {
      alert("Vui lòng nhập tiêu đề và chọn ít nhất 1 tag");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      offering_id: Number(id), // Lấy từ params
      section_no: 1,
      seq_no: Number(seqNo + 1),
      module_no: 0,   // Hardcoded
      title: formData.title,
      type: "lecture",
      url: formData.url,
      content_data: {},
      visibility: "enrolled",
    };

    try {
      const response = await fetch(`${API_URL}/teaching/content`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      console.log("res", response)

      if (response.ok) {
        alert("Thêm bài giảng thành công!");
        setShowModal(false); // Đóng modal
        setFormData({ title: "", url: "", tags: [] }); // Reset form
        loadContentList(); // Load lại danh sách
      } else {
        alert("Lỗi khi thêm bài giảng");
      }
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Có lỗi xảy ra");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="section">
      <h1 className="section-header">Lectures</h1>
      <button className="btn-add" onClick={() => setShowModal(true)}>
          + Thêm Lecture
        </button>

      {/* --- PHẦN HIỂN THỊ DANH SÁCH (GIỮ NGUYÊN CODE CŨ CỦA BẠN) --- */}
      {contents &&
        (!contents.length ? (
          contents.url ? (
            <a className="section-body_content" key={contents.seq_no} href={`/student/course/${id}/1${contents.url}`}>
              {contents.title}
            </a>
          ) : (
            <p className="section-body_content" key={contents.seq_no}>
              {contents.title}
            </p>
          )
        ) : (
          contents.map((content) => {
            return content.url ? (
              <a className="section-body_content" key={content.seq_no} href={`/student/course/${id}/1${content.url}`}>
                {content.title}
              </a>
            ) : (
              <p className="section-body_content" key={content.seq_no}>
                {content.title}
              </p>
            );
          })
        ))}

      {/* --- MODAL POPUP --- */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">Thêm bài giảng mới</div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Tiêu đề *</label>
                <input 
                  type="text" 
                  name="title" 
                  value={formData.title} 
                  onChange={handleInputChange} 
                  placeholder="Nhập tên bài..." 
                />
              </div>

              <div className="form-group">
                <label>URL Video</label>
                <input 
                  type="text" 
                  name="url" 
                  value={formData.url} 
                  onChange={handleInputChange} 
                  placeholder="/video/abc.mp4" 
                />
              </div>

              <div className="form-group">
                <label>Tags *</label>
                <div className="checkbox-group">
                  <label>
                    <input 
                      type="checkbox" 
                      value="programming" 
                      checked={formData.tags.includes("programming")}
                      onChange={handleTagChange}
                    /> Programming
                  </label>
                  <label>
                    <input 
                      type="checkbox" 
                      value="introduction" 
                      checked={formData.tags.includes("introduction")}
                      onChange={handleTagChange}
                    /> Introduction
                  </label>
                </div>
              </div>

              <div className="modal-actions modal-actions-ins">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                  Hủy
                </button>
                <button type="submit" className="btn-submit" disabled={isSubmitting}>
                  {isSubmitting ? "Đang lưu..." : "Tạo mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}