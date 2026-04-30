export type commonResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};