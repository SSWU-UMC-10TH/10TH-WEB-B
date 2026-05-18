import { createContext, useContext } from "react";
import type { AuthTokenData } from "../types/auth";

export interface AuthContextType {
    accessToken: string | null;
    refreshToken: string | null;
    userName: string | null;
    userId: number | null;
    setAuth: (authData: AuthTokenData) => void;
    updateUserName: (name: string) => void;
    clearAuth: () => void;
}

export const AuthContext = createContext<AuthContextType>({
    accessToken: null,
    refreshToken: null,
    userName: null,
    userId: null,
    setAuth: () => {},
    updateUserName: () => {},
    clearAuth: () => {},
});

export const useAuth = () => {
    const context: AuthContextType = useContext(AuthContext);
    if (!context) {
        throw new Error("AuthContext를 찾을 수 없습니다.");
    }

    return context;
};
