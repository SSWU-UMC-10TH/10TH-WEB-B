import { useState } from "react";
import StepEmail from "../components/signup/StepEmail";
import StepPassword from "../components/signup/StepPassword";
import StepName from "../components/signup/StepName";

const SignupPage = () => {
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <div className="flex flex-col items-center justify-center h-full gap-4">
            {step === 1 && (
                <StepEmail
                    onNext={(email) => { setEmail(email); setStep(2); }}
                />
            )}
            {step === 2 && (
                <StepPassword
                    email={email}
                    onNext={(password) => { setPassword(password); setStep(3); }}
                />
            )}
            {step === 3 && (
                <StepName
                    email={email}
                    password={password}
                />
            )}
        </div>
    );
};

export default SignupPage;