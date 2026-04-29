import { useEffect, useState } from "react";
import { getMyInfo } from "../apis/auth";
import type { ResponseMyInfoDto } from "../types/auth";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const MyPage = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    
    const [data, setData] = useState<ResponseMyInfoDto | null>(null);

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await getMyInfo();
                setData(response);
            } catch (error) {
                console.error("데이터 로딩 실패:", error);
            }
        };

        getData();
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    if (!data) {
        return <div>로딩 중...</div>;
    }

    return (
        <div>
            <h1>마이페이지</h1>
            <button onClick={handleLogout}>로그아웃</button>
        </div>
    );
};

export default MyPage;