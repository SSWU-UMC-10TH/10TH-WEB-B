import { postSignin } from "../apis/auth";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import useForm from "../hooks/useForm";
import { uselocalStorage } from "../hooks/useLocalStorage";
import { validateSignin, type UserSigninInformation } from "../utils/validate";

const LoginPage = () => {
  const { setItem } = uselocalStorage(LOCAL_STORAGE_KEY.acessToken);
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
    try {
      const response = await postSignin(values);
      setItem(response.data.accessToken);
      console.log(response);
    } catch (error: any) {
      alert(error?.message);
    }
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

        <button
          type="button"
          className="w-full flex items-center justify-center gap-3 bg-[#1a1a1a] border border-[#333] py-3 rounded-lg hover:bg-[#252525] transition-all"
        >
          <span className="text-sm">구글 로그인</span>
        </button>

        <div className="flex items-center gap-4 text-[#444] my-1">
          <div className="flex-grow h-[1px] bg-[#333]"></div>
          <span className="text-xs">OR</span>
          <div className="flex-grow h-[1px] bg-[#333]"></div>
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
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
