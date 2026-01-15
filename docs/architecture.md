# Architecture

## Goals
- Clear boundaries: domain depends on nothing.
- Predictability: simple, testable use cases.
- Real time: stable message contracts and explicit delivery guarantees.

## Overview
The system is split into three backend layers (domain/application/infrastructure) and a separate frontend. Client-to-server interaction uses HTTP (auth and REST endpoints) and Socket.IO (real-time events).

Authentication is JWT-based: HTTP requests use `Authorization: Bearer <token>`, and Socket.IO uses a token in the handshake auth payload.

## Backend layers
### Domain
- Entities: User, Room, Message.
- Value Objects: UserId, RoomId, MessageId.
- Domain errors and invariants.

### Application
- Use cases: register/login, createRoom, joinRoom, sendMessage, listMessages.
- Ports: UserRepository, RoomRepository, MessageRepository, PasswordHasher, TokenIssuer, Clock.
- DTOs and access policies.

### Infrastructure
- HTTP (Fastify): controllers and routes.
- Socket.IO gateway: event routing and presence.
- Persistence: Prisma + PostgreSQL (SQLite in dev).
- DI and configuration.

## Message contract (Socket.IO)
Client -> server:
- join_room: { roomId }
- send_message: { roomId, messageId, content }
- typing (optional): { roomId }

Server -> client:
- room_joined: { roomId }
- message: { roomId, message }
- presence_update: { userId, status, lastSeenAt }
- error: { code, message, traceId }

### Delivery semantics
- Delivery: at-least-once.
- Idempotency: messageId is generated on the client; the server stores and rejects duplicates.
- Ordering: best-effort ordering within a room (order by createdAt).

## Data model (draft)
- User: id, email, passwordHash, createdAt, lastSeenAt.
- Room: id, name, isPrivate, createdAt, createdBy.
- Message: id, roomId, authorId, content, createdAt.
- RoomMember: roomId, userId, joinedAt.

## Testing
- Unit: domain/application.
- Integration: HTTP + Socket.IO.
- E2E: login -> join room -> send message -> receive.

## Decision records
See ADRs: `docs/adr/`.
