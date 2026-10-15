import { AuthLayout } from "@/auth/layout/AuthLayout";
import { Login } from "@/auth/pages/Login";
import { PanelLayout } from "@/panel/layouts/PanelLayout";
import { Biblie } from "@/panel/pages/Biblie";
import { Home } from "@/panel/pages/Home";
import { Profile } from "@/panel/pages/Profile";
import { createBrowserRouter } from "react-router-dom";
import { AuthenticatedRoute, NotAuthenticatedRoute } from "./protected.router";
import {
  getMeLoader,
  getUserByUsernameLoader,
} from "@/panel/actions/social/social.action";
import { ErrorProfile } from "@/panel/pages/ErrorProfile";

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <PanelLayout />,
    children: [
      {
        index: true,
        element: <Biblie />,
      },
      {
        path: "history",
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
        path: "me",
        element: <Profile />,
        loader: getMeLoader,
        errorElement: <ErrorProfile />,
      },
      {
        path: ":username",
        element: <Profile />,
        loader: getUserByUsernameLoader,
        errorElement: <ErrorProfile />,
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
