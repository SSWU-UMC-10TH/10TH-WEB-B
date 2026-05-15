import type { PaginationDto } from "../types/common";
import type { ResponseLpListDto } from "../types/lp";
import { axiosInstance } from "./axios";

export const getLpList = async (paginationDto: PaginationDto): Promise<ResponseLpListDto> => {
    const { data } = await axiosInstance.get("v1/lps", {
        params: { categoryId: 1 }
    });
    return data;
};

// JSON으로 전송, categoryId 필수
export const postLp = async (body: { title: string; description: string; categoryId: number; tags?: string[] }) => {
    const { data } = await axiosInstance.post("v1/lps", body);
    return data;
};

export const patchLp = async ({ lpId, body }: { lpId: number; body: { title?: string; description?: string; tags?: string[] } }) => {
    const { data } = await axiosInstance.patch(`v1/lps/${lpId}`, body);
    return data;
};

export const deleteLp = async (lpId: number) => {
    const { data } = await axiosInstance.delete(`v1/lps/${lpId}`);
    return data;
};

export const postLike = async (lpId: number) => {
    const { data } = await axiosInstance.post(`v1/lps/${lpId}/likes`);
    return data;
};

export const deleteLike = async (lpId: number) => {
    const { data } = await axiosInstance.delete(`v1/lps/${lpId}/likes`);
    return data;
};

export const getComments = async ({ lpId, order }: { lpId: number; order?: string }) => {
    const { data } = await axiosInstance.get(`v1/lps/${lpId}/comments`, {
        params: { order }
    });
    return data.data ?? data;
};

export const postComment = async ({ lpId, content }: { lpId: number; content: string }) => {
    const { data } = await axiosInstance.post(`v1/lps/${lpId}/comments`, { content });
    return data;
};

// PUT으로 변경
export const putComment = async ({ lpId, commentId, content }: { lpId: number; commentId: number; content: string }) => {
    const { data } = await axiosInstance.put(`v1/lps/${lpId}/comments/${commentId}`, { content });
    return data;
};

export const deleteComment = async ({ lpId, commentId }: { lpId: number; commentId: number }) => {
    const { data } = await axiosInstance.delete(`v1/lps/${lpId}/comments/${commentId}`);
    return data;
};