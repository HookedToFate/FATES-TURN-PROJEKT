import ArcaneHeader from "./components/ArcaneHeader";
import HeroCanvas from "./components/HeroCanvas";
import LoreGrid from "./components/LoreGrid";
import SigilTicker from "./components/SigilTicker";
import ConstellationPanel from "./components/ConstellationPanel";
import QuestLedger from "./components/QuestLedger";
import FooterShrine from "./components/FooterShrine";
import { constellations, loreFragments, quests, relicShelf } from "./data/lore";

const App = () => (
  <div className="min-h-screen bg-abyss text-white">
    <div className="bg-veil-gradient">
      <ArcaneHeader />
      <main>
        <HeroCanvas />
        <LoreGrid fragments={loreFragments} />
        <SigilTicker />
        <ConstellationPanel constellations={constellations} />
        <QuestLedger quests={quests} relics={relicShelf} />
      </main>
      <FooterShrine />
    </div>
  </div>
);

export default App;
