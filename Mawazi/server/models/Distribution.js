const mongoose = require("mongoose");

const DistributionSchema = new mongoose.Schema(
  {
    orgId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    beneficiaryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Beneficiary",
      required: true,
    },
    packageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
      required: true,
    },
    quantity: { type: Number, default: 1, min: 1 },
    deliveredAt: { type: Date, default: Date.now },
    deliveredBy: { type: String, trim: true },
  },
  { timestamps: true }
);

DistributionSchema.index({ orgId: 1, deliveredAt: -1 });

module.exports = mongoose.model("Distribution", DistributionSchema);
