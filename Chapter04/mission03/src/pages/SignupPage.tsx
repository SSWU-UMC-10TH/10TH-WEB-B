import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "../hooks/useLocalStorage";

const schema = z
    .object({
        email: z.string().email("올바른 이메일 형식이 아닙니다."),
        password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다."),
        passwordCheck: z.string(),
        name: z.string().min(1, "닉네임을 입력해주세요."),
    })
    .refine((data) => data.password === data.passwordCheck, {
        message: "비밀번호가 일치하지 않습니다.",
        path: ["passwordCheck"],
    });

type FormFields = z.infer<typeof schema>;

const SignupPage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordCheck, setShowPasswordCheck] = useState(false);
    const [storedEmail, setStoredEmail] = useLocalStorage("signup-email", "");

    const {
        register,
        handleSubmit,
        watch,
        trigger,
        formState: { errors },
    } = useForm<FormFields>({
        resolver: zodResolver(schema),
        mode: "onBlur",
        defaultValues: {
            email: storedEmail,
        },
    });

    const email = watch("email");
    const password = watch("password");
    const passwordCheck = watch("passwordCheck");

    const onSubmit = (data: FormFields) => {
        console.log("회원가입 완료!", data);
        // postSignup(data);
    };

    const onGoogleLogin = () => {
        console.log("구글 로그인 버튼 클릭됨");
        // 여기에 실제 구글 로그인 로직 추가 예정
    };

    const handleNext = async () => {
        if (step === 1 && (await trigger("email"))) {
            setStoredEmail(email);
            setStep(2);
        } else if (
            step === 2 &&
            (await trigger(["password", "passwordCheck"])) &&
            password === passwordCheck
        ) {
            setStep(3);
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex min-h-full items-center justify-center bg-black px-5 py-10 text-white"
        >
            <div className="w-full max-w-[320px]">
                <div className="relative mb-10 flex items-center justify-between">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="text-2xl leading-none text-white"
                    >
                        &lt;
                    </button>
                    <h1 className="absolute left-1/2 -translate-x-1/2 text-xl font-semibold">
                        회원가입
                    </h1>
                    <div className="w-6" />
                </div>

                <div className="flex flex-col gap-4">
                    <button
                        type="button"
                        onClick={onGoogleLogin}
                        className="flex h-12 items-center justify-center gap-3 rounded-md border border-zinc-600 bg-transparent px-4 font-medium text-white transition-colors hover:bg-zinc-900"
                    >
                        <img
                            src="https://www.svgrepo.com/show/475656/google-color.svg"
                            alt="Google"
                            className="h-5 w-5"
                        />
                        구글 로그인
                    </button>

                    <div className="flex items-center gap-3 text-sm font-semibold text-zinc-300">
                        <div className="h-px flex-1 bg-zinc-700" />
                        <span>OR</span>
                        <div className="h-px flex-1 bg-zinc-700" />
                    </div>
                </div>

                <div className="mt-4 flex flex-col gap-3">
                    {step === 1 && (
                        <>
                            <input
                                {...register("email")}
                                placeholder="이메일을 입력해주세요!"
                                className={`h-12 rounded-md border bg-zinc-950 px-4 text-white placeholder:text-sm placeholder:text-zinc-500 focus:outline-none ${
                                    errors.email
                                        ? "border-red-500 bg-red-950/30"
                                        : "border-zinc-700"
                                }`}
                                type="email"
                            />
                            {errors.email && (
                                <div className="text-sm text-red-400">{errors.email.message}</div>
                            )}

                            <button
                                type="button"
                                onClick={handleNext}
                                className="h-12 w-full rounded-md bg-zinc-900 text-base font-semibold text-zinc-200 transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-900 disabled:text-zinc-500"
                                disabled={!email}
                            >
                                다음
                            </button>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <div className="text-sm text-zinc-400">이메일: {storedEmail}</div>

                            <div className="relative">
                                <input
                                    {...register("password")}
                                    placeholder="비밀번호를 입력해주세요!"
                                    className={`h-12 w-full rounded-md border bg-zinc-950 px-4 pr-14 text-white placeholder:text-sm placeholder:text-zinc-500 focus:outline-none ${
                                        errors.password
                                            ? "border-red-500 bg-red-950/30"
                                            : "border-zinc-700"
                                    }`}
                                    type={showPassword ? "text" : "password"}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-zinc-300"
                                >
                                    {showPassword ? "숨김" : "보기"}
                                </button>
                            </div>
                            {errors.password && (
                                <div className="text-sm text-red-400">
                                    {errors.password.message}
                                </div>
                            )}

                            <div className="relative">
                                <input
                                    {...register("passwordCheck")}
                                    placeholder="비밀번호를 다시 입력해주세요!"
                                    className={`h-12 w-full rounded-md border bg-zinc-950 px-4 pr-14 text-white placeholder:text-sm placeholder:text-zinc-500 focus:outline-none ${
                                        errors.passwordCheck
                                            ? "border-red-500 bg-red-950/30"
                                            : "border-zinc-700"
                                    }`}
                                    type={showPasswordCheck ? "text" : "password"}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordCheck((prev) => !prev)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-zinc-300"
                                >
                                    {showPasswordCheck ? "숨김" : "보기"}
                                </button>
                            </div>
                            {errors.passwordCheck && (
                                <div className="text-sm text-red-400">
                                    {errors.passwordCheck.message}
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={handleNext}
                                className="h-12 w-full rounded-md bg-zinc-900 text-base font-semibold text-zinc-200 transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-900 disabled:text-zinc-500"
                                disabled={!password || !passwordCheck}
                            >
                                다음
                            </button>
                        </>
                    )}

                    {step === 3 && (
                        <>
                            <input
                                {...register("name")}
                                placeholder="닉네임을 입력해주세요!"
                                className={`h-12 rounded-md border bg-zinc-950 px-4 text-white placeholder:text-sm placeholder:text-zinc-500 focus:outline-none ${
                                    errors.name
                                        ? "border-red-500 bg-red-950/30"
                                        : "border-zinc-700"
                                }`}
                            />
                            {errors.name && (
                                <div className="text-sm text-red-400">{errors.name.message}</div>
                            )}

                            <button
                                type="submit"
                                className="h-12 w-full rounded-md bg-zinc-900 text-base font-semibold text-zinc-200 transition-colors hover:bg-zinc-800"
                            >
                                회원가입 완료
                            </button>
                        </>
                    )}
                </div>
            </div>
        </form>
    );
};

export default SignupPage;
