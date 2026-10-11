"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

type DocumentItem = {
  _id: string;
  slug: string;

  title: {
    ar: string;
    fr: string;
  };

  category: string;

  icon?: string;

  description: {
    ar: string;
    fr: string;
  };

  authority: {
    ar: string;
    fr: string;
  };

  requirements: {
    ar: string[];
    fr: string[];
  };

  steps: {
    ar: string[];
    fr: string[];
  };

  note: {
    ar: string;
    fr: string;
  };
};

export default function DocumentDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const [document, setDocument] = useState<DocumentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchDocument() {
      try {
        const response = await fetch(`/api/documents/${id}`);

        if (!response.ok) {
          throw new Error("Document not found");
        }

        const data = await response.json();

        setDocument(data);

        // حفظ آخر وثيقة للمواطن المسجّل فقط
        try {
          await fetch("/api/users/last-document", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              documentId: data._id,
            }),
          });
        } catch (error) {
          console.error("Error saving last document:", error);
        }

        // تسجيل مشاهدة الوثيقة للإحصائيات
        try {
          const viewResponse = await fetch("/api/documents/view", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              documentId: data._id,
            }),
          });

          const viewData = await viewResponse.json();

          console.log(
            "🔥 DOCUMENT VIEW RESPONSE:",
            viewResponse.status,
            viewData
          );
        } catch (error) {
          console.error("Error recording document view:", error);
        }
      } catch (error) {
        console.error(error);
        setError("لم يتم العثور على الوثيقة");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchDocument();
    }
  }, [id]);

  // Loading
  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <Navbar />

        <div className="max-w-5xl mx-auto px-6 py-20 text-center">
          <p className="text-slate-500 text-lg">
            جاري تحميل الوثيقة...
          </p>
        </div>
      </main>
    );
  }

  // Error
  if (error || !document) {
    return (
      <main className="min-h-screen bg-slate-50">
        <Navbar />

        <div className="max-w-5xl mx-auto px-6 py-20 text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">
            الوثيقة غير موجودة
          </h1>

          <Link
            href="/documents"
            className="text-blue-900 font-semibold hover:underline"
          >
            ← العودة إلى قائمة الوثائق
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen bg-slate-50"
      dir="rtl"
    >
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-12">

        {/* العودة */}
        <Link
          href="/documents"
          className="inline-flex items-center gap-2 text-blue-900 font-medium mb-8 hover:underline"
        >
          ← العودة إلى قائمة الوثائق
        </Link>

        {/* Header */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 mb-6 shadow-sm">

          <div className="flex items-start gap-5">

            {/* Icon */}
            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-3xl shrink-0">
              {document.icon || "📄"}
            </div>

            {/* Title */}
            <div>
              <span className="inline-block text-sm text-blue-700 font-semibold mb-2">
                {document.category}
              </span>

              <h1 className="text-3xl font-bold text-slate-900">
                {document.title.ar}
              </h1>

              <p className="text-slate-500 mt-2">
                {document.title.fr}
              </p>
            </div>

          </div>

          {/* Description */}
          <div className="mt-8">

            <h2 className="text-xl font-bold text-slate-900 mb-3">
              عن الوثيقة
            </h2>

            <p className="text-slate-600 leading-8">
              {document.description.ar}
            </p>

            <p className="text-slate-400 mt-3">
              {document.description.fr}
            </p>

          </div>
        </div>

        {/* Authority */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 mb-6 shadow-sm">

          <h2 className="text-xl font-bold text-slate-900 mb-4">
            🏛️ الجهة المختصة
          </h2>

          <p className="text-slate-700 leading-7">
            {document.authority.ar}
          </p>

          <p className="text-slate-400 mt-2">
            {document.authority.fr}
          </p>

        </div>

        {/* Requirements */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 mb-6 shadow-sm">

          <h2 className="text-xl font-bold text-slate-900 mb-5">
            📋 الوثائق المطلوبة
          </h2>

          {document.requirements?.ar?.length > 0 ? (
            <ul className="space-y-4">

              {document.requirements.ar.map(
                (requirement, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-slate-700"
                  >
                    <span className="text-blue-700 font-bold text-lg">
                      ✓
                    </span>

                    <span>
                      {requirement}
                    </span>
                  </li>
                )
              )}

            </ul>
          ) : (
            <p className="text-slate-400">
              لا توجد معلومات متاحة.
            </p>
          )}

        </div>

        {/* Steps */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 mb-6 shadow-sm">

          <h2 className="text-xl font-bold text-slate-900 mb-6">
            📝 خطوات الحصول على الوثيقة
          </h2>

          {document.steps?.ar?.length > 0 ? (
            <div className="space-y-6">

              {document.steps.ar.map(
                (step, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4"
                  >

                    <div className="w-10 h-10 shrink-0 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold">
                      {index + 1}
                    </div>

                    <p className="text-slate-700 leading-8 pt-1">
                      {step}
                    </p>

                  </div>
                )
              )}

            </div>
          ) : (
            <p className="text-slate-400">
              لا توجد خطوات متاحة.
            </p>
          )}

        </div>

        {/* Note */}
        {document.note?.ar && (
          <div className="bg-amber-50 border border-amber-200 rounded-3xl p-8 mb-6">

            <h2 className="text-xl font-bold text-amber-900 mb-3">
              ⚠️ ملاحظة
            </h2>

            <p className="text-amber-800 leading-8">
              {document.note.ar}
            </p>

            {document.note.fr && (
              <p className="text-amber-700 mt-3">
                {document.note.fr}
              </p>
            )}

          </div>
        )}

      </div>
    </main>
  );
}