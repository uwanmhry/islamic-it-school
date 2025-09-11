// =========================
// AOS Init
// =========================
AOS.init({
  duration: 800,
  once: true,
  offset: 100,
});

// =========================
// Global State
// =========================
let currentPage = 1;
const videosPerPage = 15;
let showingAllVideos = false;
let currentCategory = "all";
let searchQuery = "";

// =========================
// DOM Ready
// =========================
document.addEventListener("DOMContentLoaded", function () {
  initializeApp();
  initEventListeners();
  initNavbarHighlight();
  loadFeaturedModalVideos();

  // Safe bind backdrop modal
  const videoModalEl = document.getElementById("videoModal");
  if (videoModalEl) {
    videoModalEl.addEventListener("click", function (e) {
      if (e.target.id === "videoModal") closeVideoModal();
    });
  }

  // Re-render grid mode saat resize
  window.addEventListener("resize", () => {
    loadMoreVideos();
  });
});

// =========================
// Initialize
// =========================
function initializeApp() {
  loadCategories();
  updateHeadings();
  setTimeout(() => {
    loadFeaturedVideos();
    loadMoreVideos();
    toggleFeaturedSection();
  }, 500);
}

// =========================
// Categories - DIPERBAIKI
// =========================
function loadCategories() {
  const container = document.getElementById("categoriesContainer");
  container.innerHTML = videoData.categories
    .map(
      (category) => `
        <button data-id="${category.id}" 
            onclick="handleCategoryClick('${category.id}')"
            class="px-4 py-1.5 ${category.id === currentCategory ? "bg-gradient-to-r from-orange-500 to-orange-400 text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"} 
            rounded-full font-medium whitespace-nowrap transition-all duration-200">
            ${category.name}
        </button>
    `
    )
    .join("");
}

// Fungsi baru untuk menangani klik kategori dengan animasi langsung
function handleCategoryClick(categoryId) {
  // Langsung update tampilan tombol sebelum memproses yang lain
  const categoryButtons = document.querySelectorAll("#categoriesContainer button");
  categoryButtons.forEach((btn) => {
    const btnCategoryId = btn.getAttribute("data-id");
    if (btnCategoryId === categoryId) {
      btn.classList.remove("bg-gray-100", "text-gray-700", "hover:bg-gray-200");
      btn.classList.add("bg-gradient-to-r", "from-orange-500", "to-orange-400", "text-white", "shadow-md");
    } else {
      btn.classList.remove("bg-gradient-to-r", "from-orange-500", "to-orange-400", "text-white", "shadow-md");
      btn.classList.add("bg-gray-100", "text-gray-700", "hover:bg-gray-200");
    }
  });
  
  // Lanjutkan dengan fungsi yang sudah ada
  renderVideosByCategory(categoryId);
}

function renderVideosByCategory(categoryId) {
  currentCategory = categoryId;
  searchQuery = "";
  currentPage = 1;
  showingAllVideos = false;

  updateHeadings();
  loadFeaturedVideos();
  loadMoreVideos();
  toggleFeaturedSection();
}

// =========================
// Headings - DIPERBAIKI
// =========================
function updateHeadings() {
  const featuredHeading = document.querySelector("#featuredSection h2");
  const featuredSubtitle = document.getElementById("featuredSubtitle");
  const moreHeading = document.querySelector("#moreSection h2");
  const moreSubtitle = document.getElementById("moreSubtitle");
  const moreSection = document.getElementById("moreSection");

  if (searchQuery) {
    featuredHeading.textContent = "";
    featuredSubtitle.textContent = "";
    moreHeading.textContent = "🔍 Hasil Pencarian";
    moreSubtitle.textContent = `Menampilkan hasil untuk: "${searchQuery}"`;
    moreSection.classList.remove("hidden");
    return;
  }

  const cat = videoData.categories.find((c) => c.id === currentCategory);
  if (cat) {
    featuredHeading.textContent = cat.featuredTitle;
    featuredSubtitle.textContent = cat.featuredSubtitle;
    moreHeading.textContent = cat.moreTitle;
    moreSubtitle.textContent = cat.moreSubtitle;
    
    // Sembunyikan section "Video Lainnya" jika kategori adalah "all"
    if (currentCategory === "all") {
      moreSection.classList.add("hidden");
    } else {
      moreSection.classList.remove("hidden");
    }
  }
}

// =========================
// Search
// =========================
function searchVideos(keyword) {
  searchQuery = (keyword || "").trim().toLowerCase();
  currentPage = 1;
  showingAllVideos = false;

  updateHeadings();
  loadFeaturedVideos();
  loadMoreVideos();
  toggleFeaturedSection();
  
  // Update kategori aktif saat pencarian
  updateActiveCategoryButton();
}

// =========================
// Helpers (YouTube ID + Thumbnail)
// =========================
function getVideoId(iframeUrl) {
  const match = iframeUrl.match(/embed\/([^?]+)/);
  return match ? match[1] : null;
}

function getThumbnailUrl(iframeUrl) {
  const videoId = getVideoId(iframeUrl);
  return videoId
    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    : "";
}

// Gabung featured + more
function getAllVideos() {
  return [
    ...videoData.featuredVideos.map((v) => ({ ...v, isFeatured: true })),
    ...videoData.moreVideos.map((v) => ({ ...v, isFeatured: false })),
  ];
}

// =========================
// Featured Videos - DIPERBAIKI
// =========================
function loadFeaturedVideos() {
  const container = document.getElementById("featuredVideosContainer");
  container.innerHTML = "";

  if (searchQuery) {
    // jangan tampilkan featured kalau search
    container.innerHTML = "";
    return;
  }

  const categoryData = videoData.categories.find(
    (c) => c.id === currentCategory
  );

  // Kalau kategori ALL - TAMPILKAN SEMUA VIDEO UTAMA
  if (currentCategory === "all") {
    container.className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6";

    // Tampilkan SEMUA video utama, bukan hanya 3
    container.innerHTML = videoData.featuredVideos
      .map((video) => {
        const thumbnail = getThumbnailUrl(video.iframe);
        return `
        <div class="video-card bg-white rounded-xl shadow-md overflow-hidden" data-aos="zoom-in">
          <div class="relative pt-[56.25%] cursor-pointer" onclick="openVideoModal('${video.iframe}')">
            <img src="${thumbnail}" alt="${video.title}" class="absolute top-0 left-0 w-full h-full object-cover">
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="w-14 h-14 bg-black bg-opacity-60 rounded-full flex items-center justify-center">
                <i class="fas fa-play text-white text-xl"></i>
              </div>
            </div>
          </div>
          <div class="p-4">
            <h3 class="font-semibold text-gray-800 text-lg line-clamp-2">${video.title}</h3>
          </div>
        </div>
      `;
      })
      .join("");
    return;
  }

  // kategori lain
  const featured = videoData.featuredVideos.find(
    (v) => v.category === currentCategory
  );
  if (featured && categoryData) {
    const thumbnail = getThumbnailUrl(featured.iframe);

    container.className = "w-full";
    container.innerHTML = `
    <div class="w-full bg-white rounded-2xl shadow-xl overflow-hidden" data-aos="zoom-in">
        <!-- Mobile: aspect-video (16:9), Desktop: tinggi hero -->
        <div class="relative w-full aspect-video md:h-[65vh] lg:h-[75vh] cursor-pointer" 
            onclick="openVideoModal('${featured.iframe}')">
        <img src="${thumbnail}" alt="${featured.title}" 
            class="absolute top-0 left-0 w-full h-full object-cover">
        <div class="absolute inset-0 flex items-center justify-center">
            <div class="w-14 h-14 md:w-20 md:h-20 bg-black bg-opacity-60 rounded-full flex items-center justify-center">
            <i class="fas fa-play text-white text-xl md:text-3xl"></i>
            </div>
        </div>
        </div>
        <div class="p-4 md:p-6 text-center">
        <h3 class="font-bold text-gray-800 text-lg md:text-2xl lg:text-3xl">${featured.title}</h3>
        </div>
    </div>
    `;
  }
}

// =========================
// Featured Modal
// =========================
function openFeaturedModal() {
  const modal = document.getElementById("featuredModal");
  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function closeFeaturedModal() {
  const modal = document.getElementById("featuredModal");
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

function loadFeaturedModalVideos() {
  const container = document.getElementById("featuredModalContent");
  container.innerHTML = "";

  videoData.featuredVideos.forEach((video) => {
    const videoId = video.iframe.split("/embed/")[1].split("?")[0];
    const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

    const videoCard = `
        <div class="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer"
            onclick="openVideoModal('${video.iframe}')">
            <div class="relative w-full h-48">
            <img src="${thumbnail}" alt="${video.title}" class="w-full h-full object-cover">
            <div class="absolute inset-0 flex items-center justify-center">
                <div class="w-12 h-12 bg-black bg-opacity-60 rounded-full flex items-center justify-center">
                <i class="fas fa-play text-white text-lg"></i>
                </div>
            </div>
            </div>
            <div class="p-4">
            <h3 class="text-gray-800 font-semibold text-lg">${video.title}</h3>
            </div>
        </div>
        `;
    container.innerHTML += videoCard;
  });
}

// =========================
// More Videos (Pagination) - DIPERBAIKI
// =========================
function getFilteredVideos() {
  let filtered;

  if (searchQuery) {
    // saat search gabung semua video
    filtered = getAllVideos().filter((v) =>
      v.title.toLowerCase().includes(searchQuery)
    );
    return filtered;
  }

  // Jika kategori "all", jangan tampilkan video lainnya
  if (currentCategory === "all") {
    return [];
  }

  filtered = videoData.moreVideos;

  if (currentCategory !== "all") {
    filtered = filtered.filter((v) => {
      if (Array.isArray(v.category)) {
        return v.category.includes(currentCategory);
      }
      return v.category === currentCategory;
    });
  }

  return filtered;
}

function loadMoreVideos() {
  const container = document.getElementById("moreVideosContainer");
  const allVideos = getFilteredVideos();

  const startIndex = (currentPage - 1) * videosPerPage;
  const paginatedVideos = showingAllVideos
    ? allVideos
    : allVideos.slice(startIndex, startIndex + videosPerPage);

  container.innerHTML = paginatedVideos.length
    ? paginatedVideos
        .map((video) => {
          const thumbnail = getThumbnailUrl(video.iframe);
          return `
          <div class="video-card bg-white rounded-xl shadow-md overflow-hidden" data-aos="fade-up">
            <div class="relative pt-[56.25%] cursor-pointer" onclick="openVideoModal('${video.iframe}')">
              <img src="${thumbnail}" alt="${video.title}" class="absolute top-0 left-0 w-full h-full object-cover">
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="w-12 h-12 bg-black bg-opacity-60 rounded-full flex items-center justify-center">
                  <i class="fas fa-play text-white text-lg"></i>
                </div>
              </div>
            </div>
            <div class="p-3">
              <h3 class="font-medium text-gray-800 text-xs line-clamp-2">${video.title}</h3>
            </div>
          </div>
        `;
        })
        .join("")
    : `<p class="text-center text-gray-500 col-span-full">Video tidak ditemukan</p>`;

  updatePagination(allVideos.length);
  updateLoadMoreButton();
}

function updatePagination(totalVideos) {
  const totalPages = Math.ceil(totalVideos / videosPerPage);
  const paginationContainer = document.getElementById("paginationContainer");

  if (totalPages <= 1 || showingAllVideos || searchQuery || currentCategory === "all") {
    paginationContainer.classList.add("hidden");
    return;
  }

  paginationContainer.classList.remove("hidden");
  let paginationHTML = "";

  if (currentPage > 1) {
    paginationHTML += `
        <button onclick="changePage(${
          currentPage - 1
        })" class="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200">
            <i class="fas fa-chevron-left text-sm"></i>
        </button>
    `;
  }

  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    paginationHTML +=
      i === currentPage
        ? `<button class="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-orange-400 text-white font-medium shadow-md">${i}</button>`
        : `<button onclick="changePage(${i})" class="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200">${i}</button>`;
  }

  if (currentPage < totalPages) {
    paginationHTML += `
        <button onclick="changePage(${
          currentPage + 1
        })" class="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200">
            <i class="fas fa-chevron-right text-sm"></i>
        </button>
    `;
  }

  paginationContainer.innerHTML = paginationHTML;
}

function changePage(page) {
  const scrollY = window.scrollY;

  currentPage = page;
  showingAllVideos = false;
  loadMoreVideos();

  window.scrollTo(0, scrollY);
}

function updateLoadMoreButton() {
  const loadMoreBtn = document.getElementById("loadMoreBtn");
  if (!loadMoreBtn) return;

  const totalVideos = getFilteredVideos().length;

  // Sembunyikan tombol "Muat Lebih Banyak" jika kategori adalah "all"
  if (searchQuery || totalVideos <= videosPerPage || currentCategory === "all") {
    loadMoreBtn.classList.add("hidden");
    return;
  } else {
    loadMoreBtn.classList.remove("hidden");
  }

  if (showingAllVideos) {
    loadMoreBtn.innerHTML = '<i class="fas fa-times mr-1"></i>Batalkan';
    loadMoreBtn.classList.remove("bg-gradient-to-r", "from-orange-500", "to-orange-400");
    loadMoreBtn.classList.add("bg-gray-500");
  } else {
    loadMoreBtn.innerHTML =
      '<i class="fas fa-reload mr-1"></i>Muat Lebih Banyak';
    loadMoreBtn.classList.remove("bg-gray-500");
    loadMoreBtn.classList.add("bg-gradient-to-r", "from-orange-500", "to-orange-400");
  }
}

function toggleAllVideos() {
  showingAllVideos = !showingAllVideos;
  currentPage = 1;
  loadMoreVideos();
}

// =========================
// Video Modal
// =========================
function openVideoModal(iframeUrl) {
  const modal = document.getElementById("videoModal");
  const iframe = document.getElementById("videoModalIframe");
  if (!modal || !iframe) return;

  iframe.src = iframeUrl + "&autoplay=1";
  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function closeVideoModal() {
  const modal = document.getElementById("videoModal");
  const iframe = document.getElementById("videoModalIframe");
  if (!modal || !iframe) return;

  iframe.src = "";
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

// =========================
// Event Listeners
// =========================
function initEventListeners() {
  const searchInput = document.getElementById("searchInput");
  const searchButton = document.getElementById("searchButton");

  searchInput.addEventListener("input", () => {
    searchVideos(searchInput.value);
  });
  searchButton.addEventListener("click", () => {
    searchVideos(searchInput.value);
  });
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      searchVideos(searchInput.value);
    }
  });

  const loadMoreBtn = document.getElementById("loadMoreBtn");
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", toggleAllVideos);
  }
}

// =========================
// Navbar Active Link
// =========================
function initNavbarHighlight() {
  const navLinks = document.querySelectorAll(".nav-link");
  const mobileLinks = document.querySelectorAll(".mobile-link");
  const sections = document.querySelectorAll("section[id]");
  const mobileMenu = document.getElementById("mobile-menu");

  function setActiveLink(link, links) {
    links.forEach((l) => l.classList.remove("text-orange-500", "font-bold"));
    link.classList.add("text-orange-500", "font-bold");
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", () => setActiveLink(link, navLinks));
  });

  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      setActiveLink(link, mobileLinks);
      if (mobileMenu) mobileMenu.classList.add("hidden");
    });
  });

  window.addEventListener("scroll", () => {
    let scrollY = window.pageYOffset;
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach((link) =>
          link.classList.remove("text-orange-500", "font-bold")
        );
        const activeDesktop = document.querySelector(
          `.nav-link[href="#${sectionId}"]`
        );
        if (activeDesktop)
          activeDesktop.classList.add("text-orange-500", "font-bold");

        mobileLinks.forEach((link) =>
          link.classList.remove("text-orange-500", "font-bold")
        );
        const activeMobile = document.querySelector(
          `.mobile-link[href="#${sectionId}"]`
        );
        if (activeMobile)
          activeMobile.classList.add("text-orange-500", "font-bold");
      }
    });
  });
}

// =========================
// Toggle Featured Section (jika ada)
// =========================
function toggleFeaturedSection() {
  // Implementasi sesuai kebutuhan
}

// Fungsi untuk mengupdate tombol kategori aktif
function updateActiveCategoryButton() {
  const categoryButtons = document.querySelectorAll("#categoriesContainer button");
  categoryButtons.forEach((btn) => {
    const categoryId = btn.getAttribute("data-id");
    if (categoryId === currentCategory) {
      btn.classList.remove("bg-gray-100", "text-gray-700", "hover:bg-gray-200");
      btn.classList.add("bg-gradient-to-r", "from-orange-500", "to-orange-400", "text-white", "shadow-md");
    } else {
      btn.classList.remove("bg-gradient-to-r", "from-orange-500", "to-orange-400", "text-white", "shadow-md");
      btn.classList.add("bg-gray-100", "text-gray-700", "hover:bg-gray-200");
    }
  });
}

// =========================
// Navbar Hide on Scroll Down, Show on Scroll Up
// =========================
function initNavbarScroll() {
  const header = document.querySelector("header");
  let lastScrollY = window.scrollY;

  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY && currentScrollY > 80) {
      // Scroll ke bawah -> sembunyikan navbar
      header.classList.add("-translate-y-full");
    } else {
      // Scroll ke atas -> tampilkan navbar
      header.classList.remove("-translate-y-full");
    }

    lastScrollY = currentScrollY;
  });
}

// Panggil fungsi saat DOM siap
document.addEventListener("DOMContentLoaded", () => {
  initNavbarScroll();
});
