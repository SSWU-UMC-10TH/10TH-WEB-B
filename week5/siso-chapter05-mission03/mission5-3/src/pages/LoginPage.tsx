import { useNavigate } from "react-router-dom";
import { postSignin } from "../apis/auth";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import useForm from "../hooks/useForm";
import { uselocalStorage } from "../hooks/useLocalStorage";
import { validateSignin, type UserSigninInformation } from "../utils/validate";
import { negative } from "zod";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

const LoginPage = () => {
  const { login, accessToken } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (accessToken) {
      navigate("/");
    }
  }, [navigate, accessToken]);

  const { values, errors, touched, getInputProps } =
    useForm<UserSigninInformation>({
      initialValue: {
        email: "",
        password: "",
      },
      validate: validateSignin,
    });

  const handleSubmit = async () => {
    await login(values);
  };

  const handleGoogleLogin = () => {
    window.location.href =
      import.meta.env.VITE_SERVER_API_URL + "/v1/auth/google/login";
  };

  //오류가 하나라도 있거나 입력값이 비어있으면 버튼 비활성화
  const isDisabled =
    Object.values(errors || {}).some((error) => error.length > 0) || //오류가 있으면 true
    Object.values(values).some((values) => values === ""); //입력값이 비어있으면 true

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <div className="w-full max-w-[340px] flex flex-col gap-6">
        <div className="flex items-center justify-center relative mb-4">
          <span className="absolute left-0 text-xl cursor-pointer text-gray-400">
            {"<"}
          </span>
          <h1 className="text-xl font-medium">로그인</h1>
        </div>

        <form className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <input
              {...getInputProps("email")}
              className={`w-full p-4 bg-[#1a1a1a] border rounded-lg outline-none placeholder:text-[#555] ${
                errors?.email && touched?.email
                  ? "border-red-500"
                  : "border-[#333] focus:border-[#666]"
              }`}
              type="email"
              placeholder="이메일을 입력하세요"
            />
            {errors?.email && touched?.email && (
              <span className="text-red-500 text-xs ml-1">{errors.email}</span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <input
              {...getInputProps("password")}
              className={`w-full p-4 bg-[#1a1a1a] border rounded-lg outline-none placeholder:text-[#555] ${
                errors?.password && touched?.password
                  ? "border-red-500"
                  : "border-[#333] focus:border-[#666]"
              }`}
              type="password"
              placeholder="비밀번호를 입력하세요"
            />
            {errors?.password && touched?.password && (
              <span className="text-red-500 text-xs ml-1">
                {errors.password}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isDisabled}
            className="w-full bg-[#ff007f] text-white py-4 rounded-lg text-md font-bold mt-4 hover:opacity-90 active:scale-[0.98] transition-all disabled:bg-[#4d0026] disabled:text-[#888] disabled:cursor-not-allowed"
          >
            로그인
          </button>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isDisabled}
            className="w-full bg-[#ff007f] text-white py-4 rounded-lg text-md font-bold mt-4 hover:opacity-90 active:scale-[0.98] transition-all disabled:bg-[#4d0026] disabled:text-[#888] disabled:cursor-not-allowed"
          >
            <div className="flex items-center justify-center gap-4">
              <img src={"/images/google.svg"} />
              <span>구글 로그인</span>
            </div>
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
