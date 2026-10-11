"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function NewDocumentPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    slug: "",
    titleAr: "",
    titleFr: "",
    category: "",
    icon: "📄",
    descriptionAr: "",
    descriptionFr: "",
    authorityAr: "",
    authorityFr: "",
    requirementsAr: "",
    requirementsFr: "",
    stepsAr: "",
    stepsFr: "",
    noteAr: "",
    noteFr: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/documents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slug: form.slug,
          title: {
            ar: form.titleAr,
            fr: form.titleFr,
          },
          category: form.category,
          icon: form.icon,
          description: {
            ar: form.descriptionAr,
            fr: form.descriptionFr,
          },
          authority: {
            ar: form.authorityAr,
            fr: form.authorityFr,
          },
          requirements: {
            ar: form.requirementsAr
              .split("\n")
              .map((item) => item.trim())
              .filter(Boolean),

            fr: form.requirementsFr
              .split("\n")
              .map((item) => item.trim())
              .filter(Boolean),
          },
          steps: {
            ar: form.stepsAr
              .split("\n")
              .map((item) => item.trim())
              .filter(Boolean),

            fr: form.stepsFr
              .split("\n")
              .map((item) => item.trim())
              .filter(Boolean),
          },
          note: {
            ar: form.noteAr,
            fr: form.noteFr,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "حدث خطأ أثناء إضافة الوثيقة");
      }

      router.push("/admin/dashboard");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "حدث خطأ غير متوقع"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-100">

      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">

          <div>
            <h1 className="text-xl font-bold text-slate-900">
              إضافة وثيقة
            </h1>

            <p className="text-sm text-slate-500">
              إضافة وثيقة إدارية جديدة
            </p>
          </div>

          <button
            onClick={() => router.push("/admin/dashboard")}
            className="text-sm text-slate-600 hover:text-blue-900"
          >
            ← العودة
          </button>

        </div>
      </header>


      {/* Form */}
      <section className="max-w-5xl mx-auto px-6 py-10">

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-8"
        >

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
              {error}
            </div>
          )}


          {/* Basic information */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-5">
              المعلومات الأساسية
            </h2>

            <div className="grid md:grid-cols-2 gap-5">

              <div>
                <label className="block text-sm font-medium mb-2">
                  الاسم بالعربية
                </label>

                <input
                  name="titleAr"
                  value={form.titleAr}
                  onChange={handleChange}
                  required
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-blue-900"
                  placeholder="مثال: مضمون الولادة"
                />
              </div>


              <div>
                <label className="block text-sm font-medium mb-2">
                  Nom en français
                </label>

                <input
                  name="titleFr"
                  value={form.titleFr}
                  onChange={handleChange}
                  required
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-blue-900"
                  placeholder="Extrait de naissance"
                />
              </div>


              <div>
                <label className="block text-sm font-medium mb-2">
                  Slug
                </label>

                <input
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  required
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-blue-900"
                  placeholder="birth-certificate"
                />
              </div>


              <div>
                <label className="block text-sm font-medium mb-2">
                  التصنيف
                </label>

                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white outline-none focus:border-blue-900"
                >
                  <option value="">اختر التصنيف</option>
                  <option value="civil-status">
                    الحالة المدنية
                  </option>
                  <option value="identity">
                    وثائق الهوية
                  </option>
                  <option value="residence">
                    السكن
                  </option>
                  <option value="education">
                    التعليم
                  </option>
                  <option value="justice">
                    العدالة
                  </option>
                  <option value="family">
                    العائلة
                  </option>
                </select>
              </div>


              <div>
                <label className="block text-sm font-medium mb-2">
                  الأيقونة
                </label>

                <input
                  name="icon"
                  value={form.icon}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-blue-900"
                />
              </div>

            </div>
          </div>


          {/* Description */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-5">
              الوصف
            </h2>

            <div className="grid md:grid-cols-2 gap-5">

              <textarea
                name="descriptionAr"
                value={form.descriptionAr}
                onChange={handleChange}
                required
                rows={4}
                placeholder="وصف الوثيقة بالعربية..."
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-blue-900"
              />

              <textarea
                name="descriptionFr"
                value={form.descriptionFr}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Description en français..."
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-blue-900"
              />

            </div>
          </div>


          {/* Authority */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-5">
              الإدارة المسؤولة
            </h2>

            <div className="grid md:grid-cols-2 gap-5">

              <input
                name="authorityAr"
                value={form.authorityAr}
                onChange={handleChange}
                required
                placeholder="الإدارة المسؤولة بالعربية"
                className="w-full border border-slate-300 rounded-xl px-4 py-3"
              />

              <input
                name="authorityFr"
                value={form.authorityFr}
                onChange={handleChange}
                required
                placeholder="Administration responsable"
                className="w-full border border-slate-300 rounded-xl px-4 py-3"
              />

            </div>
          </div>


          {/* Requirements */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">
              الوثائق المطلوبة
            </h2>

            <p className="text-sm text-slate-500 mb-4">
              اكتبي كل وثيقة في سطر مستقل.
            </p>

            <div className="grid md:grid-cols-2 gap-5">

              <textarea
                name="requirementsAr"
                value={form.requirementsAr}
                onChange={handleChange}
                rows={6}
                placeholder={"بطاقة التعريف الوطنية\nوثيقة أخرى"}
                className="w-full border border-slate-300 rounded-xl px-4 py-3"
              />

              <textarea
                name="requirementsFr"
                value={form.requirementsFr}
                onChange={handleChange}
                rows={6}
                placeholder={"Carte d'identité nationale\nAutre document"}
                className="w-full border border-slate-300 rounded-xl px-4 py-3"
              />

            </div>
          </div>


          {/* Steps */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">
              خطوات الإجراء
            </h2>

            <p className="text-sm text-slate-500 mb-4">
              اكتبي كل خطوة في سطر مستقل.
            </p>

            <div className="grid md:grid-cols-2 gap-5">

              <textarea
                name="stepsAr"
                value={form.stepsAr}
                onChange={handleChange}
                rows={6}
                placeholder={"التوجه إلى الإدارة\nتقديم الوثائق\nاستلام الوثيقة"}
                className="w-full border border-slate-300 rounded-xl px-4 py-3"
              />

              <textarea
                name="stepsFr"
                value={form.stepsFr}
                onChange={handleChange}
                rows={6}
                placeholder={"Se rendre à l'administration\nPrésenter les documents\nRécupérer le document"}
                className="w-full border border-slate-300 rounded-xl px-4 py-3"
              />

            </div>
          </div>


          {/* Notes */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-5">
              ملاحظات
            </h2>

            <div className="grid md:grid-cols-2 gap-5">

              <textarea
                name="noteAr"
                value={form.noteAr}
                onChange={handleChange}
                rows={4}
                placeholder="ملاحظات بالعربية..."
                className="w-full border border-slate-300 rounded-xl px-4 py-3"
              />

              <textarea
                name="noteFr"
                value={form.noteFr}
                onChange={handleChange}
                rows={4}
                placeholder="Remarques en français..."
                className="w-full border border-slate-300 rounded-xl px-4 py-3"
              />

            </div>
          </div>


          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-4 border-t border-slate-200">

            <button
              type="button"
              onClick={() => router.push("/admin/dashboard")}
              className="px-6 py-3 rounded-xl border border-slate-300 hover:bg-slate-50"
            >
              إلغاء
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-7 py-3 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-semibold disabled:opacity-50"
            >
              {loading ? "جاري الحفظ..." : "حفظ الوثيقة"}
            </button>

          </div>

        </form>

      </section>

    </main>
  );
}