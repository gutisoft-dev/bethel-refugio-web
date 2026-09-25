import { useAuthStore } from "@/auth/store/auth.store";
import { Link, useLocation } from "react-router-dom";

const links = [
  { href: "/", label: "Historias y Feed" },
  { href: "/biblia", label: "Buscar" },
];

export const Navbar = () => {
  const { pathname } = useLocation();
  const { logout } = useAuthStore();
  return (
    <header className="border-b border-[#eeeeee] bg-white">
      <nav
        aria-label="Navegación principal"
        className="mx-auto flex min-h-[56px] items-stretch justify-between px-2 sm:px-8"
      >
        <Link
          to="/"
          className="flex shrink-0 items-center  font-semibold tracking-[-0.04em] text-[#6800b8]"
        >
          Biblia Social
        </Link>
        <div className="flex items-stretch gap-1 sm:gap-7">
          {links.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href === "/feed" && pathname === "/");
            return (
              <Link
                key={link.href}
                to={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`relative flex items-center px-2  font-medium transition-colors sm:px-3 ${
                  isActive
                    ? "text-[#6800b8]"
                    : "text-[#241d2b] hover:text-[#6800b8]"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute inset-x-0 bottom-0 h-[2px] bg-[#8500db]" />
                )}
              </Link>
            );
          })}
        </div>
        <div className="flex items-stretch gap-1 sm:gap-7">
          <button
            onClick={logout}
            className="flex items-center  font-medium text-[#241d2b] hover:text-[#6800b8]"
          >
            Cerrar sesión
          </button>
        </div>
      </nav>
    </header>
  );
};
