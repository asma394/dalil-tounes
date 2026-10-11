"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("يرجى إدخال البريد الإلكتروني وكلمة المرور");
      return;
    }

    // مؤقتًا: سنربط تسجيل الدخول الحقيقي لاحقًا
    if (email === "admin@daliltounes.tn" && password === "admin123") {
      router.push("/admin/dashboard");
    } else {
      setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">

          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-900 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
              🇹🇳
            </div>

            <h1 className="text-2xl font-bold text-slate-900">
              فضاء الإدارة
            </h1>

            <p className="text-slate-500 mt-2">
              تسجيل الدخول إلى لوحة التحكم
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-lg bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                البريد الإلكتروني
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@daliltounes.tn"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                كلمة المرور
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold py-3 rounded-xl transition"
            >
              تسجيل الدخول
            </button>

          </form>

          <p className="text-center text-xs text-slate-400 mt-6">
            دليل تونس © 2026
          </p>
        </div>
      </div>
    </main>
  );
}