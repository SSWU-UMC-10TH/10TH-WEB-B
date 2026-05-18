import { type CommonResponse, type CursorBasedResponse } from "./common";

export type Tag = {
    id: number;
    name: string;
};

export type Likes = {
    id: number;
    userId: number;
    lpId: number;
};

export type Lp = {
    id: number;
    title: string;
    content: string;
    thumbnail: string;
    published: boolean;
    authorId: number;
    createdAt: Date;
    updatedAt: Date;
    tags: Tag[];
    likes: Likes[];
};

export type ResponseLpListDto = CursorBasedResponse<Lp[]>;

export type LpDetail = Lp & {
    author: {
        id: number;
        name: string;
        email: string;
        bio: string | null;
        avatar: string | null;
        createdAt: string;
        updatedAt: string;
    };
};

export type LpComment = {
    id: number;
    content: string;
    lpId: number;
    authorId: number;
    createdAt: string;
    updatedAt: string;
    author: {
        id: number;
        name: string;
        email: string;
        bio: string | null;
        avatar: string | null;
        createdAt: string;
        updatedAt: string;
    };
};

export type ResponseLpCommentsDto = CursorBasedResponse<LpComment[]>;

export type RequestCreateCommentDto = {
    lpId: string;
    content: string;
};

export type RequestUpdateCommentDto = {
    lpId: string;
    commentId: number;
    content: string;
};

export type RequestDeleteCommentDto = {
    lpId: string;
    commentId: number;
};

export type ResponseCommentDto = CommonResponse<LpComment>;

export type ResponseDeleteCommentDto = CommonResponse<{
    message: string;
}>;

export type RequestCreateLpDto = {
    title: string;
    content: string;
    tags: string[];
    published: boolean;
    thumbnail?: string;
};

export type RequestUpdateLpDto = Partial<RequestCreateLpDto> & {
    lpid: number | string;
};

export type RequestDeleteLpDto = {
    lpid: number | string;
};

export type ResponseUpdateLpDto = CommonResponse<Lp>;
export type ResponseDeleteLpDto = CommonResponse<boolean>;
export type ResponseLikeDto = CommonResponse<Likes>;

export type ResponseCreateLpDto = CommonResponse<Lp>;

export type RequestLpDto = {
    lpid: number | string;
};

export type ResponseLpDto = CommonResponse<LpDetail>;
