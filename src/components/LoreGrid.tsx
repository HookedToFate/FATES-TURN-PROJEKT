import type { LoreFragment } from "../data/lore";

type Props = {
  fragments: LoreFragment[];
};

const fragmentColor: Record<LoreFragment["type"], string> = {
  idea: "from-moss/30 via-moss/20 to-transparent",
  memory: "from-aurora/30 via-aurora/10 to-transparent",
  artifact: "from-dusk/30 via-dusk/10 to-transparent",
  experiment: "from-white/40 via-white/10 to-transparent"
};

const LoreGrid = ({ fragments }: Props) => (
  <section id="ideas" className="relative border-y border-white/10 bg-white/5 bg-gradient-to-b from-white/5 to-transparent py-16">
    <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6">
      <div>
        <p className="text-sm uppercase tracking-[0.4em] text-white/60">Idea Cabinet</p>
        <h2 className="mt-4 font-serif text-4xl text-white">Loose threads worth tugging.</h2>
        <p className="mt-2 text-white/70">Every card is a promise to future-me. Nothing is finished; everything is luminous.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {fragments.map((fragment) => (
          <article key={fragment.id} className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg">
            <div className={`absolute inset-0 bg-gradient-to-br ${fragmentColor[fragment.type]} opacity-60`} aria-hidden />
            <div className="relative flex flex-col gap-4">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.4em] text-white/70">
                <span>{fragment.type}</span>
                <span>{fragment.mood}</span>
              </div>
              <h3 className="font-serif text-2xl text-white">{fragment.title}</h3>
              <p className="text-white/85">{fragment.description}</p>
              <p className="text-sm text-white/70">Glimmer: {fragment.glimmer}</p>
              <div className="flex flex-wrap gap-2 text-xs">
                {fragment.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-white/20 px-3 py-1 text-white/70">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default LoreGrid;
