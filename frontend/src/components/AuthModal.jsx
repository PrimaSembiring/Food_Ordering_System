import { useState } from "react";
import axios from "axios";
import { setAuth } from "../utils/auth";

export default function AuthModal({ open, onClose, onSuccess }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  if (!open) return null;

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:8000/api/login", {
        email,
        password,
      });

      const { access_token, role } = res.data.data;
      setAuth(access_token, role);

      onClose();

      // 🔥 INI KUNCI UTAMANYA
      if (role === "owner") {
        onSuccess("/owner/orders");
      } else {
        onSuccess("/menu");
      }
    } catch {
      setError("Login gagal");
    }
  };

  const handleRegister = async () => {
    try {
      await axios.post("http://localhost:8000/api/register", {
        name,
        email,
        password,
      });

      alert("Register berhasil, silakan login");
      setMode("login");
    } catch {
      setError("Register gagal");
    }
  };

  return (
    <div style={overlay} onClick={onClose}>
      <div style={modal} onClick={(e) => e.stopPropagation()}>
        <button style={closeBtn} onClick={onClose}>✕</button>

        <h2 style={{ marginBottom: 16 }}>
          {mode === "login" ? "Login" : "Register"}
        </h2>

        {mode === "register" && (
          <input
            style={input}
            placeholder="Nama"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}

        <input
          style={input}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          style={input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        {mode === "login" ? (
          <>
            <button style={primaryBtn} onClick={handleLogin}>
              Login
            </button>
            <button style={linkBtn} onClick={() => setMode("register")}>
              Belum punya akun? Register
            </button>
          </>
        ) : (
          <>
            <button style={primaryBtn} onClick={handleRegister}>
              Register
            </button>
            <button style={linkBtn} onClick={() => setMode("login")}>
              Sudah punya akun? Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.7)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
};

const modal = {
  background: "#111",
  color: "white",
  padding: 24,
  borderRadius: 10,
  width: 320,
  position: "relative",
};

const closeBtn = {
  position: "absolute",
  top: 8,
  right: 12,
  background: "none",
  border: "none",
  color: "white",
  fontSize: 18,
  cursor: "pointer",
};

const input = {
  width: "100%",
  padding: 10,
  marginBottom: 10,
  borderRadius: 6,
  border: "none",
};

const primaryBtn = {
  width: "100%",
  padding: 10,
  marginTop: 10,
  borderRadius: 6,
  border: "none",
  background: "#f97316",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
};

const linkBtn = {
  marginTop: 10,
  background: "none",
  border: "none",
  color: "#60a5fa",
  cursor: "pointer",
};
