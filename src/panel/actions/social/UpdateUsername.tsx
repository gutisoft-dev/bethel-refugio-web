import { BethelApi } from "@/api/BethelApi";


export const UpdateUsername = async (username: string) => {
    const { data } = await BethelApi.patch("/me/username/", { username });
    return data;
}


