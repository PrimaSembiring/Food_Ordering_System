import { isAuthenticated, clearAuth } from "../utils/auth";

export default function NavbarPublic({ onLogin }) {
  const auth = isAuthenticated();

  return (
    <nav style={nav}>
      <span>🍔 FoodHub</span>

      {auth ? (
        <button
          onClick={() => {
            clearAuth();
            window.location.reload();
          }}
        >
          Logout
        </button>
      ) : (
        <button onClick={onLogin}>Login / Register</button>
      )}
    </nav>
  );
}

const nav = {
  display: "flex",
  justifyContent: "space-between",
  padding: 16,
  background: "white",
};
