# Studio2 ERP — Backend (NestJS + Prisma + PostgreSQL)

Enterprise-grade API for the Studio2 ERP platform: CRM, projects, BOQ,
procurement, inventory, finance, HR and documents — all relationally linked.

> **Decoupled by design.** This service is **not** wired to the frontend yet.
> The Next.js app currently runs on local dummy data. The backend is a complete,
> production-shaped scaffold ready to be connected module-by-module.

## Stack

- **NestJS 10** (modular, DI, guards, interceptors, filters)
- **Prisma ORM** + **PostgreSQL** (normalized, multi-tenant, soft deletes, audit fields)
- **JWT auth** + **RBAC** (`@Roles`) + MFA-ready user model
- **Swagger** API docs, **Helmet**, **rate limiting** (`@nestjs/throttler`)
- **Docker** + **docker-compose** (Postgres + Redis + API)

## Architecture

```
src/
  main.ts                 # bootstrap: helmet, CORS, validation, Swagger
  app.module.ts           # wires modules + global guards/interceptor
  config/                 # env configuration
  prisma/                 # PrismaService (global)
  common/
    decorators/           # @Public, @Roles, @CurrentUser
    guards/               # JwtAuthGuard, RolesGuard
    interceptors/         # AuditInterceptor
    filters/              # AllExceptionsFilter
  modules/
    auth/ users/ clients/ leads/ projects/ tasks/ vendors/
    inventory/ procurement/ boq/ invoices/ employees/ documents/ health/
prisma/
  schema.prisma           # full ERP data model
  seed.ts                 # sample data mirroring the frontend
```

Security pipeline (global): **JWT auth → RBAC → rate limit → audit log**.
Every route requires a Bearer token unless marked `@Public()` (login, register, health).

## Getting started

```bash
cd backend
cp .env.example .env
npm install

# Start Postgres + Redis only (API stays decoupled / run on demand)
docker compose up -d postgres redis

# Generate client, create schema, seed sample data
npm run prisma:generate
npm run prisma:migrate     # creates tables (dev)
npm run db:seed

# Run the API
npm run start:dev          # http://localhost:4000/api  ·  docs at /docs
```

### Run everything in Docker

```bash
docker compose --profile full up --build
```

## Auth

Seeded users share the password `studio2`:

| Role             | Email                |
| ---------------- | -------------------- |
| Owner            | aarav@studio2.in     |
| Admin            | priya@studio2.in     |
| Accountant       | rohan@studio2.in     |
| Designer         | sara@studio2.in      |
| Site Engineer    | vikram@studio2.in    |
| Purchase Manager | neha@studio2.in      |

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"aarav@studio2.in","password":"studio2"}'
```

## Key endpoints

- `POST /api/auth/login`, `POST /api/auth/register`, `GET /api/auth/me`
- `GET /api/projects`, `GET /api/projects/stats`
- `GET /api/clients`, `GET /api/leads`, `GET /api/vendors`
- `GET /api/inventory/materials`, `GET /api/inventory/low-stock`
- `GET /api/procurement/orders`, `GET /api/boq`, `GET /api/invoices/outstanding`
- `GET /api/employees`, `GET /api/documents`, `GET /api/health`

Full, interactive reference at **`/docs`** (Swagger).

## Data model highlights

- **Multi-tenant**: every business table carries `orgId`.
- **Soft deletes**: `deletedAt` on core entities (records are never hard-deleted).
- **Audit-safe**: `createdAt`/`updatedAt` timestamps + `AuditLog` table + audit interceptor.
- **RBAC**: `User.role` enum for fast checks plus `Role`/`Permission` tables for inheritance.
- **Relational integrity**: projects ↔ clients ↔ invoices ↔ payments; materials ↔ vendors ↔ POs; BOQ ↔ projects ↔ lines.

## Connecting the frontend later

When ready, point the Next.js app's data layer (`src/erp/data`) at these endpoints
behind a thin API client and React Query — the response shapes intentionally mirror
the current mock data, so the swap is incremental and low-risk.
