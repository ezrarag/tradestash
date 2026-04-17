# TradeStash

This repository contains the Next.js web app in `tradestash-web/`.

## Run From Repo Root

Install the web app dependencies once:

```bash
npm --prefix tradestash-web install
```

Start the app from the repo root:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

## Environment Setup

Copy `tradestash-web/.env.example` to `tradestash-web/.env.local` and fill in the Firebase credentials. The app can still run in demo mode if those environment variables are absent.

## Direct App Commands

If you prefer working inside the app directory, the original commands still work:

```bash
cd tradestash-web
npm run dev
```
