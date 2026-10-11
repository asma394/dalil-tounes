import mongoose, { Schema, models, model } from "mongoose";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "الاسم مطلوب"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    email: {
      type: String,
      required: [true, "البريد الإلكتروني مطلوب"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    passwordHash: {
      type: String,
      required: true,
    },
     lastDocumentId: {
      type: Schema.Types.ObjectId,
      ref: "Document",
      default: null,
    }, 
  },
  {
    timestamps: true,
  }
);

const User = models.User || model("User", UserSchema);

export default User;