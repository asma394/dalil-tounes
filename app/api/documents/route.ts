import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Document from "@/models/Document";

export async function GET() {
  try {
    await connectDB();

    const documents = await Document.find().sort({ createdAt: -1 });

    return NextResponse.json(documents, { status: 200 });
  } catch (error) {
    console.error("Error fetching documents:", error);

    return NextResponse.json(
      { message: "حدث خطأ أثناء جلب الوثائق" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();

    const {
      slug,
      title,
      category,
      icon,
      description,
      authority,
      requirements,
      steps,
      note,
    } = body;

    // التحقق من المعلومات الأساسية
    if (
      !slug ||
      !title?.ar ||
      !title?.fr ||
      !category ||
      !description?.ar ||
      !description?.fr ||
      !authority?.ar ||
      !authority?.fr
    ) {
      return NextResponse.json(
        { message: "يرجى ملء جميع المعلومات الأساسية المطلوبة" },
        { status: 400 }
      );
    }

    // التأكد من عدم وجود وثيقة بنفس الـ slug
    const existingDocument = await Document.findOne({ slug });

    if (existingDocument) {
      return NextResponse.json(
        { message: "هذه الوثيقة موجودة بالفعل" },
        { status: 409 }
      );
    }

    // إنشاء الوثيقة
    const document = await Document.create({
      slug,
      title,
      category,
      icon,
      description,
      authority,
      requirements,
      steps,
      note,
    });

    return NextResponse.json(
      {
        message: "تمت إضافة الوثيقة بنجاح",
        document,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating document:", error);

    return NextResponse.json(
      { message: "حدث خطأ أثناء إضافة الوثيقة" },
      { status: 500 }
    );
  }
}