import { getJson, postJson } from "./http";

export interface RoomSummary {
  id: string;
  name: string;
  isPrivate: boolean;
}

export async function createRoom(apiUrl: string, token: string, name: string) {
  return postJson<RoomSummary>(`${apiUrl}/rooms`, {
    name,
    isPrivate: false
  }, token);
}

export async function listRooms(apiUrl: string, token: string) {
  return getJson<RoomSummary[]>(`${apiUrl}/rooms`, token);
}

export interface MessageResponse {
  id: string;
  roomId: string;
  authorId: string;
  content: string;
  createdAt: string;
}

export async function listMessages(
  apiUrl: string,
  token: string,
  roomId: string,
  limit = 50
) {
  return getJson<MessageResponse[]>(`${apiUrl}/rooms/${roomId}/messages?limit=${limit}`, token);
}
