import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import z from "zod";

const schema = z.object({
    email: z.string().email({ message: "올바른 이메일 형식이 아닙니다." }),
});

type FormFields = z.infer<typeof schema>;

interface Props {
    onNext: (email: string) => void;
}

const inputClass = (hasError: boolean) =>
    `border w-[300px] p-[10px] focus:border-[#807bff] rounded-sm outline-none ${
        hasError ? "border-red-500" : "border-[#ccc]"
    }`;

const StepEmail = ({ onNext }: Props) => {
    const { register, handleSubmit, formState: { errors, isValid } } =
        useForm<FormFields>({
            resolver: zodResolver(schema),
            mode: "onChange",
        });

    const onSubmit: SubmitHandler<FormFields> = (data) => {
        onNext(data.email);
    };

    return (
        <div className="flex flex-col gap-3">
            <input
                {...register("email")}
                className={inputClass(!!errors.email)}
                type="email"
                placeholder="이메일"
            />
            {errors.email && (
                <div className="text-red-500 text-sm">{errors.email.message}</div>
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

export default StepEmail;