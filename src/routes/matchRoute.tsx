import LobbyPage from "../features/match/pages/LobbyPage";
import MatchPage from "../features/match/pages/MatchPage";
import MatchLayout from "../components/layouts/MatchLayout";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import MatchCheckRoute from "@/components/common/MatchCheckRoute";

const matchRoutes = [
  {
    path: "/match",
    element: (
      <ProtectedRoute>
        <MatchLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "lobby",
        element: <LobbyPage />,
      },
      {
        index: true,
        element: (
          <MatchCheckRoute>
            <MatchPage />
          </MatchCheckRoute>
        ),
      },
    ],
  },
];

export default matchRoutes;
