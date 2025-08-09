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

  res.json({ beneficiariesCount, packagesCount, distributionsCount });
});

module.exports = router;
