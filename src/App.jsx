import { Routes, Route } from "react-router-dom";
import { useContext, useEffect } from "react";

// 🔥 Toast
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// 🔥 Auth
import { AuthContext } from "./Context/AuthContext";

import WhatsAppButton from "./components/WhatsAppButton";

// Páginas
import Home from "./Pages/Home";
import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";
import Products from "./Pages/Products";
import ProductDetail from "./Pages/ProductDetail";
import Cart from "./Pages/Cart";
import Checkout from "./pages/Checkout";
import Promotions from "./pages/Promotions";
import Profile from "./pages/Profile";
import Login from "./Pages/Login";
import PagoExitoso from "./Pages/Pago-exitoso";
import Register from "./Pages/Register";
import NotFound from "./Pages/NotFound";
import NoAutorizado from "./pages/NoAutorizado";

// Admin
import AdminProducts from "./Pages/AdminProducts";
import AdminDashboard from "./Pages/AdminDashboard";
import AdminUsers from "./Pages/AdminUsers";
import AdminOrders from "./Pages/AdminOrders";
import AdminPromotions from "./Pages/AdminPromotions";
import AdminCoupons from "./Pages/AdminCoupons";
import AdminBanners from "./Pages/AdminBanners";
import AdminProductForm from "./Pages/AdminProductForm";

// Banner system
import BannerManager from "./Components/ComponentsBanners/BannerManager";

// ProtectedRoute
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./Components/AdminLayauts";
import ComoComprar from "./Pages/ComoComprar";

// --- Layout para páginas públicas ---
function PublicLayout({ children, page, positions = ["top", "bottom"] }) {
  return (
    <>
      {positions.includes("top") && (
        <BannerManager page={page} position="top" />
      )}
      {children}
      {positions.includes("bottom") && (
        <BannerManager page={page} position="bottom" />
      )}
    </>
  );
}

export default function App() {
  const { message, setMessage } = useContext(AuthContext);

  // 🔥 EFECTO GLOBAL DE NOTIFICACIONES
  useEffect(() => {
    if (!message) return;

    const config = {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false, // barra animada abajo
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    };

    switch (message.type) {
      case "success":
        toast.success(message.text, config);
        break;
      case "error":
        toast.error(message.text, config);
        break;
      case "waiting":
        toast.loading(message.text, config);
        break;
      default:
        toast(message.text, config);
    }

    // 🔥 limpiar mensaje para evitar repetición
    setMessage(null);
  }, [message, setMessage]);

  return (
    <>
      {/* Contenido principal */}
      <main style={{ marginTop: 0 }}>
        <Routes>
          {/* HOME */}
          <Route
            path="/"
            element={
              <PublicLayout page="home" positions={["top", "bottom"]}>
                <Home />
              </PublicLayout>
            }
          />

          {/* PRODUCTS */}
          <Route
            path="/products"
            element={
              <PublicLayout page="products" positions={["top", "bottom"]}>
                <Products />
              </PublicLayout>
            }
          />

          {/* PRODUCT DETAIL */}
          <Route
            path="/products/:id"
            element={
              <PublicLayout page="product-detail" positions={["top", "bottom"]}>
                <ProductDetail />
              </PublicLayout>
            }
          />

          {/* CART */}
          <Route
            path="/cart"
            element={
              <PublicLayout page="cart" positions={["top", "bottom"]}>
                <Cart />
              </PublicLayout>
            }
          />

          {/* REGISTER */}
          <Route
            path="/register"
            element={
              <PublicLayout page="register" positions={["top", "bottom"]}>
                <Register />
              </PublicLayout>
            }
          />

          {/* CHECKOUT */}
          <Route
            path="/checkout"
            element={
              <PublicLayout page="checkout" positions={["top"]}>
                <Checkout />
              </PublicLayout>
            }
          />

          {/* PROMOTIONS */}
          <Route
            path="/promotions"
            element={
              <PublicLayout page="promotions" positions={["top", "bottom"]}>
                <Promotions />
              </PublicLayout>
            }
          />

          {/* COMO COMPRAR */}
          <Route
            path="/Comprar"
            element={
              <PublicLayout page="promotions" positions={["top", "bottom"]}>
                <ComoComprar />
              </PublicLayout>
            }
          />

          {/* ForgotPassword */}
          <Route
            path="/forgot"
            element={
              <PublicLayout page="products" positions={["top", "bottom"]}>
                <ForgotPassword />
              </PublicLayout>
            }
          />

          {/* ResetPassword */}
          <Route
            path="/reset-password/:token"
            element={
              <PublicLayout page="products" positions={["top", "bottom"]}>
                <ResetPassword />
              </PublicLayout>
            }
          />

          {/* PROFILE */}
          <Route
            path="/profile"
            element={
              <PublicLayout page="profile" positions={["top", "bottom"]}>
                <Profile />
              </PublicLayout>
            }
          />

          {/* LOGIN */}
          <Route
            path="/login"
            element={
              <PublicLayout page="login" positions={["top"]}>
                <Login />
              </PublicLayout>
            }
          />

          {/* PAGO EXITOSO */}
          <Route
            path="/pago-exitoso"
            element={
              <PublicLayout page="pago-exitoso" positions={["top"]}>
                <PagoExitoso />
              </PublicLayout>
            }
          />

          {/* NOT FOUND */}
          <Route path="*" element={<NotFound />} />
          <Route path="/category/:id" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />

          {/* --- ADMIN --- */}
          <Route path="/no-autorizado" element={<NoAutorizado />} />

          <Route
            path="/admin/*"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="banners" element={<AdminBanners />} />
            <Route path="Datos" element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="promotions" element={<AdminPromotions />} />
            <Route path="coupons" element={<AdminCoupons />} />
            <Route path="AdminUsers" element={<AdminUsers />} />
            <Route path="products/new" element={<AdminProductForm />} />
            <Route path="products/:id" element={<AdminProductForm />} />
            <Route index element={<div>Bienvenido al Panel Admin...</div>} />
          </Route>
        </Routes>
      </main>

      <WhatsAppButton />

      {/* 🔥 TOAST CONTAINER GLOBAL */}
      <ToastContainer newestOnTop />
    </>
  );
}
