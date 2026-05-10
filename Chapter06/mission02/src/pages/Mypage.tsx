import { useEffect, useState } from "react";
import { getMyInfo } from "../apis/auth";
import type { ResponseMyInfoDto } from "../types/auth";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";

const Mypage = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [data, setData] = useState<ResponseMyInfoDto>();

    useEffect(() => {
        const getData = async () => {
            const response = await getMyInfo();
            console.log(response);
            setData(response);
        };

        getData();
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
                <h1 className="text-2xl font-semibold mb-4">{data?.data?.name}님 환영합니다</h1>
                <img
                    src={data?.data?.avatar as string}
                    className="w-24 h-24 rounded-full mx-auto mb-4 shadow"
                />
                <h2 className="text-lg text-gray-700 mb-6">{data?.data?.email}</h2>
                <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg transition duration-200 transform hover:scale-105"
                >
                    로그아웃
                </button>
            </div>
        </div>
    );
};

export default Mypage;
