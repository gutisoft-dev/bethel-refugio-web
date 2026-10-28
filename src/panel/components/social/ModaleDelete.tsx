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
interface Props {
  handleDelete: () => void;
  onCloseDeleted: () => void;
  open: boolean;
  text: string;
}

export const ModaleDelete = ({ handleDelete, open,onCloseDeleted,text }: Props) => {
  return (
    <div className="mt-2">
      <AlertDialog open={open}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {text}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Una vez eliminada, no se puede recuperar.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={onCloseDeleted} >Cancelar</AlertDialogCancel>
            <AlertDialogAction variant={"destructive"} onClick={handleDelete}>
              Continuar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
