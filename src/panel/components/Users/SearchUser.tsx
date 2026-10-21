import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Close } from "@/icons/Close";
import { Search } from "@/icons/Search";
import { useDebounce } from "@/panel/hooks/useDebounce";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface FormData {
  search: string;
}

interface Props {
  onSearch: (username: string) => void;
}
export const SearchUser = ({ onSearch }: Props) => {
  const { register, watch, reset } = useForm<FormData>({
    defaultValues: {
      search: "",
    },
  });
  const search = watch("search");
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    onSearch(debouncedSearch.trim());
  }, [debouncedSearch, onSearch]);

  const clearSearch = () => {
    reset({
      search: "",
    });
  };
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="w-full">
      <section className="">
        <Card className="mx-auto w-full max-w-7xl border-0 bg-white py-0 shadow-none ring-0">
          <CardContent className={"p-2 md:p-4"}>
            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => e.preventDefault()}
            >
              <div
                className={`${isScrolled ? "flex min-w-0 flex-row items-center gap-2" : " flex flex-col gap-3 sm:flex-row"}`}
              >
                <div className="relative min-w-0 flex-1">
                  <Search
                    className="size-5 pointer-events-none
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-slate-400"
                  />

                  <Input
                    id="bible-search"
                    aria-label="Buscar en la Biblia"
                    placeholder="Buscar el nombre de un usuario..."
                    {...register("search", {
                      required: true,
                    })}
                    className={`h-12
                    rounded-xl
                    pl-12
                    pr-10
                    text-sm
                    placeholder:text-slate-400
                    focus-visible:ring-2
                    focus-visible:ring-purple-500
                  `}
                  />
                  {search.length > 0 && (
                    <button
                      type="button"
                      aria-label="Limpiar búsqueda"
                      className="absolute right-3 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-slate-500 hover:bg-slate-200 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                      onClick={clearSearch}
                    >
                      <Close />
                    </button>
                  )}
                </div>

                <Button
                  type="submit"
                  className={`h-12 px-7 sm:min-w-34.5
                  rounded-xl
                  bg-purple-700
                  font-semibold
                  text-white
                  hover:bg-purple-800
                `}
                >
                  <Search />
                  Buscar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};
