import { BethelApi } from "@/api/BethelApi";
import type {
  UserResponse,
} from "@/panel/interfaces/social.interfaces";
import type { LoaderFunctionArgs } from "react-router-dom";

export const getUserByUsername = async (username: string) => {
  const { data } = await BethelApi.get<UserResponse>(`/users/${username}/`);
  return data;
};
export const getUserByUsernameLoader = async ({
  params,
}: LoaderFunctionArgs) => {
  const username = params.username;
   if (!username) {
    throw new Response("Username no proporcionado", {
      status: 400,
    });
  }
  return getUserByUsername(username);
};

export const getMe = async () => {
  const { data } = await BethelApi.get<UserResponse>(`/me`);
  return data;
};



export const getMeLoader = async () => {
  return getMe();
}