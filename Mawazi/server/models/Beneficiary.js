const mongoose = require("mongoose");

const BeneficiarySchema = new mongoose.Schema(
  {
    orgId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    name: { type: String, required: true, trim: true },
    idNo: String,
    phone: String,
    address: String,
    familySize: { type: Number, default: 1, min: 1 },
    basketsReceived: [
      {
        packageId: { type: mongoose.Schema.Types.ObjectId, ref: "Package" },
        date: { type: Date, default: Date.now },
      },
    ],
    notes: String,
  },
  { timestamps: true }
);

BeneficiarySchema.index({ orgId: 1, name: 1 });

module.exports = mongoose.model("Beneficiary", BeneficiarySchema);
