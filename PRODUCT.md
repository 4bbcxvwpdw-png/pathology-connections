# Product

> Scope note: this file describes the **Pathology Connections** game (a standalone static
> site in this folder, hosted on GitHub Pages). It is a sibling of, not the same as, the
> AnkiCards Quiz Suite — that project has its own PRODUCT.md. Both deliberately share the
> "Clinical Ledger" visual identity; see DESIGN.md.

## Register

product

## Users

Two audiences, one surface:

- **Players** — M1 and M2 students at the medical school. They arrive from a weekly email
  link, usually on a phone, on their own time, with a couple of free minutes. M2s want a fast,
  low-stakes spaced-review hit; M1s want an approachable on-ramp to pathology that doesn't feel
  like a graded assignment. No account, no login, no streak pressure beyond a private local one.
- **Authors** — the pathology interest group leadership (Thirth + peers). Once a week they open
  the private Builder page, type a puzzle, and paste it into one data file. They are not
  engineers; the authoring path has to be copy-paste simple.

## Product Purpose

A weekly NYT *Connections*-style pathology puzzle: sixteen terms, four hidden groups of four,
four mistakes allowed. After every puzzle — win or lose — the player gets a short explanation
of each group. The puzzle is the hook; the explanation is the point.

Success looks like: students actually open it each week; it reads as a credible product made by
the interest group, not a hobby toy or an AI template; the post-game review teaches something an
M1 didn't know and an M2 had half-forgotten; and the leadership can ship a new puzzle in a few
minutes without touching code. Hosted free on GitHub Pages; updated weekly through the Builder.

## Brand Personality

Clever, clean, collegial. It is a game, so it should feel inviting and a little fun, but it
lives in the same serious clinical aesthetic as the group's other tools — the restraint is what
signals "made by people who respect your time and your intelligence." It should feel like a
sharp resident set this puzzle for you over coffee, not like a brightly gamified quiz app.

## Anti-references

- **The generic "AI-made" look.** Navy top bar, teal rounded-square logo mark, gray card
  surfaces, evenly tracked uppercase eyebrows over every section, gradient accents, emoji as
  icons. The single thing to stay away from.
- **A bright, candy-colored NYT-Connections clone.** The real NYT game's saturated
  yellow/green/blue/purple tiles were *deliberately rejected* in favor of the muted house
  palette. Recognizable as Connections, not a reskin of it.
- **Kahoot / Duolingo gamification.** Bouncy mascots, confetti, big primary-color fills,
  playful sound. Wrong register for a study tool, even a fun one.
- **A clinical worksheet.** The opposite failure: so austere it reads as homework. There is a
  game here; it should feel like one.

## Design Principles

- **Calm until earned.** The board stays near-monochrome while you play; category color is the
  reward that arrives only when a group is solved. Restraint makes the payoff land.
- **Teach on the way out.** The end-of-game review with per-group explanations is a first-class
  screen, not a footnote. Every finished puzzle leaves the player with something.
- **One system, two surfaces.** Game and Builder share a single identity, the same "Clinical
  Ledger" the Quiz Suite uses. Players and authors should feel they're in the same world.
- **Phone-first, friction-free.** It opens from an email link and is playable in two minutes
  with no account. Nothing gates the first tap.
- **Distinct, not default.** Avoid both traps: the AI-template look *and* the obvious
  bright-NYT clone. The muted, typographic, image-capable board is the differentiator.

## Accessibility & Inclusion

Target WCAG 2.1 AA.

- **Never color alone.** A solved group always carries its category *name* plus a colored dot,
  and difficulty is also conveyed by order, so the four tiers are distinguishable without hue.
- **Contrast.** Body and explanation text (serif, on white or tinted washes) and tile text must
  hold ≥4.5:1; the tinted solved-row washes are kept light enough that ink text stays legible.
- **Keyboard + focus.** Tiles and controls are real buttons, keyboard operable, with a visible
  petrol focus ring. Overlays close on Escape.
- **Reduced motion.** The shake / pop / settle / reveal animations have a
  `prefers-reduced-motion` fallback that collapses them to near-instant state changes.
- **Images.** Histology/clinical tiles have alt text and a tap-to-zoom lightbox so low-vision
  players can read slide detail.
