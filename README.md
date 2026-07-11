# EduElevate Frontend

React + TypeScript frontend for the EduElevate learning platform, built with Vite, Tailwind CSS v4, and Shadcn/ui.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** React 19 + TypeScript 6
- **Build Tool:** Vite 8
- **Styling:** Tailwind CSS v4
- **Components:** Shadcn/ui
- **Linting:** Oxlint

## Getting Started

```bash
npm install
npm run dev
```

The dev server starts at `http://localhost:5173`.

## Available Commands

| Command           | Description                        |
| ----------------- | ---------------------------------- |
| `npm run dev`     | Start the Vite dev server with HMR |
| `npm run build`   | Type-check and build for production |
| `npm run lint`    | Run Oxlint on the codebase         |
| `npm run preview` | Preview the production build        |

## Project Structure

```
src/
├── features/          # Feature-sliced modules (components, hooks, schemas, services, types, utils)
├── lib/               # Shared utilities (e.g. Shadcn cn helper)
├── components/shared/ # Globally shared UI components (Shadcn/ui)
├── App.tsx            # Root component
├── main.tsx           # Entry point
└── index.css          # Tailwind + Shadcn theme
```
