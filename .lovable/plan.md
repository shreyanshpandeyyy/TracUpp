## Goal

Make TracUP look like a normal, hand-built SaaS tool — simple, neutral, and easy to explain in an interview — instead of a flashy AI-generated template. Remove the stopwatch logo and use a text-only "TracUP" brand everywhere. Scope: the whole app (login + employee + manager + shared components).

## What makes the current design feel "AI-generated" (and what we change)

- **Stopwatch logo icon** in a colored rounded square → remove it; show plain text "TracUP".
- **Purple/indigo accent (#6366F1) + glowing gradient blobs** on the login panel → calm, single blue accent and a flat solid panel (no blur glows).
- **Emojis in headings** ("👋", "🎉") → remove for a professional tone.
- **Very rounded corners everywhere** (1rem radius, `rounded-2xl`) → smaller, conventional radius.
- **Heavy shadows + hover-lift animations** → lighter, subtler shadows; remove the lift-on-hover bounce.

## Changes

### 1. Design tokens — `src/styles.css`
- Reduce `--radius` from `1rem` to `0.5rem` so cards/buttons look conventional.
- Replace the indigo `--accent` with a calmer, professional blue; align `--ring` to it.
- Keep the neutral slate background and dark navy sidebar (they already read as clean/neutral).
- Soften `--shadow-card` / `--shadow-lift` to lighter, smaller shadows.
- Tone down `.hover-lift` (remove the translateY bounce, keep a subtle shadow change).

### 2. Branding — text only (remove logo)
- `src/routes/index.tsx` — remove the `Timer` icon + colored square in both the brand panel and the mobile header; keep just "TracUP" text. Remove the two gradient blur blob `div`s. Drop the unused `Timer` import.
- `src/components/tracup/DashboardShell.tsx` — remove the `Timer` icon square in the sidebar header and the mobile header; keep "TracUP" + role label as text. Drop the unused `Timer` import.

### 3. Remove emojis & soften copy
- `src/routes/employee.index.tsx` — remove "👋" from the greeting heading.
- `src/components/tracup/TaskCard.tsx` — remove "🎉" from the "Mark Complete" toast.
- Quick scan of other route files (`employee.*`, `manager.*`) for stray emojis and remove them.

### 4. Reduce roundness across shared components
Swap oversized `rounded-2xl`/`rounded-xl` for more standard `rounded-lg`/`rounded-md` in:
- `TaskCard.tsx`, `StatCard.tsx`, `PriorityBadge.tsx` (badges stay pill/rounded-full — that's fine), `CalendarStrip.tsx`, `DashboardShell.tsx`, and the login inputs/buttons in `index.tsx`.
- Keep the change visual-only; no logic changes.

### 5. Verify
- Run the build to confirm no leftover unused imports / broken classes.
- Screenshot the login + one employee + one manager page to confirm the cleaner look and that the logo is gone.

## Notes
- This is a presentation/styling pass only — no changes to auth, data store, routing, or business logic.
- The accent color is the main lever for "less AI". If you'd prefer near-monochrome (gray + black, no blue accent at all), I can go further — but "clean & neutral" with one calm blue is the safest interview-friendly look.

## Technical details
- Most of the visual shift comes from `src/styles.css` tokens (radius, accent, shadows), which cascade through all components automatically.
- Per-file edits are limited to removing icons/emojis/gradient blobs and adjusting a handful of Tailwind radius utilities.
- No new dependencies, routes, or files.
