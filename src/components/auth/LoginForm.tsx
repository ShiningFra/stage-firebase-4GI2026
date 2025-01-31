
import React, { useState } from 'react';
import LoginButtons from "@/components/auth/LoginButtons";
import LoginFormEmail from "@/components/auth/LoginFormEmail";
import LoginFormPhone from "@/components/auth/LoginFormPhone";

interface LoginFormProps {
    onForgottenPasswordClick:(callback: () => void) => void;
    onSignUpClick: (callback: () => void) => void;

}

export default function LoginForm({
                                      onForgottenPasswordClick,
                                      onSignUpClick,

                                  }:LoginFormProps) {
    const [loginMethod, setLoginMethod] = useState('email');

    return (
        <div className="w-full max-w-sm mx-auto">
            <LoginButtons />
            <div className="my-4 border-b text-center">
                <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                    Or with email
                </div>
            </div>
            <div className="flex justify-center space-x-4 mb-4">
                <button
                    type="button"
                    className={`px-4 py-2 rounded ${loginMethod === 'email' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
                    onClick={() => setLoginMethod('email')}
                >
                    Email
                </button>
            </div>
            {loginMethod === 'email' ? <LoginFormEmail
                onForgottenPasswordClick={onForgottenPasswordClick}
                onSignUpClick={onSignUpClick}/> : <LoginFormPhone onForgottenPasswordClick={onForgottenPasswordClick}
                                                                  onSignUpClick={onSignUpClick} />}
        </div>
    );
}
