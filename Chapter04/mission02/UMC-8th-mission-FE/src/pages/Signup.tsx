import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { postSignup } from "../apis/auth";
import Profile from '../img/profile.png'

const schema = z.object({
  email: z.string().email({ message: "올바른 이메일 형식이 아닙니다." }),
  password: z.string()
    .min(8, { message: "비밀번호는 8자 이상이어야 합니다." })
    .max(20, { message: "비밀번호는 20자 이하여야 합니다." }),
  passwordCheck: z.string()
    .min(8, { message: "비밀번호는 8자 이상이어야 합니다." })
    .max(20, { message: "비밀번호는 20자 이하여야 합니다." }),
  name: z.string().min(1, { message: "이름(닉네임)을 입력해주세요." })
}).refine((data) => data.password === data.passwordCheck, {
  message: "비밀번호가 일치하지 않습니다.",
  path: ["passwordCheck"],
});

type FormFields = z.infer<typeof schema>;

const Signup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const { register, handleSubmit, trigger, watch, formState: { errors, isSubmitting } } = useForm<FormFields>({
    defaultValues: { name: "", email: "", password: "", passwordCheck: "" },
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const values = watch();

  // 유효성 체크 로직
  const isStep1Valid = values.email && !errors.email;
  const isStep2Valid = values.password && values.passwordCheck && !errors.password && !errors.passwordCheck && values.password === values.passwordCheck;
  const isStep3Valid = values.name && !errors.name;

  const inputBaseStyle = `text-white border p-[10px] focus:border-[#A0E9FF] rounded-sm bg-transparent outline-none [&::-ms-reveal]:invert-[1] [&::-webkit-contacts-auto-fill-button]:invert-[1]`;
  
  const getBtnStyle = (isValid: any) => 
    `w-full py-3 rounded-md text-lg font-medium mt-2 transition-colors ${isValid ? "bg-pink-600 cursor-pointer hover:bg-pink-700" : "bg-[#333] text-gray-500 cursor-not-allowed"}`;

  const handleNextStep = async (fields: (keyof FormFields)[]) => {
    if (await trigger(fields)) setStep((prev) => prev + 1);
  };

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      const { passwordCheck, ...rest } = data;
      await postSignup(rest);
      alert("회원가입 완료!");
      navigate("/");
    } catch (error: any) {
      alert(error.message || "실패했습니다.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 bg-black text-white">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 py-2 w-[300px]">
        <button onClick={() => (step > 1 ? setStep(step - 1) : navigate(-1))} className="text-white text-xl cursor-pointer">{`<`}</button>
        <div className="text-xl font-bold">회원가입</div>
        <div className="w-5"></div>
      </div>

      <div className="flex flex-col gap-3 w-[300px]">
        
        {step === 2 && (
          <div className="flex items-center gap-2 mb-2 text-gray-300 text-sm">
            <span>✉️</span>
            <span className="text-white">{values.email}</span>
          </div>
        )}

        {/* --- 1단계: 이메일 --- */}
        {step === 1 && (
          <>
            <input {...register("email")} className={`${inputBaseStyle} ${errors.email ? "border-red-500" : "border-[#ccc]"}`} type="email" placeholder="이메일" />
            {errors.email && <div className="text-red-500 text-sm">{errors.email.message}</div>}
            <button type="button" onClick={() => handleNextStep(["email"])} className={getBtnStyle(isStep1Valid)}>다음</button>
          </>
        )}

        {/* --- 2단계: 비밀번호 & 확인 --- */}
        {step === 2 && (
          <>
            <input {...register("password")} className={`${inputBaseStyle} ${errors.password ? "border-red-500" : "border-[#ccc]"}`} type="password" placeholder="비밀번호를 입력해주세요!" />
            <input {...register("passwordCheck")} className={`${inputBaseStyle} ${errors.passwordCheck ? "border-red-500" : "border-[#ccc]"}`} type="password" placeholder="비밀번호를 다시 한 번 입력해주세요!" />
            {(errors.password || errors.passwordCheck) && <div className="text-red-500 text-sm">{errors.password?.message || errors.passwordCheck?.message}</div>}
            <button type="button" onClick={() => handleNextStep(["password", "passwordCheck"])} className={getBtnStyle(isStep2Valid)}>다음</button>
          </>
        )}

        {/* --- 3단계: 이름(닉네임) --- */}
        {step === 3 && (
          <>
          <div className="flex justify-center items-center w-full">
          <img src={Profile} width={200} ></img></div>
            <input {...register("name")} className={`${inputBaseStyle} ${errors.name ? "border-red-500" : "border-[#ccc]"}`} type="text" placeholder="닉네임을 입력해주세요!" />
            {errors.name && <div className="text-red-500 text-sm">{errors.name.message}</div>}
            <button disabled={isSubmitting || !isStep3Valid} type="button" onClick={handleSubmit(onSubmit)} className={getBtnStyle(isStep3Valid)}>회원가입 완료</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Signup;