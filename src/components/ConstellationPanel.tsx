import { useState } from "react";
import type { Constellation } from "../data/lore";

type Props = {
  constellations: Constellation[];
};

const ConstellationPanel = ({ constellations }: Props) => {
  const [active, setActive] = useState(constellations[0]);

  return (
    <section id="constellations" className="bg-abyss px-6 py-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 lg:flex-row">
        <div className="flex-1 rounded-3xl border border-white/10 bg-white/5 p-6">
          <p className="text-sm uppercase tracking-[0.4em] text-white/60">Constellation Map</p>
          <h2 className="mt-4 font-serif text-4xl text-white">{active.title}</h2>
          <p className="text-sm uppercase tracking-[0.3em] text-white/70">{active.axis}</p>
          <p className="mt-6 text-white/80">{active.lore}</p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm">
            {constellations.map((constellation) => (
              <button
                key={constellation.id}
                type="button"
                onClick={() => setActive(constellation)}
                className={`rounded-full border px-4 py-2 transition ${
                  constellation.id === active.id
                    ? "border-moss text-moss"
                    : "border-white/20 text-white/70 hover:border-white/40"
                }`}
              >
                {constellation.title}
              </button>
            ))}
          </div>
        </div>
        <div className="scroll-veil flex flex-1 flex-col gap-8 rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-6">
          <p className="text-sm uppercase tracking-[0.4em] text-white/60">Starmap Draft</p>
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-abyss to-aurora/20">
            {active.coordinates.map((coordinate, index) => (
              <span
                key={`${active.id}-${index}`}
                className="absolute h-3 w-3 -translate-x-1.5 -translate-y-1.5 rounded-full bg-moss shadow-[0_0_20px_rgba(92,255,192,0.8)]"
                style={{ left: `${coordinate.x}%`, top: `${coordinate.y}%` }}
              />
            ))}
            <span className="absolute inset-10 border border-dashed border-white/20" aria-hidden />
          </div>
          <p className="text-sm text-white/75">
            Plotting points between mechanics and myth. The grid resets when a new memory is published.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ConstellationPanel;
