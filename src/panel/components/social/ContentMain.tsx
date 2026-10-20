import { useEffect, useState } from "react";
import type { UserResponse } from "@/panel/interfaces/social.interfaces";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import type { taps } from "@/panel/pages/Profile";
import { Check } from "@/icons/Check";
import { UserPlus } from "@/icons/UserPlus";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFollow } from "@/panel/actions/social/Follower";
import axios from "axios";
import { toast } from "@/components/ui/toast";
import { EditableUsername } from "./EditableUsername";
import { DeleteAccount } from "./DeleteAccount";
interface Props {
  user: UserResponse;
  handleTapsChange: (value: taps) => void;
  taps: taps;
}

export const ContentMain = ({ user, taps, handleTapsChange }: Props) => {
  const queryClient = useQueryClient();

  const [following, setFollowing] = useState(user.is_following);

  useEffect(() => {
    setFollowing(user.is_following);
  }, [user]);

  const createFollowMutation = useMutation({
    mutationFn: createFollow,

    onSuccess: async (resp) => {
      console.log(resp);
      setFollowing((current) => !current);
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
    <section className="relative mt-8 w-full min-w-0 overflow-hidden rounded-3xl border">
      <div className="h-20 bg-purple-700 sm:h-28" />

      <div className="relative min-w-0 px-3 pb-4 sm:px-5">
        <div className="-mt-2 flex min-w-0 flex-col gap-4 sm:-mt-7 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <div className="flex size-20 shrink-0 items-center justify-center rounded-full border-4 border-white bg-[#7209b7] text-3xl font-semibold text-white shadow-md sm:size-28 sm:text-5xl">
              G
            </div>

            <div className="min-w-0 flex-1 pb-1">
              <EditableUsername username={user.username} />

              {user.email && (
                <p className="truncate text-sm text-stone-500">{user.email}</p>
              )}
            </div>
          </div>

          {user.is_following !== undefined && (
            <div className="flex shrink-0 sm:pb-1">
              <Button
                size="sm"
                variant={following ? "secondary" : "default"}
                onClick={() => createFollowMutation.mutate(user.id)}
                aria-pressed={following}
              >
                {following ? (
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
          )}
        </div>
        <DeleteAccount/>
        <div className="mt-6 min-w-0 border-t border-[#7209b7]/10 pt-4">
          <div className="-mx-3 overflow-x-auto overflow-y-hidden px-3 sm:mx-0 sm:px-0">
            <Tabs
              defaultValue="overview"
              value={taps}
              onValueChange={(value) => handleTapsChange(value as taps)}
            >
              <TabsList
                variant="line"
                className="flex h-auto w-max min-w-full justify-start gap-1"
              >
                <TabsTrigger
                  value="followers"
                  className="shrink-0 whitespace-nowrap"
                >
                  Seguidores
                </TabsTrigger>

                <TabsTrigger
                  value="following"
                  className="shrink-0 whitespace-nowrap"
                >
                  Siguiendo
                </TabsTrigger>
                <TabsTrigger
                  value="verses"
                  className="shrink-0 whitespace-nowrap"
                >
                  Versículos favoritos
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>
    </section>
  );
};
