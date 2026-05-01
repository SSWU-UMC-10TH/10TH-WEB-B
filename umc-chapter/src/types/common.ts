export type CommonResponse<T> = {
    status: boolean;
    ststusCode: number;
    message: string;
    data: T;
}