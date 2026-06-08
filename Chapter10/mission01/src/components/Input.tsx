import { memo } from "react";

interface InputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export const Input = memo(
    ({ value, onChange, placeholder = "영화 제목을 입력하세요", className = "" }: InputProps) => {
        return (
            <input
                type="text"
                className={`w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${className}`}
                placeholder={placeholder}
                value={value}
                onChange={(event) => onChange(event.target.value)}
            />
        );
    },
);
