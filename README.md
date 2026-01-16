# CLAUDE.md

## Project: Sargam Transposer

A React + TypeScript frontend app for transposing Sargam (Indian classical music) notation for bansuri.

## Commands

```bash
npm run dev        # Start development server
npm run build      # Production build
npm test           # Run tests once
npm run test:watch # Run tests in watch mode
npx tsc --noEmit   # Type check
npm run cf:deploy  # run deployment
```

## Deploy

login to `npx wrangler` using 
```bash
npx wrangler login
```

Deploy using the command
```
npm run cf:deploy
```
