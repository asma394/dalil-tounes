"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
type DocumentItem = {
  _id: string;
  slug: string;
  title: {
    ar: string;
    fr: string;
  };
  category: string;
  icon?: string;
};

export default function AdminDashboard() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [weeklyViews, setWeeklyViews] = useState<
  { day: number; views: number }[]
>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
  const [usersCount, setUsersCount] = useState(0);
  const [stats, setStats] = useState({
  totalUsers: 0,
  totalDocuments: 0,
  totalViews: 0,
  newUsersThisWeek: 0,
  viewsThisWeek: 0,
});

  useEffect(() => {
    fetchDocuments();
    fetchUsersCount();
    fetchStats();
  }, []);

  async function fetchDocuments() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/documents");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "تعذّر جلب الوثائق");
      }

      setDocuments(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "حدث خطأ أثناء جلب الوثائق"
      );
    } finally {
      setLoading(false);
    }
  }
  async function fetchUsersCount() {
  try {
    const response = await fetch("/api/users/count");
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "تعذّر جلب عدد المواطنين");
    }

    setUsersCount(data.count);
  } catch (err) {
    console.error("Error fetching users count:", err);
  }
}async function fetchStats() {
  try {
    const response = await fetch("/api/admin/stats");
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "تعذّر جلب الإحصائيات");
    }

    setStats(data.overview);
const formattedWeeklyViews = data.weeklyViews.map(
  (item: {
    _id: number;
    views: number;
  }) => ({
    day: item._id,
    views: item.views,
  })
);
console.log("🔥 WEEKLY VIEWS:", formattedWeeklyViews);
setWeeklyViews(formattedWeeklyViews);
  } catch (err) {
    console.error("Error fetching admin stats:", err);
  }
}

  async function handleDelete(slug: string, title: string) {
    const confirmed = window.confirm(
      `هل أنت متأكدة من حذف الوثيقة "${title}"؟\nهذا الإجراء لا يمكن التراجع عنه.`
    );

    if (!confirmed) return;

    try {
      setDeletingSlug(slug);
      setError("");

      const response = await fetch(`/api/documents/${slug}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "تعذّر حذف الوثيقة");
      }

      // نحذف الوثيقة من القائمة مباشرة دون إعادة تحميل الصفحة
      setDocuments((previousDocuments) =>
        previousDocuments.filter((document) => document.slug !== slug)
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "حدث خطأ أثناء حذف الوثيقة"
      );
    } finally {
      setDeletingSlug(null);
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              لوحة تحكّم المسؤول
            </h1>

            <p className="mt-2 text-gray-500">
              إدارة الوثائق والإجراءات الإدارية
            </p>
          </div>

          <Link
            href="/admin/dashboard/documents/new"
            className="inline-flex items-center justify-center rounded-lg bg-blue-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
          >
            + إضافة وثيقة
          </Link>
        </div>
{/* Weekly Views Chart */}
<div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

  <div className="mb-6">
    <h2 className="text-xl font-bold text-gray-800">
      استشارات الوثائق هذا الأسبوع
    </h2>

    <p className="mt-1 text-sm text-gray-500">
      عدد مرات فتح الوثائق خلال أيام الأسبوع
    </p>
  </div>

  <div className="h-80 w-full">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={weeklyViews}
        margin={{
          top: 10,
          right: 20,
          left: 0,
          bottom: 10,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis
          dataKey="day"
          tickFormatter={(day) => {
            const days: Record<number, string> = {
              1: "الأحد",
              2: "الاثنين",
              3: "الثلاثاء",
              4: "الأربعاء",
              5: "الخميس",
              6: "الجمعة",
              7: "السبت",
            };

            return days[day] || "";
          }}
        />

        <YAxis allowDecimals={false} />

        <Tooltip
          formatter={(value) => [
            value,
            "الاستشارات",
          ]}
          labelFormatter={(day) => {
            const days: Record<number, string> = {
              1: "الأحد",
              2: "الاثنين",
              3: "الثلاثاء",
              4: "الأربعاء",
              5: "الخميس",
              6: "الجمعة",
              7: "السبت",
            };

            return days[Number(day)] || "";
          }}
        />

        <Line
          type="monotone"
          dataKey="views"
          stroke="#1e3a8a"
          strokeWidth={3}
          dot={{ r: 5 }}
          activeDot={{ r: 7 }}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>

</div>
       {/* Statistics */}
<div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

  {/* عدد المواطنين */}
  <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
    <div className="flex items-center justify-between">
      <p className="text-sm text-gray-500">
        المواطنون المسجّلون
      </p>

      <span className="text-2xl">👥</span>
    </div>

    <p className="mt-3 text-3xl font-bold text-blue-900">
      {stats.totalUsers}
    </p>

    <p className="mt-2 text-xs text-gray-400">
      إجمالي الحسابات
    </p>
  </div>

  {/* عدد الوثائق */}
  <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
    <div className="flex items-center justify-between">
      <p className="text-sm text-gray-500">
        الوثائق المسجّلة
      </p>

      <span className="text-2xl">📄</span>
    </div>

    <p className="mt-3 text-3xl font-bold text-blue-900">
      {stats.totalDocuments}
    </p>

    <p className="mt-2 text-xs text-gray-400">
      إجمالي الوثائق
    </p>
  </div>

  {/* إجمالي الاستشارات */}
  <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
    <div className="flex items-center justify-between">
      <p className="text-sm text-gray-500">
        إجمالي الاستشارات
      </p>

      <span className="text-2xl">👁️</span>
    </div>

    <p className="mt-3 text-3xl font-bold text-blue-900">
      {stats.totalViews}
    </p>

    <p className="mt-2 text-xs text-gray-400">
      عدد مرات فتح الوثائق
    </p>
  </div>

  {/* استشارات هذا الأسبوع */}
  <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
    <div className="flex items-center justify-between">
      <p className="text-sm text-gray-500">
        استشارات هذا الأسبوع
      </p>

      <span className="text-2xl">📈</span>
    </div>

    <p className="mt-3 text-3xl font-bold text-blue-900">
      {stats.viewsThisWeek}
    </p>

    <p className="mt-2 text-xs text-gray-400">
      منذ بداية الأسبوع
    </p>
  </div>

</div>

        {/* Error message */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="rounded-xl bg-white p-10 text-center text-gray-500 shadow-sm">
            جاري تحميل الوثائق...
          </div>
        ) : documents.length === 0 ? (
          <div className="rounded-xl bg-white p-10 text-center shadow-sm">
            <p className="text-lg font-semibold text-gray-700">
              لا توجد وثائق حاليًا
            </p>

            <p className="mt-2 text-sm text-gray-500">
              يمكنك إضافة وثيقة جديدة باستعمال الزر الموجود بالأعلى.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            {/* Table for desktop */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-right">
                <thead className="border-b bg-gray-50 text-sm text-gray-600">
                  <tr>
                    <th className="px-6 py-4 font-semibold">الوثيقة</th>
                    <th className="px-6 py-4 font-semibold">التصنيف</th>
                    <th className="px-6 py-4 font-semibold">Slug</th>
                    <th className="px-6 py-4 text-center font-semibold">
                      الإجراءات
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {documents.map((document) => (
                    <tr
                      key={document._id}
                      className="transition hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">
                            {document.icon || "📄"}
                          </span>

                          <div>
                            <p className="font-semibold text-gray-800">
                              {document.title?.ar || "بدون عنوان"}
                            </p>

                            <p className="mt-1 text-sm text-gray-500">
                              {document.title?.fr || ""}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {document.category}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-500">
                        {document.slug}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {/* Edit button */}
                          <Link
                            href={`/admin/dashboard/documents/${document.slug}/edit`}
                            title="تعديل الوثيقة"
                            aria-label={`تعديل ${document.title?.ar || document.slug}`}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-blue-200 bg-blue-50 text-sm text-blue-700 transition hover:bg-blue-100"
                          >
                            ✏️
                          </Link>

                          {/* Delete button */}
                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                document.slug,
                                document.title?.ar || document.slug
                              )
                            }
                            disabled={deletingSlug === document.slug}
                            title="حذف الوثيقة"
                            aria-label={`حذف ${document.title?.ar || document.slug}`}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-red-200 bg-red-50 text-sm text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deletingSlug === document.slug ? "…" : "🗑️"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Cards for mobile */}
            <div className="divide-y divide-gray-100 md:hidden">
              {documents.map((document) => (
                <div key={document._id} className="p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">
                      {document.icon || "📄"}
                    </span>

                    <div className="min-w-0 flex-1">
                      <h2 className="font-semibold text-gray-800">
                        {document.title?.ar || "بدون عنوان"}
                      </h2>

                      <p className="mt-1 text-sm text-gray-500">
                        {document.title?.fr || ""}
                      </p>

                      <p className="mt-2 text-xs text-gray-400">
                        {document.category} · {document.slug}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <Link
                        href={`/admin/dashboard/documents/${document.slug}/edit`}
                        title="تعديل الوثيقة"
                        aria-label="تعديل الوثيقة"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-blue-200 bg-blue-50 text-sm text-blue-700 hover:bg-blue-100"
                      >
                        ✏️
                      </Link>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            document.slug,
                            document.title?.ar || document.slug
                          )
                        }
                        disabled={deletingSlug === document.slug}
                        title="حذف الوثيقة"
                        aria-label="حذف الوثيقة"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-red-200 bg-red-50 text-sm text-red-700 hover:bg-red-100 disabled:opacity-50"
                      >
                        {deletingSlug === document.slug ? "…" : "🗑️"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}