import { useNavigate } from "react-router-dom";
import useForm from "../hooks/useForm";
import { validateSignin, type UserSigninInformation } from "../utils/validate";

const LoginPage = () => {
  const navigate = useNavigate();

  const { values, errors, touched, getInputProps } =
    useForm<UserSigninInformation>({
      initialValue: {
        email: "",
        password: "",
      },
      validate: validateSignin,
    });

  const handleSubmit = async () => {
    console.log(values);
  };

  const isDisabled =
    Object.values(errors || {}).some((error) => error.length > 0) ||
    Object.values(values).some((v) => v === "");

  return (
    <div className="flex flex-col items-center justify-center h-full bg-black text-white px-4">
      <div className="flex items-center justify-center w-[300px] mb-8 relative">
        <span
          className="absolute left-0 cursor-pointer text-gray-400"
          onClick={() => navigate(-1)}
        >
          {"<"}
        </span>
        <h1 className="text-lg font-bold">로그인</h1>
      </div>

      <button className="w-[300px] border border-gray-600 py-3 rounded-md mb-6 text-sm hover:bg-zinc-900 cursor-pointer">
        구글 로그인
      </button>

      <div className="flex items-center w-[300px] gap-2 mb-6">
        <div className="flex-1 h-[1px] bg-zinc-800"></div>
        <span className="text-[10px] text-gray-500">OR</span>
        <div className="flex-1 h-[1px] bg-zinc-800"></div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <input
            {...getInputProps("email")}
            name="email"
            className={`w-[300px] bg-zinc-900 border p-[12px] rounded-md focus:outline-none focus:border-zinc-500 
            ${
              errors?.email && touched?.email
                ? "border-red-500"
                : "border-zinc-800"
            }`}
            type="email"
            placeholder="이메일을 입력해주세요!"
          />
          {errors?.email && touched?.email && (
            <div className="text-red-500 text-xs">{errors.email}</div>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <input
            {...getInputProps("password")}
            className={`w-[300px] bg-zinc-900 border p-[12px] rounded-md focus:outline-none focus:border-zinc-500
            ${
              errors?.password && touched?.password
                ? "border-red-500"
                : "border-zinc-800"
            }`}
            type="password"
            placeholder="비밀번호를 입력해주세요!"
          />
          {errors?.password && touched?.password && (
            <div className="text-red-500 text-xs">{errors.password}</div>
          )}
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isDisabled}
          className={`w-[300px] py-3 mt-4 rounded-md text-sm font-bold transition-colors cursor-pointer
          ${isDisabled ? "bg-zinc-800 text-zinc-500" : "bg-white text-black"}`}
        >
          로그인
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
