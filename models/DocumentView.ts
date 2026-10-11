import mongoose, { Schema, models, model } from "mongoose";

const DocumentViewSchema = new Schema(
  {
    documentId: {
      type: Schema.Types.ObjectId,
      ref: "Document",
      required: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const DocumentView =
  models.DocumentView || model("DocumentView", DocumentViewSchema);

export default DocumentView;