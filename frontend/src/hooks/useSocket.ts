import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

export function useSocket(url: string, token: string | null) {
  const [connected, setConnected] = useState(false);

  const socket = useMemo(() => {
    if (!token) {
      return null;
    }
    return io(url, {
      autoConnect: false,
      auth: {
        token
      }
    });
  }, [url, token]);

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
