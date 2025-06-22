import useMatchStore from "@/store/matchStore";
import { useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

function MatchCheckRoute({ children }: { children: ReactNode }) {
  const { matchSlot, matchId } = useMatchStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (matchSlot.length <= 1 || !matchId) {
      console.log("check");
      navigate(-1);
    }
  }, []);

  return <>{children}</>;
}

export default MatchCheckRoute;
