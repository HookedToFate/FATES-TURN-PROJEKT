import { useEffect, useState } from "react";

type Whisper = {
  title: string;
  message: string;
  reward: string;
};

const whispers: Whisper[] = [
  {
    title: "Patched Spiral",
    message: "Drafting a journal mechanic that prints glyphs whenever you abort a thought.",
    reward: "+1 intuition shard"
  },
  {
    title: "Aquifer Arcade",
    message: "Water physics minigame that stores every splash as a sound preset.",
    reward: "Unlocks secret soundboard"
  },
  {
    title: "Oracle Patch",
    message: "AI pen pal that only answers in maps. Needs moods as GPS coordinates.",
    reward: "Summons cartographic familiar"
  }
];

const SigilTicker = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setCurrent((prev) => (prev + 1) % whispers.length);
    }, 5000);

    return () => window.clearInterval(id);
  }, []);

  const whisper = whispers[current];

  return (
    <section className="px-6 py-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 rounded-3xl border border-white/10 bg-gradient-to-r from-aurora/40 via-abyss to-dusk/30 p-8 md:flex-row md:items-center">
        <div className="flex-1">
          <p className="text-sm uppercase tracking-[0.4em] text-white/70">Whisper Queue</p>
          <h2 className="mt-4 font-serif text-4xl text-white">{whisper.title}</h2>
          <p className="mt-4 text-white/80">{whisper.message}</p>
        </div>
        <div className="flex flex-1 flex-col gap-4 rounded-2xl border border-white/20 bg-white/10 p-6">
          <p className="text-xs uppercase tracking-[0.4em] text-white/70">Potential Reward</p>
          <p className="text-2xl font-mono text-moss">{whisper.reward}</p>
          <p className="text-sm text-white/70">
            Patience bonus increases if you keep the tab open long enough. Each loop makes the whisper brighter.
          </p>
        </div>
      </div>
    </section>
  );
};

export default SigilTicker;
