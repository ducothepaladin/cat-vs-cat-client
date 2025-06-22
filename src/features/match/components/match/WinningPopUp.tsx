import { Sparkles, Trophy, Skull } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import useMatchStore from "@/store/matchStore";
import { useNavigate } from "react-router-dom";
import useStatsStore from "@/store/statsStore";

function WinningPopUp() {
  const { isWin, reset } = useMatchStore();
  const stats = useStatsStore();

  const navigate = useNavigate();

  function handleRefresh() {
    navigate("/match/lobby");
    reset();
    stats.reset();
  }

  return (
    <>
      {isWin && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          {isWin === "win" && (
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative bg-gradient-to-b from-yellow-100 to-white rounded-xl border-2 border-yellow-300 shadow-2xl w-[90%] max-w-xl px-8 py-10 text-center"
            >
              <div className="flex flex-col items-center mb-6">
                <div className="relative flex justify-center items-center mb-4">
                  <Sparkles className="absolute -left-10 top-0 w-6 h-6 text-yellow-400 animate-ping" />
                  <Trophy className="w-16 h-16 text-yellow-500 drop-shadow-lg animate-bounce" />
                  <Sparkles className="absolute -right-10 top-0 w-6 h-6 text-yellow-400 animate-ping" />
                </div>
                <h1 className="text-4xl font-bold text-yellow-700 drop-shadow-sm">
                  Victory Achieved!
                </h1>
              </div>
              <div className="mt-8">
                <Button
                  onClick={handleRefresh}
                  className=" px-6 py-4 bg-yellow-400 hover:bg-yellow-500 duration-300 transition-colors rounded-full text-white font-semibold text-base shadow-md active:scale-95 transform"
                >
                  Back To Lobby
                </Button>
              </div>
              <div className="absolute bottom-4 left-6 text-left text-sm text-yellow-800 opacity-80">
                <p className="font-bold">Player: You</p>
                <p>Health Left: 60%</p>
              </div>
            </motion.div>
          )}
          {isWin === "lose" && (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative bg-gradient-to-b from-gray-100 to-white rounded-xl border-2 border-gray-300 shadow-2xl w-[90%] max-w-xl px-8 py-10 text-center"
            >
              <div className="flex flex-col items-center mb-6">
                <div className="relative flex justify-center items-center mb-4">
                  <Skull className="w-16 h-16 text-gray-600 drop-shadow-lg animate-shake" />
                </div>
                <h1 className="text-4xl font-bold text-gray-700 drop-shadow-sm">
                  Defeat!
                </h1>
                <p className="mt-2 text-gray-500">Better luck next time.</p>
              </div>
              <div className="mt-8">
                <Button
                  onClick={handleRefresh}
                  className="px-6 py-4 bg-gray-400 hover:bg-gray-500 duration-300 transition-colors rounded-full text-white font-semibold text-base shadow-md active:scale-95 transform"
                >
                  Back To Lobby
                </Button>
              </div>
              <div className="absolute bottom-4 left-6 text-left text-sm text-gray-700 opacity-80">
                <p className="font-bold">Player: You</p>
                <p>Health Left: 0%</p>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </>
  );
}

export default WinningPopUp;
