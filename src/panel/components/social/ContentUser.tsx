import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/toast";
import { Check } from "@/icons/Check";
import { MoreHorizontal } from "@/icons/MoreHorizontal";
import { Profile } from "@/icons/Profile";
import { UserPlus } from "@/icons/UserPlus";
import { createFollow } from "@/panel/actions/social/Follower";
import type { Follower } from "@/panel/interfaces/Follower.interface";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  follower: Follower;
  title: string;
  subtitle: string;
}
export const ContentUser = ({ follower,title,subtitle }: Props) => {
  const queryClient = useQueryClient();

  const [isFollowing, setIsFollowing] = useState(follower.is_following);
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate("/profile/" + follower.username);
  };

  const createFollowMutation = useMutation({
    mutationFn: createFollow,

    onSuccess: async (resp) => {
      console.log(resp);
      setIsFollowing((current) => !current);
      await queryClient.invalidateQueries({
        queryKey: ["specfollowingialties"],
      });
    },

    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.add({
          type: "success",
          description: `Ha ocurrido un error `,
          priority: "high",
        });
        return;
      }
    },
  });

  return (
    <Card className="w-full max-w-md overflow-hidden shadow-sm">
      <CardHeader className="border-b bg-card pb-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-xl">{title}</CardTitle>
            <CardDescription className="mt-1">
             {subtitle}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="icon" aria-label="Más opciones">
                  <MoreHorizontal data-icon="inline-start" />
                </Button>
              }
            ></DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuItem onClick={handleRedirect}>
                <Profile />
                Ver Perfil
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="p-5">
        <div className="flex items-center gap-4">
          <Avatar className="size-14 border-2 border-background shadow-sm">
            <AvatarFallback className="bg-primary text-base font-semibold text-primary-foreground">
              BH
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-foreground">
              {follower.username}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">Te sigue</p>
          </div>

          <Button
            size="sm"
            variant={isFollowing ? "secondary" : "default"}
            onClick={() => createFollowMutation.mutate(follower.id)}
            aria-pressed={isFollowing}
          >
            {isFollowing ? (
              <>
                <Check data-icon="inline-start" /> Siguiendo
              </>
            ) : (
              <>
                <UserPlus data-icon="inline-start" /> Seguir
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
