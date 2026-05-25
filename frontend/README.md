# CodeLens AI — Frontend

Production-ready React frontend for an AI-Powered Code Review Assistant platform.

## Tech Stack

- React 19 + Vite 8
- Tailwind CSS v4
- Framer Motion
- React Router DOM v7
- Shadcn-style UI components
- Lucide React icons
- Monaco Editor
- Axios + React Hot Toast

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Build

```bash
npm run build
npm run preview
```

## Environment

Copy `.env.example` to `.env` and set your backend URL:

```
VITE_API_URL=http://localhost:5000/api
```

## Routes

| Path | Page |
|------|------|
| `/` | Landing |
| `/dashboard` | Code review dashboard |
| `/review/:id` | Review results |
| `/history` | Review history |
| `/settings` | Settings |
| `/auth/login` | Login |
| `/auth/signup` | Signup |
| `*` | 404 |

## Project Structure

```
src/
├── components/     # UI, backgrounds, landing, common
├── pages/          # Route pages
├── layouts/        # Main, Dashboard, Auth layouts
├── routes/         # Route definitions
├── services/       # API layer (axios + mock data)
├── hooks/          # Custom React hooks
├── context/        # Auth & theme providers
├── animations/     # Framer Motion variants
└── utils/          # Helpers, constants, mock data
```

## Backend Integration

API calls are centralized in `src/services/`. Replace mock implementations with real endpoints when the backend is ready. See comments in `authService.js` and `reviewService.js`.
