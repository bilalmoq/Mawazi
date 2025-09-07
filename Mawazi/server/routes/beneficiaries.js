const express = require("express");
const Beneficiary = require("../models/Beneficiary");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const orgId = req.session.user.orgId;
    const { name, idNo, phone, address, familySize, notes } = req.body;

    const newBeneficiary = new Beneficiary({
      orgId,
      name,
      idNo,
      phone,
      address,
      familySize: familySize ? Number(familySize) : 1,
      notes,
    });

    await newBeneficiary.save();
    res.redirect("/beneficiaries.html");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding beneficiary");
  }
});

router.get("/", async (req, res) => {
  try {
    const orgId = req.session.user.orgId;
    const query = req.query.q || "";

    const results = await Beneficiary.find({
      orgId,
      name: { $regex: query, $options: "i" },
    });

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error searching beneficiaries");
  }
});

module.exports = router;
