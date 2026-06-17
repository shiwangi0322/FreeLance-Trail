import { useState } from "react";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";

function AuthContainer() {
    const [isSignUp, setIsSignUp] = useState(false);

    return (
        <div className="relative w-[900px] h-[550px] bg-white rounded-3xl shadow-2xl overflow-hidden">

            <div className="absolute top-0 left-0 w-1/2 h-full">
                {isSignUp ? <SignUpForm /> : <LoginForm />}
            </div>

            <div className="absolute top-0 right-0 w-1/2 h-full bg-red-500 text-white flex flex-col items-center justify-center">
                {isSignUp ? (
                    <>
                        <h2 className="text-4xl font-bold mb-4">Welcome Back!</h2>
                        <button
                            onClick={() => setIsSignUp(false)}
                            className="border border-white px-8 py-3 rounded-full"
                        >
                            SIGN IN
                        </button>
                    </>
                ) : (
                    <>
                        <h2 className="text-4xl font-bold mb-4">Hello, Friend!</h2>
                        <button
                            onClick={() => setIsSignUp(true)}
                            className="border border-white px-8 py-3 rounded-full"
                        >
                            SIGN UP
                        </button>
                    </>
                )}
            </div>

        </div>
    );
}

export default AuthContainer;