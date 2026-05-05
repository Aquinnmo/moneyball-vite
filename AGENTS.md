# AGENTS

## Tech Stack

Vite for build
React + Typescript core
React Router for routing
Plain CSS for styling
ESLint for linting

## Visual Design

Any component or page designed should be:

- Minimalistic
- Simple to digest
- Data-first
- Easy to use

## Code Structure

This repository will follow the following structure principles:

- Imported components from new files will be used where possible to ensure modularity in design and reusability
- Strongly typed: Always utilize Typescript effectively.
- View `docs/ARCHITECTURE.md` to understand Data flow and Module Responsibilities.
- View `docs/CODE_PATTERNS.md` to view preferred patterns to use and rules to abide by.
- Schemas and Type definitions MUST solely be extracted from `src/types`. All fetch requests MUST be centralized in `src/api/client.ts`.

## Workflow

- plan your changes, using the best practices listed above
- make your changes, using the best practices listed above
- lint your changes, fixing any issues that are listed. YOU MUST verify your work by running `npx eslint src/` in the terminal BEFORE finishing the turn.
- never simply ignore linting errors (e.g. no `eslint-disable`). Fix the underlying issue.
