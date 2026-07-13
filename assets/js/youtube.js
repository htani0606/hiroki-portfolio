const youtubeVideos = [
  {
    id: "qq1g6BKbtHQ",
    title: "Guitar Cover",
    description: "ギターカバー動画や演奏記録です。",
  },
  {
    id: "Qu5AbLiQwzo",
    title: "Sound Making",
    description: "ギターサウンドや音作りのメモです。",
  },
];

function renderYouTubeCard(video) {
  const thumbnailUrl = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
  const videoUrl = `https://www.youtube.com/watch?v=${video.id}`;

  return `
    <article class="youtube-card">
      <a
        class="youtube-card__link"
        href="${videoUrl}"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="${video.title}をYouTubeで見る"
      >
        <div class="youtube-card__thumb">
          <img
            src="${thumbnailUrl}"
            alt="${video.title} のサムネイル"
            loading="lazy"
          />
          <span class="youtube-card__play" aria-hidden="true">▶</span>
        </div>

        <div class="youtube-card__body">
          <p class="youtube-card__kicker">YouTube</p>
          <h3 class="youtube-card__title">${video.title}</h3>
          <p class="youtube-card__description">${video.description}</p>
        </div>
      </a>
    </article>
  `;
}

function loadYouTubeCards() {
  const container = document.querySelector("[data-youtube-list]");
  if (!container) return;

  container.innerHTML = youtubeVideos.map(renderYouTubeCard).join("");
}

loadYouTubeCards();
