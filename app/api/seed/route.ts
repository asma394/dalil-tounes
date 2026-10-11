import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Document from "@/models/Document";

const sampleDocuments = [
  {
    slug: "birth-certificate",
    title: {
      ar: "مضمون الولادة",
      fr: "Extrait de naissance",
    },
    category: "civil-status",
    icon: "📄",
    description: {
      ar: "وثيقة رسمية تثبت ولادة الشخص وتحتوي على بياناته الأساسية.",
      fr: "Document officiel attestant la naissance d’une personne et contenant ses informations essentielles.",
    },
    authority: {
      ar: "مكتب الحالة المدنية",
      fr: "Bureau de l’état civil",
    },
    requirements: {
      ar: ["تقديم المعطيات اللازمة للتعرّف على صاحب المضمون"],
      fr: ["Fournir les informations nécessaires pour identifier la personne concernée"],
    },
    steps: {
      ar: [
        "التوجّه إلى مكتب الحالة المدنية المعني.",
        "تقديم المعطيات المطلوبة.",
        "اتباع إجراءات المكتب للحصول على الوثيقة.",
      ],
      fr: [
        "Se rendre au bureau de l’état civil concerné.",
        "Fournir les informations demandées.",
        "Suivre la procédure du bureau pour obtenir le document.",
      ],
    },
    note: {
      ar: "هذه معلومات تجريبية للمشروع وليست إرشادات إدارية رسمية. يجب التثبت من الإجراءات لدى الجهة المعنية.",
      fr: "Ces informations sont fictives et servent au projet. Vérifiez la procédure auprès de l’administration concernée.",
    },
  },
];

export async function POST() {
  try {
    await connectDB();

    const insertedDocuments = await Document.insertMany(sampleDocuments, {
      ordered: false,
    });

    return NextResponse.json(
      {
        message: "تمت إضافة الوثيقة التجريبية بنجاح",
        count: insertedDocuments.length,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Seed error:", error);

    return NextResponse.json(
      {
        message:
          "تعذّرت الإضافة. ربما أُضيفت الوثيقة سابقًا، أو حدث خطأ في قاعدة البيانات.",
      },
      { status: 500 }
    );
  }
}