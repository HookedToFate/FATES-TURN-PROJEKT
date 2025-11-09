# FATES-TURN-PROJEKT

An intentionally unfinished, mystical play-space for ideas, memories, and gaming artifacts. The site leans into an ethereal, game-adjacent aesthetic rather than a conventional portfolio. Every section is meant to feel like a living cabinet of curiosities that can be extended with new rituals over time.

## Stack

- **Framework**: React 18 + TypeScript (Vite)
- **Styling**: TailwindCSS with bespoke gradients, serif/display font pairing, and micro-animations
- **Testing**: Jest + Testing Library (jsdom environment)

## Getting Started

```bash
npm install
npm run dev   # starts Vite on http://localhost:4173
npm run build # bundles for production
npm test      # runs Jest in CI mode
```

## Structure

```
src/
  components/   # Modular sections: hero, lore grid, constellation map, quest ledger, etc.
  data/         # Narrative seed data powering cards + interactions
  index.css     # Tailwind entry + custom utility styles (orbs, scroll veil)
  App.tsx       # Page composition rooted in the aesthetic vision
```

## Design Notes

- Embrace magical realism: gradients, serif headlines, animated “orbs”, and gamified stats make the space feel alive.
- Keep content modular so future updates can swap fragments, quests, or relics without refactoring layout.
- Accessibility first: semantic headings, button controls for constellation selection, and readable contrast ratios.
