import { axiosInstance } from "./axios";

// API 명세서에 따른 응답 타입 정의
export interface GetMeResponse {
    id: number;
    email: string;
    name: string; // nickname 대신 name 사용
    profileImageUrl: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
}

// 내 정보 조회 API 호출 함수
export const getMe = async () => {
    const res = await axiosInstance.get<GetMeResponse>("/v1/users/me");
    return res.data;
};