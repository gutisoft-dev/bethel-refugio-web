import { AuthLayout } from "@/auth/layout/AuthLayout";
import { Login } from "@/auth/pages/Login";
import { PanelLayout } from "@/panel/layouts/PanelLayout";
import { Biblie } from "@/panel/pages/Biblie";
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
        element: <Biblie />,
      },
    ],
  },
  {
    path: "/history",
    element: (
      <AuthenticatedRoute>
        <PanelLayout />,
      </AuthenticatedRoute>
    ),
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
