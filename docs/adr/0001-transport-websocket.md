# ADR 0001: Transport for realtime

## Status
Accepted

## Context
We need a bidirectional channel for messages, presence, and room events. Considered:
- WebSocket
- SSE
- Long-polling

Key requirements: bidirectionality, low latency, and a simple event model for chat.

## Decision
Choose WebSocket as the primary transport. To handle restrictive networks, we use Socket.IO, which supports polling fallback. Server configuration keeps `polling` and `websocket` transports enabled (Socket.IO v4 defaults).

## Consequences
Pros:
- Low latency and bidirectionality for presence/typing.
- Single event contract.
- Works in environments where pure WebSocket is blocked.

Cons:
- Additional protocol layer (Socket.IO) on top of WebSocket.
- Slightly harder to observe/debug than HTTP-only approaches.

## Alternatives
- SSE: simpler to implement, but only server -> client and requires a second channel for client -> server.
- Long-polling: higher latency and extra load, not suitable for chat.
