# Mera Journey — redesign

The site plays as Kai's documentary: letterbox bars, a running timecode, chapter slates and burned-in subtitles. Scrolling flies a real-time 3D Himalaya from the valley at dusk, through the night at high camp, to Mera Peak's summit at dawn.

## Run

```bash
npm install
npm run dev      # http://localhost:3210
npm run build && npm start
```

## Stack

- Next.js 15 (App Router), React 19, TypeScript
- Three.js: real Khumbu terrain (Ama Dablam, Everest, Mera Peak) from AWS Terrain Tiles elevation data in `public/terrain/`, with altitude snowlines, glaciers, ridge-cast soft shadows and valley haze (`components/Himalaya.tsx`, `lib/terrain.ts`)
- GSAP ScrollTrigger + Lenis: scroll choreography (`components/Home.tsx`, `lib/motion.ts`)
- Fonts self-hosted via `next/font`: Gloock (titles), Hanken Grotesk (text), JetBrains Mono (timecode)

## Content

All copy lives in `lib/content.ts`. Photos are in `public/photos/` (Kai's own, from the current site; the Tiger's Nest photo is CC BY 2.5 from Wikimedia Commons and credited in the footer).

## Still to fill in

- FAQ answers for cancellations, insurance/bonding and minimum lead time (the current site's answers could not be retrieved). Add them to `faqs` in `lib/content.ts`.
- The inquiry form opens the visitor's email app addressed to kaimaifoto@gmail.com. Swap in a form backend (Formspree, Resend, etc.) in `components/InquiryForm.tsx` if you want submissions without email.
- Films, Journal and legal pages from the old site are not rebuilt yet. Old `/nepal-bhutan/*`, `/journeys` and `/about` URLs redirect (see `next.config.mjs`).
- A real Bhutan photo of Kai's would be better than the Commons image.
