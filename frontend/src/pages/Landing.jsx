import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getToken, getRole } from "../utils/auth";

export default function Landing() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    const role = getRole();

    // ✅ SUDAH LOGIN → LANGSUNG KE MENU
    if (token && role === "customer") {
      navigate("/menu", { replace: true });
    }
  }, [navigate]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f0f0f",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "48px", marginBottom: "16px" }}>
          🍔 FoodHub
        </h1>
        <p style={{ color: "#aaa", marginBottom: "32px" }}>
          Pesan makanan favoritmu dengan mudah
        </p>

        <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
          <button
            onClick={() => navigate("/login")}
            style={{
              padding: "12px 24px",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            Login
          </button>

          <button
            onClick={() => navigate("/register")}
            style={{
              padding: "12px 24px",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
