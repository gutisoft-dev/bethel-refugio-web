import { useAuthStore } from "@/auth/store/auth.store";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { Save } from "@/icons/Save";
import { favoriteBibleVerse } from "@/panel/actions/biblie/favorite.action";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Props {
  normalized_reference: string;
}

export const SaveVerse = ({ normalized_reference }: Props) => {
  const queryClient = useQueryClient();
  const { authStatus } = useAuthStore();
  const navigate = useNavigate();

  const seaveVerse = useMutation({
    mutationFn: favoriteBibleVerse,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["favorite-verses"],
      });
      toast.add({
          type: "success",
          description:'El versiculo se guardo con exito',
          priority: "high",
        });
    },

    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.add({
          type: "error",
          description: error.response?.data.error?.message,
          priority: "high",
        });
        return;
      }
    },
  });

  const handleSave = async () => {
    if (authStatus === "not-authenticated") {
      navigate("/auth/login");
      return;
    }
    seaveVerse.mutate(normalized_reference);
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="xs"
      onClick={() => handleSave()}
      className="h-auto gap-1 p-0 text-white/70 hover:bg-transparent hover:text-white cursor-pointer"
    >
      <Save />
      Guardar versiculo
    </Button>
  );
};
