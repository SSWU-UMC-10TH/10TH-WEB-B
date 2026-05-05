// 수정 전: export const enum PAGINATION_ORDER { ... }
// 수정 후: 객체와 타입을 분리하여 선언 (erasableSyntaxOnly 대응)

export const PAGINATION_ORDER = {
    ASC: "asc",
    DESC: "desc",
} as const;

// 객체의 값들을 타입으로 추출합니다 ("asc" | "desc")
export type PAGINATION_ORDER = (typeof PAGINATION_ORDER)[keyof typeof PAGINATION_ORDER];