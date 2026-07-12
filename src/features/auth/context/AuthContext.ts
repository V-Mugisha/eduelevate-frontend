import { createContext } from "react";
import type { User } from "../types/authTypes";

export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (authenticatedUser: User, token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
