import { useMemo } from "react";

const heroMotes = new Array(6).fill(null).map((_, index) => ({
  id: `mote-${index}`,
  delay: (index + 1) * 0.6,
  top: `${10 + index * 8}%`,
  left: `${5 + index * 12}%`
}));

const HeroCanvas = () => {
  const currentMoon = useMemo(() => {
    const phases = ["Waxing", "Full", "Waning", "New"];
    return phases[new Date().getDate() % phases.length];
  }, []);

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.4em] text-white/70">
            <span className="h-2 w-2 animate-pulse rounded-full bg-moss" aria-hidden />
            live build — {currentMoon} moon
          </p>
          <h1 className="font-serif text-5xl leading-tight text-white md:text-6xl">
            A living reliquary of <span className="text-moss">unfinished</span> spells, ideas, and artifacts.
          </h1>
          <p className="mt-6 text-lg text-white/80 md:text-xl">
            This space shapeshifts with each entry. Wander through dream indexes, cooperative riddles, and game relics rescued from LAN basements.
          </p>
          <div className="mt-10 flex flex-wrap gap-4 text-sm uppercase tracking-[0.3em]">
            <span className="rounded-full border border-white/30 px-5 py-2 text-white/80">Mystic UX</span>
            <span className="rounded-full border border-white/30 px-5 py-2 text-white/80">Memory Craft</span>
            <span className="rounded-full border border-white/30 px-5 py-2 text-white/80">Gamer Lore</span>
          </div>
        </div>
        <div className="relative rounded-3xl border border-white/15 bg-white/5 p-8 shadow-[0_0_80px_rgba(127,91,255,0.35)]">
          <p className="text-sm uppercase tracking-[0.4em] text-white/60">Codex Weather</p>
          <p className="mt-4 font-serif text-3xl text-white">Probability of Serendipity</p>
          <p className="text-6xl font-mono text-moss">87%</p>
          <p className="mt-6 text-sm text-white/80">
            Energy reserves for experiments, rebalanced nightly. Each visitor donates a flicker when they linger.
          </p>
          <div className="mt-6 grid gap-3 text-sm">
            <div className="flex items-center justify-between text-white/70">
              <span>Dream voltage</span>
              <span>+12</span>
            </div>
            <div className="flex items-center justify-between text-white/70">
              <span>Guild whispers</span>
              <span>3 unread</span>
            </div>
            <div className="flex items-center justify-between text-white/70">
              <span>Glitch offering</span>
              <span>awaiting</span>
            </div>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-70">
        {heroMotes.map((mote) => (
          <span
            key={mote.id}
            className="floating-orb absolute h-32 w-32 rounded-full blur-3xl"
            style={{
              top: mote.top,
              left: mote.left,
              background: "radial-gradient(circle, rgba(92,255,192,0.35), transparent 60%)",
              animationDelay: `${mote.delay}s`
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroCanvas;
