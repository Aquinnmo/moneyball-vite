# Code Patterns & Best Practices

## Preferred Patterns
- **Exports**: Use named exports exclusively for components and functions across the codebase. Default exports should generally be avoided.
- **Component Typing**: Use explicit TypeScript interfaces (`Props`) for all components, importing the required schema types from `src/types`.
- **JSDoc Comments**: Add a JSDoc block to every component exposing its purpose, props, and standard usage.
- **Centralized Imports**: Use barrel exports (e.g., `src/types/index.ts`) when importing elements.

## "Do Not" Rules
- **DO NOT** make raw `fetch` calls in React Components or anywhere outside of `src/api/client.ts`.
- **DO NOT** declare implicit or explicit `any` types in component props.
- **DO NOT** redefine types inline. Always leverage inferred Zod types from `src/types`.
- **DO NOT** mutate component state synchronously within a `useEffect` if it results in cascading renders (handle basic state setup either in conditionals or at the point of action).
- **DO NOT** use linter ignores (e.g., `/* eslint-disable */` or `// eslint-disable-next-line`). Always fix the root cause of standard linter issues.