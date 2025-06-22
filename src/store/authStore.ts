import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AuthStore = {
    accessToken: string | null;
    setAccessToken: (token: string) => void;
    logout: () => void;
};

const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            accessToken: null,
            setAccessToken: (token: string) => {
                set({ accessToken: token });
            },
            logout: () => {
                set({ accessToken: null });
            },
        }),
        {
            name: 'auth-storage',
        }
    )
);

export const getAccessToken = () => useAuthStore.getState().accessToken;

export default useAuthStore;