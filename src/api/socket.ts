import { getAccessToken } from "@/store/authStore";
import { io, Socket } from "socket.io-client";


const URL = import.meta.env.VITE_URL || "http://localhost:5000";


export const socket: Socket = io(URL, {
    auth: {
        token: getAccessToken()
    },
    autoConnect: false
});