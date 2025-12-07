import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "../css/login.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const API_URL = "https://canxphung.dev/api";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: username,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error("Sai tài khoản hoặc mật khẩu");
      }

      const data = await response.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      const token = localStorage.getItem("token");
      const payload = jwtDecode(token);
      console.log(payload);

      if (payload.role === "student") {
        navigate("/student/courses");
      }

      if (payload.role === "instructor") {
        navigate("/instructor/courses");
      }
    } catch (err) {
      console.log(err);
      setError("Sai tài khoản hoặc mật khẩu.");
    }
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleLogin}>
        <h2>Đăng nhập</h2>

        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Email"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />

        {error && <p className="error-msg">{error}</p>}

        <button type="submit" className="login-btn">
          Đăng nhập
        </button>
      </form>
    </div>
  );
}
