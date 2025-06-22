import useInviteStore from "@/store/inviteStore";
import { useEffect, useState } from "react";
import { UserPlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { socket } from "@/api/socket";

function InvitePopUp() {
  const { inviteFrom, clearInvite } = useInviteStore();
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    setIsVisible(!!inviteFrom);
  }, [inviteFrom]);

  if (!isVisible || !inviteFrom) return null;

  const handleReject = () => {
      clearInvite();
      setIsVisible(false);
  }

  const handleAcceptInvite = () => {
    socket.emit('join_slot', {invitedUserId: inviteFrom});
    setIsVisible(false);
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/25 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm relative">
        <div
          onClick={handleReject}
          aria-label="Close"
        >
          <X size={20} />
        </div>
        <div className="flex flex-col items-center gap-4">
          <UserPlus size={40} />
          <h2 className="text-lg font-semibold text-gray-800">
            Game Invite
          </h2>
          <p className="text-gray-600 text-center">
            <span className="font-bold">{inviteFrom}</span> has invited you to a match!
          </p>
          <div className="flex gap-4 mt-4">
            <Button
              onClick={handleAcceptInvite}
            >
              Accept
            </Button>
            <Button
              onClick={handleReject}
            >
              Decline
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InvitePopUp;
