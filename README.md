# Airbnb Clone (MERN)

A full-stack Airbnb-style booking platform built with the MERN stack:
**MongoDB + Express + React (Vite) + Node.js**.

The repo contains two apps:

```
airbnb_web/              <- React frontend (Vite, TailwindCSS, MUI)
airbnb_web/airbnb-api/   <- Express REST API (Mongoose, JWT auth, bcrypt)
```

---

## Features

- User registration & login with bcrypt-hashed passwords and JWT issued
  via an `httpOnly` cookie.
- Host flow: register as a host, create/update/delete your own listings
  (with server-enforced ownership checks).
- Browse + search listings by location; filter by price, bedrooms, property type.
- Booking lifecycle (`pending → confirmed / expired / cancelled`) with a
  15-minute payment hold, so unpaid bookings don't permanently block a
  host's calendar. Designed so plugging in Stripe (or any payment gateway)
  is a drop-in change.
- Role-based access: `user`, `host`, `admin`.
- Production hardening: `helmet`, rate limiting on auth + booking routes,
  `express-mongo-sanitize`, `compression`, request logging via `morgan`,
  centralized error handler, graceful shutdown, `/api/healthz` endpoint.

---

## Local development

### Prerequisites

- **Node.js 18+**
- A MongoDB database (free tier on [MongoDB Atlas](https://www.mongodb.com/atlas) works great)

### 1. Clone and install

```bash
git clone https://github.com/Muhammad-Abdullah-Waheed/Airbnb-react-project.git
cd Airbnb-react-project
npm install   # installs both frontend AND backend (via postinstall hook)
```

### 2. Configure environment variables

**Backend (`airbnb-api/.env`):**

```bash
cp airbnb-api/.env.example airbnb-api/.env
```

Then fill in:
- `MONGODB_URI` — your MongoDB connection string
- `JWT_SECRET` — generate with:
  ```bash
  node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
  ```
- `CORS_ORIGIN` — `http://localhost:5173` for local dev

**Frontend (`.env`):**

```bash
cp .env.example .env
```

Default value (`VITE_API_URL=http://localhost:4000`) is fine for local dev.

### 3. Run both apps

Two terminals:

```bash
# Terminal 1 — backend (http://localhost:4000)
npm run backend:dev

# Terminal 2 — frontend (http://localhost:5173)
npm run dev
```

---

## Production build (monolithic)

The backend is configured to serve the built React app in production, so the
whole thing deploys as a **single** Node service on port 4000.

```bash
npm run build                          # builds React to ./dist
NODE_ENV=production npm start          # backend serves API + static frontend
```

Visit `http://localhost:4000` — the React app is now served by the backend.

---

## Deployment

### Option A — Vercel (recommended, no credit card required)

The whole stack (React frontend + Express API) deploys as a single Vercel
project. The Express app runs as a serverless function via `api/index.js`;
the Vite build is served statically. See `vercel.json` for routing.

1. Push this repo to GitHub.
2. In Vercel, click **Add New → Project** and import the repo. Vercel
   auto-detects Vite and uses `vercel.json` for function + rewrite config.
3. Under **Environment Variables**, add:
   - `MONGODB_URI` — your MongoDB Atlas SRV URI
   - `JWT_SECRET` — a long random string (≥ 64 chars)
   - `NODE_ENV` — `production`
4. Click **Deploy**. Once live, the API is at `<your-app>.vercel.app/api/*`
   and the frontend is at `<your-app>.vercel.app/`.

### Option B — Render.com (Blueprint)

Render now requires a credit card to create services. If you have one:

1. In Render, click **New → Blueprint** and point it at this repo.
   Render picks up `render.yaml` automatically.
2. In the service's **Environment** tab, set `MONGODB_URI`, `JWT_SECRET`,
   and optionally `CORS_ORIGIN`.
3. Render builds (`npm install && npm run build`) and starts (`npm start`)
   automatically. Health check hits `/api/healthz`.

### Option C — Docker

```bash
docker build -t airbnb-web .
docker run --rm -p 4000:4000 \
  -e NODE_ENV=production \
  -e MONGODB_URI="your-uri" \
  -e JWT_SECRET="your-secret" \
  airbnb-web
```

### Option D — Split frontend and backend

- Frontend on **Vercel** or **Netlify** (point at project root, build
  command `npm run build`, output `dist`). Set `VITE_API_URL` to the
  backend URL.
- Backend on **Render**, **Railway**, **Fly.io**, or any Node host. Set
  `CORS_ORIGIN` to the frontend URL.

---

## Environment variables reference

### Backend (`airbnb-api/.env`)

| Variable      | Required | Description |
|---------------|----------|-------------|
| `MONGODB_URI` | Yes      | MongoDB connection string |
| `JWT_SECRET`  | Yes      | Secret used to sign JWTs (32+ chars) |
| `PORT`        | No       | Port to listen on (default 4000) |
| `NODE_ENV`    | No       | `development` or `production` |
| `CORS_ORIGIN` | No       | Comma-separated allowed origins |

### Frontend (`.env`)

| Variable        | Required | Description |
|-----------------|----------|-------------|
| `VITE_API_URL`  | No       | Backend URL. Leave empty for same-origin monolith. |

---

## API overview

| Method | Path                                  | Auth     | Purpose |
|--------|---------------------------------------|----------|---------|
| POST   | `/api/register`                       | —        | Create account |
| POST   | `/api/login`                          | —        | Issue JWT cookie |
| GET    | `/api/profile`                        | cookie   | Current user |
| GET    | `/api/logout`                         | —        | Clear JWT cookie |
| GET    | `/api/listings`                       | —        | Paginated + filtered listings |
| GET    | `/api/getlistings/:id`                | —        | Listing detail |
| GET    | `/api/listings/search/:location`      | —        | Search by location |
| POST   | `/api/listings`                       | cookie   | Create listing |
| PUT    | `/api/listings/update/:id`            | cookie   | Update (owner only) |
| DELETE | `/api/listings/delete/:id`            | cookie   | Delete (owner only) |
| POST   | `/api/savebooking`                    | cookie   | Create `pending` booking |
| POST   | `/api/bookings/:id/pay`               | cookie   | Simulated payment → `confirmed` |
| POST   | `/api/bookings/:id/cancel`            | cookie   | Owner cancel |
| GET    | `/api/bookings/user/:id`              | cookie   | Bookings for user |
| GET    | `/api/healthz`                        | —        | Liveness check |

---

## Security notes

- Passwords are **bcrypt-hashed** (10 rounds) via a Mongoose `pre('save')` hook.
- JWTs live in **`httpOnly`** cookies (`secure` + `sameSite=none` in production).
- `helmet` sets defensive HTTP headers.
- `express-rate-limit` throttles `/login`, `/register`, and `/savebooking`.
- `express-mongo-sanitize` strips `$`-prefixed keys from request bodies.
- All listing/booking mutations check ownership via the decoded JWT — never
  from the request body.

---

## License

MIT
