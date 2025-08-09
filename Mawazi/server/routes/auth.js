const express = require("express");
const bcrypt = require("bcryptjs");
const Organization = require("../models/Organization");
const User = require("../models/User");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { orgName, email, password } = req.body;
    if (!orgName || !email || !password)
      return res.status(400).send("Missing fields");

    const org = await Organization.create({ name: orgName });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      orgId: org._id,
      email,
      passwordHash,
      role: "admin",
    });

    req.session.user = {
      userId: user._id,
      orgId: org._id,
      orgName: org.name,
      role: user.role,
      email: user.email,
    };
    res.redirect("/dashboard.html");
  } catch (e) {
    console.error(e);
    res.status(500).send("Registration error");
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password /*, orgName */ } = req.body;
    if (!email || !password) return res.status(400).send("Missing fields");

    const user = await User.findOne({ email });
    if (!user) return res.status(401).send("Invalid credentials");

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).send("Invalid credentials");

    const org = await Organization.findById(user.orgId).select("name");
    req.session.user = {
      userId: user._id,
      orgId: user.orgId,
      orgName: org?.name || "",
      role: user.role,
      email: user.email,
    };

    res.redirect("/dashboard.html");
  } catch (e) {
    console.error(e);
    res.status(500).send("Login error");
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/login.html"));
});

module.exports = router;
