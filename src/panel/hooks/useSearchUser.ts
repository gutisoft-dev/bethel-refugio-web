import { useQuery } from "@tanstack/react-query";
import { SearchUser } from "../actions/Users/SearchUser";

export const useSearchUser = (username: string) => {
  return useQuery({
    queryKey: ["userByUsername", username],
    queryFn: () => SearchUser(username),
  });
};
