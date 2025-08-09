const express = require("express");
const Package = require("../models/Package");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  const { q } = req.query;
  const filter = { orgId: req.session.user.orgId };
  if (q) filter.title = { $regex: q, $options: "i" };
  const list = await Package.find(filter).sort({ createdAt: -1 }).limit(200);
  res.json(list);
});

router.post("/", requireAuth, async (req, res) => {
  const { title, type, items, totalQuantity, expiresAt, notes } = req.body;
  if (!title || !totalQuantity) return res.status(400).send("Missing fields");

  const parsedItems = items
    ? items
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  await Package.create({
    orgId: req.session.user.orgId,
    title,
    type: type || "food",
    items: parsedItems,
    totalQuantity: Number(totalQuantity),
    distributed: 0,
    expiresAt: expiresAt ? new Date(expiresAt) : undefined,
    notes,
  });

  res.redirect("/packages.html");
});

module.exports = router;
