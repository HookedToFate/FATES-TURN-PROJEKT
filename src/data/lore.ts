export type LoreFragment = {
  id: string;
  title: string;
  type: "idea" | "memory" | "artifact" | "experiment";
  mood: string;
  description: string;
  glimmer: string;
  tags: string[];
};

export const loreFragments: LoreFragment[] = [
  {
    id: "dream-index",
    title: "Dream Index.01",
    type: "idea",
    mood: "Liminal",
    description: "Collect whispers from half-remembered levels and weave them into playable diary entries.",
    glimmer: "Prototype UI that blurs as you hesitate.",
    tags: ["interactive fiction", "memory craft"]
  },
  {
    id: "ember-archive",
    title: "Ember Archive",
    type: "memory",
    mood: "Warm",
    description: "Keepsakes from LAN basements, soda-sticky keyboards, and pixelated midnight alliances.",
    glimmer: "Holographic polaroids that pulse when a story unlocks.",
    tags: ["nostalgia", "co-op"]
  },
  {
    id: "glyph-hunt",
    title: "Glyph Hunt",
    type: "artifact",
    mood: "Cryptic",
    description: "A tabletop mini-game that asks you to trade real secrets for virtual sigils.",
    glimmer: "Dice that only settle when you breathe together.",
    tags: ["social", "ritual"]
  },
  {
    id: "veil-radio",
    title: "Veil Radio",
    type: "experiment",
    mood: "Electric",
    description: "Procedural radio hosting fragments of future selves, tuned by tarot spreads.",
    glimmer: "DJ deck driven by moon phases + RSS feeds.",
    tags: ["audio", "generative"]
  }
];

export type Constellation = {
  id: string;
  title: string;
  axis: string;
  lore: string;
  coordinates: { x: number; y: number }[];
};

export const constellations: Constellation[] = [
  {
    id: "soft-rebellion",
    title: "Soft Rebellion",
    axis: "Playfulness ↔ Protection",
    lore: "Keeps the site light even when the topics get heavy. The nodes reveal micro-interactions worth prototyping next.",
    coordinates: [
      { x: 10, y: 20 },
      { x: 35, y: 10 },
      { x: 55, y: 35 },
      { x: 30, y: 55 }
    ]
  },
  {
    id: "mycelium",
    title: "Mycelium Relay",
    axis: "Solitude ↔ Signal",
    lore: "Thread private musings into public rituals. Visitors decide how much of the fungus-glow to share.",
    coordinates: [
      { x: 15, y: 65 },
      { x: 40, y: 40 },
      { x: 70, y: 50 },
      { x: 60, y: 80 }
    ]
  },
  {
    id: "lore-engine",
    title: "Lore Engine",
    axis: "Mechanics ↔ Myth",
    lore: "Every mechanic should feel like a secret handshake. The notes here map dependencies between feelings and features.",
    coordinates: [
      { x: 20, y: 30 },
      { x: 45, y: 15 },
      { x: 65, y: 25 },
      { x: 80, y: 60 }
    ]
  }
];

export type Quest = {
  id: string;
  title: string;
  phase: "dawning" | "brewing" | "looming";
  detail: string;
  progress: number;
};

export const quests: Quest[] = [
  {
    id: "ink-trail",
    title: "Ink Trail Cartography",
    phase: "dawning",
    detail: "Design a journaling mechanic where doodles train a tiny oracle.",
    progress: 35
  },
  {
    id: "echo-capsules",
    title: "Echo Capsules",
    phase: "brewing",
    detail: "Audio notes trapped in quartz shards; visitors tap to release them.",
    progress: 62
  },
  {
    id: "guild-entry",
    title: "Guild Entry Puzzle",
    phase: "looming",
    detail: "Gate the hidden wiki with a cooperative riddle that resets nightly.",
    progress: 15
  }
];

export type Relic = {
  id: string;
  label: string;
  rarity: "common" | "rare" | "mythic";
  description: string;
  charge: number;
};

export const relicShelf: Relic[] = [
  {
    id: "neon-scribe",
    label: "Neon Scribe",
    rarity: "common",
    description: "A stylus that records gossip between UI components.",
    charge: 72
  },
  {
    id: "orbiter",
    label: "Orbiter Familiar",
    rarity: "rare",
    description: "Follows the cursor, nudging visitors toward serendipity.",
    charge: 48
  },
  {
    id: "inkwell",
    label: "Moonlit Inkwell",
    rarity: "mythic",
    description: "Only refills when someone uploads a glitch screenshot.",
    charge: 12
  }
];
