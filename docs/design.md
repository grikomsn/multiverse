# Design direction (draft)

Primary reference: Poti Poti Studio's _Is This Seat Taken?_ (local art in `references/`, not committed). The studio describes its goal as simplified, cute, instantly readable characters; Apple called the game “a tricky puzzler dressed up as a Saturday morning cartoon” whose interface hides its own easter eggs.

## Palette (sampled from the key art and screenshots)

| Token         | Hex       | Where it shows up in the game   |
| ------------- | --------- | ------------------------------- |
| `paper`       | `#fee4ba` | Page/backdrop                   |
| `paper-deep`  | `#edd5ab` | Cinema wall, recessed areas     |
| `paper-shade` | `#dac6a7` | Halftone dots, shadows on paper |
| `ink`         | `#35374e` | Outlines, display type          |
| `ink-soft`    | `#565265` | Speech bubbles, secondary text  |
| `terracotta`  | `#e07a5f` | Bus body, primary accent        |
| `sage`        | `#81b29a` | Seats, trees, taxi trim         |
| `mustard`     | `#ffb133` | Hats, taxi, highlights          |
| `seat`        | `#a97262` | Cinema seats, warm secondary    |

Wired as Tailwind `@theme` tokens in `apps/web/src/styles/global.css`.

## Motifs to borrow

- Thick, rounded ink outlines (3–4px) on cards, buttons, avatars.
- Halftone/dot-grid paper grain; keep it away from body copy.
- Slightly rotated cards and labels (±1–3°), tilted “ticket” and “notepad” panels (the Confirm notepad, the passenger card).
- Speech bubbles with a tail for asides, tooltips and empty states.
- A route/progress rail with dots (the top-of-screen journey bar) for timelines and pagination.
- Seat grids: the seat-selector playground from v8/v9 is a natural fit for an interactive “where I've sat” career map or an easter egg.
- Characters as simple geometric faces (circle, square, pentagon) with expressions; one could be a Griko avatar.

## Type candidates (licensed, local only)

- **Timeless Serif** (bold): chunky display serif close to the “seat taken?” lettering.
- **Timeless Sans / Grotesk**, **Nohemi**, **Origin**: sans candidates for UI and body.
- **Neue Regrade** (variable, ink traps): accent/labels.

Font files stay out of git (see AGENTS.md). Load them with Astro's Fonts API (local provider) from `assets/fonts` at build time.

## Other references

- Lynn Fisher (lynnandtonic.com): yearly illustrated self-redesigns, character-driven.
- Josh Comeau (joshwcomeau.com): playful, retro, delightful micro-interactions.
- neal.fun: small browser games as content.
- Robby Leonardi, Bruno Simon: portfolio-as-game (too heavy for us; take the spirit, not the 3D).
- Halftone and scrapbook styles in product sites (Greptile, Granola; Cntrl for stickers), via bestsaaswebdesigns.com “50 Design Styles”.

Sources: [Thinky Games interview](https://thinkygames.com/features/make-sure-everyones-happy-in-the-new-demo-for-is-this-seat-taken-an-interview-with-the-developers/), [Apple Design Awards Q&A](https://developer.apple.com/news/?id=z12xq8fa), [But Why Tho review](https://butwhytho.net/2025/09/is-this-seat-taken-review-poti-poti/), [Elementor developer portfolios](https://elementor.com/blog/best-web-developer-portfolio-examples/), [Really Good Designs interactive portfolios](https://reallygooddesigns.com/interactive-portfolio-examples/), [50 Design Styles](https://bestsaaswebdesigns.com/blog/design-styles).
