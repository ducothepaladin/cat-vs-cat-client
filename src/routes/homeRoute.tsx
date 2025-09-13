import ProtectedRoute from "@/components/common/ProtectedRoute";

const homeRoute = [
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <div>Hello</div>
      </ProtectedRoute>
    ),
  },
];

export default homeRoute;
