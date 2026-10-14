const currentPage = window.location.pathname.split("/").pop() || "index.html";

document.querySelectorAll(".site-nav a").forEach((link) => {
  const href = link.getAttribute("href");
  if (href === currentPage || (currentPage === "" && href === "index.html")) {
    link.setAttribute("aria-current", "page");
  }
});

const appStoreGrid = document.querySelector("[data-app-store-apps]");

const fallbackApps = {
  6787011352: {
    artworkUrl512:
      "https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/cf/e5/9f/cfe59fee-81d4-53c3-78d5-6eef661c6562/AppIcon-0-0-1x_U007epad-0-1-85-220.png/512x512bb.jpg",
    description: "Plan pedal placement and signal flow at true scale before building your rig.",
    trackCensoredName: "Pedalboard Canvas: Planner",
    trackViewUrl: "https://apps.apple.com/jp/app/pedalboard-canvas-planner/id6787011352",
  },
  6771564919: {
    artworkUrl512:
      "https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/3a/48/32/3a483292-f8cc-ce85-788b-59f445d272ce/AppIcon-0-0-1x_U007ephone-0-1-85-220.png/512x512bb.jpg",
    description: "A walking map for discovering unwalked streets near home.",
    trackCensoredName: "YORUMICHI",
    trackViewUrl: "https://apps.apple.com/jp/app/yorumichi/id6771564919",
  },
};

const escapeHtml = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const summarize = (text, maxLength = 90) => {
  const normalized = String(text ?? "").replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) {
    return normalized;
  }
  return `${normalized.slice(0, maxLength).trim()}...`;
};

const containsJapanese = (text) => /[\u3005\u3040-\u30ff\u3400-\u9fff]/.test(String(text ?? ""));

const renderAppCards = (apps) => {
  if (!appStoreGrid) {
    return;
  }

  appStoreGrid.innerHTML = apps
    .map((app) => {
      const icon = app.artworkUrl512 || app.artworkUrl100 || app.artworkUrl60;
      const name = app.trackCensoredName || app.trackName || "App Store App";
      const fallbackDescription = fallbackApps[app.trackId]?.description;
      const description = containsJapanese(app.description) ? fallbackDescription : app.description;
      const summary = summarize(description || fallbackDescription);
      const url = app.trackViewUrl || "#";

      return `
        <article class="work-card app-store-card">
          <a class="app-store-card-inner" href="${escapeHtml(url)}" target="_blank" rel="noopener">
            <img class="app-icon" src="${escapeHtml(icon)}" alt="${escapeHtml(name)} icon" />
            <div class="work-body">
              <p class="meta-label">App Store</p>
              <h3>${escapeHtml(name)}</h3>
              <p>${escapeHtml(summary)}</p>
              <span class="text-link app-store-link">App Store</span>
            </div>
          </a>
        </article>
      `;
    })
    .join("");
};

const lookupAppStoreApp = (id) =>
  new Promise((resolve, reject) => {
    const callbackName = `appStoreLookup_${id}_${Date.now()}`.replace(/\W/g, "_");
    const script = document.createElement("script");
    const timeout = window.setTimeout(() => {
      cleanup();
      reject(new Error(`App Store lookup timed out: ${id}`));
    }, 10000);

    const cleanup = () => {
      window.clearTimeout(timeout);
      script.remove();
      delete window[callbackName];
    };

    window[callbackName] = (data) => {
      cleanup();
      resolve(data.results?.[0] || null);
    };

    script.onerror = () => {
      cleanup();
      reject(new Error(`App Store lookup failed: ${id}`));
    };
    script.src = `https://itunes.apple.com/lookup?id=${encodeURIComponent(id)}&country=jp&lang=en_us&callback=${callbackName}`;
    document.head.append(script);
  });

const loadAppStoreApps = async () => {
  if (!appStoreGrid) {
    return;
  }

  const ids = appStoreGrid.dataset.appStoreApps
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  const fallback = ids.map((id) => fallbackApps[id]).filter(Boolean);
  if (fallback.length > 0) {
    renderAppCards(fallback);
  }

  try {
    const apps = (await Promise.all(ids.map(lookupAppStoreApp))).filter(Boolean);
    if (apps.length === 0) {
      throw new Error("No App Store results");
    }

    renderAppCards(apps);
  } catch (error) {
    if (fallback.length === 0) {
      appStoreGrid.innerHTML = `
        <article class="work-card app-store-card">
          <div class="work-body">
            <p class="meta-label">App Store</p>
            <h3>App Store data unavailable</h3>
            <p>Try again later.</p>
          </div>
        </article>
      `;
    }
  }
};

loadAppStoreApps();
