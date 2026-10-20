import { Link, useLocation } from "react-router-dom";
import { links } from "../helpers/ItemNavbar";
import { AvatarContent } from "./Avatar";
import { Close } from "@/icons/Close";


interface Props {
  isSidebarOpen: boolean;
  handelCloseSidebar: () => void;
}
export const SidebarContent = ({ isSidebarOpen, handelCloseSidebar }: Props) => {
  const { pathname } = useLocation();

  return (
    <>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 sm:hidden"
          onClick={() => handelCloseSidebar()}
        />
      )}

      <aside
        className={`fixed right-0 top-0 z-50 h-full w-72 transform bg-white shadow-xl transition-transform duration-300 sm:hidden ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex min-h-14 items-center justify-between border-b px-5">
            <span className="font-semibold tracking-[-0.04em] text-[#6800b8]">
              Biblia Social
            </span>

            <button
              type="button"
              onClick={() => handelCloseSidebar()}
              className="rounded-md p-2 text-[#241d2b] hover:bg-purple-50 hover:text-[#6800b8]"
              aria-label="Cerrar menú"
            >
           <Close />
            </button>
          </div>

          <div className="flex flex-col gap-1 p-4">
            {links.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href === "/feed" && pathname === "/");

              return (
                <Link
                  key={link.href}
                  to={link.href}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => handelCloseSidebar()}
                  className={`rounded-lg px-4 py-3 font-medium transition-colors ${
                    isActive
                      ? "bg-purple-50 text-[#6800b8]"
                      : "text-[#241d2b] hover:bg-purple-50 hover:text-[#6800b8]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Logout */}
          <div className="mt-auto border-t p-4">
             <AvatarContent/>
          </div>
        </div>
      </aside>
    </>
  );
};
