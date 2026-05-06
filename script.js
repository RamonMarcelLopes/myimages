const imgList    = document.getElementById("imgList");
const filterBar  = document.getElementById("filterBar");
const searchInput = document.getElementById("searchInput");
const imgCount   = document.getElementById("img-count");
const lightbox   = document.getElementById("lightbox");
const lbImg      = document.getElementById("lbImg");
const lbName     = document.getElementById("lbName");
const lbClose    = document.getElementById("lbClose");
const lbPrev     = document.getElementById("lbPrev");
const lbNext     = document.getElementById("lbNext");
const lbCopy     = document.getElementById("lbCopy");
const toast      = document.getElementById("toast");
const emptyState = document.getElementById("emptyState");

// URLs externas que você quer incluir além das da pasta imgs/
const EXTRAS = [
  "https://github.com/RamonMarcelLopes/RamonMarcelLopes/raw/output/github-contribution-grid-snake-dark.svg",
];

let allImages = [];       // { src, name, folder }
let filtered  = [];       // imagens visíveis atualmente
let lbIndex   = 0;        // índice atual no lightbox
let activeFolder = "all";

// ── Carrega imagens via API ──────────────────────────────────
async function carregar() {
  try {
    const res = await fetch("/api/images");
    const { images } = await res.json();
    const combined = [...images, ...EXTRAS];

    allImages = combined.map((src) => {
      const parts = src.replace(/^\.\//, "").split("/");
      const name   = parts[parts.length - 1];
      const folder = parts.length >= 2 ? parts[parts.length - 2] : "outros";
      return { src, name, folder };
    });

    buildFilters();
    renderAll();
  } catch (e) {
    console.error("Erro ao carregar imagens:", e);
  }
}

// ── Filtros por pasta ────────────────────────────────────────
function buildFilters() {
  const folders = ["all", ...new Set(allImages.map((i) => i.folder))];
  filterBar.innerHTML = "";
  folders.forEach((folder) => {
    const btn = document.createElement("button");
    btn.className = "filter-btn" + (folder === "all" ? " active" : "");
    btn.dataset.folder = folder;
    btn.textContent = folder === "all" ? "tudo" : folder;
    btn.addEventListener("click", () => setFilter(folder));
    filterBar.appendChild(btn);
  });
}

function setFilter(folder) {
  activeFolder = folder;
  document.querySelectorAll(".filter-btn").forEach((b) => {
    b.classList.toggle("active", b.dataset.folder === folder);
  });
  renderAll();
}

// ── Busca ────────────────────────────────────────────────────
searchInput.addEventListener("input", renderAll);

// ── Render ───────────────────────────────────────────────────
function renderAll() {
  const query = searchInput.value.toLowerCase().trim();

  filtered = allImages.filter((img) => {
    const folderMatch = activeFolder === "all" || img.folder === activeFolder;
    const searchMatch = !query || img.name.toLowerCase().includes(query) || img.folder.toLowerCase().includes(query);
    return folderMatch && searchMatch;
  });

  imgList.innerHTML = "";
  imgCount.textContent = `${filtered.length} imagem${filtered.length !== 1 ? "s" : ""}`;

  if (filtered.length === 0) {
    emptyState.style.display = "flex";
    return;
  }
  emptyState.style.display = "none";

  filtered.forEach((img, idx) => {
    const card = document.createElement("div");
    card.className = "img-card";
    card.style.animationDelay = `${Math.min(idx * 0.03, 0.5)}s`;

    card.innerHTML = `
      <img src="${img.src}" alt="${img.name}" class="loading" loading="lazy" />
      <div class="card-overlay">
        <span class="card-folder">${img.folder}</span>
        <span class="card-name">${img.name}</span>
        <div class="card-actions">
          <button class="card-btn" data-action="open">abrir</button>
          <button class="card-btn" data-action="copy">copiar</button>
        </div>
      </div>
    `;

    const imgEl = card.querySelector("img");
    imgEl.addEventListener("load", () => imgEl.classList.remove("loading"));

    card.querySelector('[data-action="open"]').addEventListener("click", (e) => {
      e.stopPropagation();
      openLightbox(idx);
    });

    card.querySelector('[data-action="copy"]').addEventListener("click", (e) => {
      e.stopPropagation();
      copyPath(img.src);
    });

    card.addEventListener("click", () => openLightbox(idx));
    imgList.appendChild(card);
  });
}

// ── Lightbox ─────────────────────────────────────────────────
function openLightbox(idx) {
  lbIndex = idx;
  showLbImage();
  lightbox.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.classList.remove("open");
  document.body.style.overflow = "";
}

function showLbImage() {
  const img = filtered[lbIndex];
  lbImg.src = img.src;
  lbName.textContent = `${img.folder} / ${img.name}`;
  lbPrev.style.opacity = lbIndex > 0 ? "1" : "0.3";
  lbNext.style.opacity = lbIndex < filtered.length - 1 ? "1" : "0.3";
}

lbClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });

lbPrev.addEventListener("click", () => {
  if (lbIndex > 0) { lbIndex--; showLbImage(); }
});

lbNext.addEventListener("click", () => {
  if (lbIndex < filtered.length - 1) { lbIndex++; showLbImage(); }
});

lbCopy.addEventListener("click", () => copyPath(filtered[lbIndex].src));

document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("open")) return;
  if (e.key === "Escape")       closeLightbox();
  if (e.key === "ArrowLeft")    { if (lbIndex > 0) { lbIndex--; showLbImage(); } }
  if (e.key === "ArrowRight")   { if (lbIndex < filtered.length - 1) { lbIndex++; showLbImage(); } }
});

// ── Toast / copiar ───────────────────────────────────────────
function copyPath(src) {
  navigator.clipboard.writeText(src).then(() => showToast()).catch((err) => {
    console.warn("Clipboard API falhou:", err);
  });
}

let toastTimer;
function showToast() {
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2000);
}

carregar();