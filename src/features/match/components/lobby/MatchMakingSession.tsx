import { Button } from "@/components/ui/button";
import { CircleAlert, User, Crown, Ban, LogOut } from "lucide-react";
import FriendList from "./FriendList";
import useMatchStore from "@/store/matchStore";
import { getUserById } from "../../hooks/useUserQuery";
import {
  acceptInvite,
  bothReady,
  kicked,
  playerLeft,
  useInviteFail,
} from "../../hooks/useUserEvent";
import { Badge } from "@/components/ui/badge";
import useInviteStore from "@/store/inviteStore";
import { socket } from "@/api/socket";
import { useMatchStarted } from "../../hooks/useMatchEvent";

function MatchMakingSession() {
  const { matchSlot, isBothReady, removeSlot, clearSlotId, setBothReady } =
    useMatchStore();
  const { inviteFrom, clearInvite } = useInviteStore();
  const { data: user, isLoading } = getUserById();

  acceptInvite();
  useInviteFail();
  bothReady();
  kicked();
  playerLeft();
  useMatchStarted();

  if (isLoading) return <>Loading...</>;

  const handleReady = () => {
    socket.emit("ready", { hostUserId: inviteFrom, isReady: isBothReady });
  };

  const handleKick = () => {
    socket.emit("kick", { kickedId: matchSlot[1].id });
    removeSlot(matchSlot[1].id);
    clearInvite();
    clearSlotId();
    setBothReady(false);
  };

  const handleLeaveRoom = () => {
    socket.emit("leave", { hostUserId: inviteFrom });
    removeSlot(matchSlot[0].id);
    clearInvite();
    clearSlotId();
    setBothReady(false);
  };

  const handleStartGame = () => {
    socket.emit("match_start", { p1: matchSlot[0].id, p2: matchSlot[1].id });
  };

  return (
    <div className="h-full w-full min-h-screen flex justify-center items-center">
      <div className="border p-8 w-full max-w-lg bg-white shadow-2xl space-y-8 flex-col justify-center items-center rounded-3xl transition-all duration-300">
        <h1 className="w-full text-center text-5xl font-extrabold drop-shadow-lg tracking-tight mb-4 animate-fade-in">
          Cat vs Cat
        </h1>
        {
          <div className="grid gap-4 grid-cols-2 rounded-xl">
            <div className="h-32 border-2 rounded-xl p-4 flex flex-col justify-center items-center shadow-md relative group transition-all duration-200">
              <span className="absolute top-2 right-2 text-yellow-400 animate-bounce">
                <Crown size={18} />
              </span>
              <User
                size={40}
                className=" mb-2 group-hover:scale-110 transition-transform"
              />
              <span className="text-base font-semibold">
                {matchSlot.length > 0 && matchSlot[0]
                  ? matchSlot[0]?.name
                  : user?.name}
              </span>
            </div>
            {matchSlot.length !== 2 ? (
              <div className="h-32 border-2 border-dashed border-neutral-300 bg-neutral-50 rounded-xl p-4 flex flex-col justify-center items-center shadow-inner hover:bg-neutral-100 transition group cursor-pointer">
                <CircleAlert
                  size={40}
                  className="text-neutral-400 mb-2 group-hover:animate-pulse"
                />
                <span className="text-base font-semibold text-neutral-400 transition-colors">
                  Invite Player
                </span>
              </div>
            ) : (
              <div className="h-32 border-2 rounded-xl p-4 flex flex-col justify-center items-center shadow-md relative group transition-all duration-200">
                <User
                  size={40}
                  className=" mb-2 group-hover:scale-110 transition-transform"
                />
                <span className="text-base font-semibold">
                  {matchSlot[1].name}
                </span>
                <Badge
                  className={`absolute top-2 right-2 ${
                    isBothReady ? "bg-green-500" : "bg-gray-400"
                  }`}
                >
                  {isBothReady ? "Ready" : "Not Ready"}
                </Badge>
                {user && matchSlot[1] && user.id !== matchSlot[1].id ? (
                  <Button
                    size="sm"
                    onClick={handleKick}
                    variant="ghost"
                    className="absolute top-2 left-2 text-red-500 hover:scale-105 active:scale-95"
                  >
                    <Ban />
                  </Button>
                ) : (
                  <Button
                    onClick={handleLeaveRoom}
                    variant="ghost"
                    className="absolute bottom-2 right-2 hover:scale-105 active:scale-95"
                  >
                    <LogOut />
                  </Button>
                )}
              </div>
            )}
          </div>
        }
        {user && matchSlot[1] && user.id === matchSlot[1].id ? (
          isBothReady ? (
            <Button
              onClick={handleReady}
              variant="outline"
              className="w-full py-4 text-lg font-bold shadow-lg"
            >
              Not Ready
            </Button>
          ) : (
            <Button
              onClick={handleReady}
              className="w-full py-4 text-lg font-bold shadow-lg"
            >
              Ready
            </Button>
          )
        ) : (
          <Button
            disabled={matchSlot.length !== 2 || !isBothReady}
            className="w-full py-4 text-lg font-bold shadow-lg"
            onClick={handleStartGame}
          >
            {isBothReady ? "Start" : "Wait..."}
          </Button>
        )}
        <FriendList matchSlot={matchSlot} />
      </div>
    </div>
  );
}

export default MatchMakingSession;
