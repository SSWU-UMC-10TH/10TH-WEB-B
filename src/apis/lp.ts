import { axiosInstance } from './axios';

export const getLps = async (sort: string) => {
  const response = await axiosInstance.get(`/v1/lps?sort=${sort}`);
  return response.data;
};

export const getLpDetail = async (lpid: string) => {
  const response = await axiosInstance.get(`/v1/lps/${lpid}`);
  return response.data;
};