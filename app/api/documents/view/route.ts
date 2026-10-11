import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

import connectDB from "@/lib/mongodb";
import DocumentView from "@/models/DocumentView";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "default-secret"
);

export async function POST(request: NextRequest) {
  try {
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

    await connectDB();

    // نحاول نعرف المواطن إذا كان عامل Login
    let userId = null;

    const token = request.cookies.get("auth_token")?.value;

    if (token) {
      try {
        const { payload } = await jwtVerify(token, JWT_SECRET);

        if (payload.sub) {
          userId = payload.sub;
        }
      } catch {
        // إذا الـ token غير صالح، نعتبره visitor
        userId = null;
      }
    }

    // تسجيل consultation
    await DocumentView.create({
      documentId,
      userId,
    });
    console.log("🔥 DOCUMENT VIEW SAVED");
console.log("🔥 VIEW DOCUMENT:", documentId);
console.log("🔥 VIEW USER:", userId);

    return NextResponse.json({
      success: true,
      message: "تم تسجيل مشاهدة الوثيقة",
    });
  } catch (error) {
    console.error("Error recording document view:", error);

    return NextResponse.json(
      {
        success: false,
        message: "حدث خطأ أثناء تسجيل مشاهدة الوثيقة",
      },
      { status: 500 }
    );
  }
}