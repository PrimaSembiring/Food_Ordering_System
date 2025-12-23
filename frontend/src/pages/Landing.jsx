import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken, getRole } from "../utils/auth";
import AuthModal from "../components/AuthModal";
import NavbarPublic from "../components/NavbarPublic";
import hero from "../assets/hero-food.jpeg";

export default function Landing() {
  const navigate = useNavigate();
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    const token = getToken();
    const role = getRole();

    if (token && role === "customer") {
      navigate("/menu", { replace: true });
    }

    if (token && role === "owner") {
      navigate("/owner/orders", { replace: true });
    }
  }, [navigate]);

  return (
    <>
      {/* NAVBAR */}
      <NavbarPublic onLogin={() => setAuthOpen(true)} />

      {/* HERO */}
      <div
        style={{
          height: "85vh",
          backgroundImage: `url(${hero})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          marginTop: 64,
        }}
      >
        {/* OVERLAY */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
          }}
        />

        {/* CONTENT */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
            textAlign: "center",
            padding: 20,
          }}
        >
          <h1 style={{ fontSize: 48, marginBottom: 12 }}>🍔 FoodHub</h1>
          <p style={{ color: "#ddd" }}>
            Pesan makanan favoritmu dengan mudah
          </p>
        </div>
      </div>

      {/* AUTH MODAL */}
      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={(path) => navigate(path)}
      />
    </>
  );
}
