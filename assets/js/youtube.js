const youtubeVideos = [
  {
    id: "qq1g6BKbtHQ",
    title: "Guitar Cover 01",
    category: "guitar",
  },
  {
    id: "Qu5AbLiQwzo",
    title: "Guitar Cover 02",
    category: "guitar",
  },
  {
    id: "WO3OQ4qgBqQ",
    title: "Sound Making",
    category: "sound-making",
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
        </div>
      </a>
    </article>
  `;
}

function loadYouTubeCards() {
  document.querySelectorAll("[data-youtube-list]").forEach((container) => {
    const category = container.dataset.youtubeList;
    const videos = youtubeVideos.filter((video) => video.category === category);
    container.innerHTML = videos.map(renderYouTubeCard).join("");
  });
}

loadYouTubeCards();
