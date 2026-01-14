import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

export function useSocket(url: string, userId: string | null) {
  const [connected, setConnected] = useState(false);

  const socket = useMemo(() => {
    if (!userId) {
      return null;
    }
    return io(url, {
      autoConnect: false,
      extraHeaders: {
        "x-user-id": userId
      }
    });
  }, [url, userId]);

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.connect();
    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.disconnect();
    };
  }, [socket]);

  return { socket, connected };
}
