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
      <section
        className={
          isScrolled
            ? "fixed inset-x-0 top-0 z-40 w-full bg-white px-5 md:px-8"
            : "w-full py-3"
        }
      >
        <div className="mx-auto w-full max-w-7xl border-0  py-0 shadow-none ring-0">
          <div className={isScrolled ? "p-2" : "p-2 md:p-4"}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                // Conserva aquí tu lógica de búsqueda.
              }}
              className="w-full"
            >
              <div
                className={`
            flex w-full min-w-0 items-center overflow-hidden
            rounded-2xl border border-slate-200 bg-white
            shadow-sm transition-shadow
            focus-within:ring-2 focus-within:ring-purple-500/30
            ${isScrolled ? "h-11" : "h-14"}
          `}
              >
                <Search className="ml-5 size-5 shrink-0 text-slate-400" />

                <Input
                  id="bible-search"
                  aria-label="Buscar en la Biblia"
                  placeholder="Buscar el nombre de un usuario..."
                  {...register("search", {
                    required: true,
                  })}
                  className="
              h-full min-w-0 flex-1 rounded-none border-0
              bg-transparent px-4 text-base shadow-none
              placeholder:text-slate-400
              focus-visible:border-0 focus-visible:ring-0
              md:text-base
            "
                />

                {search.length > 0 && (
                  <button
                    type="button"
                    aria-label="Limpiar búsqueda"
                    onClick={clearSearch}
                    className="
                mr-2 flex size-8 shrink-0 items-center
                justify-center rounded-full text-slate-500
                hover:bg-slate-100 hover:text-slate-800
                focus-visible:outline-none
                focus-visible:ring-2 focus-visible:ring-purple-500
              "
                  >
                    <Close className="size-4" />
                  </button>
                )}

                <Button
                  type="submit"
                  className={`
              h-full shrink-0 rounded-none
              rounded-r-[0.9rem] bg-purple-700
              px-5 font-semibold text-white
              hover:bg-purple-800 sm:px-7
              ${isScrolled ? "text-sm" : "text-base"}
            `}
                >
                  <Search className="mr-2 size-4" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};
