import type { Credential, LoginResponse } from "@/types/Auth"
import { useMutation } from "@tanstack/react-query";
import { login } from "../services/authServices";
import useAuthStore from "@/store/authStore";
import { useNavigate } from "react-router-dom";

export default function useLogin() {
  const { setAccessToken } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: Credential) => login(data),
    onSuccess: (userData: LoginResponse) => {
      setAccessToken(userData.accessToken);
      navigate("/match/lobby");
    },
  });
}
