# Realtime Chat Application (WebSocket)

## Purpose
A production-grade, portfolio-ready realtime chat system showcasing clean architecture, realtime systems design, explicit trade-offs, and engineering maturity.

## Demo
https://realtime-chat-1-2zgr.onrender.com

## Project description
Realtime Chat is a portfolio-grade web application that demonstrates a layered backend architecture, a typed realtime contract over Socket.IO, and a pragmatic frontend. The project emphasizes clarity of boundaries, explicit decisions (ADRs), and testability across domain, application, integration, and UI layers.

## Hashtags
#realtime #websocket #socketio #typescript #fastify #prisma #postgresql #react #architecture #cleanarchitecture

## What this demonstrates
- Clean architecture boundaries with dependency inversion
- Realtime messaging, presence, and message delivery semantics
- Documented decisions (ADRs) and explicit trade-offs
- Strong typing, tests, CI, and maintainable structure

## Tech stack
Backend:
- Node.js + TypeScript
- Fastify (HTTP)
- Socket.IO (realtime)
- Prisma + PostgreSQL
- Zod (validation)
- Vitest (testing)

Frontend:
- React + TypeScript
- Socket.IO client
- React Testing Library

Tooling:
- ESLint + Prettier
- GitHub Actions CI

## Architecture overview
See `docs/architecture.md` for the full overview and message contract.

## How to run locally
### Prerequisites
- Node.js 20+
- PostgreSQL 15+

If you do not have a local PostgreSQL instance, use Docker:
```
docker compose up -d
```

### Backend
1) Install dependencies:
```
npm install
```

2) Configure env:
```
cp backend/.env.example backend/.env
```
Update `backend/.env` with:
- `DATABASE_URL` (local Postgres)
- `JWT_SECRET`
- `CORS_ORIGIN` (frontend URL, e.g. `http://localhost:5173`)

3) Generate Prisma client and run migrations:
```
npm run -w @realtime-chat/backend prisma:generate
npm run -w @realtime-chat/backend prisma:migrate
```

4) Start backend:
```
npm run -w @realtime-chat/backend dev
```

### Frontend
```
npm run -w @realtime-chat/frontend dev
```
Set in your environment (or `.env` for Vite):
- `VITE_API_URL` (e.g. `http://localhost:3000`)
- `VITE_REALTIME_URL` (same as backend for Socket.IO)

## Authentication and realtime
- HTTP: `Authorization: Bearer <JWT>`
- Socket.IO: `auth.token` handshake payload (same JWT)

## How to run tests
```
npm run lint
npm run typecheck
npm run test
```

## Screenshots / GIFs
- Add screenshots of login, rooms, and chat here.

## Future work
- Refresh tokens
- Role-based room access
- Rate limiting and abuse protection
- Message search and pagination

## ADRs
- `docs/adr/0001-transport-websocket.md`
- `docs/adr/0002-realtime-library-socketio.md`
- `docs/adr/0003-persistence-prisma-postgres.md`

## Documentation
- Architecture: `docs/architecture.md`
- ADRs: `docs/adr/*`
