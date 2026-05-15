import { axiosInstance } from "./axios";

export interface GetMeResponse {
    id: number;
    email: string;
    name: string;
    bio?: string;
    profileImageUrl: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
}

export const getMe = async () => {
    const res = await axiosInstance.get<GetMeResponse>("/v1/users/me");
    return res.data;
};

// id를 path에 넣어야 함
export const patchMe = async ({ id, name, bio }: { id: number; name: string; bio?: string }) => {
    const { data } = await axiosInstance.patch(`/v1/users/${id}`, { name, bio });
    return data;
};

export const deleteMe = async (id: number) => {
    const { data } = await axiosInstance.delete(`/v1/users/${id}`);
    return data;
};