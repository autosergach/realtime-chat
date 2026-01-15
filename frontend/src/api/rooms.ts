import { getJson, postJson } from "./http";

export interface RoomSummary {
  id: string;
  name: string;
  isPrivate: boolean;
}

export async function createRoom(apiUrl: string, userId: string, name: string) {
  return postJson<RoomSummary>(`${apiUrl}/rooms`, {
    name,
    isPrivate: false,
    createdBy: userId
  }, {
    "x-user-id": userId
  });
}

export async function listRooms(apiUrl: string, userId: string) {
  return getJson<RoomSummary[]>(`${apiUrl}/rooms`, {
    "x-user-id": userId
  });
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
  userId: string,
  roomId: string,
  limit = 50
) {
  return getJson<MessageResponse[]>(
    `${apiUrl}/rooms/${roomId}/messages?limit=${limit}`,
    {
      "x-user-id": userId
    }
  );
}
