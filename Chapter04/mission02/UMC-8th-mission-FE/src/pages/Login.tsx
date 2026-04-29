import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import useForm from "../hooks/useForm";
import { type UserSigninInformation, validateSignin } from "../utils/validate";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const {login, accessToken} = useAuth();
    const navigate = useNavigate();

    useEffect(()=> {
        if (accessToken) {
            navigate("/")
        }
    }, [navigate, accessToken])

    const { values, errors, touched, getInputProps } = useForm<UserSigninInformation>({
        initialValue: {
            email: "",
            password: "",
        },
        validate: validateSignin,
    })

    const handleSubmit = async () => {
        await login(values);
        navigate("/my")
    };

    const isDisabled = Object.values(errors || {}).some((error) => error.length > 0) ||
        Object.values(values).some((value) => value === "");


    return (
        <div className="flex flex-col items-center justify-center h-full gap-4 bg-black">
            <div className="flex items-center justify-between px-4 py-2">
                <button onClick={() => navigate(-1)} className="text-white -ml-30 mr-20 text-xl cursor-pointer">{`<`}</button>
                <div className="text-white text-xl font-bold translate-x-[8px]">로그인</div>
            </div>
            <div className="flex flex-col gap-3">
                <input
                    {...getInputProps("email")}
                    name="email"
                    className={`text-white border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm
                        ${errors?.email && touched?.email ? "border-white-500" : "border-gray-300"}`}
                    type={"email"}
                    placeholder={"이메일"}
                />
                {errors?.email && touched?.email && (
                    <div className="text-red-500 text-sm">{errors.email}</div>
                )}
                <input
                    {...getInputProps("password")}
                    className={`text-white border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm
                        ${errors?.password && touched?.password ? "border-white-500 " : "border-white-300"}`}
                    type={"password"}
                    placeholder={"비밀번호"}
                />
                {errors?.password && touched?.password && (
                    <div className="text-red-500 text-sm">{errors.password}</div>
                )}
                <button type="button" onClick={handleSubmit} disabled={isDisabled}
                    className="w-full bg-pink-600 text-white py-3 rounded-md text-lg font-midium hover:bg-pink-700 transition-colors cursor-pointer disabled:bg-black">
                    로그인
                </button>
            </div>
        </div>
    )
}

export default Login
