import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
interface Props {
  isPosting: boolean;
  text: string;
}

export const ButtonSubmit = ({ isPosting, text }: Props) => {
  return (
    <Button
      type="submit"
      className="h-10 cursor-pointer w-full"
      disabled={isPosting}
    >
      {isPosting && <Spinner data-icon="inline-start" />}
      {text}
    </Button>
  );
};
