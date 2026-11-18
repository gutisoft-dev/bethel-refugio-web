import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Spinner } from "@/components/ui/spinner";
interface Props {
  handleDelete: () => void;
  onCloseDeleted: () => void;
  open: boolean;
  text: string;
  isloading: boolean;
}

export const ModaleDelete = ({
  handleDelete,
  open,
  onCloseDeleted,
  text,
  isloading,
}: Props) => {
  return (
    <div className="mt-2">
      <AlertDialog open={open}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{text}</AlertDialogTitle>
            <AlertDialogDescription>
              Una vez eliminada, no se puede recuperar.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={onCloseDeleted}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              variant={"destructive"}
              onClick={handleDelete}
              disabled={isloading}
            >
              {isloading && <Spinner />}
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
