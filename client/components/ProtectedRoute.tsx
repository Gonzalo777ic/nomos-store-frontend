import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const isAuthed = useAuthStore((s) => s.isAuthenticated());
  if (!isAuthed()) return <Navigate to="/login" replace />;
  return children;
}
