// src/Components/AdminLayout.jsx
import { Link, Outlet } from "react-router-dom";
import { useState } from "react";
import "../Styles/AdminLayout.css";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="admin-container">
      {/* BOTÓN MÓVIL */}
      <button
        className="mobile-sidebar-toggle"
        onClick={toggleSidebar}
      >
        {sidebarOpen ? "Cerrar" : "Menú"}
      </button>

      {/* SIDEBAR */}
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <h2>Panel Admin</h2>
        <nav>
          <ul>
            <li><Link to="/admin/Datos" onClick={closeSidebar}>Estadísticas</Link></li>
            <li><Link to="/admin/banners" onClick={closeSidebar}>Banners</Link></li>
            <li><Link to="/admin/products" onClick={closeSidebar}>Productos</Link></li>
            <li><Link to="/admin/orders" onClick={closeSidebar}>Órdenes</Link></li>
            <li><Link to="/admin/promotions" onClick={closeSidebar}>Promociones</Link></li>
            <li><Link to="/admin/coupons" onClick={closeSidebar}>Cupones</Link></li>
            <li><Link to="/admin/AdminUsers" onClick={closeSidebar}>Usuarios</Link></li>
          </ul>
        </nav>
      </aside>

      {/* OVERLAY */}
      {sidebarOpen && <div className="overlay" onClick={closeSidebar}></div>}

      {/* CONTENIDO */}
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}