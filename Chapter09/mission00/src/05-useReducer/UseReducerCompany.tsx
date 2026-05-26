import { useReducer, useState } from "react";
import type { ChangeEvent } from "react";

interface IState {
    department: string;
    error: string | null;
}

interface IAction {
    type: "CHANGE_DEPARTMENT" | "RESET";
    payload?: string;
}

function reducer(state: IState, action: IAction) {
    const { type, payload } = action;

    switch (type) {
        case "CHANGE_DEPARTMENT": {
            const newDepartment = payload ?? "";
            const hasError = newDepartment !== "카드메이커";

            return {
                ...state,
                department: hasError ? state.department : newDepartment,
                error: hasError ? "거부권 행사 가능, 카드메이커만 입력 가능합니다." : null,
            };
        }
        case "RESET":
            return {
                department: "Software Developer",
                error: null,
            };
        default:
            return state;
    }
}

export default function UseReducerCompany() {
    const [state, dispatch] = useReducer(reducer, {
        department: "Software Developer",
        error: null,
    });
    const [department, setDepartment] = useState("");

    const handleChangeDepartment = (e: ChangeEvent<HTMLInputElement>) => {
        setDepartment(e.target.value);
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
            <form
                className="flex w-full max-w-xl flex-col items-center gap-6"
                onSubmit={(e) => {
                    e.preventDefault();
                    dispatch({ type: "CHANGE_DEPARTMENT", payload: department });
                }}
            >
                <h1 className="text-center text-3xl font-bold">{state.department}</h1>

                {state.error && (
                    <p className="text-center text-lg font-semibold text-red-500">{state.error}</p>
                )}

                <input
                    className="w-full rounded-md border border-zinc-700 bg-zinc-900 p-4 text-white outline-none transition placeholder:text-zinc-500 focus:border-white"
                    placeholder="변경하고 싶은 직무를 입력해주세요. 단 거부권 행사 가능"
                    value={department}
                    onChange={handleChangeDepartment}
                />

                <button
                    className="w-full rounded-md bg-white px-4 py-3 font-semibold text-black transition hover:bg-zinc-200"
                    type="submit"
                >
                    직무 변경하기
                </button>
            </form>
        </main>
    );
}
