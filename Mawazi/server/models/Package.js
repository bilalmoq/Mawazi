const mongoose = require("mongoose");

const PackageSchema = new mongoose.Schema(
  {
    orgId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    title: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["food", "cleaning", "other"],
      default: "food",
    },
    items: [{ type: String, trim: true }],
    totalQuantity: { type: Number, required: true, min: 1 },
    distributed: { type: Number, default: 0, min: 0 },
    expiresAt: { type: Date },
    notes: String,
  },
  { timestamps: true }
);

PackageSchema.index({ orgId: 1, title: 1 });

module.exports = mongoose.model("Package", PackageSchema);
