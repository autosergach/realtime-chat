# Архитектура

## Цели
- Четкие границы: domain не зависит ни от чего.
- Предсказуемость: простые, проверяемые юзкейсы.
- Реальное время: устойчивые контракты сообщений и явные гарантии доставки.

## Обзор
Система разделена на три слоя backend (domain/application/infrastructure) и отдельный frontend. Взаимодействие клиента с сервером идет через HTTP (аутентификация и справочники) и Socket.IO (реальное время).

## Слои backend
### Domain
- Сущности: User, Room, Message.
- Value Objects: UserId, RoomId, MessageId.
- Доменные ошибки и инварианты.

### Application
- Юзкейсы: register/login, createRoom, joinRoom, sendMessage, listMessages.
- Порты: UserRepository, RoomRepository, MessageRepository, PasswordHasher, TokenIssuer, Clock.
- DTO и политики доступа.

### Infrastructure
- HTTP (Fastify): контроллеры и маршруты.
- Socket.IO gateway: маршрутизация событий и presence.
- Persistence: Prisma + PostgreSQL (SQLite в dev).
- DI и конфигурация.

## Контракт сообщений (Socket.IO)
Клиент -> сервер:
- join_room: { roomId }
- send_message: { roomId, messageId, content }
- typing (опционально): { roomId }

Сервер -> клиент:
- room_joined: { roomId }
- message: { roomId, message }
- presence_update: { userId, status, lastSeenAt }
- error: { code, message, traceId }

### Семантика доставки
- Доставка: at-least-once.
- Идемпотентность: messageId генерируется клиентом, сервер хранит и отклоняет дубликаты.
- Порядок: best-effort порядок внутри комнаты (order by createdAt).

## Data model (черновик)
- User: id, email, passwordHash, createdAt, lastSeenAt.
- Room: id, name, isPrivate, createdAt, createdBy.
- Message: id, roomId, authorId, content, createdAt.
- RoomMember: roomId, userId, joinedAt.

## Тестирование
- Unit: domain/application.
- Integration: HTTP + Socket.IO.
- E2E: login -> join room -> send message -> receive.

## Документация решений
См. ADR: `docs/adr/`.
