import { axiosInstance } from './axios';

export const getLps = async (sort: string) => {
  const response = await axiosInstance.get(`/v1/lps?sort=${sort}`);
  return response.data;
};

export const getLpDetail = async (lpid: string) => {
  const response = await axiosInstance.get(`/v1/lps/${lpid}`);
  return response.data;
};

export const postLikeLp = async (lpid: number) => {
   const res = await axiosInstance.post(`/v1/lps/${lpid}/likes`);
  return res.data;
 };

