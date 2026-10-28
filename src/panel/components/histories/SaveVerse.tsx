import { useAuthStore } from "@/auth/store/auth.store";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { Save } from "@/icons/Save";
import { favoriteBibleVerse } from "@/panel/actions/biblie/favorite.action";
import type { Historia } from "@/panel/interfaces/History.interface";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Props {
  story: Historia;
}

export const SaveVerse = ({ story }: Props) => {
  const queryClient = useQueryClient();
  const { authStatus } = useAuthStore();
  const navigate = useNavigate();

  const saveVerseMutation = useMutation({
    mutationFn: favoriteBibleVerse,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["favorite-verses"],
      });
      toast.add({
        type: "success",
        description: `${story.reference} se guardó en tus favoritos.`,
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
    saveVerseMutation.mutate(story.normalized_reference);
  };

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={handleSave}
      disabled={saveVerseMutation.isPending}
      aria-busy={saveVerseMutation.isPending}
      className="h-10 min-w-0 flex-1 justify-center gap-2 rounded-lg px-2 text-sm text-white/80 hover:bg-white/10 hover:text-white sm:text-base"
    >
      <Save className="size-6" />
      {/* {saveVerseMutation.isPending ? "Guardando…" : "Guardar versículo"} */}
    </Button>
  );
};
