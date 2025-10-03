import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
// Se asume que useAuthStore y el login local ya no se usan en este archivo.

export default function Login() {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);


  const handleLogin = () => {
    // Inicia el flujo de Auth0 (redirección al dominio de Auth0)
    loginWithRedirect();
  };

  if (isLoading) {
    return (
      <main className="container mx-auto max-w-md px-4 py-10">
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-500 font-medium">Cargando la configuración de autenticación...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto max-w-md px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold">Iniciar sesión</h1>
      <div className="space-y-4 rounded-md border bg-white p-6">
        <p className="text-center text-gray-700">Utiliza tu cuenta de Nomos para continuar.</p>
        <button
          onClick={handleLogin}
          type="button"
          className="w-full rounded-md bg-indigo-600 px-4 py-3 font-medium text-white hover:bg-indigo-700 transition duration-150 shadow-md"
        >
          Iniciar Sesión con Auth0
        </button>
        <p className="text-center text-sm text-gray-600">
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="text-indigo-600 hover:underline">
            Regístrate
          </Link>
        </p>
      </div>
    </main>
  );
}
