import { Navigate } from "react-router-dom";

import { useAuth } from "@/hooks/useAuth";


function FallbackLoader() {
  return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-gray-500">Verificando autenticación...</p>
    </div>
  );
}

export default function ProtectedRoute({ children }: { children: JSX.Element }) {

  const { isAuthenticated, isLoading } = useAuth();






  if (isLoading) {
    return <FallbackLoader />;
  }


  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }


  return children;
}
