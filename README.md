# Pathology Connections

A weekly NYT *Connections*-style puzzle for the pathology interest group. Sixteen terms,
four hidden groups of four, four mistakes allowed. After each puzzle, players get a short
explanation of every group — quick review for M2s, a relevant teaser for M1s.

It's a plain website (no server, no database), so **GitHub Pages hosts it for free**.

---

## The files

| File | What it is |
|------|------------|
| `index.html` | The game players open. |
| `builder.html` | Your private tool for making each week's puzzle. (Not linked from the game.) |
| `puzzles.json` | **The one file you edit each week.** All puzzles live here. |
| `images/` | Histology / clinical pictures, dropped in by file name. |
| `styles.css`, `game.js` | The look and the logic. You don't need to touch these. |

---

## Posting a new puzzle each week (the whole routine)

1. **Open `builder.html`** (bookmark it). Fill in the date, a title, the four categories, the
   sixteen terms, and a one–three sentence explanation per group. Click **Generate**, then **Copy**.
2. **If your puzzle uses images:** on GitHub, open the `images` folder → **Add file → Upload files**
   → drag your picture in. Then in the Builder, type just that file name in the image box.
3. **Open `puzzles.json` on GitHub** → click the pencil (✏️ Edit) → paste your copied block inside
   the `"puzzles": [ ... ]` list (put a comma after the previous puzzle) → **Commit changes**.
4. Wait about a minute. The live site updates itself and shows the newest puzzle automatically;
   older ones move into the **Archive**.
5. **Paste the site link into your weekly email** and send.

That's it. You never touch the code.

> Tip: in the Builder, click **"Load the sample to edit"** to start from the example puzzle
> instead of a blank form.

---

## Hosting it (one-time setup — do this with Claude)

1. Make a free account at **github.com**.
2. Create a new **public** repository (name it e.g. `pathology-connections`).
3. Upload all these files into it (drag-and-drop in the browser).
4. In the repo: **Settings → Pages → Source: Deploy from a branch → `main` / `root` → Save**.
5. GitHub gives you a link like `https://YOURNAME.github.io/pathology-connections/`. That's the game.

(Public is required for free hosting. The puzzle answers technically live in the file — fine for a
friendly review game; people just won't peek.)

---

## A note on the sample images

The four pictures in `images/` are **placeholders** (clearly labeled) so you can see the image
feature working. Swap them for real histology/clinical photos you have the rights to use — just
upload a new file with the same name, or use a new name and update it in the Builder.

---

## Editing a puzzle by hand (if you ever skip the Builder)

Each puzzle looks like this — copy a block, change the words, keep the punctuation:

```json
{
  "date": "2026-06-22",
  "title": "Week of June 22",
  "author": "Pathology Interest Group",
  "groups": [
    {
      "name": "Your category name",
      "tier": 1,
      "explanation": "One to three sentences shown after the puzzle.",
      "tiles": [
        { "text": "Term one" },
        { "text": "Term two" },
        { "text": "Term three" },
        { "image": "images/your-picture.jpg", "alt": "what it shows", "text": "caption" }
      ]
    }
  ]
}
```

- `tier` is the difficulty color: **1** = easiest (ochre), **2** = green, **3** = petrol, **4** = hardest (brick).
- Each group needs exactly **4 tiles**; each puzzle needs exactly **4 groups**.
- A tile is text (`"text"`), an image (`"image"` + `"alt"`), or an image with a caption (both).
