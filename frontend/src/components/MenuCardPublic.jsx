export default function MenuCardPublic({ menu, isAuth, onLogin }) {
  return (
    <div style={card}>
      <h3>{menu.name}</h3>
      <p>Rp {menu.price}</p>

      {isAuth ? (
        <button>Tambah ke Keranjang</button>
      ) : (
        <button onClick={onLogin}>Login untuk memesan</button>
      )}
    </div>
  );
}

const card = {
  background: "white",
  padding: 16,
  borderRadius: 10,
};
