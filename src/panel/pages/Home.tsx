
import { useState } from "react"
import { HistoriesCard } from "../components/histories/HistoriesCard"
import { HistoriesHeader, type HistoryFeed } from "../components/histories/HistoriesHeader"
// import { HistoriesCommunity } from "../components/histories/HistoriesCommunity"

export const Home = () => {
  const [activeFeed, setActiveFeed] = useState<HistoryFeed>("public")

  return (
    <div className="grid h-full min-h-0 w-full grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden bg-slate-50 text-slate-900">
      <HistoriesHeader activeFeed={activeFeed} onFeedChange={setActiveFeed} />
      <HistoriesCard feed={activeFeed} />
      {/* <HistoriesCommunity /> */}
    </div>
  )
}
