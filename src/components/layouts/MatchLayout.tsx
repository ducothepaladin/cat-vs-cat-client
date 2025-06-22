import { Outlet } from "react-router-dom"
import LobbyNavbar from "../LobbyNavbar"
import { Toaster } from "@/components/ui/sonner"


function MatchLayout() {
  return (
    <div>
      <LobbyNavbar />
      <Outlet />
      <Toaster />
    </div>
  )
}

export default MatchLayout