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

  const path = window.location.pathname;

  if (path.includes("beneficiaries.html")) {
    const form = document.getElementById("beneficiarySearchForm");
    const input = document.getElementById("beneficiarySearchInput");
    const results = document.getElementById("beneficiaryResults");

    form?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const query = input.value.trim();
      if (!query) return;

      try {
        const res = await fetch(
          `/beneficiaries?q=${encodeURIComponent(query)}`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();

        if (!Array.isArray(data) || data.length === 0) {
          results.innerHTML = "<p>No results found.</p>";
          return;
        }

        const table = document.createElement("table");
        table.innerHTML = `
          <thead>
            <tr>
              <th>Name</th>
              <th>ID Number</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Family Size</th>
            </tr>
          </thead>
          <tbody>
            ${data
              .map(
                (b) => `
              <tr>
                <td>${b.name}</td>
                <td>${b.idNo || "—"}</td>
                <td>${b.phone || "—"}</td>
                <td>${b.address || "—"}</td>
                <td>${b.familySize}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        `;
        results.innerHTML = "";
        results.appendChild(table);
      } catch (err) {
        console.error(err);
        results.innerHTML = "<p>Error fetching results.</p>";
      }
    });
  }

  if (path.includes("packages.html")) {
    const form = document.getElementById("packageSearchForm");
    const input = document.getElementById("packageSearchInput");
    const results = document.getElementById("packageResults");

    form?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const query = input.value.trim();
      if (!query) return;

      try {
        const res = await fetch(`/packages?q=${encodeURIComponent(query)}`, {
          credentials: "include",
        });
        const data = await res.json();

        if (!Array.isArray(data) || data.length === 0) {
          results.innerHTML = "<p>No results found.</p>";
          return;
        }

        const table = document.createElement("table");
        table.innerHTML = `
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Total Quantity</th>
              <th>Distributed</th>
              <th>Items</th>
              <th>Expires At</th>
            </tr>
          </thead>
          <tbody>
            ${data
              .map(
                (p) => `
              <tr>
                <td>${p.title}</td>
                <td>${p.type}</td>
                <td>${p.totalQuantity}</td>
                <td>${p.distributed}</td>
                <td>${(p.items || []).join(", ") || "—"}</td>
                <td>${
                  p.expiresAt ? new Date(p.expiresAt).toLocaleDateString() : "—"
                }</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        `;
        results.innerHTML = "";
        results.appendChild(table);
      } catch (err) {
        console.error(err);
        results.innerHTML = "<p>Error fetching results.</p>";
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  const path = window.location.pathname;

  if (path.includes("dashboard.html")) {
    try {
      const statsRes = await fetch("http://localhost:3000/stats", {
        credentials: "include",
      });
      const stats = await statsRes.json();

      document.getElementById("stat-beneficiaries").textContent =
        stats.beneficiariesCount;
      document.getElementById("stat-baskets").textContent = stats.packagesCount;
      document.getElementById("stat-distributions").textContent =
        stats.distributionsCount;
    } catch (err) {
      console.error("Error loading stats", err);
    }

    const tableBody = document.getElementById("recentTableBody");
    try {
      const res = await fetch("http://localhost:3000/distributions/recent", {
        credentials: "include",
      });
      const data = await res.json();

      if (!Array.isArray(data) || data.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="4" class="muted">No recent activity</td></tr>`;
        return;
      }

      tableBody.innerHTML = data
        .map(
          (dist) => `
        <tr>
          <td>${new Date(dist.createdAt).toLocaleDateString()}</td>
          <td>${dist.beneficiary?.name || "—"}</td>
          <td>${dist.package?.title || "—"}</td>
          <td>${dist.quantity || "—"}</td>
        </tr>
      `
        )
        .join("");
    } catch (err) {
      console.error("Error loading recent distributions", err);
      tableBody.innerHTML = `<tr><td colspan="4" class="muted">Error loading activity</td></tr>`;
    }
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  const path = window.location.pathname;

  if (path.includes("dashboard.html")) {
    try {
      const res = await fetch("http://localhost:3000/stats", {
        credentials: "include",
      });
      const stats = await res.json();

      document.getElementById("stat-beneficiaries").textContent =
        stats.beneficiariesCount;
      document.getElementById("stat-baskets").textContent = stats.packagesCount;
      document.getElementById("stat-distributions").textContent =
        stats.distributionsCount;

      const tbody = document.getElementById("recent-activity");
      tbody.innerHTML = "";

      if (stats.recent.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4">No recent activity.</td></tr>';
      } else {
        stats.recent.forEach((row) => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
          <td>${new Date(row.date).toLocaleDateString()}</td>
          <td>${row.beneficiary}</td>
          <td>${row.basket}</td>
          <td>${row.quantity}</td>
        `;
          tbody.appendChild(tr);
        });
      }
    } catch (err) {
      console.error("Error loading dashboard stats:", err);
    }
  }
});
