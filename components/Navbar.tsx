"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [language, setLanguage] = useState<"ar" | "fr">("ar");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const isArabic = language === "ar";

  const toggleLanguage = () => {
    setLanguage(isArabic ? "fr" : "ar");
  };

useEffect(() => {
  async function checkLogin() {
    try {
      const response = await fetch("/api/auth/me");

      if (response.ok) {
        const data = await response.json();

        if (data.authenticated) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error("Error checking login:", error);
      setIsLoggedIn(false);
    }
  }

  checkLogin();
}, []);
  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        setIsLoggedIn(false);

        // نرجع للصفحة الرئيسية
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <nav
      dir={isArabic ? "rtl" : "ltr"}
      className="w-full border-b border-gray-100 bg-white"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-900 text-xl font-bold text-white">
            د
          </div>

          <div>
            <h1 className="text-xl font-bold text-blue-950">
              {isArabic ? "دليل تونس" : "Dalil Tounes"}
            </h1>

            <p className="text-xs text-gray-500">
              {isArabic
                ? "دليلك للخدمات الإدارية"
                : "Votre guide administratif"}
            </p>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="font-medium text-blue-900 transition hover:text-blue-600"
          >
            {isArabic ? "الرئيسية" : "Accueil"}
          </Link>

          <Link
            href="/documents"
            className="font-medium text-gray-600 transition hover:text-blue-900"
          >
            {isArabic ? "الوثائق الإدارية" : "Documents"}
          </Link>

          <Link
            href="/about"
            className="font-medium text-gray-600 transition hover:text-blue-900"
          >
            {isArabic ? "من نحن" : "À propos"}
          </Link>

          <Link
            href="/contact"
            className="font-medium text-gray-600 transition hover:text-blue-900"
          >
            {isArabic ? "اتصل بنا" : "Contact"}
          </Link>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3">

          <button
            onClick={toggleLanguage}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            {isArabic ? "FR" : "ع"}
          </button>

          {!isLoggedIn ? (
            <>
              <Link
                href="/citizen/login"
                className="hidden rounded-lg px-4 py-2 font-medium text-blue-900 transition hover:bg-blue-50 sm:block"
              >
                {isArabic ? "تسجيل الدخول" : "Connexion"}
              </Link>

              <Link
                href="/register"
                className="rounded-lg bg-blue-900 px-4 py-2 font-medium text-white transition hover:bg-blue-800"
              >
                {isArabic ? "إنشاء حساب" : "Créer un compte"}
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loggingOut
                ? isArabic
                  ? "جاري الخروج..."
                  : "Déconnexion..."
                : isArabic
                ? "تسجيل الخروج"
                : "Déconnexion"}
            </button>
          )}

        </div>
      </div>
    </nav>
  );
}