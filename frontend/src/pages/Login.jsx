import { useState } from "react";
import axios from "axios";
import { setAuth } from "../utils/auth";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Email dan password wajib diisi");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await axios.post("http://localhost:8000/api/login", {
        email,
        password,
      });

      const { access_token, role } = res.data.data;

      setAuth(access_token, role);

      // 🔥 REDIRECT SESUAI ROLE
      if (role === "owner") {
        navigate("/owner", { replace: true });
      } else {
        navigate("/menu", { replace: true });
      }
    } catch (err) {
      console.error(err);
      setError("Email atau password salah");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f0f0f",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
      }}
    >
      <div
        style={{
          width: 320,
          padding: 24,
          background: "#111",
          borderRadius: 10,
          border: "1px solid #333",
        }}
      >
        <h2 style={{ marginBottom: 20, textAlign: "center" }}>
          Login FoodHub
        </h2>

        {error && (
          <p style={{ color: "red", marginBottom: 12 }}>
            {error}
          </p>
        )}

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={input}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            ...button,
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Memproses..." : "Login"}
        </button>

        {/* 🔥 TOMBOL REGISTER (INI YANG KURANG SEBELUMNYA) */}
        <p style={{ marginTop: 16, fontSize: 14, textAlign: "center" }}>
          Belum punya akun?{" "}
          <Link
            to="/register"
            style={{ color: "#60a5fa", textDecoration: "underline" }}
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const input = {
  width: "100%",
  padding: "10px",
  marginBottom: "12px",
  borderRadius: 6,
  border: "1px solid #444",
  background: "#000",
  color: "white",
};

const button = {
  width: "100%",
  padding: "10px",
  borderRadius: 6,
  border: "none",
  background: "#16a34a",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
};
