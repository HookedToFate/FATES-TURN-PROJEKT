const ArcaneHeader = () => (
  <header className="sticky top-0 z-20 backdrop-blur-lg bg-abyss/80 border-b border-white/10">
    <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
      <div className="flex items-center gap-3">
        <span className="h-10 w-10 rounded-full bg-veil-gradient" aria-hidden />
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-white/60">Fate's Turn</p>
          <p className="font-serif text-xl text-white">Secret maintenance log</p>
        </div>
      </div>
      <nav className="hidden gap-6 text-sm uppercase tracking-[0.2em] text-white/70 sm:flex">
        <a href="#ideas" className="hover:text-moss transition-colors">
          Ideas
        </a>
        <a href="#constellations" className="hover:text-moss transition-colors">
          Constellations
        </a>
        <a href="#quests" className="hover:text-moss transition-colors">
          Quests
        </a>
      </nav>
    </div>
  </header>
);

export default ArcaneHeader;
