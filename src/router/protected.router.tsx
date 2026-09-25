import type { PropsWithChildren } from "react";
import { useAuthStore } from "../auth/store/auth.store";
import { Navigate } from "react-router-dom";

export const AuthenticatedRoute = ({ children }: PropsWithChildren) => {
  const { authStatus } = useAuthStore();
  if (authStatus === "checking") return null;

  if (authStatus === "not-authenticated") return <Navigate to="/auth/login" />;
 
  return children;
};

export const NotAuthenticatedRoute = ({ children }: PropsWithChildren) => {
  const { authStatus } = useAuthStore();
  if (authStatus === "checking") return null;

  if (authStatus === "authenticated") return <Navigate to="/" />;

  return children;
};
