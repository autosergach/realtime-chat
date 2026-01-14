# ADR 0003: Persistence and ORM (Postgres + Prisma)

## Status
Accepted

## Context
We need a reliable database with transactions, indexes, and easy migrations. Considered:
- PostgreSQL + Prisma
- SQLite (for local development)
- Other ORMs (TypeORM, MikroORM) or raw SQL

## Decision
Primary DB: **PostgreSQL**. ORM: **Prisma**. SQLite is allowed for local development as an optional simplification.

## Rationale
- PostgreSQL: mature, strong indexing and transactions, scalable.
- Prisma: strong typing, migrations, and TypeScript-first DX.
- SQLite simplifies local start but is not the production target.

## Consequences
Pros:
- Clear schema and migrations.
- Strong typing and understandable data access layer.
- Production-ready storage.

Cons:
- Prisma adds an abstraction layer.
- SQLite differs in behavior and performance; differences must be considered.

## Alternatives
- TypeORM/MikroORM: flexible but higher cognitive load and less migration ergonomics.
- Raw SQL: maximum control but higher maintenance cost and fewer types.
