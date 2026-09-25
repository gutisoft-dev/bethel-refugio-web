import type { PropsWithChildren } from "react";
import { useAuthStore } from "../store/auth.store";
import { useQuery } from "@tanstack/react-query";
import { CustomFullScreenLoading } from "../components/CustomFullScreenLoading";

export const CheckAuthProvider = ({ children }: PropsWithChildren) => {
  const { checkAuthStatus } = useAuthStore();

  const { isLoading } = useQuery({
    queryKey: ["auth"],
    queryFn: checkAuthStatus,
    retry: false,
     refetchOnWindowFocus: false,
  });
  if (isLoading) return <CustomFullScreenLoading />;
  

  return children;
};
