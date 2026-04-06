import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext";
import { CartProvider } from "./Context/CartContext";
import Header from "./Components/Hearders";
import Footer from "./components/Footer";
import { SocketProvider } from "./Context/SocketContext";
import "../src/App.css"; // tu CSS global
import ErrorBoundary from "./Components/ErrorBoundary";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <SocketProvider>
          <BrowserRouter>
            <Header />
            <ErrorBoundary>
              <App />
            </ErrorBoundary>
            <Footer />
          </BrowserRouter>
        </SocketProvider>
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>,
);
