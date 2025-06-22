import MatchMakingSession from "./MatchMakingSession";

function Lobby() {



  return (
    <div className="w-dvw h-dvh relative overflow-hidden">
      <div
        style={{
          backgroundImage:
            "url('https://worldofprintables.com/wp-content/uploads/2023/07/Black-and-White-Cat-Background-650x364.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        className="absolute w-full h-full left-0 top-0 z-0 blur-xs"
      />
      <div className="flex justify-center items-center w-dvw h-dvh relative z-10">
        <MatchMakingSession />
      </div>
    </div>
  );
}

export default Lobby;
