import { useEffect, useState } from "react";
import api from "../../utils/api";

export default function OwnerMenu() {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    price: "",
  });

  // =====================
  // FETCH MENU
  // =====================
  const fetchMenu = async () => {
    try {
      const res = await api.get("/owner/menu");
      setMenus(res.data);
    } catch (err) {
      alert("Gagal mengambil menu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  // =====================
  // ADD MENU
  // =====================
  const addMenu = async (e) => {
    e.preventDefault();

    try {
      await api.post("/owner/menu", {
        name: form.name,
        category: form.category,
        price: Number(form.price),
      });

      setForm({ name: "", category: "", price: "" });
      fetchMenu();
    } catch (err) {
      alert(err.response?.data?.error || "Gagal menambah menu");
    }
  };

  // =====================
  // TOGGLE ACTIVE (SOFT DELETE)
  // =====================
  const toggleMenu = async (menu) => {
    try {
      await api.put(`/owner/menu/${menu.id}`, {
        available: !menu.available,
      });
      fetchMenu();
    } catch {
      alert("Gagal update status menu");
    }
  };

  // =====================
  // SAVE EDIT
  // =====================
  const saveEdit = async (id) => {
    try {
      await api.put(`/owner/menu/${id}`, {
        name: editForm.name,
        price: Number(editForm.price),
      });
      setEditingId(null);
      fetchMenu();
    } catch {
      alert("Gagal edit menu");
    }
  };

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;

  return (
    <div style={{ padding: 30, maxWidth: 900, margin: "auto" }}>
      <h1 style={{ marginBottom: 20 }}>🍽️ Manajemen Menu</h1>

      {/* ================= FORM ADD MENU ================= */}
      <form
        onSubmit={addMenu}
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 30,
          flexWrap: "wrap",
        }}
      >
        <input
          placeholder="Nama menu"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          placeholder="Kategori"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Harga"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          required
        />
        <button type="submit" style={btnPrimary}>
          Tambah Menu
        </button>
      </form>

      {/* ================= LIST MENU ================= */}
      {menus.length === 0 && <p>Belum ada menu</p>}

      {menus.map((menu) => (
        <div
          key={menu.id}
          style={{
            border: "1px solid #ddd",
            borderRadius: 10,
            padding: 16,
            marginBottom: 12,
            background: "#fff",
            opacity: menu.available ? 1 : 0.5,
            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
          }}
        >
          {editingId === menu.id ? (
            <>
              <input
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
              />
              <input
                type="number"
                value={editForm.price}
                onChange={(e) =>
                  setEditForm({ ...editForm, price: e.target.value })
                }
              />
              <button
                onClick={() => saveEdit(menu.id)}
                style={btnPrimary}
              >
                Simpan
              </button>
              <button
                onClick={() => setEditingId(null)}
                style={btn}
              >
                Batal
              </button>
            </>
          ) : (
            <>
              <h3>{menu.name}</h3>
              <p>Kategori: {menu.category}</p>
              <p>Harga: Rp {menu.price}</p>
              <p>
                Status:{" "}
                <b style={{ color: menu.available ? "green" : "red" }}>
                  {menu.available ? "Aktif" : "Nonaktif"}
                </b>
              </p>

              <div style={{ marginTop: 10 }}>
                <button
                  onClick={() => toggleMenu(menu)}
                  style={menu.available ? btnDanger : btnPrimary}
                >
                  {menu.available ? "Nonaktifkan" : "Aktifkan"}
                </button>

                <button
                  onClick={() => {
                    setEditingId(menu.id);
                    setEditForm({
                      name: menu.name,
                      price: menu.price,
                    });
                  }}
                  style={{ ...btn, marginLeft: 8 }}
                >
                  Edit
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

/* ================= STYLES ================= */

const btn = {
  padding: "8px 14px",
  borderRadius: 6,
  border: "1px solid #ccc",
  background: "#f9f9f9",
  cursor: "pointer",
};

const btnPrimary = {
  ...btn,
  background: "#f97316",
  color: "white",
  border: "none",
  fontWeight: "bold",
};

const btnDanger = {
  ...btn,
  background: "#dc2626",
  color: "white",
  border: "none",
};
