import { socket } from "@/api/socket";
import { getAccessToken } from "@/store/authStore";
import { getSlotId } from "@/store/matchStore";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  const token = getAccessToken();
  const slotId = getSlotId();

  useEffect(() => {
    if (!token) {
      navigate("/auth");
      return;
    }

    socket.auth = { token };
    socket.connect();

    socket.emit("join", { roomId: slotId });

    return () => {
      socket.disconnect();
    };
  }, [token, slotId]);

  return <div>{children}</div>;
}
