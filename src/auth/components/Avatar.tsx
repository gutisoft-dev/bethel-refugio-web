import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserIcon, SettingsIcon, LogOutIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";
import { Button } from "@/components/ui/button";
export const AvatarContent = () => {
  const { authStatus, logout } = useAuthStore();
  return (
    <div className="flex items-center">
      {authStatus === "authenticated" ? (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                type="button"
                className="rounded-full cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#6800b8] focus-visible:ring-offset-2"
              >
                <Avatar className="h-9 w-9 bg-[#6800b8]">
                  <AvatarFallback className="bg-[#6800b8] text-white">
                    U
                  </AvatarFallback>
                </Avatar>
              </button>
            }
          ></DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuItem>
              <UserIcon />
              Perfil
            </DropdownMenuItem>

            <DropdownMenuItem>
              <SettingsIcon />
              Configuración
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem variant="destructive" onClick={logout}>
              <LogOutIcon />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button >
          <Link to="/auth/login">Iniciar sesión</Link>
        </Button>
      )}
    </div>
  );
};
