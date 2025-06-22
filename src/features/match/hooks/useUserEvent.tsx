import { socket } from "@/api/socket";
import useInviteStore from "@/store/inviteStore";
import useMatchStore from "@/store/matchStore";
import type { Slot } from "@/types/Match";
import type { UserResponse } from "@/types/User";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

export const useInviteFail = () => {
  const { setInviteFail, isInviteFail } = useInviteStore();

  useEffect(() => {
    function handleInviteFail({ message }: { message: string }) {
      setInviteFail();
      toast("Invite Fail", {
        description: message,
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
    }

    socket.on("invite_fail", handleInviteFail);

    return () => {
      socket.off("invite_fail", handleInviteFail);
    };
  }, [isInviteFail]);
};

export const useReceiveInvite = () => {
  const { setInviteFrom } = useInviteStore();
  const { matchSlot } = useMatchStore();

  const matchSlotRef = useRef(matchSlot);

  useEffect(() => {
    matchSlotRef.current = matchSlot;
  }, [matchSlot]);

  useEffect(() => {
    function handleRecieveInvite({ fromUserId }: { fromUserId: string }) {
      if (matchSlotRef.current.length === 2) {
        socket.emit("already_in_room", { fromUserId });
      } else {
        setInviteFrom(fromUserId);
      }
    }

    socket.on("recieve_invite", handleRecieveInvite);

    return () => {
      socket.off("recieve_invite", handleRecieveInvite);
    };
  }, []);

  return;
};

export const acceptInvite = () => {
  const { setMatchSlot, setSlotId, matchSlot, slotId } = useMatchStore();

  useEffect(() => {
    function acceptInvite({ slot, roomId }: { slot: Slot[]; roomId: string }) {
      setMatchSlot(slot);
      setSlotId(roomId);
    }

    socket.on("room_created", acceptInvite);

    return () => {
      socket.off("room_created", acceptInvite);
    };
  }, [matchSlot, slotId]);

  return;
};

export const bothReady = () => {
  const { setBothReady, isBothReady } = useMatchStore();

  useEffect(() => {
    function bothReadyFn({ isReady }: { isReady: boolean }) {
      setBothReady(isReady);
    }

    socket.on("both_ready", bothReadyFn);

    return () => {
      socket.off("both_ready", bothReadyFn);
    };
  }, [isBothReady]);

  return;
};

export const kicked = () => {
  const { setMatchSlot, clearSlotId, setBothReady, isBothReady, slotId, matchSlot } = useMatchStore();
  const { clearInvite } = useInviteStore();

  useEffect(() => {
    function kickedFn({ user }: { user: UserResponse }) {
      setMatchSlot([user]);
      clearInvite();
      clearSlotId();
      setBothReady(false);
    }

    socket.on("kicked", kickedFn);

    return () => {
      socket.off("kicked", kickedFn);
    };
  }, [isBothReady, slotId, matchSlot]);

  return;
};

export const playerLeft = () => {
  const { setMatchSlot, matchSlot, clearSlotId, setBothReady, isBothReady, slotId } =
    useMatchStore();
  const { clearInvite } = useInviteStore();

  useEffect(() => {
    function playerLeftFn({ user }: { user: UserResponse }) {
      setMatchSlot([user]);
      clearInvite();
      clearSlotId();
      setBothReady(false);
    }

    socket.on("player_left", playerLeftFn);

    return () => {
      socket.off("player_left", playerLeftFn);
    };
  }, [isBothReady, slotId, matchSlot]);

  return;
};
