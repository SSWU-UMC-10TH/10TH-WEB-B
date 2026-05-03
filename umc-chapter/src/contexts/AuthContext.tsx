import type { RequestSigninDto } from "../types/auth";
import { createContext, useContext, useState, type PropsWithChildren, useEffect } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { postLogout, postSignin } from "../apis/auth";

interface AuthContextType {
    accessToken: string | null;
    refreshToken: string | null;
    isLoading: boolean; // 추가
    login: (signInData: RequestSigninDto, onSuccess?: () => void) => Promise<void>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
    accessToken: null,
    refreshToken: null,
    isLoading: true, // 추가
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

    const [isLoading, setIsLoading] = useState(true); // 추가
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);

    // 초기 토큰 로드
    useEffect(() => {
        const rawAccessToken = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);
        const rawRefreshToken = localStorage.getItem(LOCAL_STORAGE_KEY.refreshToken);
        
        if (rawAccessToken) {
            setAccessToken(JSON.parse(rawAccessToken));
        }
        if (rawRefreshToken) {
            setRefreshToken(JSON.parse(rawRefreshToken));
        }
        
        setIsLoading(false); // 로딩 완료
    }, []);

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
        console.trace("logout 호출됨");
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
        <AuthContext.Provider value={{accessToken, refreshToken, isLoading, login, logout}}>
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