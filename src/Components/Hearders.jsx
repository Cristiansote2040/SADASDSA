import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import { CartContext } from "../Context/Cartcontext.jsx";
import { FiShoppingCart, FiSearch, FiX } from "react-icons/fi";
import "../Styles/Components/Headers.css";

export default function Header() {
  const { user, logout } = useContext(AuthContext) || {};
  const { cart } = useContext(CartContext) || {};

  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      const trimmed = search.trim();

      const params = new URLSearchParams();

      if (trimmed) {
        params.set("search", trimmed);
      }

      params.set("page", "1"); // 🔥 CLAVE

      navigate(`/products?${params.toString()}`);

      setSearch("");
      setSearchOpen(false);
      setMobileOpen(false);
    }
  };

  return (
    <>
      <header className={`header ${scrolled ? "scrolled" : ""}`}>
        {/* LEFT */}
        <div className="left">
          <img src="https://cdn-icons-png.flaticon.com/512/5987/5987097.png" alt="logo" />
          <Link to="/">Pique Picante</Link>
        </div>

        {/* CENTER desktop */}
        <nav className="center">
          <Link to="/products">Productos</Link>
          <Link to="/promotions">Promociones</Link>
        </nav>

        {/* RIGHT desktop */}
        <div className="right">
          <div className="search-desktop">
            <input
              type="text"
              placeholder="Buscar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearch}
            />
            <button onClick={() => setSearchOpen(true)}>
              <FiSearch />
            </button>
          </div>

          {user ? (
            <>
              <Link to="/profile">{user.name}</Link>
              {user?.role === "admin" && (
                <Link to="/admin/" className="admin-btn">
                  Panel de Admin
                </Link>
              )}
              <button className="btn-logout" onClick={logout}>
                Salir
              </button>
            </>
          ) : (
            <Link to="/register" className="btn-register">
              Cuenta
            </Link>
          )}

          <Link to="/cart" className="cart">
            <FiShoppingCart />
            {cart?.length > 0 && (
              <span className="cart-badge">{cart.length}</span>
            )}
          </Link>
        </div>

        {/* HAMBURGUESA mobile */}
        <div
          className={`menu-icon ${mobileOpen ? "open" : ""}`}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </header>

      {/* SEARCH FULLSCREEN MOBILE */}
      {searchOpen && (
        <div className="search-overlay">
          <div className="search-box">
            <button
              className="close-search"
              onClick={() => setSearchOpen(false)}
            >
              <FiX size={24} />
            </button>
            <input
              type="text"
              autoFocus
              placeholder="Buscar productos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>
        </div>
      )}

      {/* MOBILE MENU overlay */}
      {mobileOpen && (
        <>
          <div className="overlay" onClick={() => setMobileOpen(false)} />
          <div className="mobile-menu">
            <Link to="/products" onClick={() => setMobileOpen(false)}>
              Productos
            </Link>
            <Link to="/promotions" onClick={() => setMobileOpen(false)}>
              Promociones
            </Link>
            <div className="mobile-search">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleSearch}
              />
            </div>
            {user ? (
              <>
                <Link to="/profile" onClick={() => setMobileOpen(false)}>
                  {user.name}
                </Link>
                {user?.role === "admin" && (
                  <Link to="/admin/products" className="admin-btn">
                    Panel de Admin
                  </Link>
                )}
                <button onClick={logout}>Salir</button>
              </>
            ) : (
              <Link to="/register" onClick={() => setMobileOpen(false)}>
                Cuenta
              </Link>
            )}
            <Link
              to="/cart"
              className="cart"
              onClick={() => setMobileOpen(false)}
            >
              <FiShoppingCart />
              {cart?.length > 0 && (
                <span className="cart-badge">{cart.length}</span>
              )}
            </Link>
          </div>
        </>
      )}
    </>
  );
}
