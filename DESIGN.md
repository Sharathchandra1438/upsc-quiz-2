# Lead Discovery Platform — Design Brief

## Aesthetic
Dark glassmorphism SaaS with premium tech identity. Refined, professional, confident.

## Tone & Purpose
Trust and clarity for B2B lead discovery. Users scan data quickly, act decisively on business opportunities.

## Color Palette
| Token | OKLCH | Intent |
|-------|-------|--------|
| Primary | `0.55 0.12 260` | Confident navy blue, tech-credible |
| Accent | `0.68 0.16 155` | Emerald green, growth & opportunity |
| Chart-1 | `0.68 0.16 155` | Hot leads (badge emerald) |
| Chart-2 | `0.72 0.15 70` | Warm leads (badge amber/gold) |
| Chart-3 | `0.65 0.19 22` | Cool leads (badge orange) |
| Destructive | `0.65 0.19 22` | Red alerts, low-priority leads |
| Background | `0.08 0 0` | Deep black, minimal distractions |
| Card | `0.12 0.01 260` | Subtle navy, glassmorphic container |
| Foreground | `0.96 0 0` | Near-white text, AA+ contrast |

## Typography
**Display:** Space Grotesk — bold, geometric, tech-forward headlines
**Body:** DM Sans — neutral, readable at all sizes, excellent for data tables
**Mono:** Geist Mono — for API codes, data extraction examples

## Shape Language
Moderate radii (8px, 12px) for modern softness. `--radius: 0.5rem` base. Subtle shadows for depth without visual noise.

## Structural Zones
| Zone | Treatment | Intent |
|------|-----------|--------|
| Header | Glassmorphic card, dark background | Navigation hub, map integration |
| Sidebar | Solid dark with accent highlights | Navigation, filters, saved searches |
| Main Content | Dark background, alternating card zones | Lead grid, analytics, export |
| Cards | Glassmorphic (blur + transparency) | Individual lead data, high information density |
| Badges | Color-coded (emerald/amber/orange) | Instant lead score recognition |

## Signature Details
- **Glassmorphic cards:** `backdrop-filter: blur(12px)` with semi-transparent background
- **Elevated shadows:** Box shadows for card depth (0 20px 25px -5px)
- **Color-coded scoring:** Emerald (high), amber (medium), orange (low), red (action needed)
- **Smooth micro-interactions:** fade-in (0.3s), slide-up (0.4s ease) on card reveal

## Component Patterns
- Lead card: glassmorphic container with title, location, score badge, action buttons
- Score badge: colored pill with high contrast text, semantic color coding
- Search/filter bar: dark input with accent border on focus
- Navigation items: subtle hover states, active state with accent color
- Modal/popover: glassmorphic with elevated shadow

## Motion Choreography
**Page entry:** Cards slide up on load (staggered)
**Interactions:** Smooth 0.3s transitions on hover, 0.4s easing on state changes
**Loading:** Subtle opacity pulse or skeleton UI (glassmorphic placeholder)

## Spacing & Rhythm
Mobile-first responsive grid. Base spacing unit: 0.5rem. Card gutters: 1.5rem. Content padding: 2rem.

## Constraints
- Never use raw hex or named colors; all colors via OKLCH tokens
- Glassmorphic cards on dark backgrounds only (contrast safety)
- Avoid neon glows; use muted shadows for depth
- Prioritize readability over decoration (SaaS, not gallery)
