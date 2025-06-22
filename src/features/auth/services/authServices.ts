import API from "@/api/axios";
import type { RegisterUser, Credential } from "@/types/Auth";


export const register = async (user: RegisterUser) => {
    try {
      const response = await API.post("/auth/register", user);
      return response.data.content;
    } catch (error) {
      console.error("Error during registration:", error);
      throw error;
    }
  };

export const login = async (user: Credential) => {
  try {
    const response = await API.post("/auth/login", user);
    return response.data.content;
  } catch (error) {
    console.log("Error during login:", error);
    throw error;
  }
}