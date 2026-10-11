import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Document from "@/models/Document";
import DocumentView from "@/models/DocumentView";

export async function GET() {
  try {
    await connectDB();

    // =========================
    // الإحصائيات الأساسية
    // =========================

    const totalUsers = await User.countDocuments();

    const totalDocuments = await Document.countDocuments();

    const totalViews = await DocumentView.countDocuments();

    // =========================
    // بداية الأسبوع الحالي
    // =========================

    const now = new Date();

    const startOfWeek = new Date(now);
    const day = startOfWeek.getDay();

    const diff = day === 0 ? 6 : day - 1;

    startOfWeek.setDate(startOfWeek.getDate() - diff);
    startOfWeek.setHours(0, 0, 0, 0);

    // =========================
    // الحسابات الجديدة هذا الأسبوع
    // =========================

    const newUsersThisWeek = await User.countDocuments({
      createdAt: {
        $gte: startOfWeek,
      },
    });

    // =========================
    // الاستشارات هذا الأسبوع
    // =========================

    const viewsThisWeek = await DocumentView.countDocuments({
      createdAt: {
        $gte: startOfWeek,
      },
    });
    // =========================
// الاستشارات اليومية هذا الأسبوع
// =========================

const weeklyViews = await DocumentView.aggregate([
  {
    $match: {
      createdAt: {
        $gte: startOfWeek,
      },
    },
  },

  {
    $group: {
      _id: {
        $dayOfWeek: "$createdAt",
      },
      views: {
        $sum: 1,
      },
    },
  },

  {
    $sort: {
      "_id": 1,
    },
  },
]);

    // =========================
    // أكثر الوثائق مشاهدة
    // =========================

    const popularDocuments = await DocumentView.aggregate([
      {
        $group: {
          _id: "$documentId",
          views: {
            $sum: 1,
          },
        },
      },

      {
        $sort: {
          views: -1,
        },
      },

      {
        $limit: 5,
      },

      {
        $lookup: {
          from: "documents",
          localField: "_id",
          foreignField: "_id",
          as: "document",
        },
      },

      {
        $unwind: "$document",
      },

      {
        $project: {
          _id: 1,
          views: 1,
          title: "$document.title",
          slug: "$document.slug",
          category: "$document.category",
          icon: "$document.icon",
        },
      },
    ]);

    // =========================
    // النتيجة
    // =========================
return NextResponse.json({
  success: true,

  overview: {
    totalUsers,
    totalDocuments,
    totalViews,
    newUsersThisWeek,
    viewsThisWeek,
  },

  weeklyViews,

  popularDocuments,
});
  } catch (error) {
    console.error("Error fetching admin statistics:", error);

    return NextResponse.json(
      {
        success: false,
        message: "حدث خطأ أثناء جلب الإحصائيات",
      },
      {
        status: 500,
      }
    );
  }
}

