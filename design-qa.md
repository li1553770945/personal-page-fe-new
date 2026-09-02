# Design QA — Blog card separation refinement

- Source visual truth: `C:\Users\15537\AppData\Local\Temp\codex-clipboard-17180123-8e5c-4918-a809-c56d1648da30.png`
- Scope: borrow the reference's clear article separation without copying its palette, large-card scale, feed icon, or composition.
- Desktop implementation: `K:\code\personal-page\design-qa-assets\implementation-blog-relaxed-desktop-v1.png`
- Dark-theme implementation: `K:\code\personal-page\design-qa-assets\implementation-blog-relaxed-dark-list-v1.png`
- Mobile implementation: `K:\code\personal-page\design-qa-assets\implementation-blog-relaxed-mobile-v1.png`
- Side-by-side comparison: `K:\code\personal-page\design-qa-assets\design-comparison-relaxed-cards.png`
- Desktop viewport: 1440 × 1024 CSS px, device scale factor 1; screenshot pixels 1425 × 1013
- Mobile viewport: 390 × 844 CSS px; rendered page width 375 px with no horizontal overflow
- Source pixels: 1290 × 1602
- Density normalization: the dark reference and dark implementation were scaled to equal-width panels; the intentionally different card heights are preserved rather than stretched
- State: `/blog`, 96 posts loaded, no filter, pinned-first sort, desktop light/dark and mobile dark states

## Findings

- No actionable P0, P1, or P2 findings remain.
- [P3] The reference cards are intentionally much taller and include a feed icon.
  - Location: article cards.
  - Evidence: the reference uses editorial cards with large internal whitespace and an RSS mark; the implementation keeps a balanced 118 px directory rhythm and existing metadata.
  - Impact: the implementation feels denser and more utility-oriented, matching the preceding user direction.
  - Resolution: accepted as intentional differentiation; only the separation treatment is adopted.
- [P3] Real article records have fewer cover images than the reference.
  - Location: article media column.
  - Evidence: the component displays a cover when provided, while the visible records are mostly text-only.
  - Resolution: accepted as a content constraint; no fake image placeholders were added.

## Required Fidelity Surfaces

- Fonts and typography: existing Geist typography, title hierarchy, 13/20 summaries, and compact metadata remain unchanged; the border treatment does not disturb wrapping or truncation.
- Spacing and layout rhythm: every article has its own rounded 1 px boundary, 12 px inter-card gap, 18 px vertical padding, and 3 px leading accent. The revised 118 px desktop rhythm avoids both the original loose layout and the interim long-strip appearance.
- Colors and visual tokens: light mode uses the site's neutral card surface plus a low-opacity steel-blue accent; dark mode uses its existing navy-neutral tokens. Pinned items use amber only on the leading accent, giving it semantic meaning rather than decorative variation.
- Image quality and asset fidelity: existing favicon, Live2D asset, and backend covers remain untouched; no new raster or code-drawn visual was required.
- Copy and content: titles, categories, tags, dates, likes, comments, and hidden view-count policy are unchanged.

## Interaction Verification

- The full article card still opens `/blog-shell?slug=b19f32` in development.
- Card hover and keyboard focus classes retain a visible border/background/elevation response without changing layout.
- Desktop light mode, desktop dark mode, and mobile dark mode render all 96 cards without document-level horizontal overflow.
- Desktop and mobile browser consoles report no errors.

## Comparison History

- Earlier implementation: compact rows were separated only by horizontal dividers, so adjacent articles could visually merge.
- First fix: introduced individual low-contrast borders, an 8 px gap, and 104 px card height.
- User follow-up: that version read too much like a stack of long, narrow strips.
- Second fix: increased desktop card height to 118 px, vertical padding to 18 px, and inter-card spacing to 12 px while preserving the restrained blue/amber accents.
- Post-fix evidence: the light, dark, mobile, and side-by-side captures show a more balanced card proportion without returning to oversized editorial cards.
- Formal comparison pass: no actionable P0/P1/P2 differences remain for the requested separation treatment.

## Focused Comparison Evidence

- `design-comparison-relaxed-cards.png` focuses on the article list in the same dark state. Borders, leading accents, corner radius, increased vertical padding, inter-card spacing, metadata placement, and intentional scale differences are readable without an additional crop.

## Implementation Checklist

- [x] Added an individual border and subtle surface to every article.
- [x] Added semantic leading accents for normal and pinned posts.
- [x] Preserved compact density, filters, sorting, tags, and full-card links.
- [x] Checked light, dark, and mobile states.
- [x] Targeted ESLint, production build, browser navigation, console checks, responsive checks, and visual comparison completed.

## Follow-up Polish

- If desired later, cover-bearing articles can use a slightly stronger media border while text-only notes remain quieter.

final result: passed
