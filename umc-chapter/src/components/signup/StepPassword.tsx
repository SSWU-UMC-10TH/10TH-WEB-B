import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import z from "zod";

const schema = z.object({
    password: z
        .string()
        .min(6, { message: "비밀번호는 6자 이상이어야 합니다." })
        .max(20, { message: "비밀번호는 20자 이하이어야 합니다." }),
    passwordCheck: z
        .string()
        .min(6, { message: "비밀번호는 6자 이상이어야 합니다." })
        .max(20, { message: "비밀번호는 20자 이하이어야 합니다." }),
}).refine((data) => data.password === data.passwordCheck, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordCheck"],
});

type FormFields = z.infer<typeof schema>;

interface Props {
    email: string;
    onNext: (password: string) => void;
}

const inputClass = (hasError: boolean) =>
    `border w-[300px] p-[10px] focus:border-[#807bff] rounded-sm outline-none pr-10 ${
        hasError ? "border-red-500" : "border-[#ccc]"
    }`;

const StepPassword = ({ email, onNext }: Props) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordCheck, setShowPasswordCheck] = useState(false);

    const { register, handleSubmit, formState: { errors, isValid } } =
        useForm<FormFields>({
            resolver: zodResolver(schema),
            mode: "onChange",
        });

    const onSubmit: SubmitHandler<FormFields> = (data) => {
        onNext(data.password);
    };

    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-gray-600 text-sm border border-[#ccc] rounded-sm p-[10px] w-[300px]">
                <span>✉️</span>
                <span>{email}</span>
            </div>

            <div className="relative">
                <input
                    {...register("password")}
                    className={inputClass(!!errors.password)}
                    type={showPassword ? "text" : "password"}
                    placeholder="비밀번호"
                />
                <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                    {showPassword ? "🙈" : "👁️"}
                </button>
            </div>
            {errors.password && (
                <div className="text-red-500 text-sm">{errors.password.message}</div>
            )}

            <div className="relative">
                <input
                    {...register("passwordCheck")}
                    className={inputClass(!!errors.passwordCheck)}
                    type={showPasswordCheck ? "text" : "password"}
                    placeholder="비밀번호 확인"
                />
                <button
                    type="button"
                    onClick={() => setShowPasswordCheck((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                    {showPasswordCheck ? "🙈" : "👁️"}
                </button>
            </div>
            {errors.passwordCheck && (
                <div className="text-red-500 text-sm">{errors.passwordCheck.message}</div>
            )}

            <button
                type="button"
                onClick={handleSubmit(onSubmit)}
                disabled={!isValid}
                className="w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
                다음
            </button>
        </div>
    );
};

export default StepPassword;