export type ClientToServerEvent =
  | {
      type: "join_room";
      payload: {
        roomId: string;
      };
    }
  | {
      type: "send_message";
      payload: {
        roomId: string;
        messageId: string;
        content: string;
      };
    }
  | {
      type: "typing";
      payload: {
        roomId: string;
      };
    };

export type ServerToClientEvent =
  | {
      type: "room_joined";
      payload: {
        roomId: string;
      };
    }
  | {
      type: "message";
      payload: {
        roomId: string;
        message: {
          id: string;
          authorId: string;
          content: string;
          createdAt: string;
        };
      };
    }
  | {
      type: "presence_update";
      payload: {
        userId: string;
        status: "online" | "offline";
        lastSeenAt: string | null;
      };
    }
  | {
      type: "error";
      payload: {
        code: string;
        message: string;
        traceId: string;
      };
    };
