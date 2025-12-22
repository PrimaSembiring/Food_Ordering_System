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
      onSuccess();
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
    /* 🔥 FIX UTAMA ADA DI SINI */
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999]"
      onClick={onClose}
    >
      {/* STOP PROPAGATION BIAR MODAL BISA DIKLIK */}
      <div
        className="bg-zinc-900 p-6 rounded w-80 text-white relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-3 text-white text-xl"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-xl mb-4 capitalize">
          {mode === "login" ? "Login" : "Register"}
        </h2>

        {mode === "register" && (
          <input
            className="w-full mb-2 p-2 bg-zinc-800 rounded"
            placeholder="Nama"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}

        <input
          className="w-full mb-2 p-2 bg-zinc-800 rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full mb-3 p-2 bg-zinc-800 rounded"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-500 mb-2">{error}</p>}

        {mode === "login" ? (
          <>
            <button
              className="w-full bg-white text-black p-2 rounded"
              onClick={handleLogin}
            >
              Login
            </button>

            {/* 🔥 GANTI TEXT JADI BUTTON */}
            <button
              type="button"
              className="mt-3 text-sm text-blue-400 underline w-full"
              onClick={() => setMode("register")}
            >
              Belum punya akun? Register
            </button>
          </>
        ) : (
          <>
            <button
              className="w-full bg-white text-black p-2 rounded"
              onClick={handleRegister}
            >
              Register
            </button>

            <button
              type="button"
              className="mt-3 text-sm text-blue-400 underline w-full"
              onClick={() => setMode("login")}
            >
              Sudah punya akun? Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}
