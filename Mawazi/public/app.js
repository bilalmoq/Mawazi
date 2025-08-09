// Detect auth by pinging /stats (needs session cookie)
async function isLoggedIn() {
  try {
    const res = await fetch("/stats", { credentials: "include" });
    return res.ok;
  } catch {
    return false;
  }
}

async function setupNavVisibility() {
  const logged = document.querySelectorAll(".nav-when-logged");
  const guest = document.querySelectorAll(".nav-when-guest");
  const inside = await isLoggedIn();
  logged.forEach((el) => (el.style.display = inside ? "" : "none"));
  guest.forEach((el) => (el.style.display = inside ? "none" : ""));
}

async function protectPages() {
  const protectedPages = [
    "dashboard.html",
    "beneficiaries.html",
    "packages.html",
    "distribute.html",
  ];
  const current = location.pathname.split("/").pop() || "index.html";
  if (protectedPages.includes(current)) {
    const inside = await isLoggedIn();
    if (!inside) location.href = "login.html";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  setupNavVisibility();
  protectPages();
});
