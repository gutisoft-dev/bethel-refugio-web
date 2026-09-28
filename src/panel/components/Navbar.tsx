import { AvatarContent } from "@/auth/components/Avatar";
import { SidebarContent } from "@/auth/components/Sidebar";
import { links } from "@/auth/helpers/ItemNavbar";
import { Close } from "@/icons/Close";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export const Navbar = () => {
  const { pathname } = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handelCloseSidebar = () => setIsSidebarOpen(false);
  return (
    <header className="border-b border-[#eeeeee] bg-white">
      <nav
        aria-label="Navegación principal"
        className="mx-auto flex min-h-14 items-stretch justify-between px-2 sm:px-8"
      >
        <Link
          to="/"
          className="flex shrink-0 items-center font-semibold tracking-[-0.04em] text-[#6800b8]"
        >
          Biblia Social
        </Link>
        <div className="hidden items-stretch gap-1 sm:flex sm:gap-7">
          {links.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href === "/feed" && pathname === "/");

            return (
              <Link
                key={link.href}
                to={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`relative flex items-center px-2 font-medium transition-colors sm:px-3 ${
                  isActive
                    ? "text-[#6800b8]"
                    : "text-[#241d2b] hover:text-[#6800b8]"
                }`}
              >
                {link.label}

                {isActive && (
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#8500db]" />
                )}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-stretch gap-1 sm:flex sm:gap-7 ">
        <AvatarContent/>
        </div>

        <button
          type="button"
          onClick={() => setIsSidebarOpen(true)}
          className="flex items-center justify-center rounded-md p-2 text-[#241d2b] hover:bg-purple-50 hover:text-[#6800b8] sm:hidden"
          aria-label="Abrir menú"
        >
          <Close/>
        </button>
      </nav>
      <SidebarContent
        isSidebarOpen={isSidebarOpen}
        handelCloseSidebar={handelCloseSidebar}
      />
    </header>
  );
};
