import { useAuthStore } from "@/auth/store/auth.store";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

import { Delete } from "@/icons/Delete";

export const DeleteAccount = () => {
  const { deleteAccount } = useAuthStore();

  const handleDelete = async () => {
    const resp = await deleteAccount();
    if (!resp) {
      toast.add({
        type: "error",
        description: "Error al eliminar la sesion",
        priority: "high",
      });
      return;
    }
    
  };

  return (
    <div className="mt-2">
      <AlertDialog>
        <AlertDialogTrigger
          render={
            <Button variant={"destructive"} className={"cursor-pointer"}>
              <Delete /> Eliminar cuenta
            </Button>
          }
        />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Esta seguro que desea eliminar su cuenta?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Una vez eliminada, no se puede recuperar.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction variant={"destructive"} onClick={handleDelete}>
              Continuar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
