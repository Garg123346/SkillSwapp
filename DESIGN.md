# Design Brief

## Direction

Crimson Quad — a warm-ivory academic exchange hall where burgundy and navy carry institutional weight and gold marks distinction.

## Tone

Refined academic elegance: generous whitespace, hairline borders, and restrained gold used like a library seal — never loud, always deliberate.

## Differentiation

A serif-led editorial hierarchy on warm ivory, with a deep-navy footer and gold eyebrow labels, making a student skill platform read like a faculty journal rather than a SaaS dashboard.

## Color Palette

| Token      | OKLCH        | Role                                            |
| ---------- | ------------ | ----------------------------------------------- |
| background | 0.978 0.006 85 | Warm ivory #FAF8F4 canvas                       |
| foreground | 0.235 0.03 265 | Deep navy-ink text for AA+ readability          |
| card       | 1 0 0        | Pure white raised surfaces                      |
| primary    | 0.37 0.135 12 | Burgundy #7A1735 — CTAs, active states, links   |
| secondary  | 0.29 0.05 258 | Deep navy #15263D — dark surfaces, footer, chips |
| accent     | 0.72 0.115 82 | Subtle gold — eyebrows, badges, focus ring      |
| muted      | 0.955 0.008 85 | Warm recessed fills and section alternation     |

## Typography

- Display: Fraunces — hero headlines, section titles, card names, serif authority
- Body: General Sans — paragraphs, nav, labels, buttons
- Mono: JetBrains Mono — stats, metadata, code-like details
- Scale: hero `text-5xl md:text-7xl font-semibold tracking-tight`, h2 `text-3xl md:text-5xl font-semibold tracking-tight`, label `text-xs font-semibold tracking-widest uppercase text-accent`, body `text-base md:text-lg text-muted-foreground`

## Elevation & Depth

Layered surfaces: ivory background, white cards with hairline borders and `shadow-subtle`, lifting to `shadow-elevated` on hover; no gradients on surfaces, only a subtle burgundy→navy token reserved for text/signature use.

## Structural Zones

| Zone    | Background        | Border     | Notes                                                   |
| ------- | ----------------- | ---------- | ------------------------------------------------------- |
| Header  | `bg-card`         | `border-b` | Sticky; white surface, serif wordmark, gold hover accents |
| Content | `bg-background`   | —          | Alternate sections with `bg-muted/40` for rhythm        |
| Footer  | `bg-secondary`    | `border-t border-accent/40` | Deep navy with ivory text and gold hairline |

## Spacing & Rhythm

Section gaps `py-16 md:py-24`; content grouped in `space-y-6`; micro-spacing `gap-3`/`gap-4` in cards and nav for airy rhythm.

## Component Patterns

- Buttons: `rounded-md`, burgundy primary with white text, gold-tinted ghost outline; hover darkens fill and lifts with `shadow-elevated`
- Cards: `rounded-xl`, `bg-card`, `border`, `shadow-subtle`; hover raises to `shadow-elevated` with `-translate-y-0.5`
- Badges: pill `rounded-full`, gold `bg-accent/15 text-accent-foreground` or navy `bg-secondary text-secondary-foreground`

## Motion

- Entrance: single fade-and-rise on section mount, 0.4s ease-out, staggered 60ms per item
- Hover: color/translate transitions via `transition-smooth` (0.3s cubic-bezier)
- Decorative: none — motion reserved for interaction feedback only

## Constraints

- Design tokens only: no raw hex, rgb, or arbitrary Tailwind colors in components
- Minimal Lucide line icons; no heavy gradients, glassmorphism, or clutter
- Light mode is primary; dark mode is a tuned navy inversion, not a naive flip

## Signature Detail

The gold hairline eyebrow label above every serif section title — a quiet academic seal that anchors the visual system.
