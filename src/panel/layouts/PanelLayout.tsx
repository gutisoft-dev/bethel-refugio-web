import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";

export const PanelLayout = () => {
  return (
    <div  className="min-h-screen bg-background">
     <header>
        <Navbar />
     </header>
      <main>
        <div className="container  mx-auto p-3">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
