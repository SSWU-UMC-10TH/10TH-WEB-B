import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {z} from "zod";

const schema =z.object({
  email: z.string().email({ message: "올바른 이메일 형식이 아닙니다"}),
  password: z
    .string()
    .min(8,{
      message: "비밀번호는 20자 이하여야 합니다",
    }),
  name: z.string().min(1, { message: "이름을 입력해주세요" }),
});
type FormFields = z.infer<typeof schema>;

const SignupPage() =>{
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting},
  } = useForm<FormFields>( {
    defaultValues: {
      name: "",
      email: "",
      password: "",
      
    },
    resolver: zodResolver(schema),
  });
  return (
    <div className='flex flex-col items-center justify-center h-full gap-4'>
        <div className='flex flex-col gap-3'>
            <input
                {...register('email')}
                className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm
                ${errors?.email ? "border-red-500 bg-red-200" : "border-gray-300"}`}
                type={"email"}
                placeholder={"이메일"}
                
            />
           
            <input
                {...register("password")}
                className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm
                ${errors?.password ? "border-red-500 bg-red-200" : "border-gray-300"}`}
                type={"password"}
                placeholder={"비밀번호"}
            />
            
            <input
                {...register("name")}
                className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm
                ${errors?.password ? "border-red-500 bg-red-200" : "border-gray-300"}`}
                type={"password"}
                placeholder={"이름"}
            />
            <button 
                type="button" 
                onClick={()=>{}} 
                disabled={false}
                className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-300"
            >
                로그인
            </button>
        </div>
    </div>
  )
}

export default SignupPage