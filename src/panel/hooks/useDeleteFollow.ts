import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { deleteFollow } from "../actions/social/Follower";
import { toast } from "@/components/ui/toast";
import axios from "axios";

export const useDeleteFollow = () => {
  const queryClient = useQueryClient();

  const [openDelete, setOpenDelete] = useState(false);
  const [Selectedfollow, setSelectedfollow] = useState<string | null>(null);

  const deleteFollowMutation = useMutation({
    mutationFn: deleteFollow,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["follower"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["following"],
      });
      toast.add({
        type: "success",
        description: `Usuario eliminado con exito`,
        priority: "high",
      });
      setOpenDelete(false);
    },

    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.add({
          type: "error",
          description: `Ha ocurrido un error `,
          priority: "high",
        });
        return;
      }
    },
  });

  const onOpenDeleted = (follow: string) => {
    setOpenDelete(true);
    setSelectedfollow(follow);
  };

  const onCloseDeleted = () => {
    setOpenDelete(false);
  };

  return {
    onOpenDeleted,
    onCloseDeleted,
    deleteFollowMutation,
    openDelete,
    Selectedfollow,
  };
};
