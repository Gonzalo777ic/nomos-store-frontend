import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShoppingCart, LogIn, LogOut, PackageSearch } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const totalItems = useCartStore((s) => s.totalItems());
  const isAuthed = useAuthStore((s) => s.isAuthenticated());
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <span className="inline-block h-6 w-6 rounded bg-brand" />
          <span>Nomos <span className="text-brand">Store</span></span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <NavLink to="/" className={({isActive})=> isActive?"text-brand font-semibold":"text-gray-600 hover:text-gray-900"}>Inicio</NavLink>
          <NavLink to="/products" className={({isActive})=> isActive?"text-brand font-semibold":"text-gray-600 hover:text-gray-900"}>Productos</NavLink>
          {isAuthed && (
            <NavLink to="/orders" className={({isActive})=> isActive?"text-brand font-semibold":"text-gray-600 hover:text-gray-900"}>Mis pedidos</NavLink>
          )}
        </nav>
        <div className="flex items-center gap-2">
          {!isAuthed ? (
            <Button variant="ghost" size="sm" onClick={()=>navigate('/login')} className="text-gray-700"><LogIn className="mr-2"/>Entrar</Button>
          ) : (
            <Button variant="ghost" size="sm" onClick={logout} className="text-gray-700"><LogOut className="mr-2"/>Salir</Button>
          )}
          <Button asChild variant="default" size="sm" className="relative bg-brand hover:bg-brand/90">
            <Link to="/cart" aria-label="Carrito">
              <ShoppingCart />
              <span>Carrito</span>
              {totalItems > 0 && (
                <span className="absolute -right-2 -top-2 rounded-full bg-red-500 text-white text-[10px] px-1.5 py-0.5">{totalItems}</span>
              )}
            </Link>
          </Button>
        </div>
      </div>
      <div className="md:hidden border-t px-4 py-2 flex gap-4 text-sm">
        <Link to="/products" className="flex items-center gap-2 text-gray-700"><PackageSearch className="h-4 w-4"/> Explorar</Link>
      </div>
    </header>
  );
}
