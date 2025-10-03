import "./global.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
// Importar Auth0Provider
import { Auth0Provider } from '@auth0/auth0-react';
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Orders from "./pages/Orders";
import ProductDetail from "./pages/ProductDetail";
import Products from "./pages/Products";
import Register from "./pages/Register";

const queryClient = new QueryClient();

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}

// Renombramos la lógica de enrutamiento a AppContent
const AppContent = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  </QueryClientProvider>
);

// NUEVA FUNCIÓN APP para envolver y renderizar
const App = () => {
  // Configuración de Auth0
  const auth0Domain = "dev-663twfpev8syoqq5.us.auth0.com";
  const auth0ClientId = "UAn2A8nk0ZMwYrHt1JtvlXGRh7IBU8G5";
  const auth0Audience = "https://nomos.inventory.api"; // Identificador de tu API Backend

  return (
    <Auth0Provider
      domain={auth0Domain}
      clientId={auth0ClientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: auth0Audience,
      }}
      // ✅ Solución 1: Asegura la cache en localstorage.
      cacheLocation="localstorage"
    >
      <AppContent />
    </Auth0Provider>
  );
};


// Llamada a render ahora usa el nuevo componente App
createRoot(document.getElementById("root")!).render(<App />);
