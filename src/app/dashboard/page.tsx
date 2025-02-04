'use client'
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import authService from "@/services/auth";
import Link from 'next/link';
import Image from "next/image";
import { useTranslations } from 'next-intl';

// Ajoute ici l'import des icônes et des images de la NavBar et Footer si nécessaire

const Dashboard = () => {
  const router = useRouter();
  const t = useTranslations("Home");

  useEffect(() => {
    const role = localStorage.getItem('userRole');

    if (role === "CHAUFFEUR") {
      router.push("/chauffeur");
    } else if (role === "CLIENT") {
      router.push("/client");
    } else {
      router.push("/login");
    }
  }, [router]);

  return (
    <>
      {/* Navbar */}
      <nav className="flex justify-between items-center p-4 bg-[#2D3A96] text-white">
        <div className="flex items-center">
          <Link href="/" className="ml-4 font-bold text-xl">MonSite</Link>
        </div>
        <div className="flex space-x-6">
          <Link href="/" className="hover:text-[#FE9261]">{t('home')}</Link>
          <Link href="/about" className="hover:text-[#FE9261]">{t('about')}</Link>
          <Link href="/contact" className="hover:text-[#FE9261]">{t('contact')}</Link>
        </div>
      </nav>

      {/* Main content */}
      <div className="container mx-auto text-center py-16">
        <h1 className="text-3xl font-bold text-[#2D3A96]">{t('welcome')}</h1>
        <p className="mt-4 text-lg">{t('intro')}</p>
      </div>

      {/* Footer */}
      <footer className="bg-[#243757] text-white py-8">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex space-x-6">
            <Link href="/terms" className="hover:text-[#FE9261]">{t('terms')}</Link>
            <Link href="/privacy" className="hover:text-[#FE9261]">{t('privacy')}</Link>
            <Link href="/faq" className="hover:text-[#FE9261]">{t('faq')}</Link>
          </div>
          <div className="flex space-x-6">
          </div>
        </div>
        <div className="text-center mt-6">
          <p className="text-sm">&copy; 2025 MonSite. {t('allRightsReserved')}</p>
        </div>
      </footer>
    </>
  );
};

export default Dashboard;
