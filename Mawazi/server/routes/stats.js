const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const Beneficiary = require("../models/Beneficiary");
const Package = require("../models/Package");
const Distribution = require("../models/Distribution");

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  const orgId = req.session.user.orgId;

  const beneficiariesCount = await Beneficiary.countDocuments({ orgId });
  const packagesCount = await Package.countDocuments({ orgId });
  const distributionsCount = await Distribution.countDocuments({ orgId });

  const recentDistributions = await Distribution.find({ orgId })
    .sort({ deliveredAt: -1 })
    .limit(10)
    .populate("beneficiaryId")
    .populate("packageId");

  const recent = recentDistributions.map((d) => ({
    date: d.deliveredAt,
    beneficiary: d.beneficiaryId?.name || "—",
    basket: d.packageId?.title || "—",
    quantity: d.quantity,
  }));

  res.json({ beneficiariesCount, packagesCount, distributionsCount, recent });
});

module.exports = router;
