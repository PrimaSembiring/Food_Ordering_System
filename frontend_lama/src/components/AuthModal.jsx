import React, { useState } from "react";
import { login, register } from "../services/auth";

const AuthModal = ({ show, onClose, onAuth }) => {
  const [mode, setMode] = useState("login"); // login | register
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!show) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "register") {
        // ✅ REGISTER: TIDAK EXPECT TOKEN
        await register(
          form.name,
          form.email,
          form.password,
          form.role
        );

        alert("Register berhasil. Silakan login.");
        setMode("login"); // ⬅️ BALIK KE LOGIN
        setForm({
          name: "",
          email: "",
          password: "",
          role: "customer",
        });
      } else {
        // ✅ LOGIN: BARU DAPET TOKEN
        const data = await login(form.email, form.password);
        onAuth(data);
      }
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          "Auth failed. Periksa email & password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl p-6 w-full max-w-md space-y-4"
      >
        <h2 className="text-xl font-bold">
          {mode === "login" ? "Login" : "Register"}
        </h2>

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        {mode === "register" && (
          <>
            <input
              name="name"
              placeholder="Name"
              className="w-full border p-2 rounded"
              value={form.name}
              onChange={handleChange}
              required
            />

            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="customer">Customer</option>
              <option value="owner">Owner</option>
            </select>
          </>
        )}

        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 text-white py-2 rounded"
        >
          {loading
            ? "Processing..."
            : mode === "login"
            ? "Login"
            : "Register"}
        </button>

        <p className="text-sm text-center">
          {mode === "login" ? (
            <>
              Belum punya akun?{" "}
              <button
                type="button"
                className="text-orange-500"
                onClick={() => setMode("register")}
              >
                Register
              </button>
            </>
          ) : (
            <>
              Sudah punya akun?{" "}
              <button
                type="button"
                className="text-orange-500"
                onClick={() => setMode("login")}
              >
                Login
              </button>
            </>
          )}
        </p>
      </form>
    </div>
  );
};

export default AuthModal;
