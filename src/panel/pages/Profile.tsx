import { useState } from "react";
import { ContentMain } from "../components/social/ContentMain";
import type { UserResponse } from "../interfaces/social.interfaces";
import { useLoaderData } from "react-router-dom";
import { ContentFavoriteVeses } from "../components/social/ContentFavoriteVeses";
import { ContentFollowers } from "../components/social/ContentFollowers";
import { ContentFollowing } from "../components/social/ContentFollowing";

export type taps = "followers" | "following" | "stories" | "verses";

export const Profile = () => {
  const user = useLoaderData() as UserResponse;
  const [taps, setTaps] = useState<taps>("followers");

  const handleTapsChange = (value: taps) => {
    setTaps(value);
  };

  return (
    <div className="mx-auto max-w-5xl px-5 pb-16 lg:px-8">
      <ContentMain
        user={user}
        taps={taps}
        handleTapsChange={handleTapsChange}
      />
      <div className="mt-4">
        {taps === "verses" && <ContentFavoriteVeses id={user.id} />}
        {taps === "followers" && <ContentFollowers id={user.id} />}
        {taps === "following" && <ContentFollowing id={user.id} />}
      </div>
    </div>
  );
};
