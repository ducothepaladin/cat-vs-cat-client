import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAddFriend, useGetFriends } from "../../hooks/useUserQuery";
import type { FriendResponse } from "@/types/User";
import { useState } from "react";
import z from "zod";
import InvitePopUp from "./InvitePopUp";
import { socket } from "@/api/socket";
import { useReceiveInvite } from "../../hooks/useUserEvent";
import type { Slot } from "@/types/Match";

function FriendList({ matchSlot }: { matchSlot: Slot[]}) {

  const [email, setEmail] = useState<string>("");
  const { data, isLoading } = useGetFriends();
  const { mutate } = useAddFriend();

  useReceiveInvite();


  if (isLoading) return <>Loading..</>;

  const handleAddFriend = () => {
    mutate({ friendEmail:  email});
    setEmail("");
  };

  const handleInvite = (toUserId: string) => {
    socket.emit('invite_friend', {toUserId});
  }

  return (
    <div>
      <InvitePopUp />
      <h2 className="font-bold mb-3 text-2xl flex items-center gap-2">
        Other Players
      </h2>
      <div className="flex mb-3 space-x-3">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter ID"
        />
        <Button
          onClick={handleAddFriend}
          disabled={!z.string().email().safeParse(email).success}
        >
          Add New
        </Button>
      </div>
      <ScrollArea className="w-full h-52 p-2 rounded-xl border border-purple-100 shadow-inner">
        {data.friends.map((friend: FriendResponse, i: number) => (
          <div
            key={i}
            className="p-3 cursor-pointer hover:bg-neutral-100 flex justify-between items-center mb-3 rounded-lg border border-purple-100 transition-all duration-150 group"
          >
            <div>
              <p className="text-sm font-semibold group-hover:underline">
                {friend.name}
              </p>
              <p className="text-xs text-neutral-400">{friend.email}</p>
            </div>
            <Button disabled={(matchSlot.length === 2)} onClick={() => handleInvite(friend.id)} className="text-xs active:scale-90 flex items-center gap-1 px-3 py-1 rounded-lg transition-all duration-150 group-hover:scale-105">
              <Plus size={16} />
              Invite
            </Button>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
}

export default FriendList;
