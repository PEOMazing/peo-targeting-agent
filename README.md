# Gabriel Revnew × Gusto — Deployment

## Upload to the existing repo (replaces the Targeting Agent)

1. In the GitHub repo, DELETE these if they exist (open each → trash icon → commit):
   - the old `app/` folder (or `src/` folder) — delete the whole directory
   - `tsconfig.json`
   - any old `next.config.js` / `next.config.ts`
   - `package-lock.json`
2. Click **Add file → Upload files** at the repo root.
3. Drag in EVERYTHING from this unzipped folder (the `app` folder, `package.json`,
   `next.config.mjs`, `.gitignore`, `README.md`).
4. Commit. Vercel auto-deploys in ~90 seconds.

## Test before sharing
- Password gate appears, nothing visible behind it
- GUSTOWINS unlocks (any casing works)
- Welcome letter appears → "Explore the site" dismisses
- All 9 tabs work on mobile; take a quiz, watch the stamp

## Notes
- Password: GUSTOWINS (set in app/page.jsx — search "GUSTOWINS" to change it)
- Keep the repo PRIVATE (Settings → Change visibility)
- Search engines are told not to index the site (robots: noindex)
