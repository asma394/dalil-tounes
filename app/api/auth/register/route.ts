import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name =
      typeof body.name === "string" ? body.name.trim() : "";

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const password =
      typeof body.password === "string" ? body.password : "";

    // التثبت من الحقول
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "يرجى ملء جميع الحقول." },
        { status: 400 }
      );
    }

    if (name.length < 2 || name.length > 100) {
      return NextResponse.json(
        { message: "الاسم يجب أن يكون بين حرفين و100 حرف." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "البريد الإلكتروني غير صالح." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: "كلمة السر يجب أن تحتوي على 8 أحرف على الأقل." },
        { status: 400 }
      );
    }

    // الاتصال بقاعدة البيانات الموجودة في المشروع
    await connectDB();

    // التثبت من عدم وجود حساب بنفس البريد
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { message: "هذا البريد الإلكتروني مسجّل من قبل." },
        { status: 409 }
      );
    }

    // تشفير كلمة السر
    const passwordHash = await bcrypt.hash(password, 12);

    // إنشاء حساب المواطن
    const newUser = await User.create({
      name,
      email,
      passwordHash,
    });

    return NextResponse.json(
      {
        message: "تم إنشاء الحساب بنجاح!",
        user: {
          id: newUser._id.toString(),
          name: newUser.name,
          email: newUser.email,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    // معالجة حالة تكرار البريد حتى لو حدثت عمليتا تسجيل في نفس الوقت
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      return NextResponse.json(
        { message: "هذا البريد الإلكتروني مسجّل من قبل." },
        { status: 409 }
      );
    }

    console.error("Registration error:", error);

    return NextResponse.json(
      { message: "حدث خطأ أثناء إنشاء الحساب." },
      { status: 500 }
    );
  }
}