export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="container mx-auto px-4 py-10 text-center text-sm text-gray-500">
        <p>
          © {new Date().getFullYear()} Nomos Store. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
