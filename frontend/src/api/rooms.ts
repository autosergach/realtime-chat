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
