import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Document from "@/models/Document";

// GET: جلب وثيقة حسب slug
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
      console.log("🔥 REQUESTED SLUG:", slug);

    await connectDB();

    const document = await Document.findOne({ slug }).lean();

    if (!document) {
      return NextResponse.json(
        { message: "الوثيقة غير موجودة" },
        { status: 404 }
      );
    }

    return NextResponse.json(document, { status: 200 });
  } catch (error) {
    console.error("Error fetching document:", error);

    return NextResponse.json(
      { message: "حدث خطأ أثناء جلب الوثيقة" },
      { status: 500 }
    );
  }
}

// PUT: تعديل وثيقة حسب slug
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();

    await connectDB();

    // نسمح فقط بتعديل الحقول الموجودة في الموديل
    const {
      title,
      category,
      icon,
      description,
      authority,
      requirements,
      steps,
      note,
    } = body;

    if (
      !title?.ar?.trim() ||
      !title?.fr?.trim() ||
      !category?.trim() ||
      !description?.ar?.trim() ||
      !description?.fr?.trim() ||
      !authority?.ar?.trim() ||
      !authority?.fr?.trim()
    ) {
      return NextResponse.json(
        { message: "يرجى ملء جميع المعلومات الأساسية المطلوبة" },
        { status: 400 }
      );
    }

    const updatedDocument = await Document.findOneAndUpdate(
      { slug },
      {
        title,
        category,
        icon,
        description,
        authority,
        requirements,
        steps,
        note,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedDocument) {
      return NextResponse.json(
        { message: "الوثيقة غير موجودة" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "تم تعديل الوثيقة بنجاح",
        document: updatedDocument,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating document:", error);

    return NextResponse.json(
      { message: "حدث خطأ أثناء تعديل الوثيقة" },
      { status: 500 }
    );
  }
}

// DELETE: حذف وثيقة حسب slug
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    await connectDB();

    const deletedDocument = await Document.findOneAndDelete({ slug });

    if (!deletedDocument) {
      return NextResponse.json(
        { message: "الوثيقة غير موجودة" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "تم حذف الوثيقة بنجاح" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting document:", error);

    return NextResponse.json(
      { message: "حدث خطأ أثناء حذف الوثيقة" },
      { status: 500 }
    );
  }
}