"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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
};

const categories = [
  { value: "all", label: "الكل" },
  { value: "civil-status", label: "الحالة المدنية" },
  { value: "identity", label: "الهوية" },
  { value: "residence", label: "السكن" },
  { value: "education", label: "التعليم" },
  { value: "justice", label: "العدالة" },
  { value: "family", label: "العائلة" },
];

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  // آخر وثيقة دخل إليها المواطن
  const [lastDocument, setLastDocument] =
    useState<DocumentItem | null>(null);

  // ==============================
  // جلب جميع الوثائق
  // ==============================
  useEffect(() => {
    async function fetchDocuments() {
      try {
        const response = await fetch("/api/documents");

        if (!response.ok) {
          throw new Error("Failed to fetch documents");
        }

        const data = await response.json();

        setDocuments(data);
        try {
  await fetch("/api/documents/view", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      documentId: data._id,
    }),
  });
} catch (error) {
  console.error("Error recording document view:", error);
}
      } catch (error) {
        console.error("Error fetching documents:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDocuments();
  }, []);

  // ==============================
  // جلب آخر وثيقة للمواطن
  // ==============================
  useEffect(() => {
    async function fetchLastDocument() {
      try {
        const response = await fetch("/api/users/last-document");

        if (!response.ok) {
          setLastDocument(null);
          return;
        }

        const data = await response.json();

        if (data.success && data.document) {
          setLastDocument(data.document);
        } else {
          setLastDocument(null);
        }
      } catch (error) {
        console.error("Error fetching last document:", error);
        setLastDocument(null);
      }
    }

    fetchLastDocument();
  }, []);

  // ==============================
  // البحث والتصفية
  // ==============================
  const filteredDocuments = documents.filter((document) => {
    const searchValue = search.toLowerCase();

    const matchesSearch =
      document.title.ar.toLowerCase().includes(searchValue) ||
      document.title.fr.toLowerCase().includes(searchValue) ||
      document.description.ar.toLowerCase().includes(searchValue);

    const matchesCategory =
      category === "all" || document.category === category;

    return matchesSearch && matchesCategory;
  });

  // ==============================
  // حفظ آخر وثيقة
  // ==============================
  async function saveLastDocument(documentId: string) {
    try {
      console.log("🔥 CLICKED DOCUMENT:", documentId);

      const response = await fetch("/api/users/last-document", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentId,
        }),
      });

      const data = await response.json();

      console.log(
        "🔥 SAVE RESPONSE:",
        response.status,
        data
      );
    } catch (error) {
      console.error("🔥 SAVE ERROR:", error);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      {/* ============================== */}
      {/* Header */}
      {/* ============================== */}

      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-12 text-center">

          <h1 className="text-4xl font-bold text-slate-900">
            الوثائق الإدارية
          </h1>

          <p className="text-slate-500 mt-3 max-w-2xl mx-auto">
            اكتشف الوثائق والإجراءات الإدارية التي تحتاجها بسهولة.
          </p>

          {/* ============================== */}
          {/* آخر وثيقة للمواطن */}
          {/* ============================== */}

          {lastDocument && (
            <div className="max-w-3xl mx-auto mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-6 text-right">

              <p className="text-sm font-semibold text-blue-700">
                📌 آخر وثيقة دخلت إليها
              </p>

              <div className="mt-3 flex items-center justify-between gap-4">

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {lastDocument.title.ar}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {lastDocument.title.fr}
                  </p>
                </div>

                <Link
                  href={`/documents/${lastDocument.slug}`}
                  className="shrink-0 rounded-xl bg-blue-900 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
                >
                  فتح الوثيقة
                </Link>

              </div>
            </div>
          )}

          {/* ============================== */}
          {/* Search */}
          {/* ============================== */}

          <div className="max-w-2xl mx-auto mt-8">

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث عن وثيقة..."
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-900"
            />

          </div>

        </div>
      </section>

      {/* ============================== */}
      {/* Content */}
      {/* ============================== */}

      <section className="max-w-7xl mx-auto px-6 py-10">

        {/* ============================== */}
        {/* Categories */}
        {/* ============================== */}

        <div className="flex flex-wrap gap-3 mb-8">

          {categories.map((item) => (
            <button
              key={item.value}
              onClick={() => setCategory(item.value)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition ${
                category === item.value
                  ? "bg-blue-900 text-white"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-blue-900 hover:text-blue-900"
              }`}
            >
              {item.label}
            </button>
          ))}

        </div>

        {/* ============================== */}
        {/* Loading */}
        {/* ============================== */}

        {loading && (
          <div className="text-center py-20">

            <p className="text-slate-500">
              جاري تحميل الوثائق...
            </p>

          </div>
        )}

        {/* ============================== */}
        {/* Empty */}
        {/* ============================== */}

        {!loading && filteredDocuments.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">

            <div className="text-5xl mb-4">
              🔎
            </div>

            <h2 className="text-xl font-bold text-slate-800">
              لا توجد وثائق
            </h2>

            <p className="text-slate-500 mt-2">
              لم نجد وثيقة تطابق البحث الذي أدخلته.
            </p>

          </div>
        )}

        {/* ============================== */}
        {/* Documents */}
        {/* ============================== */}

        {!loading && filteredDocuments.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {filteredDocuments.map((document) => (

              <Link
                key={document._id}
                href={`/documents/${document.slug}`}
                onClick={() => saveLastDocument(document._id)}
                className="group bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg hover:border-blue-200 transition"
              >

                <div className="flex items-start justify-between gap-4">

                  <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-3xl">
                    {document.icon || "📄"}
                  </div>

                  <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg">
                    {document.category}
                  </span>

                </div>

                <h2 className="text-xl font-bold text-slate-900 mt-5 group-hover:text-blue-900 transition">
                  {document.title.ar}
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  {document.title.fr}
                </p>

                <p className="text-slate-600 text-sm mt-4 line-clamp-3">
                  {document.description.ar}
                </p>

                <div className="mt-6 text-blue-900 font-semibold text-sm">
                  عرض التفاصيل ←
                </div>

              </Link>

            ))}

          </div>
        )}

      </section>
    </main>
  );
}