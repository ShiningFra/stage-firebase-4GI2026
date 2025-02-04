import React from 'react';
import LoginFormEmail from "@/components/auth/LoginFormEmail";

interface LoginFormProps {
    onForgottenPasswordClick: (callback: () => void) => void;
    onSignUpClick: (callback: () => void) => void;
}

export default function LoginForm({
    onForgottenPasswordClick,
    onSignUpClick,
}: LoginFormProps) {
    return (
        <div className="w-full max-w-sm mx-auto">
            <LoginFormEmail
                onForgottenPasswordClick={onForgottenPasswordClick}
                onSignUpClick={onSignUpClick}
            />
        </div>
    );
}
