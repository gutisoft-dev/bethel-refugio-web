import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "../components/Navbar";

export const PanelLayout = () => {
  const { pathname } = useLocation();
  const isHistoryPage = pathname === "/history";

  return (
    <div
      className={
        
        isHistoryPage
          ? "flex h-dvh min-h-0 flex-col overflow-hidden bg-slate-50"
          : "min-h-screen"
      }
    >
      <header className={isHistoryPage ? "shrink-0" : undefined}>
        <Navbar />
      </header>
      <main
        className={
          isHistoryPage
            ? "flex min-h-0 flex-1 flex-col overflow-hidden bg-slate-50"
            : undefined
        }
      >
        <div
          className={
            isHistoryPage
              ? "h-full min-h-0 w-full overflow-hidden"
              : "container mx-auto"
          }
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
};
