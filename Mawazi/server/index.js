const path = require("path");
const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const isauth = require("./middleware/requireAuth");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev_secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(express.static(path.join(__dirname, "..", "public")));

mongoose
  .connect(
    "mongodb+srv://bilalmoq:ka62X2qseh021Qlz@cluster0.eny6zoz.mongodb.net/mawazi?retryWrites=true&w=majority&appName=Cluster0" // you can replace this with your own MongoDB connection string
  )
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err.message));

// Routes
app.use("/auth", require("./routes/auth"));
app.use("/beneficiaries", isauth, require("./routes/beneficiaries"));
app.use("/packages", isauth, require("./routes/packages"));
app.use("/distributions", isauth, require("./routes/distributions"));
app.use("/stats", isauth, require("./routes/stats"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`🚀 http://localhost:${process.env.PORT || 3000}`);
});
