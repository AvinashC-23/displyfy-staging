# Repository Guidelines

## Project Structure & Module Organization

This repository contains a Next.js App Router application. Route pages and API handlers live in `app/`; reusable UI is in `components/`, with interactive forms under `components/forms/`. Domain rules, Zod schemas, provider adapters, repository access, and Supabase helpers belong in `lib/`. Logos live in `public/brand/`; generated editorial imagery and other page media live in `public/assets/` and are referenced as `/assets/...`. Database migrations and seed data live in `supabase/`. Unit and integration tests use `tests/*.test.ts`; browser journeys use `e2e/*.spec.ts`.

## Build, Test, and Development Commands

- `npm install`: install exact versions from `package-lock.json`.
- `npm run dev`: start the configured app at `http://127.0.0.1:3000`.
- `npm run lint`: run ESLint across the repository.
- `npm run typecheck`: verify strict TypeScript without emitting files.
- `npm run test`: run Vitest unit, integration, and security tests.
- `npm run test:e2e`: run Playwright on desktop and 375px mobile profiles.
- `npm run test:staging-security`: exercise live staging RLS/RPC controls using temporary synthetic rows.
- `npm run build`: create and validate the production Next.js build.

Use Node.js `24.20.0` via `nvm use` before installing or validating changes.

## Coding Style & Naming Conventions

Use TypeScript, two-space indentation, double quotes, and semicolons. Prefer Server Components; add `"use client"` only for browser interaction. Name components in PascalCase, functions and variables in camelCase, and routes/directories in kebab-case. Keep business decisions in `lib/`, not UI components. Validate all external input with Zod and store money as integer minor units.

## Testing Guidelines

Add focused tests for normal, edge, and hostile inputs. Name Vitest files `*.test.ts` and Playwright files `*.spec.ts`. Authorization, mission capacity, budget, invitation, payout, and status changes require regression coverage. Run lint, type checking, tests, E2E tests, and the production build before requesting review.

## Commit & Pull Request Guidelines

No Git history exists yet. Use concise Conventional Commit messages, for example `feat: add restricted mission approval`. Pull requests should explain behavior, security impact, migrations, and verification performed; link the relevant issue and include screenshots for visible UI changes.

## Security & Configuration

Demo mode requires no secrets. Keep credentials in `.env.local`, never commit them, and never expose server secrets with `NEXT_PUBLIC_`. Preserve RLS, server-side role checks, generic authentication errors, and explicit simulated-provider labels.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
