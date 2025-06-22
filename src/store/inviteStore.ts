import { create } from "zustand";
import { persist } from "zustand/middleware";

type InviteStore = {
    inviteFrom: string | null;
    isInviteFail: boolean;
    message: string;
    setInviteFrom: (id: string) => void;
    clearInvite: () => void;
    setInviteFail: () => void; 
    setMassage: (msg: string) => void;
};

const useInviteStore = create<InviteStore>()(
    persist(
        (set) => ({
            inviteFrom: null,
            isInviteFail: false,
            message: "",
            setInviteFrom: (id: string) => {
                set({ inviteFrom: id });
            },
            clearInvite: () => {
                set({ inviteFrom: null });
            },
            setInviteFail: () => {
                set((state) => ({
                    isInviteFail: !state.isInviteFail
                }));
            },
            setMassage: (msg: string) => {
                set({ message: msg});
            }
        }),
        {
            name: "invite-store",
        }
    )
);

export default useInviteStore;