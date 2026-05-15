import type { RequestSigninDto } from "../types/auth";
import { createContext, useContext, useState, type PropsWithChildren, useEffect } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { postSignin } from "../apis/auth";
import { getMe } from "../apis/user";
import { useMutation } from "@tanstack/react-query";

interface User {
    id: number;
    name: string;
}

interface AuthContextType {
    accessToken: string | null;
    refreshToken: string | null;
    user: User | null;
    isLoading: boolean;
    login: (signInData: RequestSigninDto, onSuccess?: () => void) => Promise<void>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
    accessToken: null,
    refreshToken: null,
    user: null,
    isLoading: true,
    login: async () => {},
    logout: async () => {},
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);

    const { setItem: setAccessTokenInStorage, removeItem: removeAccessTokenFromStorage } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
    const { setItem: setRefreshTokenInStorage, removeItem: removeRefreshTokenFromStorage } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

    const fetchUser = async () => {
        try {
            const userData = await getMe();
            setUser({ id: userData.id, name: userData.name });
        } catch (e) {
            console.error("내 정보 불러오기 실패:", e);
            doLogout();
        }
    };

    const doLogout = () => {
        removeAccessTokenFromStorage();
        removeRefreshTokenFromStorage();
        setAccessToken(null);
        setRefreshToken(null);
        setUser(null);
    };

    useEffect(() => {
        const rawAccessToken = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);
        if (rawAccessToken) {
            const token = JSON.parse(rawAccessToken);
            setAccessToken(token);
            fetchUser();
        }
        setIsLoading(false);
    }, []);

    const loginMutation = useMutation({
        mutationFn: (signInData: RequestSigninDto) => postSignin(signInData),
        onSuccess: async (response) => {
            if (response.accessToken) {
                setAccessTokenInStorage(response.accessToken);
                setRefreshTokenInStorage(response.refreshToken);
                setAccessToken(response.accessToken);
                setRefreshToken(response.refreshToken);
                await fetchUser();
            }
        },
        onError: () => {
            alert("로그인에 실패했습니다. 다시 시도해주세요.");
        },
    });

    const login = async (signInData: RequestSigninDto, onSuccess?: () => void) => {
        await loginMutation.mutateAsync(signInData);
        onSuccess?.();
    };

    const logout = async () => {
        doLogout();
    };

    return (
        <AuthContext.Provider value={{ accessToken, refreshToken, user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("AuthContext를 찾을 수 없습니다.");
    return context;
};