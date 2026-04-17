# TradeStash Web

TradeStash is a Next.js 14 + Firebase rebuild of the original Bubble MVP. The web app is designed for a college-first barter marketplace: stash posts, search, trade proposals, async messaging, XP tiers, city leaderboards, premium visibility hooks, and a BEAM delivery stub.

## Stack

- Next.js 14 App Router
- Firebase Auth
- Firestore
- Vercel-ready environment variable configuration
- Demo mode fallback when Firebase env vars are absent

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env.local` and fill in Firebase credentials.

3. Start the app:

```bash
npm run dev
```

4. Seed Firestore with starter documents after Firebase Admin env vars are configured:

```bash
npm run seed:firestore
```

## Scripts

- `npm run dev` starts the Next.js app
- `npm run build` builds for production
- `npm run lint` runs Next.js ESLint
- `npm run typecheck` runs TypeScript validation
- `npm run seed:firestore` bootstraps Firestore collections with starter data

## Notes

- Listings currently accept up to four photo URLs. This keeps the MVP focused on search, trading, and gamification without blocking on a Storage uploader flow.
- Search is implemented as tokenized in-memory filtering over active listings for the MVP. If inventory volume grows, the next step is Algolia-backed indexing.
- Async messaging is Firestore-shaped and BEAM delivery is stubbed behind `/api/delivery-request`.
- The codebase includes demo mode so the UX can still be reviewed before Firebase credentials are available.
