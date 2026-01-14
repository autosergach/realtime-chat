# ADR 0002: Realtime library (Socket.IO vs ws)

## Status
Accepted

## Context
We need reliable bidirectional delivery for chat events: messages, presence, typing. Considered:
- `ws` (raw WebSocket)
- `Socket.IO`

Key requirements:
- reliable reconnection
- works in environments with WebSocket restrictions
- simple event model
- convenient frontend integration

## Decision
Choose **Socket.IO**.

## Rationale
- Supports long-polling fallback when WebSocket is blocked.
- Built-in reconnection and room primitives.
- Convenient event-based protocol for client/server.
- Large ecosystem and mature docs.

## Consequences
Pros:
- Faster implementation of rooms/presence.
- Less manual work for retries and reconnects.

Cons:
- Additional protocol layer on top of WebSocket.
- Some library “magic,” harder to trace at the network level.

## Alternatives
- `ws`: transparent and lightweight, but requires manual reconnection, fallback, rooms, and event protocol.
