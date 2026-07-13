const currentPage = window.location.pathname.split("/").pop() || "index.html";

document.querySelectorAll(".site-nav a").forEach((link) => {
  const href = link.getAttribute("href");
  if (href === currentPage || (currentPage === "" && href === "index.html")) {
    link.setAttribute("aria-current", "page");
  }
});

const appStoreGrid = document.querySelector("[data-app-store-apps]");

const fallbackApps = {
  6788577763: {
    artworkUrl512:
      "https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/9a/61/68/9a616870-a861-46ea-bc02-391cab95933c/AppIcon-0-0-1x_U007ephone-0-1-85-220.png/512x512bb.jpg",
    description:
      "Cyber Abyss Tactics は、サイバー世界を舞台にした iPhone 向けカード対戦ゲームです。4つの文明からデッキを選び、CPUと1対1で対戦します。",
    trackCensoredName: "Cyber Abyss Tactics",
    trackViewUrl: "https://apps.apple.com/jp/app/cyber-abyss-tactics/id6788577763",
  },
  6782377027: {
    artworkUrl512:
      "https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/04/85/02/04850272-e941-8f05-86ad-c61a559b32a1/AppIcon-0-0-1x_U007ephone-0-1-85-220.png/512x512bb.jpg",
    description:
      "Cyber Concept Paint は、キャラクター、メカ、背景、建物などのコンセプトアート制作に向けた iPhone 用ペイントアプリです。",
    trackCensoredName: "Cyber Concept Paint",
    trackViewUrl: "https://apps.apple.com/jp/app/cyber-concept-paint/id6782377027",
  },
};

const escapeHtml = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const summarize = (text, maxLength = 150) => {
  const normalized = String(text ?? "").replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) {
    return normalized;
  }
  return `${normalized.slice(0, maxLength).trim()}...`;
};

const renderAppCards = (apps) => {
  if (!appStoreGrid) {
    return;
  }

  appStoreGrid.innerHTML = apps
    .map((app) => {
      const icon = app.artworkUrl512 || app.artworkUrl100 || app.artworkUrl60;
      const name = app.trackCensoredName || app.trackName || "App Store App";
      const summary = summarize(app.description);
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
    script.src = `https://itunes.apple.com/lookup?id=${encodeURIComponent(id)}&country=jp&lang=ja_jp&callback=${callbackName}`;
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
            <p>アプリ情報を取得できませんでした。時間をおいて再読み込みしてください。</p>
          </div>
        </article>
      `;
    }
  }
};

loadAppStoreApps();
