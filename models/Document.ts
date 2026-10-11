import mongoose, { Schema, models, model } from "mongoose";

const DocumentSchema = new Schema(
  {
    // المعرّف الذي يظهر في الرابط
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    // اسم الوثيقة بالعربية والفرنسية
    title: {
      ar: { type: String, required: true, trim: true },
      fr: { type: String, required: true, trim: true },
    },

    // التصنيف
    category: {
      type: String,
      required: true,
      trim: true,
    },

    // أيقونة الوثيقة
    icon: {
      type: String,
      default: "📄",
    },

    // وصف الوثيقة
    description: {
      ar: { type: String, required: true },
      fr: { type: String, required: true },
    },

    // الإدارة المسؤولة
    authority: {
      ar: { type: String, required: true },
      fr: { type: String, required: true },
    },

    // الأوراق المطلوبة
    requirements: {
      ar: [{ type: String }],
      fr: [{ type: String }],
    },

    // خطوات استخراج الوثيقة
    steps: {
      ar: [{ type: String }],
      fr: [{ type: String }],
    },

    // ملاحظات إضافية
    note: {
      ar: { type: String, default: "" },
      fr: { type: String, default: "" },
    },
  },
  {
    timestamps: true,
  }
);

// نتفادوا إنشاء Model جديد كل مرة يعاود Next.js تحميل الملف
const Document =
  models.Document || model("Document", DocumentSchema);

export default Document;