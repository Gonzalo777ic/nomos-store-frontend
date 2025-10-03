import { Navigate } from "react-router-dom";
// ELIMINAMOS: import { useAuthStore } from "@/store/auth";
import { useAuth } from "@/hooks/useAuth"; // ✅ NUEVA IMPORTACIÓN

// Asumimos que tienes un componente Loader o un fallback simple.
function FallbackLoader() {
  return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-gray-500">Verificando autenticación...</p>
    </div>
  );
}

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  // ✅ Obtenemos el estado de autenticación y carga directamente de useAuth (Auth0)
  const { isAuthenticated, isLoading } = useAuth();

  // El código de Zustand era:
  // const isAuthed = useAuthStore((s) => s.isAuthenticated());
  // if (!isAuthed()) return <Navigate to="/login" replace />;

  // 1. Si está cargando (Auth0 está verificando el token), mostramos el loader.
  if (isLoading) {
    return <FallbackLoader />;
  }

  // 2. Si no está autenticado (y ya terminó de cargar), redirigimos.
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 3. Si está autenticado, renderizamos los hijos.
  return children;
}
