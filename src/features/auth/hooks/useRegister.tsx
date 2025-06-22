import type { RegisterUser } from "@/types/Auth";
import { register } from "../services/authServices";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export default function useRegister() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (userData: RegisterUser) => register(userData),
    onSuccess: () => {
      navigate("/auth");
    },
  });
}
