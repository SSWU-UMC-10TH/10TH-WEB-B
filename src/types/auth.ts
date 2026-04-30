import type { commonResponse } from "./common";

// 회원가입 요청
export type RequestSignupDto = {
  name: string;
  email: string;
  password: string;
  bio?: string;
  avatar?: string;
};

// 회원가입 응답
export type ResponseSignupDto = commonResponse<{
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
}>;

// 로그인 요청
export type RequestSigninDto = {
  email: string;
  password: string;
};

// 로그인 응답
export type ResponseSigninDto = commonResponse<{
  id: number;
  name: string;
  accessToken: string;
  refreshToken: string;
}>;

// 내 정보 조회 응답
export type ResponseMyInfoDto = commonResponse<{
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
}>;