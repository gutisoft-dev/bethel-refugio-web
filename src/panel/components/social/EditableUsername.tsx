import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Close } from "@/icons/Close";
import { useMutation, } from "@tanstack/react-query";
import { UpdateUsername } from "@/panel/actions/social/UpdateUsername";
import { toast } from "@/components/ui/toast";
import axios from "axios";

interface Props {
  username: string;
}

export const EditableUsername = ({ username }: Props) => {
  const location = useLocation();

  const canEdit = location.pathname === "/profile/me";

  const [isEditing, setIsEditing] = useState(false);
  const [editedUsername, setEditedUsername] = useState(username);


useEffect(() => {
  setEditedUsername(username);
}, [username])



  const createFollowMutation = useMutation({
    mutationFn: UpdateUsername,

    onSuccess: async (resp) => {
      setEditedUsername(resp.username);
     

      toast.add({
        type: "success",
        description: `Has cambiado tu nombre de usuario`,
        priority: "high",
      });
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

  const handleSave = () => {
    const newUsername = editedUsername.trim();

    if (!newUsername) return;

    createFollowMutation.mutate(newUsername);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedUsername(username);
    setIsEditing(false);
  };

  return (
    <div className="flex min-w-0 items-center gap-2 pt-2">
      {isEditing && canEdit ? (
        <>
          <Input
            value={editedUsername}
            onChange={(e) => setEditedUsername(e.target.value)}
            className="h-9 max-w-64"
            placeholder="Nombre de usuario"
            autoFocus
          />

          <Button size="sm" onClick={handleSave}>
            Guardar
          </Button>

          <Button size="sm" variant="outline" onClick={handleCancel}>
            <Close />
          </Button>
        </>
      ) : (
        <>
          <h1 className="truncate text-lg font-semibold sm:text-2xl">
            @{editedUsername}
          </h1>

          {canEdit && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setIsEditing(true);
              }}
            >
              Editar
            </Button>
          )}
        </>
      )}
    </div>
  );
};
