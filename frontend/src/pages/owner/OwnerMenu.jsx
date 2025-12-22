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
  // TOGGLE ACTIVE
  // =====================
  const toggleMenu = async (menu) => {
    try {
      await api.put(`/owner/menu/${menu.id}`, {
        available: !menu.available,
      });
      fetchMenu();
    } catch {
      alert("Gagal update menu");
    }
  };

  // =====================
  // DELETE MENU
  // =====================
  const deleteMenu = async (id) => {
    if (!window.confirm("Yakin hapus menu?")) return;

    try {
      await api.delete(`/owner/menu/${id}`);
      fetchMenu();
    } catch (err) {
      alert(
        err.response?.data?.error ||
          "Menu tidak bisa dihapus (sudah pernah dipesan)"
      );
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

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: 800, margin: "auto" }}>
      <h1>Menu Owner</h1>

      {/* FORM ADD MENU */}
      <form onSubmit={addMenu} style={{ marginBottom: 30 }}>
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
        <button type="submit">Tambah Menu</button>
      </form>

      {/* LIST MENU */}
      {menus.map((menu) => (
        <div
          key={menu.id}
          style={{
            border: "1px solid #444",
            padding: 15,
            marginBottom: 10,
            opacity: menu.available ? 1 : 0.5,
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
              <button onClick={() => saveEdit(menu.id)}>Simpan</button>
              <button onClick={() => setEditingId(null)}>Batal</button>
            </>
          ) : (
            <>
              <h3>{menu.name}</h3>
              <p>Kategori: {menu.category}</p>
              <p>Harga: Rp {menu.price}</p>
              <p>Status: {menu.available ? "Aktif" : "Nonaktif"}</p>

              <button onClick={() => toggleMenu(menu)}>
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
                style={{ marginLeft: 10 }}
              >
                Edit
              </button>

              <button
                onClick={() => deleteMenu(menu.id)}
                style={{ marginLeft: 10, color: "red" }}
              >
                Hapus
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
