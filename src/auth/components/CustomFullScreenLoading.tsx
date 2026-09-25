import { Spinner } from "@/components/ui/spinner";

export const CustomFullScreenLoading = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Spinner />
      </div>
    </div>
  );
};
