@AGENTS.md

# Vyaam — Expo App Frontend Setup

Briefing for Claude Code to start frontend implementation. Place this file at the root of the Expo project — Claude Code reads it automatically at the start of every session.

## What this project is

Vyaam is a fitness trainer marketplace app for India (Hisar/Delhi NCR launch). **One app, not two** — customers and trainers share a single codebase with role-aware navigation, not separate apps. 117 screens have been fully designed in Figma; this phase builds the Expo (React Native) frontend against that design.

## Reference materials — read these before writing screens

Figma file link: https://www.figma.com/design/XGneuIxWiSwOptsUsmA4Mh/Vyaam?node-id=24-8&m=draw

- **Figma file key: `XGneuIxWiSwOptsUsmA4Mh`** — "Design" page (id `3:16`) holds all 117 screens; "Brand Guide" page (id `0:1`) holds every color/type/component style used to build them. If Figma Dev Mode or an MCP connector is available in this environment, inspect the Brand Guide page directly rather than guessing values — see the color note below for why this matters.
- **`Vyaam_Figma_Build_Report.docx`** — full inventory of all 117 screens grouped by module, in build order.
- **`Vyaam_Backend_API_Specification.docx`** — every endpoint, the two pagination conventions, and the error envelope. Frontend API calls must match this exactly, not improvise a shape.

## Tech stack

- **Expo** (React Native), **TypeScript** throughout — no untyped `.js` files.
- **Navigation**: React Navigation — bottom tabs + stack per role. Customer tabs and Trainer tabs are different tab sets on the same account (see Trainer/Home vs Customer/Home in the Figma file); switching role via `/me/switch-role` should swap the active navigator, not launch a different app shell.
- **State management**:
  - **Zustand** for anything genuinely global and cross-screen: auth/session, current user profile, active role (customer/trainer), unread-notification count, in-progress AI-plan-generation job status.
  - **React Context** only for narrow, rarely-changing concerns: theme (light/dark), and nothing else unless a real case shows up. Don't reach for Context as a second global store — if it needs to update often or from many places, it belongs in Zustand.
  - No Redux. Not needed at this scale, and it wasn't asked for.
- **Lists**: `FlatList` (or `FlashList` if the team wants better perf on very long lists like chat) for every scrollable list — trainer search results, leads, notifications, chat messages, logs. Never `ScrollView` + `.map()` for anything that can exceed ~15 items.

## Design tokens — colors, spacing, type

Create a single `theme/` module that is the **only** place raw color/size/font values are allowed to appear. No screen or component should contain a hardcoded hex value, pixel size, or font name — everything reads from tokens.

**Colors confirmed from the brand guide:**

- Sand (background) — `#FAF7F0`
- Ink green (primary dark / text-on-light) — `#0F3D34`
- Saffron (accent, used sparingly for "energy moments" — never as a primary button or large text block, it fails contrast at size) — `#E8762C`

**Colors that must be pulled from Figma, not guessed:** the full token set used throughout the build also includes a deeper ink shade for headings, a muted gray for secondary text, a hairline border/divider gray, saffron-tint and verified-green tint backgrounds for badges, and semantic danger/warning/info colors. These were used consistently across all 117 screens but their exact hex values live in the Brand Guide page's paint styles — inspect that page directly (Figma Dev Mode → paint styles, or via the Figma API/MCP connector using the file key above) rather than reconstructing them from memory. Getting one of these slightly wrong is an easy, hard-to-notice bug across dozens of screens.

**Typography**: Plus Jakarta Sans, weights ExtraBold/Bold/SemiBold/Medium/Regular. A type scale (H1 through H5, Body, Body Secondary, Caption) was used consistently — pull the exact size/line-height/weight for each from the Brand Guide page's text styles rather than guessing; screens throughout the build reused these exact styles by name, so the mapping should be 1:1.

**Shape**: pill radius (fully rounded, effectively 999) for every button, input, and chip; 20px corner radius for cards; 14–16px for small nested elements (icon circles, thumbnails). No shadows anywhere — the brand is intentionally flat.

**Spacing**: build a small numeric scale (e.g. 4/8/12/16/20/24/28/32) rather than one-off magic numbers per screen; the Figma build consistently used 24px screen margins and 8–12px gaps between related elements.

## Dark / light mode

- **Default: light.** Ship light mode first and correctly; dark is a parallel palette, not an afterthought bolted on later.
- Every token in `theme/` needs a light value and a dark value — structure it as `theme.light.colors.X` / `theme.dark.colors.X`, not scattered conditional logic per component.
- Respect the system color scheme on first launch, but let the user override it explicitly in Settings, and persist that override (the Settings module already has an Account/Notification/Privacy settings pattern in Figma — a dark-mode toggle fits naturally there, though it wasn't an explicit screen in this design pass).
- The theme (light/dark, plus which palette is active) is exactly the kind of narrow, infrequently-changing global state that belongs in the Context exception above, not Zustand.

## Global/shared components

Build one reusable component per Figma component — do not let screens each build their own button or input. At minimum:

- `Button` — variants: Primary / Secondary / Accent / Ghost / Destructive / Disabled, sizes: Small / Medium / Large (matches the Figma component set exactly)
- `Input` — the text field used throughout forms (label optional/hideable, placeholder, optional trailing unit text)
- `Pill` — used both as a selectable chip (Default/Dark = unselected/selected) and as a segmented-control option
- `Switch` — the on/off toggle used in every settings and preferences screen
- `Badge` — Verified / Pending / Suspended / Online Only / Draft, plus two solid states. **Known gap**: no promotional/saffron badge variant exists in the Figma component set yet, even though the pattern (OFFER / NEW BATCH / FREE SESSION tags, etc.) recurs across the Home feed and several plan-ready screens. Build it as a proper reusable component now rather than repeating the one-off frames used in the design file.
- `Card` — the base white rounded container almost every screen's content sits in

Keep variant logic inside the component via props/enums, not via separate near-duplicate components per variant.

## Performance & memoization

- Wrap purely presentational components in `React.memo`.
- `useCallback` for any function passed down as a prop, especially `renderItem` and `keyExtractor` for `FlatList`.
- `useMemo` for derived data — filtered/sorted lists, computed totals, anything non-trivial recomputed on every render.
- Avoid creating new inline objects/arrays/functions directly in JSX props on components wrapped in `memo` — it silently defeats the memoization.
- Split large screens into smaller components rather than one large file per screen; several screens in this design (Trainer Profile, Client Detail, Progress Charts) have enough independent sections that they should not be single monolithic components.
- For `FlatList`s with fixed-height rows (most list screens here — trainer cards, log rows, notification rows all have consistent heights), supply `getItemLayout` to skip layout measurement.

## API integration

- One typed API client module, not raw `fetch()` calls scattered through screens.
- Match `Vyaam_Backend_API_Specification.docx` exactly: Style A pagination (`page`/`limit`, response has `data` + `pagination.hasMore`) for every list screen except chat; Style B (cursor-based `before`/`limit`) specifically for chat message history.
- Branch "load more" logic off `hasMore` in the response, never off comparing `data.length` to the page size.
- Handle the standard error envelope (`error.code`, `error.message`, `error.field`) centrally so every screen doesn't reimplement error parsing.

## Build order

Follow the phased rollout already established for the product: **Phase 1** — onboarding/auth, AI diet & workout plan generation, calculators, logs & tracking (no marketplace supply needed for any of this). **Phase 2** — Discover, the full request/bidding/session marketplace loop, chat. **Phase 3** — Trainer Mode, community (not yet designed — flagged as an open gap), payments. Build and ship screens in that order rather than jumping around the file.

## Known open items carried over from design (don't silently resolve these in code)

- Equipment intake screen should only appear conditionally when "At home" is selected as training location — the Figma flow shows it unconditionally since static frames can't express conditional logic; the app must gate it properly.
- Session check-in trust model (self-report vs. mutual confirmation vs. geofence) is undecided — don't hardcode an assumption into the check-in flow without confirming.
- Chat contact-masking redaction rules (what patterns get auto-hidden) aren't specified at the regex level yet.
- All calculator formulas, progress-chart data, and streak logic were illustrative in the design and need real computation implemented per the API spec, not just wired to static numbers.
