"use client";

import { useEffect, useState, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

type DocumentItem = {
  slug: string;
  title: { ar: string; fr: string };
  category: string;
  icon?: string;
  description: { ar: string; fr: string };
  authority: { ar: string; fr: string };
  requirements: { ar: string[]; fr: string[] };
  steps: { ar: string[]; fr: string[] };
  note: { ar: string; fr: string };
};

export default function EditDocumentPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [titleAr, setTitleAr] = useState("");
  const [titleFr, setTitleFr] = useState("");
  const [category, setCategory] = useState("civil-status");
  const [icon, setIcon] = useState("📄");

  const [descriptionAr, setDescriptionAr] = useState("");
  const [descriptionFr, setDescriptionFr] = useState("");

  const [authorityAr, setAuthorityAr] = useState("");
  const [authorityFr, setAuthorityFr] = useState("");

  const [requirementsAr, setRequirementsAr] = useState("");
  const [requirementsFr, setRequirementsFr] = useState("");

  const [stepsAr, setStepsAr] = useState("");
  const [stepsFr, setStepsFr] = useState("");

  const [noteAr, setNoteAr] = useState("");
  const [noteFr, setNoteFr] = useState("");

  // جلب معلومات الوثيقة الحالية
  useEffect(() => {
    async function fetchDocument() {
      try {
        const response = await fetch(`/api/documents/${slug}`);

        if (!response.ok) {
          throw new Error("لم يتم العثور على الوثيقة");
        }

        const document: DocumentItem = await response.json();

        setTitleAr(document.title?.ar || "");
        setTitleFr(document.title?.fr || "");
        setCategory(document.category || "civil-status");
        setIcon(document.icon || "📄");

        setDescriptionAr(document.description?.ar || "");
        setDescriptionFr(document.description?.fr || "");

        setAuthorityAr(document.authority?.ar || "");
        setAuthorityFr(document.authority?.fr || "");

        setRequirementsAr(
          document.requirements?.ar?.join("\n") || ""
        );
        setRequirementsFr(
          document.requirements?.fr?.join("\n") || ""
        );

        setStepsAr(document.steps?.ar?.join("\n") || "");
        setStepsFr(document.steps?.fr?.join("\n") || "");

        setNoteAr(document.note?.ar || "");
        setNoteFr(document.note?.fr || "");
      } catch (err) {
        console.error(err);
        setError("تعذّر تحميل معلومات الوثيقة.");
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchDocument();
    }
  }, [slug]);

  // تحويل النص إلى قائمة، كل سطر عنصر
  function textToArray(text: string) {
    return text
      .split("\n")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }

  // حفظ التعديلات
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    const updatedDocument = {
      title: {
        ar: titleAr,
        fr: titleFr,
      },
      category,
      icon,
      description: {
        ar: descriptionAr,
        fr: descriptionFr,
      },
      authority: {
        ar: authorityAr,
        fr: authorityFr,
      },
      requirements: {
        ar: textToArray(requirementsAr),
        fr: textToArray(requirementsFr),
      },
      steps: {
        ar: textToArray(stepsAr),
        fr: textToArray(stepsFr),
      },
      note: {
        ar: noteAr,
        fr: noteFr,
      },
    };

    try {
      const response = await fetch(`/api/documents/${slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedDocument),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "فشل حفظ التعديلات");
      }

      setSuccess("تم تعديل الوثيقة بنجاح! ✅");

      setTimeout(() => {
        router.push("/admin/dashboard");
        router.refresh();
      }, 1000);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "حدث خطأ أثناء حفظ التعديلات"
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500 text-lg">
          جاري تحميل معلومات الوثيقة...
        </p>
      </main>
    );
  }

  if (error && !titleAr && !titleFr) {
    return (
      <main className="min-h-screen bg-slate-50 p-8 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">
          تعذّر تحميل الوثيقة
        </h1>

        <p className="text-red-600 mb-6">{error}</p>

        <Link
          href="/admin/dashboard"
          className="text-blue-900 font-semibold hover:underline"
        >
          العودة إلى Dashboard
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4" dir="rtl">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/dashboard"
            className="text-blue-900 font-medium hover:underline"
          >
            ← العودة إلى Dashboard
          </Link>

          <h1 className="text-3xl font-bold text-slate-900 mt-5">
            تعديل الوثيقة ✏️
          </h1>

          <p className="text-slate-500 mt-2">
            يمكنك تعديل المعلومات التالية ثم حفظ التغييرات.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Basic information */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              المعلومات الأساسية
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div>
                <label className="block font-medium mb-2">
                  العنوان بالعربية *
                </label>
                <input
                  required
                  value={titleAr}
                  onChange={(e) => setTitleAr(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div>
                <label className="block font-medium mb-2">
                  Titre en français *
                </label>
                <input
                  required
                  value={titleFr}
                  onChange={(e) => setTitleFr(e.target.value)}
                  dir="ltr"
                  className="w-full border border-slate-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div>
                <label className="block font-medium mb-2">
                  التصنيف *
                </label>
                <select
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-3 bg-white outline-none focus:ring-2 focus:ring-blue-200"
                >
                  <option value="civil-status">الحالة المدنية</option>
                  <option value="identity">الهوية</option>
                  <option value="residence">السكن</option>
                  <option value="education">التعليم</option>
                  <option value="justice">العدالة</option>
                  <option value="family">العائلة</option>
                </select>
              </div>

              <div>
                <label className="block font-medium mb-2">
                  الأيقونة
                </label>
                <input
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="📄"
                />
              </div>
            </div>
          </section>

          {/* Description */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              وصف الوثيقة
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block font-medium mb-2">
                  الوصف بالعربية *
                </label>
                <textarea
                  required
                  rows={4}
                  value={descriptionAr}
                  onChange={(e) => setDescriptionAr(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div>
                <label className="block font-medium mb-2">
                  Description en français *
                </label>
                <textarea
                  required
                  rows={4}
                  value={descriptionFr}
                  onChange={(e) => setDescriptionFr(e.target.value)}
                  dir="ltr"
                  className="w-full border border-slate-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
            </div>
          </section>

          {/* Authority */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              الجهة المختصة
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block font-medium mb-2">
                  الجهة المختصة بالعربية *
                </label>
                <input
                  required
                  value={authorityAr}
                  onChange={(e) => setAuthorityAr(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div>
                <label className="block font-medium mb-2">
                  Autorité compétente en français *
                </label>
                <input
                  required
                  value={authorityFr}
                  onChange={(e) => setAuthorityFr(e.target.value)}
                  dir="ltr"
                  className="w-full border border-slate-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
            </div>
          </section>

          {/* Requirements */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-2">
              الوثائق المطلوبة
            </h2>

            <p className="text-sm text-slate-500 mb-5">
              اكتبي كل وثيقة في سطر منفصل.
            </p>

            <div className="space-y-5">
              <div>
                <label className="block font-medium mb-2">
                  بالعربية
                </label>
                <textarea
                  rows={5}
                  value={requirementsAr}
                  onChange={(e) => setRequirementsAr(e.target.value)}
                  placeholder={"نسخة من بطاقة التعريف\nمضمون ولادة"}
                  className="w-full border border-slate-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div>
                <label className="block font-medium mb-2">
                  En français
                </label>
                <textarea
                  rows={5}
                  value={requirementsFr}
                  onChange={(e) => setRequirementsFr(e.target.value)}
                  dir="ltr"
                  placeholder={"Copie de la carte d'identité\nExtrait de naissance"}
                  className="w-full border border-slate-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
            </div>
          </section>

          {/* Steps */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-2">
              خطوات الحصول على الوثيقة
            </h2>

            <p className="text-sm text-slate-500 mb-5">
              اكتبي كل خطوة في سطر منفصل.
            </p>

            <div className="space-y-5">
              <div>
                <label className="block font-medium mb-2">
                  الخطوات بالعربية
                </label>
                <textarea
                  rows={5}
                  value={stepsAr}
                  onChange={(e) => setStepsAr(e.target.value)}
                  placeholder={"التوجه إلى الإدارة المختصة\nتقديم الملف"}
                  className="w-full border border-slate-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div>
                <label className="block font-medium mb-2">
                  Étapes en français
                </label>
                <textarea
                  rows={5}
                  value={stepsFr}
                  onChange={(e) => setStepsFr(e.target.value)}
                  dir="ltr"
                  placeholder={"Se rendre à l'administration compétente\nDéposer le dossier"}
                  className="w-full border border-slate-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
            </div>
          </section>

          {/* Notes */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              ملاحظات إضافية
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block font-medium mb-2">
                  الملاحظة بالعربية
                </label>
                <textarea
                  rows={3}
                  value={noteAr}
                  onChange={(e) => setNoteAr(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div>
                <label className="block font-medium mb-2">
                  Note en français
                </label>
                <textarea
                  rows={3}
                  value={noteFr}
                  onChange={(e) => setNoteFr(e.target.value)}
                  dir="ltr"
                  className="w-full border border-slate-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
            </div>
          </section>

          {/* Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4">
              {success}
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-blue-900 hover:bg-blue-800 disabled:bg-slate-400 text-white font-semibold py-4 rounded-xl transition"
            >
              {saving ? "جاري حفظ التعديلات..." : "💾 حفظ التعديلات"}
            </button>

            <Link
              href="/admin/dashboard"
              className="flex-1 text-center bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold py-4 rounded-xl transition"
            >
              إلغاء
            </Link>
          </div>

        </form>
      </div>
    </main>
  );
}