# Repository Guidelines

## Project Structure & Module Organization
- `app/` holds Next.js routes, layouts, and API handlers; localized content lives in `app/[locale]` and shared UI in `app/components`.
- `components/` provides feature modules (`translator.tsx`, `languageSelector.tsx`) plus reusable UI primitives under `components/ui/`.
- `hooks/`, `lib/`, and `types/` centralize shared logic, Supabase helpers, and TypeScript definitions. Assets, fonts, and icons live in `public/` and Tailwind styles extend from `styles/`.
- Configuration lives in `config/`, while Supabase database tooling sits in `supabase/` (keep migrations in sync when changing schema).

## Build, Test, and Development Commands
- `npm run dev` starts the Next.js dev server with live reload.
- `npm run build` compiles the production bundle; `npm run start` serves that output.
- `npm run lint` runs the project ESLint setup; fix findings before committing.
- `npm run format:write` applies Prettier with sorted imports. Use `format:check` in CI or pre-commit hooks.
- `npm run supabase:generate-types` refreshes `lib/database.types.ts` after updating Supabase schema.

## Coding Style & Naming Conventions
- TypeScript-first codebase; prefer functional React components and server-first data loaders in `app/`.
- Prettier enforces 4-space indentation, double quotes, trailing commas, and no semicolons; keep imports ordered per `prettier.config.js`.
- Use PascalCase for components (`TranslatorPanel`), camelCase for hooks (`useVirtualKeyboard`), and kebab-case for files under `app/` routes.
- Tailwind utility classes drive styling; compose shared patterns with helpers in `components/ui/` or `styles/`.

## Testing Guidelines
- No automated test harness yet; rely on `npm run lint` plus manual smoke tests via `npm run dev` across supported locales and auth flows.
- When adding tests, colocate them with features (e.g., `components/translator.test.tsx`) and follow `should…` phrasing for describe blocks to clarify intent.

## Commit & Pull Request Guidelines
- Follow the existing log style: prefix messages with a change marker (`~style:`, `+feature`, `!fix`) and keep the subject under 72 characters.
- Bundle related updates per commit, include screenshots for UI tweaks, and document Supabase changes in the PR description.
- Reference Jira/GitHub issues with `Refs #123` when applicable; note env var or migration impacts explicitly.
- Open PRs only after running lint/format scripts and, when schema changes, attaching the relevant `supabase/migrations` diff.

## Configuration & Secrets
- Never commit `.env.local`; document required vars in the PR body when introducing new ones.
- Use Supabase service keys with least privilege; rotate and update teammates through the secure vault rather than hardcoding secrets.
