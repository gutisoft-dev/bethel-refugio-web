import { AuthLayout } from "@/auth/layout/AuthLayout";
import { Login } from "@/auth/pages/Login";
import { PanelLayout } from "@/panel/layouts/PanelLayout";
import { Biblia } from "@/panel/pages/Biblia";
import { Home } from "@/panel/pages/Home";
import { Profile } from "@/panel/pages/Profile";
import { createBrowserRouter, Navigate } from "react-router-dom";

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <PanelLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
    ],
  },
  {
    path: "/profile",
    element: (
      // <AuthenticatedRoute>
      <PanelLayout />
    ),
    children: [
      {
        index: true,
        element: <Profile />,
      },
    ],
  },
  {
    path: "/biblia",
    element: (
      // <AuthenticatedRoute>
      <PanelLayout />
    ),
    children: [
      {
        index: true,
        element: <Biblia />,
      },
    ],
  },
  {
    path: "/auth",
    element: (
      // <NotAuthenticatedRoute>
      <AuthLayout />
      // </NotAuthenticatedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/auth/login" />,
      },
      {
        path: "login",
        element: <Login />,
      },
    ],
  },
  {
    path: "*",
    element: <div>404</div>,
  },
]);
