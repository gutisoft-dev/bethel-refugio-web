
import { useState } from "react"
// import { HistoriesCard } from "../components/histories/HistoriesCard"
import { HistoriesGrid } from "../components/histories/HistoriesGrid"
import { HistoriesHeader, type HistoryFeed } from "../components/histories/HistoriesHeader"
// import { HistoriesCommunity } from "../components/histories/HistoriesCommunity"

export const Home = () => {
  const [activeFeed, setActiveFeed] = useState<HistoryFeed>("public")

  return (
    <div className="grid h-full min-h-0 w-full grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden text-slate-900">
      <HistoriesHeader activeFeed={activeFeed} onFeedChange={setActiveFeed} />
      <HistoriesGrid feed={activeFeed} />
      {/* <HistoriesCard feed={activeFeed} /> */}
      {/* <HistoriesCommunity /> */}
    </div>
  )
}
