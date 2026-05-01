import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import z from "zod";
import { postSignup } from "../../apis/auth";

const schema = z.object({
    name: z.string().min(1, { message: "닉네임을 입력해주세요." }),
});

type FormFields = z.infer<typeof schema>;

interface Props {
    email: string;
    password: string;
}

const inputClass = (hasError: boolean) =>
    `border w-[300px] p-[10px] focus:border-[#807bff] rounded-sm outline-none ${
        hasError ? "border-red-500" : "border-[#ccc]"
    }`;

const StepName = ({ email, password }: Props) => {
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors, isValid, isSubmitting } } =
        useForm<FormFields>({
            resolver: zodResolver(schema),
            mode: "onChange",
        });

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        await postSignup({ email, password, name: data.name });
        navigate("/");
    };

    return (
        <div className="flex flex-col gap-3">
            <div className="flex justify-center mb-2">
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-3xl border border-[#ccc]">
                    👤
                </div>
            </div>

            <input
                {...register("name")}
                className={inputClass(!!errors.name)}
                type="text"
                placeholder="닉네임"
            />
            {errors.name && (
                <div className="text-red-500 text-sm">{errors.name.message}</div>
            )}

            <button
                type="button"
                onClick={handleSubmit(onSubmit)}
                disabled={!isValid || isSubmitting}
                className="w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
                회원가입 완료
            </button>
        </div>
    );
};

export default StepName;