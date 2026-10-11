"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setMessage("");
    setSuccess(false);
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "تعذّر تسجيل الدخول.");
        return;
      }

      setSuccess(true);
      setMessage(data.message || "تم تسجيل الدخول بنجاح!");

      // ننتظر قليلًا حتى تظهر رسالة النجاح
      setTimeout(() => {
        router.push("/documents");
        router.refresh();
      }, 800);
    } catch {
      setMessage("تعذّر الاتصال بالخادم. تأكدي أن المشروع يعمل.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      dir="rtl"
      className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12"
    >
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="bg-emerald-700 px-6 py-8 text-center text-white">
          <h1 className="mb-2 text-3xl font-bold">دليل تونس 🇹🇳</h1>
          <p className="text-sm text-emerald-100">
            مرحبًا بك مجددًا! سجّل الدخول لمتابعة رحلتك.
          </p>
        </div>

        <div className="p-6 sm:p-8">
          <h2 className="mb-2 text-center text-2xl font-bold text-gray-800">
            تسجيل الدخول
          </h2>

          <p className="mb-6 text-center text-sm text-gray-500">
            أدخل معلومات حسابك للمتابعة
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                البريد الإلكتروني
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                required
                autoComplete="email"
                dir="ltr"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-left outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                كلمة المرور
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="أدخل كلمة المرور"
                required
                autoComplete="current-password"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            {message && (
              <div
                role="status"
                className={`rounded-lg p-3 text-center text-sm ${
                  success
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-emerald-700 px-4 py-3 font-bold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            ما عندكش حساب؟
            <Link
              href="/register"
              className="mr-1 font-bold text-emerald-700 hover:text-emerald-900"
            >
              أنشئ حسابًا جديدًا
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}