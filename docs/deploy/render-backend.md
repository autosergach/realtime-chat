# Backend deployment on Render

## Prerequisites
- Render account
- PostgreSQL database (Render managed Postgres recommended)

## Step-by-step
1) Create a new Web Service in Render.
   - Runtime: Node
   - Root Directory: (leave empty, repo root)

2) Set build and start commands:
   - Build Command:
     ```
     npm install
     npm run -w @realtime-chat/backend prisma:generate
     npm run -w @realtime-chat/backend build
     ```
   - Start Command:
     ```
     npm run -w @realtime-chat/backend prisma:deploy
     npm run -w @realtime-chat/backend start
     ```

3) Configure environment variables:
   - `DATABASE_URL` = Render Postgres connection string
   - `JWT_SECRET` = long random string
   - `PORT` = 3000 (Render will inject its own PORT, keep if needed)

4) Deploy the service.

## Verification
- Health check:
  ```
  curl https://<your-service>.onrender.com/health
  ```

## Notes
- Prisma migrations are applied via `prisma migrate deploy` on every start.
- Socket.IO works out of the box on Render Web Services.
