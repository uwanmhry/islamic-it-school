// =========================
// INITIALIZATION
// =========================

/**
 * Initialize AOS (Animate On Scroll) library
 */
AOS.init({
  duration: 800,
  once: true,
  offset: 100,
});

// =========================
// GLOBAL STATE
// =========================
let currentPage = 1;
const videosPerPage = 15;
let showingAllVideos = false;
let currentCategory = "all";
let searchQuery = "";

// =========================
// DOM READY EVENT
// =========================
document.addEventListener("DOMContentLoaded", function () {
  initializeApp();
  initEventListeners();
  initNavbarHighlight();
  initNavbarScroll();
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
// CORE FUNCTIONS
// =========================

/**
 * Initialize the application
 */
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
// CATEGORY FUNCTIONS
// =========================

/**
 * Load and render all categories
 */
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

/**
 * Handle category click with immediate visual feedback
 * @param {string} categoryId - ID of the clicked category
 */
function handleCategoryClick(categoryId) {
  // Immediately update button appearance before processing content
  updateActiveCategoryButton(categoryId);
  
  // Continue with content loading
  renderVideosByCategory(categoryId);
}

/**
 * Update active category button styling
 * @param {string} activeCategoryId - ID of the active category
 */
function updateActiveCategoryButton(activeCategoryId = currentCategory) {
  const categoryButtons = document.querySelectorAll("#categoriesContainer button");
  categoryButtons.forEach((btn) => {
    const btnCategoryId = btn.getAttribute("data-id");
    if (btnCategoryId === activeCategoryId) {
      btn.classList.remove("bg-gray-100", "text-gray-700", "hover:bg-gray-200");
      btn.classList.add("bg-gradient-to-r", "from-orange-500", "to-orange-400", "text-white", "shadow-md");
    } else {
      btn.classList.remove("bg-gradient-to-r", "from-orange-500", "to-orange-400", "text-white", "shadow-md");
      btn.classList.add("bg-gray-100", "text-gray-700", "hover:bg-gray-200");
    }
  });
}

/**
 * Render videos based on selected category
 * @param {string} categoryId - ID of the category to display
 */
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
// HEADING & UI FUNCTIONS
// =========================

/**
 * Update section headings based on current state
 */
function updateHeadings() {
  const featuredHeading = document.querySelector("#featuredSection h2");
  const featuredSubtitle = document.getElementById("featuredSubtitle");
  const moreHeading = document.querySelector("#moreSection h2");
  const moreSubtitle = document.getElementById("moreSubtitle");
  const moreSection = document.getElementById("moreSection");

  if (searchQuery) {
    // Search mode
    featuredHeading.textContent = "";
    featuredSubtitle.textContent = "";
    moreHeading.textContent = "🔍 Hasil Pencarian";
    moreSubtitle.textContent = `Menampilkan hasil untuk: "${searchQuery}"`;
    moreSection.classList.remove("hidden");
    return;
  }

  const cat = videoData.categories.find((c) => c.id === currentCategory);
  if (cat) {
    // Category mode
    featuredHeading.textContent = cat.featuredTitle;
    featuredSubtitle.textContent = cat.featuredSubtitle;
    moreHeading.textContent = cat.moreTitle;
    moreSubtitle.textContent = cat.moreSubtitle;
    
    // Hide "More Videos" section for "all" category
    if (currentCategory === "all") {
      moreSection.classList.add("hidden");
    } else {
      moreSection.classList.remove("hidden");
    }
  }
}

// =========================
// SEARCH FUNCTIONS
// =========================

/**
 * Search videos based on keyword
 * @param {string} keyword - Search term
 */
function searchVideos(keyword) {
  searchQuery = (keyword || "").trim().toLowerCase();
  currentPage = 1;
  showingAllVideos = false;

  updateHeadings();
  loadFeaturedVideos();
  loadMoreVideos();
  toggleFeaturedSection();
  
  // Update active category button during search
  updateActiveCategoryButton();
}

// =========================
// VIDEO UTILITY FUNCTIONS
// =========================

/**
 * Extract YouTube video ID from iframe URL
 * @param {string} iframeUrl - YouTube iframe URL
 * @returns {string|null} YouTube video ID or null if not found
 */
function getVideoId(iframeUrl) {
  const match = iframeUrl.match(/embed\/([^?]+)/);
  return match ? match[1] : null;
}

/**
 * Get YouTube thumbnail URL from iframe URL
 * @param {string} iframeUrl - YouTube iframe URL
 * @returns {string} Thumbnail URL
 */
function getThumbnailUrl(iframeUrl) {
  const videoId = getVideoId(iframeUrl);
  return videoId
    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    : "";
}

/**
 * Combine featured and more videos into a single array
 * @returns {Array} Combined videos with isFeatured flag
 */
function getAllVideos() {
  return [
    ...videoData.featuredVideos.map((v) => ({ ...v, isFeatured: true })),
    ...videoData.moreVideos.map((v) => ({ ...v, isFeatured: false })),
  ];
}

// =========================
// FEATURED VIDEOS FUNCTIONS
// =========================

/**
 * Load and render featured videos based on current category
 */
function loadFeaturedVideos() {
  const container = document.getElementById("featuredVideosContainer");
  container.innerHTML = "";

  // Don't show featured videos in search mode
  if (searchQuery) {
    return;
  }

  const categoryData = videoData.categories.find(
    (c) => c.id === currentCategory
  );

  // "All" category - Show ALL featured videos
  if (currentCategory === "all") {
    container.className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6";

    // Display ALL featured videos
    container.innerHTML = videoData.featuredVideos
      .map((video) => renderVideoCard(video, "featured"))
      .join("");
    return;
  }

  // Other categories - Show single featured video
  const featured = videoData.featuredVideos.find(
    (v) => v.category === currentCategory
  );
  
  if (featured && categoryData) {
    const thumbnail = getThumbnailUrl(featured.iframe);

    container.className = "w-full";
    container.innerHTML = `
    <div class="w-full bg-white rounded-2xl shadow-xl overflow-hidden" data-aos="zoom-in">
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

/**
 * Render a video card component
 * @param {Object} video - Video object
 * @param {string} type - Type of video card ('featured' or 'more')
 * @returns {string} HTML string of the video card
 */
function renderVideoCard(video, type = "more") {
  const thumbnail = getThumbnailUrl(video.iframe);
  const isFeatured = type === "featured";
  
  return `
    <div class="video-card bg-white rounded-xl shadow-md overflow-hidden" data-aos="${isFeatured ? 'zoom-in' : 'fade-up'}">
      <div class="relative pt-[56.25%] cursor-pointer" onclick="openVideoModal('${video.iframe}')">
        <img src="${thumbnail}" alt="${video.title}" class="absolute top-0 left-0 w-full h-full object-cover">
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="${isFeatured ? 'w-14 h-14' : 'w-12 h-12'} bg-black bg-opacity-60 rounded-full flex items-center justify-center">
            <i class="fas fa-play text-white ${isFeatured ? 'text-xl' : 'text-lg'}"></i>
          </div>
        </div>
      </div>
      <div class="${isFeatured ? 'p-4' : 'p-3'}">
        <h3 class="${isFeatured ? 'font-semibold text-lg' : 'font-medium text-xs'} text-gray-800 line-clamp-2">${video.title}</h3>
      </div>
    </div>
  `;
}

// =========================
// FEATURED MODAL FUNCTIONS
// =========================

/**
 * Open featured videos modal
 */
function openFeaturedModal() {
  const modal = document.getElementById("featuredModal");
  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

/**
 * Close featured videos modal
 */
function closeFeaturedModal() {
  const modal = document.getElementById("featuredModal");
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

/**
 * Load videos into featured modal
 */
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
// MORE VIDEOS & PAGINATION FUNCTIONS
// =========================

/**
 * Get filtered videos based on current state
 * @returns {Array} Filtered videos
 */
function getFilteredVideos() {
  let filtered;

  if (searchQuery) {
    // Search mode - combine all videos
    filtered = getAllVideos().filter((v) =>
      v.title.toLowerCase().includes(searchQuery)
    );
    return filtered;
  }

  // Don't show "more videos" for "all" category
  if (currentCategory === "all") {
    return [];
  }

  filtered = videoData.moreVideos;

  // Filter by category
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

/**
 * Load more videos with pagination
 */
function loadMoreVideos() {
  const container = document.getElementById("moreVideosContainer");
  const allVideos = getFilteredVideos();

  const startIndex = (currentPage - 1) * videosPerPage;
  const paginatedVideos = showingAllVideos
    ? allVideos
    : allVideos.slice(startIndex, startIndex + videosPerPage);

  container.innerHTML = paginatedVideos.length
    ? paginatedVideos.map((video) => renderVideoCard(video, "more")).join("")
    : `<p class="text-center text-gray-500 col-span-full">Video tidak ditemukan</p>`;

  updatePagination(allVideos.length);
  updateLoadMoreButton();
}

/**
 * Update pagination UI
 * @param {number} totalVideos - Total number of videos
 */
function updatePagination(totalVideos) {
  const paginationContainer = document.getElementById("paginationContainer");
  const totalPages = Math.ceil(totalVideos / videosPerPage);

  // Hide pagination in certain conditions
  if (totalPages <= 1 || showingAllVideos || searchQuery || currentCategory === "all") {
    paginationContainer.classList.add("hidden");
    return;
  }

  paginationContainer.classList.remove("hidden");
  
  let paginationHTML = "";

  // Previous button
  if (currentPage > 1) {
    paginationHTML += `
        <button onclick="changePage(${currentPage - 1})" 
                class="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200">
            <i class="fas fa-chevron-left text-sm"></i>
        </button>
    `;
  }

  // Page numbers
  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  // Adjust if we're near the beginning or end
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    paginationHTML +=
      i === currentPage
        ? `<button class="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-orange-400 text-white font-medium shadow-md">${i}</button>`
        : `<button onclick="changePage(${i})" class="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200">${i}</button>`;
  }

  // Next button
  if (currentPage < totalPages) {
    paginationHTML += `
        <button onclick="changePage(${currentPage + 1})" 
                class="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200">
            <i class="fas fa-chevron-right text-sm"></i>
        </button>
    `;
  }

  paginationContainer.innerHTML = paginationHTML;
}

/**
 * Change to a specific page
 * @param {number} page - Page number to navigate to
 */
function changePage(page) {
  const scrollY = window.scrollY;
  currentPage = page;
  showingAllVideos = false;
  loadMoreVideos();
  window.scrollTo(0, scrollY);
}

/**
 * Update the load more button state
 */
function updateLoadMoreButton() {
  const loadMoreBtn = document.getElementById("loadMoreBtn");
  if (!loadMoreBtn) return;

  const totalVideos = getFilteredVideos().length;

  // Hide button in certain conditions
  if (searchQuery || totalVideos <= videosPerPage || currentCategory === "all") {
    loadMoreBtn.classList.add("hidden");
    return;
  } else {
    loadMoreBtn.classList.remove("hidden");
  }

  // Update button text and style based on state
  if (showingAllVideos) {
    loadMoreBtn.innerHTML = '<i class="fas fa-times mr-1"></i>Batalkan';
    loadMoreBtn.classList.remove("bg-gradient-to-r", "from-orange-500", "to-orange-400");
    loadMoreBtn.classList.add("bg-gray-500");
  } else {
    loadMoreBtn.innerHTML = '<i class="fas fa-reload mr-1"></i>Muat Lebih Banyak';
    loadMoreBtn.classList.remove("bg-gray-500");
    loadMoreBtn.classList.add("bg-gradient-to-r", "from-orange-500", "to-orange-400");
  }
}

/**
 * Toggle between paginated view and all videos view
 */
function toggleAllVideos() {
  showingAllVideos = !showingAllVideos;
  currentPage = 1;
  loadMoreVideos();
}

// =========================
// VIDEO MODAL FUNCTIONS
// =========================

/**
 * Open video modal with specific video
 * @param {string} iframeUrl - YouTube iframe URL
 */
function openVideoModal(iframeUrl) {
  const modal = document.getElementById("videoModal");
  const iframe = document.getElementById("videoModalIframe");
  if (!modal || !iframe) return;

  iframe.src = iframeUrl + "&autoplay=1";
  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

/**
 * Close video modal
 */
function closeVideoModal() {
  const modal = document.getElementById("videoModal");
  const iframe = document.getElementById("videoModalIframe");
  if (!modal || !iframe) return;

  iframe.src = "";
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

// =========================
// EVENT LISTENERS
// =========================

/**
 * Initialize all event listeners
 */
function initEventListeners() {
  // Search functionality
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

  // Load more button
  const loadMoreBtn = document.getElementById("loadMoreBtn");
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", toggleAllVideos);
  }
}

// =========================
// NAVBAR FUNCTIONS
// =========================

/**
 * Initialize navbar active link highlighting
 */
function initNavbarHighlight() {
  const navLinks = document.querySelectorAll(".nav-link");
  const mobileLinks = document.querySelectorAll(".mobile-link");
  const sections = document.querySelectorAll("section[id]");
  const mobileMenu = document.getElementById("mobile-menu");

  /**
   * Set active link style
   * @param {Element} link - Link element to activate
   * @param {NodeList} links - All link elements
   */
  function setActiveLink(link, links) {
    links.forEach((l) => l.classList.remove("text-orange-500", "font-bold"));
    link.classList.add("text-orange-500", "font-bold");
  }

  // Desktop links
  navLinks.forEach((link) => {
    link.addEventListener("click", () => setActiveLink(link, navLinks));
  });

  // Mobile links
  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      setActiveLink(link, mobileLinks);
      if (mobileMenu) mobileMenu.classList.add("hidden");
    });
  });

  // Scroll-based highlighting
  window.addEventListener("scroll", () => {
    let scrollY = window.pageYOffset;
    
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        // Update desktop links
        navLinks.forEach((link) =>
          link.classList.remove("text-orange-500", "font-bold")
        );
        const activeDesktop = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        if (activeDesktop) activeDesktop.classList.add("text-orange-500", "font-bold");

        // Update mobile links
        mobileLinks.forEach((link) =>
          link.classList.remove("text-orange-500", "font-bold")
        );
        const activeMobile = document.querySelector(`.mobile-link[href="#${sectionId}"]`);
        if (activeMobile) activeMobile.classList.add("text-orange-500", "font-bold");
      }
    });
  });
}

/**
 * Initialize navbar hide/show on scroll behavior
 */
function initNavbarScroll() {
  const header = document.querySelector("header");
  let lastScrollY = window.scrollY;

  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY && currentScrollY > 80) {
      // Scroll down - hide navbar
      header.classList.add("-translate-y-full");
    } else {
      // Scroll up - show navbar
      header.classList.remove("-translate-y-full");
    }

    lastScrollY = currentScrollY;
  });
}

// =========================
// MISC FUNCTIONS
// =========================

/**
 * Toggle featured section visibility (if needed)
 */
function toggleFeaturedSection() {
  // Implementation as needed
}