const imgList     = document.getElementById("imgList");
const filterBar   = document.getElementById("filterBar");
const searchInput = document.getElementById("searchInput");
const imgCount    = document.getElementById("img-count");
const sortWrap    = document.getElementById("sortWrap");
const sortTrigger = document.getElementById("sortTrigger");
const sortMenu    = document.getElementById("sortMenu");
const sortLabel   = document.getElementById("sortLabel");
const btnGrid     = document.getElementById("btnGrid");
const btnList     = document.getElementById("btnList");
const lightbox    = document.getElementById("lightbox");
const lbImgContainer = document.getElementById("lbImgContainer");
const lbImg       = document.getElementById("lbImg");
const lbName      = document.getElementById("lbName");
const lbClose     = document.getElementById("lbClose");
const lbPrev      = document.getElementById("lbPrev");
const lbNext      = document.getElementById("lbNext");
const lbCopy      = document.getElementById("lbCopy");
const lbDownload  = document.getElementById("lbDownload");
const toast       = document.getElementById("toast");
const emptyState  = document.getElementById("emptyState");

// ── Custom sort dropdown ────────────────────────────────────
let sortValue = "default";

sortTrigger.addEventListener("click", (e) => {
  e.stopPropagation();
  sortWrap.classList.toggle("open");
});

document.addEventListener("click", () => sortWrap.classList.remove("open"));

sortMenu.querySelectorAll(".sort-opt").forEach(opt => {
  opt.addEventListener("click", () => {
    sortValue = opt.dataset.value;
    sortLabel.textContent = opt.textContent;
    sortMenu.querySelectorAll(".sort-opt").forEach(o => o.classList.remove("active"));
    opt.classList.add("active");
    sortWrap.classList.remove("open");
    pushState();
    renderAll();
  });
});

const EXTRAS = [
  "https://github.com/RamonMarcelLopes/RamonMarcelLopes/raw/output/github-contribution-grid-snake-dark.svg",
];

let allImages    = [];
let filtered     = [];
let lbIndex      = 0;
let activeFolder = "all";
let viewMode     = "grid"; // "grid" | "list"

// ── Carrega imagens ──────────────────────────────────────────
async function carregar() {
  try {
    const res = await fetch("/api/images");
    const { images } = await res.json();
    const combined = [...images, ...EXTRAS];

    const VIDEO_EXTS = [".mp4", ".webm", ".ogg", ".mov"];
    allImages = combined.map((src) => {
      const parts  = src.replace(/^\.\//, "").split("/");
      const name   = parts[parts.length - 1];
      const folder = parts.length >= 2 ? parts[parts.length - 2] : "outros";
      const ext    = "." + name.split(".").pop().toLowerCase();
      const type   = VIDEO_EXTS.includes(ext) ? "video" : "image";
      return { src, name, folder, type };
    });

    const { open } = readState();
    buildFilters();
    renderAll();
    if (open !== null && open < filtered.length) {
      openLightbox(open);
    }
  } catch (e) {
    console.error("Erro ao carregar imagens:", e);
  }
}

// ── Filtros ──────────────────────────────────────────────────
function buildFilters() {
  const folders = ["all", ...new Set(allImages.map((i) => i.folder))];
  filterBar.innerHTML = "";
  folders.forEach((folder) => {
    const count = folder === "all" ? allImages.length : allImages.filter(i => i.folder === folder).length;
    const btn = document.createElement("button");
    btn.className = "filter-btn" + (folder === activeFolder ? " active" : "");
    btn.dataset.folder = folder;
    btn.textContent = folder === "all" ? `tudo (${count})` : `${folder} (${count})`;
    btn.addEventListener("click", () => setFilter(folder));
    filterBar.appendChild(btn);
  });
}

function setFilter(folder) {
  activeFolder = folder;
  document.querySelectorAll(".filter-btn").forEach((b) => {
    b.classList.toggle("active", b.dataset.folder === folder);
  });
  pushState();
  renderAll();
}

// ── Eventos ──────────────────────────────────────────────────
searchInput.addEventListener("input", renderAll);

btnGrid.addEventListener("click", () => {
  viewMode = "grid";
  btnGrid.classList.add("active");
  btnList.classList.remove("active");
  imgList.classList.remove("list-mode");
  renderAll();
});

btnList.addEventListener("click", () => {
  viewMode = "list";
  btnList.classList.add("active");
  btnGrid.classList.remove("active");
  imgList.classList.add("list-mode");
  renderAll();
});

// ── URL state ────────────────────────────────────────────────
function pushState(extra = {}) {
  const params = new URLSearchParams();
  if (activeFolder !== "all") params.set("folder", activeFolder);
  if (sortValue !== "default") params.set("sort", sortValue);
  if (extra.open != null) params.set("open", extra.open);
  const qs = params.toString();
  history.pushState({}, "", qs ? "?" + qs : location.pathname);
}

function readState() {
  const params = new URLSearchParams(location.search);
  const folder = params.get("folder") || "all";
  const sort   = params.get("sort") || "default";
  const open   = params.get("open");

  activeFolder = folder;

  sortValue = sort;
  const optEl = sortMenu.querySelector(`[data-value="${sort}"]`);
  if (optEl) {
    sortLabel.textContent = optEl.textContent;
    sortMenu.querySelectorAll(".sort-opt").forEach(o => o.classList.remove("active"));
    optEl.classList.add("active");
  }

  return { open: open ? parseInt(open) : null };
}

// ── Render ───────────────────────────────────────────────────
function renderAll() {
  const query = searchInput.value.toLowerCase().trim();
  const sort  = sortValue;

  filtered = allImages.filter((img) => {
    const folderMatch  = activeFolder === "all" || img.folder === activeFolder;
    const searchMatch  = !query || img.name.toLowerCase().includes(query) || img.folder.toLowerCase().includes(query);
    return folderMatch && searchMatch;
  });

  // Ordenação
  if (sort === "name-asc")  filtered.sort((a, b) => a.name.localeCompare(b.name));
  if (sort === "name-desc") filtered.sort((a, b) => b.name.localeCompare(a.name));
  if (sort === "folder")    filtered.sort((a, b) => a.folder.localeCompare(b.folder) || a.name.localeCompare(b.name));

  imgCount.textContent = `${filtered.length} ${filtered.length !== 1 ? "imagens" : "imagem"}`;

  imgList.innerHTML = "";
  if (filtered.length === 0) {
    emptyState.style.display = "flex";
    return;
  }
  emptyState.style.display = "none";

  // Sem skeleton — cada card já aparece no DOM com mídia invisível (opacity 0)
  // e faz fade-in assim que carrega. Isso evita o bug de timing do replaceWith.
  filtered.forEach((img, idx) => {
    const card = buildCard(img, idx);
    imgList.appendChild(card);
  });
}

function buildCard(img, idx) {
  const card = document.createElement("div");
  card.className = "img-card card-loading";
  card.style.animationDelay = `${Math.min(idx * 0.025, 0.4)}s`;

  if (viewMode === "grid") {
    const mediaTpl = img.type === "video"
        ? `<video src="${img.src}" class="loading" muted playsinline preload="metadata"></video>
         <div class="card-video-badge">▶</div>`
        : `<img src="${img.src}" alt="${img.name}" class="loading" />`;
    card.innerHTML = `
      ${mediaTpl}
      <div class="card-overlay">
        <span class="card-folder">${img.folder}</span>
        <span class="card-name">${img.name}</span>
        <div class="card-actions">
          <button class="card-btn" data-action="open">abrir</button>
          <button class="card-btn" data-action="copy">copiar</button>
          <button class="card-btn dl" data-action="download">baixar</button>
        </div>
      </div>
    `;
  } else {
    const mediaTpl = img.type === "video"
        ? `<video src="${img.src}" class="loading" muted playsinline preload="metadata"></video>`
        : `<img src="${img.src}" alt="${img.name}" class="loading" />`;
    card.innerHTML = `
      ${mediaTpl}
      <div class="list-info">
        <span class="list-name">${img.name}</span>
        <span class="list-folder">${img.folder}</span>
      </div>
      <div class="list-actions">
        <button class="card-btn" data-action="open">abrir</button>
        <button class="card-btn" data-action="copy">copiar</button>
        <button class="card-btn dl" data-action="download">baixar</button>
      </div>
    `;
  }

  if (img.type === "video") {
    const videoEl = card.querySelector("video");
    const reveal = () => { videoEl.classList.remove("loading"); card.classList.remove("card-loading"); };
    videoEl.addEventListener("loadedmetadata", reveal, { once: true });
    videoEl.addEventListener("error", () => {
      reveal();
      videoEl.style.opacity = "0.15";
    }, { once: true });
    // Se já tem metadata (cache), revela imediatamente
    if (videoEl.readyState >= 1) reveal();
    // Hover para preview (sem autoplay no card)
    card.addEventListener("mouseenter", () => { videoEl.currentTime = 0; videoEl.play().catch(() => {}); });
    card.addEventListener("mouseleave", () => { videoEl.pause(); videoEl.currentTime = 0; });
  } else {
    const imgEl = card.querySelector("img");
    const reveal = () => { imgEl.classList.remove("loading"); card.classList.remove("card-loading"); };
    if (imgEl.complete) {
      // Imagem já em cache — fade-in rápido no próximo frame
      requestAnimationFrame(reveal);
    } else {
      imgEl.addEventListener("load", reveal, { once: true });
      imgEl.addEventListener("error", () => {
        reveal();
        imgEl.style.opacity = "0.15";
        imgEl.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236b7280'%3E%3Cpath d='M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z'/%3E%3C/svg%3E";
      }, { once: true });
    }
  }

  card.querySelector('[data-action="open"]').addEventListener("click", (e) => { e.stopPropagation(); openLightbox(idx); });
  card.querySelector('[data-action="copy"]').addEventListener("click", (e) => { e.stopPropagation(); copyPath(img.src); });
  card.querySelector('[data-action="download"]').addEventListener("click", (e) => { e.stopPropagation(); downloadImage(img.src, img.name); });
  card.addEventListener("click", () => openLightbox(idx));

  return card;
}

// ── Lightbox ─────────────────────────────────────────────────
function openLightbox(idx) {
  lbIndex = idx;
  resetZoom();
  showLbImage();
  lightbox.classList.add("open");
  document.body.style.overflow = "hidden";
  pushState({ open: idx });
}

function closeLightbox() {
  lightbox.classList.remove("open");
  document.body.style.overflow = "";
  const vid = document.getElementById("lbVideo");
  if (vid) { vid.pause(); vid.src = ""; }
  resetZoom();
  pushState(); // remove o ?open= da URL
}

function showLbImage() {
  const item = filtered[lbIndex];
  lbName.textContent = `${item.folder} / ${item.name}`;
  lbPrev.style.opacity = lbIndex > 0 ? "1" : "0.3";
  lbNext.style.opacity = lbIndex < filtered.length - 1 ? "1" : "0.3";

  // Limpa conteúdo anterior
  lbImgContainer.innerHTML = "";
  resetZoom();

  if (item.type === "video") {
    const vid = document.createElement("video");
    vid.id = "lbVideo";
    vid.src = item.src;
    vid.controls = true;
    vid.muted = false;
    vid.style.maxWidth = "100%";
    vid.style.maxHeight = "80vh";
    vid.style.borderRadius = "8px";
    lbImgContainer.appendChild(vid);
    // Desativa zoom em vídeos
    lbImgContainer.style.cursor = "default";
  } else {
    const img = document.createElement("img");
    img.id = "lbImg";
    img.src = item.src;
    img.alt = item.name;
    lbImgContainer.appendChild(img);
    lbImgContainer.style.cursor = "";
  }
}

lbClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
lbPrev.addEventListener("click", () => { if (lbIndex > 0) { lbIndex--; resetZoom(); showLbImage(); } });
lbNext.addEventListener("click", () => { if (lbIndex < filtered.length - 1) { lbIndex++; resetZoom(); showLbImage(); } });
lbCopy.addEventListener("click", () => copyPath(filtered[lbIndex].src));
lbDownload.addEventListener("click", () => { const img = filtered[lbIndex]; downloadImage(img.src, img.name); });

document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("open")) return;
  if (e.key === "Escape")      closeLightbox();
  if (e.key === "ArrowLeft")   { if (lbIndex > 0) { lbIndex--; resetZoom(); showLbImage(); } }
  if (e.key === "ArrowRight")  { if (lbIndex < filtered.length - 1) { lbIndex++; resetZoom(); showLbImage(); } }
});

// ── Zoom no lightbox ─────────────────────────────────────────
let zoomScale = 1;
let zoomX = 0, zoomY = 0;
let isDragging = false;
let dragStartX, dragStartY, dragOriginX, dragOriginY;

function applyTransform() {
  const el = document.getElementById("lbImg");
  if (el) el.style.transform = `scale(${zoomScale}) translate(${zoomX}px, ${zoomY}px)`;
}

function resetZoom() {
  zoomScale = 1; zoomX = 0; zoomY = 0;
  const el = document.getElementById("lbImg");
  if (el) el.style.transform = "";
  lbImgContainer.classList.remove("zoomed");
}

// Scroll para zoom (só para imagens)
lbImgContainer.addEventListener("wheel", (e) => {
  if (!document.getElementById("lbImg")) return;
  e.preventDefault();
  const delta = e.deltaY > 0 ? -0.15 : 0.15;
  zoomScale = Math.min(Math.max(1, zoomScale + delta), 5);
  if (zoomScale <= 1) { zoomScale = 1; zoomX = 0; zoomY = 0; lbImgContainer.classList.remove("zoomed"); }
  else lbImgContainer.classList.add("zoomed");
  applyTransform();
}, { passive: false });

// Click para zoom 2x / reset (só para imagens)
lbImgContainer.addEventListener("click", (e) => {
  if (!document.getElementById("lbImg")) return;
  if (isDragging) return;
  if (zoomScale > 1) { resetZoom(); return; }
  zoomScale = 2.5;
  lbImgContainer.classList.add("zoomed");
  applyTransform();
});

// Drag para mover quando zoomed
lbImgContainer.addEventListener("mousedown", (e) => {
  if (zoomScale <= 1) return;
  isDragging = false;
  dragStartX = e.clientX; dragStartY = e.clientY;
  dragOriginX = zoomX;    dragOriginY = zoomY;

  const onMove = (ev) => {
    const dx = ev.clientX - dragStartX;
    const dy = ev.clientY - dragStartY;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) isDragging = true;
    zoomX = dragOriginX + dx / zoomScale;
    zoomY = dragOriginY + dy / zoomScale;
    applyTransform();
  };
  const onUp = () => {
    window.removeEventListener("mousemove", onMove);
    window.removeEventListener("mouseup", onUp);
    setTimeout(() => { isDragging = false; }, 10);
  };
  window.addEventListener("mousemove", onMove);
  window.addEventListener("mouseup", onUp);
});

// Pinch to zoom (mobile)
let lastTouchDist = null;
lbImgContainer.addEventListener("touchstart", (e) => {
  if (e.touches.length === 2) {
    lastTouchDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
    );
  }
}, { passive: true });

lbImgContainer.addEventListener("touchmove", (e) => {
  if (e.touches.length === 2) {
    e.preventDefault();
    const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
    );
    if (lastTouchDist) {
      const ratio = dist / lastTouchDist;
      zoomScale = Math.min(Math.max(1, zoomScale * ratio), 5);
      if (zoomScale <= 1) { zoomScale = 1; zoomX = 0; zoomY = 0; lbImgContainer.classList.remove("zoomed"); }
      else lbImgContainer.classList.add("zoomed");
      applyTransform();
    }
    lastTouchDist = dist;
  }
}, { passive: false });

lbImgContainer.addEventListener("touchend", () => { lastTouchDist = null; });

// ── Download ─────────────────────────────────────────────────
async function downloadImage(src, name) {
  try {
    const url  = src.startsWith("http") ? src : `${window.location.origin}/${src.replace(/^\.\//, "")}`;
    const res  = await fetch(url);
    const blob = await res.blob();
    const a    = document.createElement("a");
    a.href     = URL.createObjectURL(blob);
    a.download = name;
    a.click();
    URL.revokeObjectURL(a.href);
  } catch (e) {
    // fallback: abre em nova aba
    window.open(src, "_blank");
  }
}

// ── Copiar URL ───────────────────────────────────────────────
function copyPath(src) {
  const base    = window.location.origin;
  const fullUrl = src.startsWith("http") ? src : `${base}/${src.replace(/^\.\//, "")}`;
  navigator.clipboard.writeText(fullUrl).then(showToast).catch((err) => console.warn("Clipboard:", err));
}

let toastTimer;
function showToast() {
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2000);
}

// ── Voltar/avançar no browser ────────────────────────────────
window.addEventListener("popstate", () => {
  const { open } = readState();
  buildFilters();
  renderAll();
  if (open !== null && open < filtered.length) {
    openLightbox(open);
  } else {
    closeLightbox();
  }
});

carregar();