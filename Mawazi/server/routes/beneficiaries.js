const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const Distribution = require("../models/Distribution");
const Beneficiary = require("../models/Beneficiary");
const Package = require("../models/Package");

const router = express.Router();

router.post("/", requireAuth, async (req, res) => {
  try {
    const orgId = req.session.user.orgId;
    const { idNo, packageId, quantity, deliveredBy } = req.body;

    const ben = await Beneficiary.findOne({ orgId, idNo: (idNo || "").trim() });
    if (!ben) return res.status(404).send("Beneficiary not found");

    const pkg = await Package.findOne({ _id: packageId, orgId });
    if (!pkg) return res.status(404).send("Package not found");

    const qty = quantity ? Number(quantity) : 1;
    const remaining = pkg.totalQuantity - pkg.distributed;
    if (qty > remaining) return res.status(400).send("Not enough quantity");

    await Distribution.create({
      orgId,
      beneficiaryId: ben._id,
      packageId,
      quantity: qty,
      deliveredBy,
    });

    pkg.distributed += qty;
    await pkg.save();

    await Beneficiary.updateOne(
      { _id: ben._id },
      { $push: { basketsReceived: { packageId, date: new Date() } } }
    );

    res.redirect("/distribute.html");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
