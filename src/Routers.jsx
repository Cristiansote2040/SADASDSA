// routes.jsx
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./Pages/Cart";
import Checkout from "./pages/Checkout";
import Promotions from "./pages/Promotions";
import Profile from "./pages/Profile";

// Admin
import AdminProducts from "./pages/Admin/ProductsAdmin";
import AdminOrders from "./pages/Admin/OrdersAdmin";
import AdminPromotions from "./pages/Admin/PromotionsAdmin";
import AdminCoupons from "./pages/Admin/CouponsAdmin";

export const publicRoutes = [
  { path: "/", element: <Home /> },
  { path: "/products", element: <Products /> },
  { path: "/products/:id", element: <ProductDetail /> },
  { path: "/cart", element: <Cart /> },
  { path: "/checkout", element: <Checkout /> },
  { path: "/promotions", element: <Promotions /> },
  { path: "/profile", element: <Profile /> },
];

export const adminRoutes = [
  { path: "/admin/products", element: <AdminProducts /> },
  { path: "/admin/orders", element: <AdminOrders /> },
  { path: "/admin/promotions", element: <AdminPromotions /> },
  { path: "/admin/coupons", element: <AdminCoupons /> },
];