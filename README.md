# DevFlow AI

> A modern project-management workspace for teams that want a clearer way to plan work, collaborate on tasks, and ship consistently.

DevFlow AI is a full-stack application for managing projects, tasks, team members, comments, dependencies, notifications, and task attachments. It combines a React dashboard with a modular NestJS API and PostgreSQL database.

## Highlights

- Colorful, responsive workspace dashboard with project and personal task metrics
- Secure JWT authentication with profile editing and password changes
- Project creation, editing, member management, and Git branch metadata
- Task filtering, assignment, priorities, statuses, due dates, and dependencies
- Task comments and activity history
- Attachment uploads with file metadata, downloads, and uploader-only deletion
- In-app notifications
- Swagger API documentation at `/api`

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, React Router |
| Data fetching | Axios, TanStack Query |
| Backend | NestJS, TypeScript, Prisma |
| Database | PostgreSQL |
| Authentication | JWT, Passport, bcrypt |
| API docs | Swagger / OpenAPI |
| Local containers | Docker, Docker Compose |

## Project Structure

```text
devflow-ai/
├── apps/
│   ├── server/             # NestJS API and Prisma schema
│   └── web/                # React + Vite frontend
├── packages/               # Shared workspace packages
├── Dockerfile              # Production API image
├── docker-compose.yml      # Local PostgreSQL + API stack
├── render.yaml             # Render API + PostgreSQL blueprint
└── vercel.json             # Vercel frontend configuration
```

## Prerequisites

- Node.js 22 or newer
- pnpm 11 or newer (`corepack enable`)
- PostgreSQL 16+ for local database development, or Docker Desktop

## Local Development

### 1. Install dependencies

```bash
corepack enable
pnpm install
```

### 2. Configure the API

Create `apps/server/.env` from the example file:

```bash
copy apps\server\.env.example apps\server\.env
```

On macOS/Linux, use:

```bash
cp apps/server/.env.example apps/server/.env
```

Set the following values in `apps/server/.env`:

```env
PORT=3000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/devflow_ai?schema=public"
JWT_SECRET="use-a-long-random-secret"
FRONTEND_URL="http://localhost:5173"

# Optional integrations
GEMINI_API_KEY=""
MAIL_HOST="smtp.gmail.com"
MAIL_PORT=587
MAIL_USER=""
MAIL_PASS=""
MAIL_FROM=""
```

### 3. Create the database schema

```bash
pnpm --filter server exec prisma generate
pnpm --filter server exec prisma migrate dev
```

### 4. Start both applications

Use two terminals:

```bash
pnpm --filter server start:dev
```

```bash
pnpm --filter web dev
```

Open the frontend at [http://localhost:5173](http://localhost:5173). The API runs at [http://localhost:3000](http://localhost:3000), with Swagger documentation at [http://localhost:3000/api](http://localhost:3000/api).

### Frontend environment variable

The frontend defaults to `http://localhost:3000`. To use another API URL, create `apps/web/.env`:

```env
VITE_API_URL=http://localhost:3000
```

## Docker Development

The Docker Compose stack starts PostgreSQL and the NestJS API. Create a root `.env` file first:

```env
POSTGRES_PASSWORD=use-a-strong-local-password
JWT_SECRET=use-a-long-random-secret
GEMINI_API_KEY=
MAIL_USER=
MAIL_PASS=
MAIL_FROM=
```

Then run:

```bash
docker compose up --build
```

The database is available on port `5433`; the API is available on port `3000`.

## Available Commands

| Command | Description |
| --- | --- |
| `pnpm dev` | Start workspace development scripts with Turbo |
| `pnpm build` | Build all workspace applications |
| `pnpm --filter web dev` | Start the Vite frontend |
| `pnpm --filter web build` | Create a production frontend build |
| `pnpm --filter server start:dev` | Start the NestJS API with watch mode |
| `pnpm --filter server build` | Build the NestJS API |
| `pnpm --filter server exec prisma studio` | Open Prisma Studio |
| `pnpm --filter server exec prisma migrate dev` | Create and apply a local migration |

## API Overview

All protected requests require:

```http
Authorization: Bearer <access-token>
```

| Area | Example endpoints |
| --- | --- |
| Authentication | `POST /auth/register`, `POST /auth/login`, `GET /auth/me` |
| Account settings | `PATCH /auth/me`, `PATCH /auth/me/password` |
| Projects | `GET /projects`, `POST /projects`, `PATCH /projects/:id` |
| Tasks | `GET /tasks`, `POST /tasks`, `PATCH /tasks/:id` |
| Attachments | `POST /tasks/:taskId/attachments`, `GET /tasks/:taskId/attachments` |
| Health check | `GET /health` |

For the full, interactive API reference, start the server and visit `/api`.

## Deployment: Render + Vercel

### 1. Deploy the API and database on Render

1. Push this repository to GitHub.
2. In Render, choose **New → Blueprint** and select the repository.
3. Render reads `render.yaml`, provisions `devflow-db`, and creates `devflow-api`.
4. In the Render service environment, set the optional values you use: `GEMINI_API_KEY`, `MAIL_USER`, `MAIL_PASS`, and `MAIL_FROM`.
5. Copy the resulting API URL, for example `https://devflow-api.onrender.com`.

### 2. Deploy the frontend on Vercel

1. In Vercel, import the same GitHub repository.
2. Vercel uses `vercel.json`; keep the project root as the repository root.
3. Add the environment variable below before deploying:

```env
VITE_API_URL=https://devflow-api.onrender.com
```

4. Deploy and copy the Vercel site URL.

### 3. Connect both services

In Render, set `FRONTEND_URL` to the Vercel URL:

```env
FRONTEND_URL=https://your-project.vercel.app
```

Redeploy the Render API after updating the variable. The API health check should then be available at:

```text
https://devflow-api.onrender.com/health
```

## Security Notes

- Never commit `.env` files, credentials, API keys, SMTP passwords, or database URLs.
- Use a long random value for `JWT_SECRET` in production.
- Rotate any credential that was accidentally committed or shared.
- Set `FRONTEND_URL` to the exact deployed Vercel domain so CORS only allows your application.
- Uploaded files are stored on the API filesystem. For durable production storage, move uploads to object storage such as Amazon S3, Cloudflare R2, or Supabase Storage.

## Current Status

DevFlow AI is a working MVP suitable for demos and portfolio deployment. Before using it with production users, add comprehensive automated tests, role-based authorization checks across every API endpoint, rate limiting, monitoring, and external object storage for uploads.

## License

This project is licensed under the [MIT License](LICENSE).
