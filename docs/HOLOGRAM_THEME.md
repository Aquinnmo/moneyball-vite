# Hologram Theme Specification: Project "Jarvis"

This document outlines the visual identity and technical implementation details for the "Hologram" theme, inspired by sci-fi aesthetics (Star Wars, Iron Man MK-I/II interfaces). The goal is a semi-transparent, glow-heavy, data-centric interface.

## 1. Core Visual Principles
- **Transparency**: High dependency on semi-transparent containers to create layering.
- **Luminosity**: All lines and text should have a subtle outer glow (neon-like).
- **Movement**: Subtle flicker, scanning lines, or floating animations.
- **Monochromatic Accents**: Primary color is cyan/electric blue, with high-contrast emergency red for errors.

## 2. Color Palette (CSS Variables)

| Variable | HEX / RGBA | Role |
| :--- | :--- | :--- |
| `--hologram-cyan` | `#00f2ff` | Primary active color, text, borders |
| `--hologram-cyan-glow` | `rgba(0, 242, 255, 0.4)` | Outer glow for text and borders |
| `--hologram-bg` | `rgba(0, 20, 30, 0.85)` | Base background (dark navy with transparency) |
| `--hologram-panel-bg` | `rgba(0, 40, 60, 0.3)` | Card / Component backgrounds |
| `--hologram-grid` | `rgba(0, 242, 255, 0.1)` | Background grid lines |
| `--hologram-error` | `#ff3b3b` | Alerts, critical status |

## 3. Textures & Effects

### A. Scanning Lines (Scanlines)
A persistent overlay across the screen to give the "CRT/Projector" feel.
- **Implementation**: `background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));`
- **Scale**: Tiny vertical repeating pattern.

### B. The "Flicker" Effect
A random, very subtle variation in opacity.
- **Animation**: `keyframes hologram-flicker` (varying opacity between 0.95 and 1.0).

### C. UI Borders
Borders should not be full 4-sided boxes where possible. Use "Bracket" corners or "L-shapes" to frame data.
- **Style**: 1px solid with `box-shadow: 0 0 8px var(--hologram-cyan-glow)`.

## 4. Typography
- **Primary**: Monospaced fonts to emphasize the "data/code" nature.
- **Headings**: Wide kerning, uppercase, with a "Glitch" hover effect.
- **Metrics**: Large, glowing numbers for primary statistics.

## 5. Components Transformation

- **Graphs**: Transparent backgrounds, glowing lines, and grid meshes.
- **Tables**: Row highlights using a sweeping "scan" light.
- **Buttons**: Outline-only with a fill-up animation on hover.

## 6. Implementation Checklist
- [ ] Define `:root` variables in `src/index.css`.
- [ ] Create a `HologramOverlay` component or global CSS class for noise/scanlines.
- [ ] Replace standard shadows with glow effects.
- [ ] Implement "Floating" animation for main dashboard panels.
