import { useAuthStore } from "@/store/auth";
import { validateEmail } from "@/utils/format";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) return alert("Email inválido");
    await login(email, password);
    navigate("/");
  };

  return (
    <main className="container mx-auto max-w-md px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold">Iniciar sesión</h1>
      <form onSubmit={onSubmit} className="space-y-4 rounded-md border bg-white p-6">
        <div className="grid gap-2">
          <label className="text-sm">Email</label>
          <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required className="rounded-md border px-4 py-2" />
        </div>
        <div className="grid gap-2">
          <label className="text-sm">Contraseña</label>
          <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required className="rounded-md border px-4 py-2" />
        </div>
        <button type="submit" className="w-full rounded-md bg-brand px-4 py-2 font-medium text-white hover:bg-brand/90">Entrar</button>
        <p className="text-center text-sm text-gray-600">¿No tienes cuenta? <Link to="/register" className="text-brand hover:underline">Regístrate</Link></p>
      </form>
    </main>
  );
}
