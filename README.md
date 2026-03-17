# Focusss

Stake to focus. Earn if you finish. Lose if you quit.

## Monorepo Layout

This repo is now a single monorepo with the app code committed directly under the root repository:

- `blitz-hack/`: Expo React Native app
- `backend/`: Express + Prisma API
- `contracts/`: Starknet Cairo contracts

The previous standalone git history for `blitz-hack` was preserved locally at `.git-backups/blitz-hack.git` during the flattening process.

## Root Scripts

Run everything from the repository root:

```bash
npm run dev:web
npm run dev:app
npm run dev:backend
npm run build:web
npm run typecheck
```

## Vercel

`vercel.json` is configured to build the Expo web app from the repo root and publish the static output from:

```bash
blitz-hack/dist
```

Build command:

```bash
npm run build:web
```

## Local Development

Frontend:

```bash
npm run dev:web
```

Backend:

```bash
npm run dev:backend
```
