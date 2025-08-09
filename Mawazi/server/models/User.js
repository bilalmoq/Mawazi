const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    orgId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    email: { type: String, required: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["admin", "staff"], default: "admin" },
  },
  { timestamps: true }
);

UserSchema.index({ orgId: 1, email: 1 }, { unique: true });

module.exports = mongoose.model("User", UserSchema);
