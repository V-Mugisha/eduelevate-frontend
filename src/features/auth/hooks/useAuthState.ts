import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getToken, setToken, removeToken } from "@/lib/token";
import type { User } from "../types/authTypes";

function decodeUserFromToken(token: string): User | null {
  try {
    const payloadBase64 = token.split(".")[1];
    const payloadJson = atob(payloadBase64);
    const payload = JSON.parse(payloadJson) as {
      userId: string;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
    };
    return {
      id: payload.userId,
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
      role: payload.role as User["role"],
    };
  } catch {
    return null;
  }
}

export default function useAuthState() {
  const [user, setUser] = useState<User | null>(() => {
    const token = getToken();
    if (!token) return null;
    return decodeUserFromToken(token);
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (token && !user) {
      const decoded = decodeUserFromToken(token);
      if (decoded) {
        setUser(decoded);
      } else {
        removeToken();
      }
    }
  }, [user]);

  const login = useCallback(
    (authenticatedUser: User, token: string) => {
      setToken(token);
      setUser(authenticatedUser);
      navigate("/dashboard");
    },
    [navigate],
  );

  const logout = useCallback(() => {
    removeToken();
    setUser(null);
    navigate("/");
  }, [navigate]);

  return {
    user,
    isAuthenticated: user !== null,
    login,
    logout,
  };
}
