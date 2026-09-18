# AESTHETIC SURVILLENCE - PART 1 & PART 2

## Student project
Organisation: Aesthetic Survillence
Founder/owner: Trevor Makhubela
Module: WEDS0520POE (Part 1 + Part 2)

## Scope note
Part 1 delivered a clean HTML foundation, an AI-generated hero image and
working page-to-page navigation across five pages. **Part 2 adds the full
CSS styling layer** — `css/style.css` is now populated with the black/white/
gold visual treatment, typography, layout and responsive design that Part 1
deliberately left out. It does **not** implement Part 3's JavaScript/SEO
functionality — `js/` stays empty until then.

None of the five HTML files were renamed, restructured, or had classes
changed to make the CSS work — `style.css` was written to target the markup
exactly as submitted in Part 1.

## 1. Folder structure
```text
AESTHETIC_SURVILLENCE_PART1_SIMPLE/
├── index.html
├── about.html
├── services.html
├── enquiry.html
├── contact.html
├── README.md
├── assets/
│   └── logo.svg
├── images/
│   ├── hero-ai-generated.png
│   └── services/
│       ├── drone-surveillance.png
│       ├── secure-transport.png
│       ├── vip-protection.png
│       ├── armed-response.png
│       ├── site-security.png
│       └── security-consulting.png
├── css/
│   └── style.css              ← Part 2: fully styled, was empty in Part 1
├── js/
│   └── (empty — reserved for Part 3)
└── docs/
    ├── website-project-proposal.docx
    ├── content-research-and-sourcing.md
    ├── sitemap.svg
    ├── low-fidelity-wireframe.svg
    └── part1-placement-guide.md
```

## 2. Where to put everything
1. Drop `style.css` into the existing `css/` folder — same filename, same
   path, so the `<link rel="stylesheet" href="css/style.css">` already in
   every page picks it up with no HTML changes.
2. Keep `assets/logo.svg` and everything under `images/` exactly where they
   already are — the stylesheet references them by those same paths
   (`.brand img`, `.hero-image`, `.service-image`).
3. Leave `js/` empty — that's Part 3's job.
4. Leave `docs/` as-is.

## 3. How to open the website
1. Open the project folder in Visual Studio Code.
2. Open `index.html` in a browser, or use the Live Server extension.
3. Test Home → About → Services → Enquiry → Contact, and resize the
   browser (or use dev tools' device toolbar) to check the responsive
   behaviour described below.

## 4. What Part 2 added

- **External stylesheet**: `css/style.css` is the single stylesheet linked
  identically by all five pages — no inline `<style>` blocks.
- **Base style + reset**: consistent font family, colour scheme, spacing
  and a CSS reset so the site renders the same across browsers.
- **Typography**: a `clamp()`-based, rem-driven type scale for `h1`/`h2`/
  `h3`, a serif display face (Cormorant Garamond) paired with a sans body
  face (Jost) and a mono label face (Space Mono) for the `.eyebrow` tags.
- **Layout structure**: CSS Grid for `.hero` and `.grid` (mission/vision/
  values cards, contact location cards), Flexbox for `.nav`, `.stats`,
  `.service-row` and `.form-grid`.
- **Visual styling**: colour, background, border and `box-shadow` applied
  to `.card`, `.service-image`, `.hero-image` and `.btn` for depth and
  hierarchy, all within the black/onyx/bone/gold palette.
- **Pseudo-classes**: `:hover` (nav links, buttons, cards, service images),
  `:focus-visible` (nav links, form fields) and `:active` (buttons, form
  fields) are used throughout for interactive feedback. The current page in
  the nav is styled off the `aria-current="page"` attribute already in the
  markup, rather than adding a JS-toggled class.
- **Animation/transitions** (pure CSS, no JavaScript — six-plus distinct
  effects): a fade-and-rise entrance for the hero content, a slow rotating
  gold sweep behind the hero, a colour-fill sweep on button hover, a lift +
  shadow on card hover, an image scale on service-row hover, and an
  underline sweep on nav-link hover.
- **Responsive design**: three breakpoints —
  **Tablet ≤1024px** (hero collapses to one column, card grids go 2-up),
  **Mobile ≤700px** (nav stacks, all grids go single-column, service rows
  stack image-under-text, form goes single-column, buttons go full-width),
  **Small mobile ≤420px** (tightened side padding). Images use
  `max-width: 100%`, `object-fit: cover` and set `aspect-ratio`s so they
  reflow cleanly at every size without needing separate cropped files.
- **Relative units**: spacing, type sizes and layout widths are expressed in
  `rem`, `em`, `%` and `clamp()` rather than fixed `px`, so the page scales
  with the browser's root font size.

## 5. Changelog

### Part 2 — [current submission]

**Feedback received on Part 1: 84/100 (Level 4).** Specific items addressed
this submission:

| Part 1 feedback item | Score | Change made in Part 2 |
|---|---|---|
| HTML Structure — Comments | 0/5 ("No comments added to code") | Added explanatory HTML comments to every section of all five pages (header/nav, hero, panel, grid, service-row, form, footer) — see `index.html`, `about.html`, `services.html`, `enquiry.html`, `contact.html`. |
| GitHub — README completeness | 2/5 ("incomplete or lacks detail") | Rewritten with full folder structure, placement instructions, a detailed "what Part 2 added" section, testing notes and a References section (this document). |
| GitHub — Changelog | 0/5 ("No changelog provided") | This table, plus the Part 1 entry below it, is that changelog going forward — update it every time you push a meaningful change. |
| Website Project Proposal — Wireframes | 1/2 ("incomplete or lack detail") | **Not fixed here** — lives in the Word proposal document, not the website files. Needs more detailed low-fidelity wireframes before resubmission if the proposal itself is being revised. |
| Website Project Proposal — Budget | 1/3 ("vague or unrealistic") | **Not fixed here** — same as above, needs realistic line-item figures added to the proposal document. |

Items already at full marks in Part 1 (design aesthetic, technical
requirements, timeline, two proposals submitted, GitHub commit history) were
left as-is — no changes needed there.

**Other Part 2 work:**
- Populated `css/style.css` (previously empty) with a full desktop style
  system: CSS reset and base styles, a rem-based typography scale
  (Cormorant Garamond / Jost / Space Mono), Grid and Flexbox layout for the
  hero, card grids, service rows, nav and form, and a black/onyx/bone/gold
  colour and box-shadow treatment.
- Added `:hover`, `:focus-visible` and `:active` pseudo-class styling to
  every interactive element (nav links, buttons, cards, form fields,
  service images), including six-plus distinct CSS-only transitions/
  animations (hero fade-rise-in, rotating gold sweep, button fill-sweep,
  card lift, service-image zoom, nav-link underline).
- Added three responsive breakpoints — tablet (≤1024px), mobile (≤700px),
  small mobile (≤420px) — adjusting layout, typography, navigation and
  image sizing at each (full detail in §4 above).
- No HTML structure, classes, or ids were changed — only comments were
  added and `css/style.css` was populated.

### Part 1 — [previous submission]
- Initial HTML structure created for Home, About, Services, Enquiry and
  Contact using semantic tags.
- File and folder structure established (`assets/`, `images/`, `css/`,
  `js/`, `docs/`).
- AI-generated hero and service images added.
- Navigation linked across all five pages.

## 6. References

- **Fonts:** Google Fonts — Cormorant Garamond, Jost, Space Mono. Licensed
  under the SIL Open Font License. Loaded via `@import` in `css/style.css`.
  `https://fonts.google.com`
- **CSS techniques referenced during development:** MDN Web Docs, for
  `clamp()`, `aspect-ratio`, `object-fit`, `conic-gradient()` and the
  `prefers-reduced-motion` media feature.
  `https://developer.mozilla.org/en-US/docs/Web/CSS`
- **Hero and service images:** AI-generated for this academic project (see
  Part 1 documentation in `docs/` for the specific tool and prompts used).
- Add any further sources used while researching real security-industry
  content, colour/type direction, or code you adapted from a tutorial,
  here, in the format required by the Harvard Style Referencing Guide
  (Adapted for the IIE) — this list only covers what was used to build the
  CSS layer in Part 2.

## 7. Testing notes
Resize-tested against the breakpoints above at approximately 1440px
(desktop), 1024px and 820px (tablet), and 700px / 375px (mobile). Take a
screenshot of the site at each width and include them in your submission —
this README doesn't embed them directly.

