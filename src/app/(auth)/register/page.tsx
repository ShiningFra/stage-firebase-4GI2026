"use client";
import React, { useState } from "react";
import RegisterForm from "@/components/auth/RegisterForm";
import Link from "next/link";
import Image from "next/image";
import logo from "@public/img/MainLogo1.png";
import { APPLICATION_NAME } from "@/app/auth/Params";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth";
import SuccessOverlay from "@/components/auth/SuccessOverlay";

export default function RegisterPage() {
    const router = useRouter();
    const [success, setSuccess] = useState(false);

    async function handleRegister(formData) {
        try {
            await authService.signup(formData);
            setSuccess(true);
        } catch (error) {
            console.error("Erreur lors de l'inscription:", error);
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
            {success ? (
                <SuccessOverlay 
                    result="Inscription réussie" 
                    message="Redirection en cours vers le tableau de bord..." 
                    redirect="/dashboard" 
                />
            ) : (
                <div className="bg-white rounded-lg shadow-xl max-w-md w-full m-4 p-8 relative">
                    <div className="flex flex-col items-center">
                        <Link href="/" className="mb-4">
                            <Image src={logo} alt="logo" width={100} height={80} />
                        </Link>
                        <h1 className="title font-bold mb-4 mt-2 text-center text-2xl">
                            Créez un compte sur {APPLICATION_NAME}
                        </h1>
                        <RegisterForm onSubmit={handleRegister} />
                    </div>
                    <Link
                        href="/"
                        className="mt-4 block w-full py-2 px-4 text border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 text-center"
                    >
                        Retour à l'accueil
                    </Link>
                </div>
            )}
        </div>
    );
}
