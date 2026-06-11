---
name: Pathology Connections
description: A weekly pathology Connections game in the "Clinical Ledger" house style — graphite ink on cool paper, four muted category colors, a serif explanation voice against a sans control layer.
colors:
  paper: "#f4f5f7"
  surface: "#ffffff"
  ink: "#191c22"
  ink-2: "#565d68"
  ink-3: "#8b929c"
  line: "#e3e6ea"
  line-strong: "#cdd2d9"
  spine: "#16181d"
  accent: "#1f5562"
  accent-hover: "#184049"
  accent-tint: "#e7eef0"
  tier-1: "#b07d22"
  tier-1-wash: "#fbf4e6"
  tier-2: "#2f7d5b"
  tier-2-wash: "#edf5f0"
  tier-3: "#1f5562"
  tier-3-wash: "#e7eef0"
  tier-4: "#b0432f"
  tier-4-wash: "#fbede9"
typography:
  display:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  read:
    fontFamily: "Charter, \"Iowan Old Style\", \"Palatino Linotype\", Palatino, Georgia, \"Times New Roman\", serif"
    fontSize: "0.97rem"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "normal"
  tile:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif"
    fontSize: "clamp(0.62rem, 2.7vw, 0.84rem)"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "normal"
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif"
    fontSize: "0.72rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.05em"
  mono:
    fontFamily: "ui-monospace, \"SF Mono\", Menlo, Consolas, monospace"
    fontSize: "1.15rem"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "normal"
rounded:
  sm: "6px"
  md: "10px"
  lg: "14px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
components:
  tile:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    border: "1px solid {colors.line-strong}"
    rounded: "{rounded.md}"
  tile-selected:
    backgroundColor: "{colors.spine}"
    textColor: "{colors.surface}"
  solved-row:
    backgroundColor: "{colors.tier-1-wash}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
  button-primary:
    backgroundColor: "{colors.spine}"
    textColor: "{colors.surface}"
    rounded: "{rounded.sm}"
    padding: "11px 20px"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    border: "1px solid {colors.line-strong}"
    rounded: "{rounded.sm}"
    padding: "11px 20px"
---

# Design System: Pathology Connections

## 1. Overview

**Creative North Star: "The Clinical Ledger" — at play.**

This is the interest group's house design (shared with the Quiz Suite) bent to a puzzle game.
The reference points are a printed pathology atlas and a well-set exam booklet, not a game app.
The board is quiet and near-monochrome while you think; the work is done by typography,
alignment, and restraint. The single departure from a pure study tool is the payoff: when you
solve a group, *then* color arrives.

The defining move, carried over from the house system, is a split between two type voices.
Material to **absorb** — the post-game explanations, the instruction line, the result lines — is
set in a text serif, the way an atlas would. Material to **act on** — tiles, buttons, category
labels, the mistake counter, navigation — is set in a crisp system sans. That division is the
personality and the main reason the game doesn't read as machine-generated.

It explicitly rejects two looks at once: the AI-template look (navy bar, teal logo, gray cards,
gradient accents, emoji icons) **and** the bright NYT-Connections clone (saturated
yellow/green/blue/purple candy tiles). This board is muted, typographic, and image-capable.

**Key Characteristics:**
- Near-monochrome graphite ink on a cool off-white (never cream).
- Four muted category colors — ochre, green, petrol, brick — that appear only on solved groups.
- A serif explanation voice paired with a sans control layer.
- Image tiles are first-class: histology/clinical photos with tap-to-zoom.
- Flat by default. Hairline borders separate; shadows are reserved for overlays only. Zero emoji.

## 2. Colors

A printed-atlas palette: graphite ink, cool paper, and four deep muted hues that all share a
low-chroma, high-craft character. Nothing is bright; nothing glows.

### Structural
- **Spine** (#16181d): the near-black structural ink. Top bar, primary buttons, and — the one
  game-specific move — the fill of a **selected tile**. A picked tile reads as inked-in, not
  as a colored chip.
- **Petrol** (#1f5562): the single interactive accent. Focus rings, links, the "This week"
  badge. Used sparingly; rarity is the point. (Petrol is *also* tier 3 below — see the note.)
- **Ink / Ink-2 / Ink-3** (#191c22 / #565d68 / #8b929c): primary text, secondary/metadata,
  disabled/placeholder. Ink-3 never carries body copy.
- **Paper** (#f4f5f7) / **Surface** (#ffffff): app background and tiles/sheets.
- **Line** (#e3e6ea) / **Line-Strong** (#cdd2d9): hairline dividers and tile borders.

### The category ramp (the game's signature)
Four tiers, easiest to hardest, each a strong hue plus a light wash. The strong hue colors the
category dot and label; the wash fills the solved row. These reuse the house system's semantic
colors, repurposed here as difficulty categories:

| Tier | Meaning | Hue | Wash |
|------|---------|-----|------|
| 1 | easiest | Ochre #b07d22 | #fbf4e6 |
| 2 | — | Botanical green #2f7d5b | #edf5f0 |
| 3 | — | Petrol #1f5562 | #e7eef0 |
| 4 | hardest | Brick #b0432f | #fbede9 |

### Named Rules
- **The Calm-Until-Earned Rule.** No category hue appears on the board until its group is
  solved. Unsolved tiles are white on paper; selection is spine ink. The ramp is a reward.
- **The No-Cream Rule.** The background is cool off-white (#f4f5f7), never a warm
  cream/sand/parchment tint. Warmth here is an AI tell, not the brand.
- **Petrol does double duty, carefully.** Petrol is both the lone interactive accent and tier 3.
  That's intentional and fine because the two never compete on one element: focus rings live on
  unsolved/active chrome, tier-3 petrol lives on a solved row. Don't add a third petrol use.

## 3. Typography

**Display / UI / tile font:** system sans (SF Pro → Segoe UI → Roboto fallbacks).
**Reading font:** Charter (→ Iowan Old Style, Palatino, Georgia). Used for explanations,
the instruction line, and result text.
**Mono:** SF Mono / ui-monospace, for the on-screen result squares only.

System stacks are a deliberate choice: the whole game is a few self-contained static files for
GitHub Pages, so no web-font CDN is loaded and it renders instantly on a phone.

### Hierarchy
- **Puzzle title** (serif, 600, 1.5rem): the masthead title and sheet headings.
- **Explanation / result** (serif, 400, 0.97rem, 1.55): post-game teaching prose and the
  "Solved with N mistakes" line. The reading voice. Cap measure ~70ch in the review sheet.
- **Instruction** (serif, 400, 1.0625rem): "Create four groups of four."
- **Tile** (sans, 600, clamp 0.62–0.84rem): the term on a tile, with `word-break` so long
  medical terms wrap instead of overflowing.
- **Category label** (sans, 700, 0.72rem, +0.05em, uppercase): the solved-row and review-card
  category name. Deliberate and rare — it earns the caps because it's a small fixed set.
- **Body / controls** (sans, 400–600, ~0.9rem): buttons, archive rows, metadata.
- **Result squares** (mono): the shareable grid recap.

### Named Rule
**The Two-Voice Rule.** Serif is for reading (explanations, instruction, results) only. Sans is
for everything you tap, count, or scan (tiles, buttons, labels, nav). Never set a tile or button
in the serif; never set an explanation in the sans.

## 4. Elevation

Flat by default. Depth comes from hairline borders and the paper/surface tonal step. Shadows are
reserved for genuinely floating layers.

- **Menu** (`0 6px 20px rgba(20,24,33,0.10)`): popovers (unused today; reserved).
- **Modal** (`0 18px 50px rgba(20,24,33,0.20)`): the review, archive, and how-to-play sheets.
- **Focus ring** (`0 0 0 3px rgba(31,85,98,0.22)`): keyboard focus on tiles and controls.

**The Flat-By-Default Rule.** A surface at rest casts no shadow. A shadow means the element is
an overlay (sheet, lightbox) or has keyboard focus. Nothing else.

## 5. Components

### Tile (signature component)
- **Default:** white surface, 1px Line-Strong border, 10px radius, sans term centered, the whole
  square is the tap target. Long words wrap (`overflow-wrap: anywhere`).
- **Hover:** border → Ink-3, background barely warms to Paper.
- **Selected:** **Spine ink fill, white text**, a 1px lift. Reads as inked-in, not as color.
- **Image tile:** the picture fills the square (`object-fit: cover`) with an optional dark
  caption strip along the bottom and a small white **zoom button** top-right that opens the
  lightbox. Selecting is still the primary tap; zoom is a separate explicit control so the two
  don't collide. Selected image tile gets a 3px inset spine ring.
- **Solve animation:** a brief `pop`; **wrong guess:** a `shake`. Both respect reduced motion.

### Solved row
A full-width band above the shrinking grid. Tier wash background, a tier-colored category label
(dot + uppercase name), and the four member terms beneath in sans. Settles in with a small
slide (reduced-motion: instant). This is where category color first appears.

### Mistake counter
The word "Mistakes remaining" plus four ink dots; each spent guess fades and shrinks a dot to
Line-Strong. State is never color-only — the count is also the number of filled dots.

### Buttons
- **Primary:** Spine ink, white text, 6px radius, 11px 20px. Submit. Hover lifts to Ink.
- **Secondary:** white surface, 1px Line-Strong border, ink text. Shuffle, Deselect, sheet
  actions. Hover fills to Paper. Disabled at 0.45 opacity.
- Gently squared, never pill. Focus-visible shows the petrol ring.

### Review sheet (the teaching payoff)
A modal sheet listing all four groups in tier order. Each is a tier-washed card: category label,
member terms, any image thumbnails (tap to zoom), and the **explanation** in the serif reading
voice. Topped by a serif result line and the mono result-squares recap; footed by "Copy result"
and "Browse archive." Appears on both win and loss.

### Archive / How-to / Lightbox
- **Archive sheet:** one hairline-bordered row per past week (title + date, "This week" badge on
  the newest), each with Play and Takeaways actions.
- **How-to-play sheet:** a single serif paragraph in a paper-tinted card. No icon wall.
- **Lightbox:** full-screen dark scrim, the image centered on white, a serif caption, a close
  control top-right. Opened from tile zoom buttons and review thumbnails.

### Top bar
Spine ink, white sans wordmark next to a hairline-outlined grid glyph (a typographic mark, not a
logo in a colored square). Right side: "How to play" and "Archive" as ghost icon-buttons with
1.5px-stroke inline SVG icons.

### Builder (authoring surface)
Same identity, form-shaped. Four group cards, color-coded by a 4px left edge in the tier hue
(the one sanctioned colored left-edge, used as an authoring affordance, not decoration). Labeled
inputs, serif explanation textareas, a 2-column tile grid (term + optional image filename), live
validation (ok / warning / error), a spine-ink JSON output block, and a live preview that reuses
the review-card component. Generate → Copy → paste.

### Icons
Inline SVG, ~1.5px stroke, `currentColor`, ~16–18px. One line-icon family (grid, help, archive,
close, magnifier, chevron, pencil). **No emoji anywhere in the UI.** (The one exception is the
*copied-to-clipboard* share text, which uses colored-square emoji so the recap renders in other
apps; on-screen that same recap is drawn with CSS-colored mono blocks, not emoji.)

## 6. Do's and Don'ts

### Do
- **Do** keep category color off the board until a group is solved (Calm-Until-Earned).
- **Do** keep explanations and result text in the serif, everything operable in the sans
  (Two-Voice Rule).
- **Do** let long medical terms wrap inside tiles; test heading/tile copy at phone width.
- **Do** carry every solved/category state with a name plus color, never color alone.
- **Do** give image tiles alt text and a zoom path.
- **Do** keep one identity across game and Builder.

### Don't
- **Don't** reintroduce bright NYT-clone tiles (saturated yellow/green/blue/purple) or any
  candy-gamified look.
- **Don't** use the AI-template look: navy bar, teal logo, gray cards, gradient accents, tracked
  uppercase eyebrows over every block, emoji as icons.
- **Don't** use a warm cream/sand/parchment background (No-Cream Rule).
- **Don't** apply `background-clip:text` gradient text, side-stripe accents on content cards
  (the Builder's tier edge is the one sanctioned exception, as an authoring affordance), or heavy
  `0 20px 60px` drop shadows.
- **Don't** add a third petrol use to any element that already carries a focus ring or a tier-3
  solved state.
