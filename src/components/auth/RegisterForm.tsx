import React, { useState, ChangeEvent, FormEvent } from "react";
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import LoginButtons from "@/components/auth/LoginButtons";
import { EyePassword, NoEyePassword } from "@/components/icon/passwordIcon";
import SuccessOverlay from "@/components/auth/SuccessOverlay";
import { authService } from "@/services/authService";
import { toast } from "react-hot-toast";
import validatePassword from "@/components/auth/passwordUtil";

const PhoneInput = dynamic(() => import('react-phone-input-2'), { ssr: false });

interface FormData {
    phoneNumber: string;
    email: string;
    password: string;
    confirmPassword: string;
    fullName: string;
    role: 'CHAUFFEUR' | 'CLIENT';
}

interface RegisterFormProps {
    onSignInClick: (callback: () => void) => void;
}

export default function RegisterForm({onSignInClick}: RegisterFormProps) {
    const router = useRouter();
    const [formData, setFormData] = useState<FormData>({
        phoneNumber: "",
        email: "",
        password: "",
        confirmPassword: "",
        fullName: "",
        role: 'CLIENT'
    });

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const [passwordTouched, setPasswordTouched] = useState<boolean>(false);
    const [Success, setSuccess] = useState<boolean>(false);

    const handleSuccess = () => {
        setSuccess(true);
        setTimeout(() => {
            router.push('/login');
        }, 2000);
    };

    const togglePasswordVisibility = (field: 'password' | 'confirmPassword') => {
        if (field === 'password') {
            setShowPassword(!showPassword);
        } else if (field === 'confirmPassword') {
            setShowConfirmPassword(!showConfirmPassword);
        }
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
        if (event.target.name === 'confirmPassword') {
            setPasswordTouched(true);
        }
    };

    const handleRoleChange = (role: 'CHAUFFEUR' | 'CLIENT') => {
        setFormData({ ...formData, role });
    };

    const validateForm = (): boolean => {
        if (!formData.phoneNumber || !formData.email || !formData.password || !formData.confirmPassword || !formData.fullName) {
            toast.error("Please fill in all fields.");
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match.");
            return false;
        }

        const { isValid, message } = validatePassword(formData.password);
        if (!isValid) {
            toast.error(message);
            return false;
        }

        return true;
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            await authService.signup({
                email: formData.email,
                password: formData.password,
                fullName: formData.fullName,
                phoneNumber: formData.phoneNumber,
                role: formData.role
            });
            handleSuccess();
        } catch (error: any) {
            toast.error(error.response?.data || 'An error occurred during registration');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center">
            <div className="w-full max-w-sm mx-auto">
                <LoginButtons />
                <div className="my-4 border-b text-center">
                    <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                        Or with email
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex justify-center space-x-4 mb-4">
                        <button
                            type="button"
                            className={`px-4 py-2 rounded ${formData.role === 'CLIENT' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
                            onClick={() => handleRoleChange('CLIENT')}
                        >
                            CLIENT
                        </button>
                        <button
                            type="button"
                            className={`px-4 py-2 rounded ${formData.role === 'CHAUFFEUR' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
                            onClick={() => handleRoleChange('CHAUFFEUR')}
                        >
                            CHAUFFEUR
                        </button>
                    </div>

                    <input
                        className="w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        type="text"
                        name="fullName"
                        placeholder="Full Name"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                    />

                    <PhoneInput
                        country={'cm'}
                        value={formData.phoneNumber}
                        onChange={(phoneNumber: string) => setFormData({ ...formData, phoneNumber })}
                        inputProps={{
                            name: 'phoneNumber',
                            required: true,
                            className: 'w-full pl-14 pr-3 py-2.5 text rounded-md border focus:outline-none focus:ring-2 focus:ring-indigo-500'
                        }}
                        containerClass="relative"
                        buttonClass="absolute left-0 top-0 bottom-0 flex items-center justify-center px-3 border-r"
                        dropdownClass="absolute left-0 z-50 bg-white shadow-lg rounded-md mt-1 max-h-60 overflow-y-auto"
                    />

                    <input
                        className="w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <div className="relative">
                        <input
                            className="w-full px-3 py-2 pr-10 rounded-md border focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => togglePasswordVisibility('password')}
                        >
                            {showPassword ? <EyePassword /> : <NoEyePassword />}
                        </button>
                    </div>

                    <div className="relative">
                        <input
                            className="w-full px-3 py-2 pr-10 rounded-md border focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            placeholder="Confirm password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => togglePasswordVisibility('confirmPassword')}
                        >
                            {showConfirmPassword ? <EyePassword /> : <NoEyePassword />}
                        </button>
                    </div>

                    {passwordTouched && formData.password !== formData.confirmPassword && (
                        <p className="text-red-500">Passwords do not match</p>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-2 rounded-md text-white font-medium ${
                            isLoading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
                        }`}
                    >
                        {isLoading ? 'Creating account...' : 'Create account'}
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <span className="text-gray-600">Already have an account?</span>{' '}
                    <button
                        onClick={() => onSignInClick(() => {})}
                        className="text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                        Sign in
                    </button>
                </div>
            </div>
            {Success && <SuccessOverlay 
                message="Account created successfully!" 
                result="success"
                redirect="/login"
            />}
        </div>
    );
}