import type { RequestSigninDto } from "../types/auth";
import { validateSignin } from "../utils/validate";
import useForm from "../hooks/useForm";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const { values, errors, touched, getInputProps } = useForm<RequestSigninDto>({
        initialValue: {
            email: "",
            password: "",
        },
        validate: validateSignin,
    });

    const handleSubmit = async () => {
        try {
            await login(values);
            navigate("/my");
        } catch (error) {
            if (error instanceof AxiosError) {
                alert(error?.message);
            }
        }
    };

    const isDisabled =
        Object.values(errors || {}).some((error) => error.length > 0) ||
        Object.values(values).some((value) => value === "");

    const onGoogleLogin = () => {
        alert("Google login is not implemented yet.");
    };

    return (
        <div className="flex h-full flex-col items-center justify-center gap-4">
            <div className="flex flex-col gap-3">
                <div className="mb-2 flex w-[300px] items-center justify-between">
                    <button type="button" onClick={() => navigate(-1)} className="text-2xl">
                        &lt;
                    </button>
                    <h2 className="mr-6 flex-1 text-center text-xl font-semibold">로그인</h2>
                </div>

                <button
                    type="button"
                    onClick={onGoogleLogin}
                    className="flex w-[300px] items-center justify-center gap-2 rounded-md border border-gray-400 px-4 py-2 font-medium hover:bg-gray-100"
                >
                    <img
                        src="https://www.svgrepo.com/show/475656/google-color.svg"
                        alt="Google"
                        className="h-5 w-5"
                    />
                    구글 로그인
                </button>

                <input
                    {...getInputProps("email")}
                    name="email"
                    className={`w-[300px] rounded-sm border border-[#ccc] p-[10px] text-black focus:border-[#87bff] ${
                        errors?.email && touched?.email
                            ? "border-red-500 bg-red-200"
                            : "border-gray-300"
                    }`}
                    type="email"
                    placeholder="이메일"
                />
                {errors?.email && touched?.email && (
                    <div className="text-sm text-red-500">{errors.email}</div>
                )}

                <input
                    {...getInputProps("password")}
                    name="password"
                    className={`w-[300px] rounded-sm border border-[#ccc] p-[10px] text-black focus:border-[#87bff] ${
                        errors?.password && touched?.password
                            ? "border-red-500 bg-red-200"
                            : "border-gray-300"
                    }`}
                    type="password"
                    placeholder="비밀번호"
                />
                {errors?.password && touched?.password && (
                    <div className="text-sm text-red-500">{errors.password}</div>
                )}

                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isDisabled}
                    className="w-full cursor-pointer rounded-md bg-blue-600 py-3 text-lg font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-gray-300"
                >
                    로그인
                </button>
            </div>
        </div>
    );
};

export default LoginPage;
