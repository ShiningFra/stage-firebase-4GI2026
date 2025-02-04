import React, { useState, ChangeEvent, FormEvent } from "react";
import ErrorTooltip from "./ErrorTooltip";
import SuccessOverlay from "@/components/auth/SuccessOverlay";
import { EyePassword, NoEyePassword } from "@/components/icon/passwordIcon";
import { authService } from "@/services/auth";
import { toast } from "react-hot-toast";

interface LoginFormProps {
    onForgottenPasswordClick: (callback: () => void) => void;
    onSignUpClick: (callback: () => void) => void;
}

interface FormData {
    email: string;
    password: string;
}

interface MousePosition {
    x: number;
    y: number;
}

export default function LoginFormEmail({ onForgottenPasswordClick, onSignUpClick }: LoginFormProps) {
    const [formData, setFormData] = useState<FormData>({ email: "", password: "" });
    const [error, setError] = useState<string | null>(null);
    const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
    const [loginSuccess, setLoginSuccess] = useState<boolean>(false);
    const [isLoadingEmail, setIsLoadingEmail] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const resetForm = () => {
        setFormData({ email: "", password: "" });
        setError(null);
        setMousePosition({ x: 0, y: 0 });
        setLoginSuccess(false);
        setIsLoadingEmail(false);
        setShowPassword(false);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateFormMail = (): boolean => {
        if (!formData.email || !formData.password) {
            toast.error("Email and password are required.");
            return false;
        }
        return true;
    };

    const handleSubmitEmail = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!validateFormMail()) return;

        setIsLoadingEmail(true);
        setError(null);
        try {
            await authService.login({ email: formData.email, password: formData.password });
            setLoginSuccess(true);
            toast.success("Login successful!");
        } catch (error) {
            toast.error("Login failed. Please check your credentials.");
            setError(error.message);
        }
        setIsLoadingEmail(false);
    };

    return (
        <>
            <form onSubmit={handleSubmitEmail} className="space-y-3">
                <input
                    className="w-full px-3 py-2 rounded-md text border focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                />
                <div className="relative">
                    <input
                        className="w-full px-3 py-2 text rounded-md border focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Password"
                        required
                    />
                    <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={togglePasswordVisibility}
                    >
                        {!showPassword ? <NoEyePassword /> : <EyePassword />}
                    </button>
                </div>
                <button
                    className={`w-full py-2 text font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                        isLoadingEmail ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={isLoadingEmail}
                    onMouseMove={(e) => setMousePosition({ x: e.clientX, y: e.clientY })}
                >
                    {isLoadingEmail ? "Loading..." : "Continue"}
                </button>
            </form>
            <p className="mt-4 text-sm text-gray-600 text text-center">
                Don't have an account yet? {" "}
                <button
                    type="button"
                    onClick={() => { onSignUpClick(() => resetForm()); }}
                    className="font-medium text-indigo-600 hover:underline"
                >
                    Create your account
                </button>
            </p>
            {loginSuccess && (
                <SuccessOverlay
                    result="Login Successful!"
                    message="Redirecting you to the dashboard...please wait !"
                    redirect="/dashboard"
                />
            )}
        </>
    );
}
