import { Outlet } from "react-router-dom";

export const AuthLayout = () => {
  return (
    <div className="min-h-screen
    bg-background
    relative

    flex
    items-stretch
    justify-stretch

    md:items-center
    md:justify-center
    md:p-4">
      <Outlet />
    </div>
  );
};
