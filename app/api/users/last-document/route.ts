import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "default-secret"
);

// ========================================
// POST
// حفظ آخر وثيقة دخل إليها المواطن
// ========================================
export async function POST(request: NextRequest) {
  console.log("🔥 LAST DOCUMENT POST CALLED");

  try {
    // الحصول على Cookie تسجيل الدخول
    const token = request.cookies.get("auth_token")?.value;

    // إذا لم يكن المواطن مسجّلًا
    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "غير مسجّل الدخول",
        },
        { status: 401 }
      );
    }

    // التحقق من JWT
    const { payload } = await jwtVerify(token, JWT_SECRET);

    // الـ ID موجود في subject عند تسجيل الدخول
    const userId = payload.sub;

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "جلسة غير صالحة",
        },
        { status: 401 }
      );
    }

    // الحصول على documentId
    const body = await request.json();
    const { documentId } = body;

    if (!documentId) {
      return NextResponse.json(
        {
          success: false,
          message: "معرّف الوثيقة مطلوب",
        },
        { status: 400 }
      );
    }

    // الاتصال بقاعدة البيانات
    await connectDB();

    // حفظ آخر وثيقة للمواطن
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        lastDocumentId: documentId,
      },
      {
        new: true,
      }
    );

    if (!updatedUser) {
      return NextResponse.json(
        {
          success: false,
          message: "المواطن غير موجود",
        },
        { status: 404 }
      );
    }

    console.log("🔥 USER ID:", userId);
    console.log("🔥 DOCUMENT ID:", documentId);
    console.log("🔥 LAST DOCUMENT SAVED");

    return NextResponse.json({
      success: true,
      message: "تم حفظ آخر وثيقة",
    });
  } catch (error) {
    console.error("Error saving last document:", error);

    return NextResponse.json(
      {
        success: false,
        message: "حدث خطأ أثناء حفظ آخر وثيقة",
      },
      { status: 500 }
    );
  }
}

// ========================================
// GET
// جلب آخر وثيقة للمواطن
// ========================================
export async function GET(request: NextRequest) {
  try {
    // الحصول على Cookie تسجيل الدخول
    const token = request.cookies.get("auth_token")?.value;

    // الزائر غير المسجّل
    if (!token) {
      return NextResponse.json({
        success: true,
        document: null,
      });
    }

    // التحقق من JWT
    const { payload } = await jwtVerify(token, JWT_SECRET);

    // الـ ID موجود في subject
    const userId = payload.sub;

    if (!userId) {
      return NextResponse.json({
        success: true,
        document: null,
      });
    }

    await connectDB();

    // جلب المواطن مع آخر وثيقة
    const user = await User.findById(userId).populate("lastDocumentId");

    if (!user || !user.lastDocumentId) {
      return NextResponse.json({
        success: true,
        document: null,
      });
    }

    return NextResponse.json({
      success: true,
      document: user.lastDocumentId,
    });
  } catch (error) {
    console.error("Error fetching last document:", error);

    return NextResponse.json(
      {
        success: false,
        message: "حدث خطأ أثناء جلب آخر وثيقة",
      },
      { status: 500 }
    );
  }
}