import { createContext, useContext } from "react";
import type { RequestSigninDto } from "../types/auth";

export interface AuthContextType {
    accessToken: string | null;
    refreshToken: string | null;
    userName: string | null;
    login: (signinData: RequestSigninDto) => Promise<void>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
    accessToken: null,
    refreshToken: null,
    userName: null,
    login: async () => {},
    logout: async () => {},
});

export const useAuth = () => {
    const context: AuthContextType = useContext(AuthContext);
    if (!context) {
        throw new Error("AuthContext를 찾을 수 없습니다.");
    }

    return context;
};
