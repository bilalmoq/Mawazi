const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const Distribution = require("../models/Distribution");
const Package = require("../models/Package");

const router = express.Router();

router.post("/", requireAuth, async (req, res) => {
  const { beneficiaryId, packageId, quantity, deliveredBy } = req.body;
  if (!beneficiaryId || !packageId) return res.status(400).send("Missing ids");

  const orgId = req.session.user.orgId;
  const pkg = await Package.findOne({ _id: packageId, orgId });
  if (!pkg) return res.status(404).send("Package not found");

  const qty = quantity ? Number(quantity) : 1;
  const remaining = pkg.totalQuantity - pkg.distributed;
  if (qty > remaining) return res.status(400).send("Not enough quantity");

  await Distribution.create({
    orgId,
    beneficiaryId,
    packageId,
    quantity: qty,
    deliveredBy,
  });
  pkg.distributed += qty;
  await pkg.save();

  res.redirect("/distribute.html");
});

router.get("/recent", requireAuth, async (req, res) => {
  const orgId = req.session.user.orgId;
  const recent = await Distribution.find({ orgId })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("beneficiary")
    .populate("package");

  res.json(recent);
});

module.exports = router;
