
import { HistoriesCard } from "../components/histories/HistoriesCard"
import { HistoriesHeader } from "../components/histories/HistoriesHeader"
import { HistoriesCommunity } from "../components/histories/HistoriesCommunity"

export const Home = () => {
  return (
    <div className="grid h-full min-h-0 w-full grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden bg-slate-50 text-slate-900">
      <HistoriesHeader />
      <HistoriesCard />
      <HistoriesCommunity />
    </div>
  )
}
