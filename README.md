## TodoApp (Vite + React + TypeScript + Tailwind CSS v4 + Express + MongoDB)

This is a full‑stack Todo application with a React + TypeScript frontend (Vite) styled using Tailwind CSS v4, and an Express + MongoDB backend with JWT authentication.

Note: This app was created entirely in Cursor via prompts.

### Features

- Todo CRUD (add, toggle complete, delete)
- Filters: All / Active / Completed
- Dark mode with Tailwind v4 class strategy
- User auth (register/login) with JWT; per‑user todos
- API proxy in Vite for local development

### Tech Stack

- Frontend: Vite, React 19, TypeScript, Tailwind CSS v4 (`@tailwindcss/vite`)
- Backend: Node.js, Express, MongoDB (Mongoose), JWT (`jsonwebtoken`), `bcryptjs`

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB running locally

### 1) Backend setup

From `server/`:

1. Create `.env` (already present in this repo) and ensure values:

```
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DB=todoApp
JWT_SECRET=dev-secret-change-me
```

2. Install and run the API:

```
npm install
npm run dev
```

The API listens on http://localhost:4000.

### 2) Frontend setup

From the project root:

```
npm install
npm run dev
```

Vite serves the app on http://localhost:5173.

The Vite dev server proxies `/api` to the backend (see `vite.config.ts`).

## Tailwind CSS v4

Included via the Vite plugin and a single import in `src/index.css`:

```
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));
```

Dark mode is controlled by toggling the `.dark` class on `<html>` (see `src/hooks/useTheme.ts`).

## API Overview

- Auth
  - POST `/api/auth/register` → `{ token }`
  - POST `/api/auth/login` → `{ token }`
- Todos (all require `Authorization: Bearer <token>`)
  - GET `/api/todos`
  - POST `/api/todos` `{ title }`
  - PATCH `/api/todos/:id` `{ title?, completed? }`
  - DELETE `/api/todos/:id`

## Project Structure (high level)

```
src/
  components/
    AuthForm.tsx
    Header.tsx
    TodoList.tsx
  hooks/
    useTheme.ts
  services/
    api.ts
  App.tsx
  main.tsx
  index.css
server/
  models/
    Todo.js
    User.js
  routes/
    auth.js
    todos.js
  middleware/
    auth.js
  app.js
  index.js
  .env
```

## Scripts

Frontend (root `package.json`):

- `npm run dev` – start Vite
- `npm run build` – type‑check and build
- `npm run preview` – preview production build

Backend (`server/package.json`):

- `npm run dev` – start API with nodemon
- `npm start` – start API

## Notes

- Ensure MongoDB is running and `.env` matches your local setup (db name is case‑sensitive).
- If the proxy fails (ECONNREFUSED), start the backend first.
- This app was created entirely in Cursor via prompts.
