import { useEffect, useState } from "react";
import { getMyInfo } from "../apis/auth";
import type { ResponseMyInfoDto } from "../types/auth";
import { useAuth } from "../context/AuthContext";

const MyPage = () => {
    const {logout} = useAuth();
    const [data, setData] = useState<ResponseMyInfoDto | null>(null)
    
    useEffect(()=> {
        const getData = async() => {
            try {                          
            const response = await getMyInfo();
            console.log(response);
            setData(response);
            } catch (error) {
                console.error("내 정보 조회 실패:", error);
            }
        }
        getData();
    }, []);

    const handleLogout = async () => {
        await logout();
    };

    return <div>
        <h1>{data?.name}님 환영합니다</h1>         
        <img src={data?.profileImageUrl as string} alt={"프로필"} />  
        <h1>{data?.email}</h1>                     
        <button
         className="cursor-pointer bg-blue-300 rounded-sm p-5 hover:scale-90"
         onClick={handleLogout}>로그아웃</button>
    </div>;
};

export default MyPage;