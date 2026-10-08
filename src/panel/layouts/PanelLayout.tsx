import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "../components/Navbar";

export const PanelLayout = () => {
  const { pathname } = useLocation();
  const isHomePage = pathname === "/";

  return (
    <div
      className={
        isHomePage
          ? "flex h-dvh flex-col overflow-hidden bg-slate-50"
          : "min-h-screen bg-background"
      }
    >
      <header className={isHomePage ? "shrink-0" : undefined}>
        <Navbar />
      </header>
      <main
        className={
          isHomePage ? "flex min-h-0 flex-1 flex-col overflow-hidden" : undefined
        }
      >
        <div
          className={
            isHomePage
              ? "h-full min-h-0 w-full overflow-hidden"
              : "container mx-auto p-3"
          }
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
};
