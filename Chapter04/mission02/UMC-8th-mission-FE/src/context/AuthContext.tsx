import { createContext, useContext, useState, type PropsWithChildren } from "react";
import type { RequestSigninDto } from "../types/auth";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../../constants/key";
import { postSignin, postLogout } from "../apis/auth"; 

interface AuthContextType { 
    accessToken: string | null;
    refreshToken: string | null;
    login: (signInData: RequestSigninDto) => Promise<void>;
    logout: () => Promise<void>;
}


export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren) => {
    
    const {
        getItem: getAccessTokenFromStorage,
        setItem: setAccessTokenInStorage,
        removeItem: removeAccessTokenFromStorage,
    } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);

    const {
        getItem: getRefreshTokenFromStorage,
        setItem: setRefreshTokenInStorage,
        removeItem: removeRefreshTokenFromStorage,
    } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

    const [accessToken, setAccessToken] = useState<string | null>(
        getAccessTokenFromStorage(),
    );

    const [refreshToken, setRefreshToken] = useState<string | null>(
        getRefreshTokenFromStorage(),
    );

    const login = async (signinData: RequestSigninDto) => {
        try {
            const response = await postSignin(signinData);
            const { data } = response;

            if (data) {
                const newAccessToken = data.accessToken;
                const newRefreshToken = data.refreshToken; 

                setAccessTokenInStorage(newAccessToken);
                setRefreshTokenInStorage(newRefreshToken);

                setAccessToken(newAccessToken);
                setRefreshToken(newRefreshToken);
                alert("로그인 성공");
                window.location.href='/my'
            }
        } catch (error) {
            console.error("로그인 오류", error);
            alert("로그인 실패");
        }
    };

    const logout = async () => {
        try {
            await postLogout();
        } catch (error) {
            console.error("로그아웃 API 오류(무시하고 클라이언트 데이터 삭제)", error);
        } finally {
            removeAccessTokenFromStorage();
            removeRefreshTokenFromStorage();

            setAccessToken(null);
            setRefreshToken(null);

            alert("로그아웃 성공");
        }
    };

    return (
        <AuthContext.Provider value={{ accessToken, refreshToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth는 AuthProvider 내부에서 사용되어야 한다.");
    }

    return context;
};