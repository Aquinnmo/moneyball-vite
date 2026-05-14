# Architecture: Project Jarvis

## Visual Identity
Moneyball follows the "Hologram" (Project Jarvis) design language, emphasizing a data-centric, semi-transparent, and high-luminosity interface. This is achieved through:
- **Monochromatic Palette**: Primary use of cyan-electric blue for focus and navy for depth.
- **Layering**: High dependency on semi-transparent panels and background scanlines to create a multi-dimensional HUD feel.
- **Feedback**: Dynamic glow effects and "flicker" animations that respond to user presence.

## Data Flow
The application follows a unidirectional data flow pattern, ensuring strong typing and centralized data fetching:

1. **API**: All network requests to external endpoints are handled exclusively within `src/api/client.ts`. This client includes error handling and retry logic.
2. **Validation/Schemas**: Raw API responses are immediately parsed and validated using Zod schemas located in `src/types/schemas.ts`.
3. **State**: Validated, strongly-typed data (e.g., `Schedule`, `GameData`) is placed into React component state using hooks (`useState`, `useEffect`) inside page-level components (`App`, `Game`).
4. **UI**: State is passed down to purely presentational React components (`src/components/`) via strongly-typed props.

## Module Responsibilities
- **`src/api/`**: Central location for all remote data fetching (`client.ts`).
- **`src/types/`**: The system's single source of truth for runtime validation (Zod) and compile-time TypeScript types.
- **`src/components/`**: Reusable UI, standardized presentational React components (e.g., `TeamTable`, `WinOMeter`).
- **`src/App.tsx`**: Route component acting as the main landing page, fetching schedule data and listing games.
- **`src/Game.tsx`**: Route component for a single game overview, fetching deeper data based on a `gamePk` URL param.
