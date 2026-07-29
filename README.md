# EduElevate Frontend

React + TypeScript frontend for the EduElevate learning platform, built with Vite, Tailwind CSS v4, and Shadcn/ui.

## Prerequisites

- Node.js 18+
- npm

## Setup

1. Clone the repository:

   ```bash
   git clone git@github.com:V-Mugisha/eduelevate-frontend.git
   cd eduelevate-frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file:

   ```env
   VITE_API_URL=http://localhost:3001/api
   ```

4. Start the dev server:

   ```bash
   npm run dev
   ```

The app runs at `http://localhost:5173`.

## Available Commands

| Command           | Description                         |
| ----------------- | ----------------------------------- |
| `npm run dev`     | Start the Vite dev server with HMR  |
| `npm run build`   | Type-check and build for production |
| `npm run lint`    | Run ESLint                          |
| `npm run format`  | Check Prettier formatting           |
| `npm run check`   | Run lint + format                   |
| `npm run preview` | Preview the production build        |
