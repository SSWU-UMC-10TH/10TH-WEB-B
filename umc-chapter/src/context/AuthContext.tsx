import type { RequestSigninDto } from "../types/auth";
import { createContext, useContext, useState, type PropsWithChildren } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { postLogout, postSignin } from "../apis/auth";

interface AuthContextType {
    accessToken: string | null;
    refreshToken: string | null;
    login: (signInData: RequestSigninDto, onSuccess?: () => void) => Promise<void>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
    accessToken: null,
    refreshToken: null,
    login: async () => {},
    logout: async () => {},
})

export const AuthProvider = ({children}: PropsWithChildren) => {
    const{
        getItem: getAccessTokenFromStorage, 
        setItem: setAccessTokenInStorage, 
        removeItem: removeAccessTokenFromStorage
    } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
    const{
        getItem: getRefreshTokenFromStorage,
        setItem: setRefreshTokenInStorage,
        removeItem: removeRefreshTokenFromStorage
    } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

    const[accessToken, setAccessToken] = useState<string | null>(
        getAccessTokenFromStorage()
    );

    const[refreshToken, setRefreshToken] = useState<string | null>(
        getRefreshTokenFromStorage()
    );

    const login = async (signInData: RequestSigninDto, onSuccess?: () => void) => {
    try {
        const response = await postSignin(signInData);
        console.log("postSignin response:", response);      

        if (response.accessToken) {
            setAccessTokenInStorage(response.accessToken);
            setRefreshTokenInStorage(response.refreshToken);
            setAccessToken(response.accessToken);
            setRefreshToken(response.refreshToken);
            
            alert("로그인 성공!");
            onSuccess?.();
        }
    } catch (error) {
        console.error("로그인 실패:", error);
        alert("로그인에 실패했습니다. 다시 시도해주세요.");
    }
}

    const logout = async () => {
    try {
        removeAccessTokenFromStorage();
        removeRefreshTokenFromStorage();
        setAccessToken(null);
        setRefreshToken(null);
        alert("로그아웃 성공!");
    } catch (error) {
        console.error("로그아웃 실패:", error);
        alert("로그아웃에 실패했습니다. 다시 시도해주세요.");
    }
}

    return (
        <AuthContext.Provider value={{accessToken, refreshToken, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context){
        throw new Error("AuthContext를 찾을 수 없습니다.");
    }
    return context;
}