import type { Quest, Relic } from "../data/lore";

const phaseColor: Record<Quest["phase"], string> = {
  dawning: "text-moss border-moss",
  brewing: "text-aurora border-aurora",
  looming: "text-dusk border-dusk"
};

type Props = {
  quests: Quest[];
  relics: Relic[];
};

const QuestLedger = ({ quests, relics }: Props) => (
  <section id="quests" className="bg-white/5 py-20">
    <div className="mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-3xl border border-white/10 bg-abyss/60 p-6">
        <p className="text-sm uppercase tracking-[0.4em] text-white/60">Quest Log</p>
        <h2 className="mt-4 font-serif text-4xl text-white">Experiments currently brewing</h2>
        <div className="mt-8 flex flex-col gap-6">
          {quests.map((quest) => (
            <article key={quest.id} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-2xl text-white">{quest.title}</h3>
                <span className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.3em] ${phaseColor[quest.phase]}`}>
                  {quest.phase}
                </span>
              </div>
              <p className="mt-2 text-white/80">{quest.detail}</p>
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/60">
                  <span>progress</span>
                  <span>{quest.progress}%</span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-gradient-to-r from-moss via-aurora to-dusk" style={{ width: `${quest.progress}%` }} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
      <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-abyss to-aurora/20 p-6">
        <p className="text-sm uppercase tracking-[0.4em] text-white/60">Relic Shelf</p>
        <h2 className="mt-4 font-serif text-3xl text-white">Playful artifacts gifting buffs</h2>
        <div className="mt-6 space-y-5">
          {relics.map((relic) => (
            <div key={relic.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between">
                <p className="font-serif text-2xl text-white">{relic.label}</p>
                <span className="text-xs uppercase tracking-[0.3em] text-white/60">{relic.rarity}</span>
              </div>
              <p className="mt-2 text-white/80">{relic.description}</p>
              <div className="mt-3 flex items-center justify-between text-sm text-white/70">
                <span>Charge</span>
                <span>{relic.charge}%</span>
              </div>
              <div className="mt-1 h-1 w-full rounded-full bg-white/10">
                <div className="h-full rounded-full bg-white/70" style={{ width: `${relic.charge}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default QuestLedger;
