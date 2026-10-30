
import { useState } from "react"
// import { HistoriesCard } from "../components/histories/HistoriesCard"
import { HistoriesGrid } from "../components/histories/HistoriesGrid"
import { HistoriesHeader, type HistoryFeed } from "../components/histories/HistoriesHeader"
import { SavedFavoriteVersesFeed } from "../components/histories/SavedFavoriteVersesFeed"
// import { HistoriesCommunity } from "../components/histories/HistoriesCommunity"

export const Home = () => {
  const [activeFeed, setActiveFeed] = useState<HistoryFeed>("public")

  return (
    <div className="grid min-h-0 w-full min-w-0 text-slate-900">
      <HistoriesHeader activeFeed={activeFeed} onFeedChange={setActiveFeed} />
      {activeFeed === "saved" ? (
        <SavedFavoriteVersesFeed />
      ) : (
        <HistoriesGrid feed={activeFeed} />
      )}
      {/* <HistoriesCard feed={activeFeed} /> */}
      {/* <HistoriesCommunity /> */}
    </div>
  )
}
