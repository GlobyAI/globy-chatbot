# Welcome to React Router!

A modern, production-ready template for building full-stack React applications using React Router.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/remix-run/react-router-templates/tree/main/default)

## Features

- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 SCSS for styling
- 🚀 Websocket streaming
- 📖 [React Router docs](https://reactrouter.com/)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 22+
- [Docker](https://www.docker.com/) (for containerized setup)

### Environment Variables

Copy the example env file and fill in your values:

```bash
cp .env.exampel .env.local
```

Edit `.env.local` and configure the required variables:

| Variable | Description |
|---|---|
| `VITE_WEB_SOCKET_URL` | WebSocket server URL |
| `VITE_AUTH0_DOMAIN` | Auth0 tenant domain |
| `VITE_AUTH0_CLIENT_ID` | Auth0 application client ID |
| `VITE_AUTH0_AUDIENCE` | Auth0 API audience |
| `VITE_APP_DOMAIN` | Application domain |
| `VITE_API_URL` | Backend API URL |
| `VITE_AUTH_API_URL` | Auth API URL |
| `VITE_LANDING_PAGE` | Landing page URL |
| `VITE_IMAGE_LIBRARY_API` | Image library API URL |
| `VITE_BASE_PATH` | Base path for the app (e.g. `/chat`) |
| `VITE_CHECKOUT_URL` | Stripe checkout endpoint |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `VITE_SIDE_STATUS_API` | Side status API URL |
| `VITE_BOOKING_API_URL` | Booking API URL |

### Running Locally (without Docker)

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

### Running Locally with Docker

1. Make sure your `.env` file is configured (see above).

2. Build and start the container:

```bash
docker compose up --build
```

The app will be available at `http://localhost:3000`.

To run in the background:

```bash
docker compose up --build -d
```

> **Note:** Vite embeds `VITE_*` variables at build time. The `docker-compose.yml` forwards them from your `.env` file as build args automatically.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.
