import { AuthLayout } from "@/auth/layout/AuthLayout";
import { Login } from "@/auth/pages/Login";
import { PanelLayout } from "@/panel/layouts/PanelLayout";
import { Biblia } from "@/panel/pages/Biblia";
import { Home } from "@/panel/pages/Home";
import { Profile } from "@/panel/pages/Profile";
import { createBrowserRouter } from "react-router-dom";
import { AuthenticatedRoute, NotAuthenticatedRoute } from "./protected.router";

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
      <AuthenticatedRoute>
        <PanelLayout />
      </AuthenticatedRoute>
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
      <AuthenticatedRoute>
        <PanelLayout />
      </AuthenticatedRoute>
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
      <NotAuthenticatedRoute>
        <AuthLayout />
      </NotAuthenticatedRoute>
    ),
    children: [
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
