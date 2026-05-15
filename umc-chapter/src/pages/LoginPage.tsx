import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import useForm from "../hooks/useForm";
import { validateSignin } from "../utils/validate";
import { useAuth } from "../contexts/AuthContext";
import type { RequestSigninDto } from "../types/auth";

const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const { values, errors, touched, getInputProps } = useForm<RequestSigninDto>({
        initialValue: { email: "", password: "" },
        validate: validateSignin,
    });

    const loginMutation = useMutation({
        mutationFn: () => login(values, () => navigate("/")),
    });

    const isDisabled =
        Object.values(errors || {}).some((e) => e.length > 0) ||
        Object.values(values).some((v) => v === "");

    const handleGoogleLogin = () => {
        window.location.href = "http://localhost:8000/v1/auth/google/login";
    };

    return (
        <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="flex flex-col gap-3">
                <input {...getInputProps("email")} type="email" placeholder="이메일"
                    className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm ${errors?.email && touched?.email ? "border-red-500" : "border-gray-300"}`} />
                {errors?.email && touched?.email && <div className="text-red-500 text-sm">{errors.email}</div>}

                <input {...getInputProps("password")} type="password" placeholder="비밀번호"
                    className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm ${errors?.password && touched?.password ? "border-red-500" : "border-gray-300"}`} />
                {errors?.password && touched?.password && <div className="text-red-500 text-sm">{errors.password}</div>}

                <button type="button" onClick={() => loginMutation.mutate()} disabled={isDisabled || loginMutation.isPending}
                    className="w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-300">
                    로그인
                </button>
                <button type="button" onClick={handleGoogleLogin}
                    className="w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 transition-colors cursor-pointer">
                    <div className="flex items-center justify-center gap-4"><span>구글 로그인</span></div>
                </button>
            </div>
        </div>
    );
};

export default LoginPage;