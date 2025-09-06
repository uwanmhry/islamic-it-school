// Initialize AOS
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
let currentCategory = 'all';
let searchQuery = "";

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function () {
    initializeApp();
    initEventListeners();
    initNavbarHighlight();
});

// =========================
// Initialize
// =========================
function initializeApp() {
    loadCategories();
    setTimeout(() => {
        loadFeaturedVideos();
        loadMoreVideos();
        toggleFeaturedSection(); // kontrol awal
    }, 500);
}

// =========================
// Categories
// =========================
function loadCategories() {
    const container = document.getElementById('categoriesContainer');
    container.innerHTML = videoData.categories.map((category, index) => `
        <button data-id="${category.id}" 
            onclick="renderVideosByCategory('${category.id}')"
            class="px-4 py-1.5 ${index === 0 ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} 
            rounded-full font-medium whitespace-nowrap transition">
            ${category.name}
        </button>
    `).join('');
}

function renderVideosByCategory(categoryId) {
    currentCategory = categoryId;
    searchQuery = "";
    currentPage = 1;
    showingAllVideos = false;

    updateMoreHeading();
    loadMoreVideos();
    toggleFeaturedSection();

    // Update button aktif
    const categoryButtons = document.querySelectorAll('#categoriesContainer button');
    categoryButtons.forEach(btn => {
        btn.classList.remove('bg-orange-500', 'text-white');
        btn.classList.add('bg-gray-100', 'text-gray-700');
    });

    const activeBtn = document.querySelector(`#categoriesContainer button[data-id="${categoryId}"]`);
    if (activeBtn) {
        activeBtn.classList.remove('bg-gray-100', 'text-gray-700');
        activeBtn.classList.add('bg-orange-500', 'text-white');
    }
}

// =========================
// Heading More Section
// =========================
function updateMoreHeading() {
    const heading = document.querySelector("#moreSection h2");
    if (searchQuery) {
        heading.textContent = "Hasil Pencarian";
    } else if (currentCategory === "all") {
        heading.textContent = "Video Lainnya";
    } else {
        const cat = videoData.categories.find(c => c.id === currentCategory);
        heading.textContent = cat ? `${cat.name}` : "Video Lainnya";
    }
}

// =========================
// Search Function
// =========================
function searchVideos(keyword) {
    searchQuery = keyword.trim().toLowerCase();
    currentPage = 1;
    showingAllVideos = false;

    updateMoreHeading();
    loadMoreVideos();
    toggleFeaturedSection();
}

// =========================
// Featured Videos
// =========================
function loadFeaturedVideos() {
    const container = document.getElementById('featuredVideosContainer');
    container.innerHTML = '';

    container.classList.remove('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-5');
    container.classList.add('grid-cols-1', 'md:grid-cols-3', 'gap-6');

    const displayVideos = videoData.featuredVideos.slice(0, 3);

    container.innerHTML = displayVideos.map(video => `
        <div class="video-card bg-white rounded-xl shadow-md overflow-hidden" data-aos="zoom-in">
            <div class="relative pt-[56.25%]">
                <iframe src="${video.iframe}" title="${video.title}" frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen class="absolute top-0 left-0 w-full h-full"></iframe>
            </div>
            <div class="p-4">
                <h3 class="font-semibold text-gray-800 text-lg line-clamp-2">${video.title}</h3>
            </div>
        </div>
    `).join('');
}

function toggleFeaturedSection() {
    const featuredSection = document.querySelector('#featuredSection');
    if (!featuredSection) return;

    if (currentCategory === "all" && !searchQuery) {
        featuredSection.style.display = "block";
    } else {
        featuredSection.style.display = "none";
    }
}

// =========================
// Featured Modal Functions
// =========================
function openFeaturedModal() {
    const modal = document.getElementById('featuredModal');
    const modalContent = document.getElementById('featuredModalContent');

    modalContent.innerHTML = videoData.featuredVideos.map(video => `
    <div class="video-card bg-white rounded-xl shadow-md overflow-hidden" data-aos="zoom-in">
      <div class="relative pt-[56.25%]">
        <iframe src="${video.iframe}" title="${video.title}" frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen class="absolute top-0 left-0 w-full h-full"></iframe>
      </div>
      <div class="p-4">
        <h3 class="font-semibold text-gray-800 text-lg line-clamp-2">${video.title}</h3>
      </div>
    </div>
  `).join("");

    modal.classList.remove("hidden");
}

function closeFeaturedModal() {
    document.getElementById('featuredModal').classList.add("hidden");
}

function closeModal() {
    const modal = document.getElementById('featuredModal');
    if (modal) {
        modal.classList.remove('open');
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 300);
    }
}

// =========================
// More Videos (Pagination)
// =========================
function getFilteredVideos() {
    let filtered = videoData.moreVideos;

    if (currentCategory !== 'all') {
    filtered = filtered.filter(v => {
        if (Array.isArray(v.category)) {
        return v.category.includes(currentCategory); // ✅ cek array
        }
        return v.category === currentCategory; // ✅ fallback lama
    });
    }

    if (searchQuery) {
        filtered = filtered.filter(v => v.title.toLowerCase().includes(searchQuery));
    }

    return filtered;
}

function loadMoreVideos() {
    const container = document.getElementById('moreVideosContainer');
    const allVideos = getFilteredVideos();

    const startIndex = (currentPage - 1) * videosPerPage;
    const paginatedVideos = showingAllVideos
        ? allVideos
        : allVideos.slice(startIndex, startIndex + videosPerPage);

    container.innerHTML = paginatedVideos.length
        ? paginatedVideos.map(video => `
            <div class="video-card bg-white rounded-xl shadow-md overflow-hidden" data-aos="fade-up">
                <div class="relative pt-[56.25%]">
                    <iframe src="${video.iframe}" title="${video.title}" frameborder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen class="absolute top-0 left-0 w-full h-full"></iframe>
                </div>
                <div class="p-3">
                    <h3 class="font-medium text-gray-800 text-xs line-clamp-2">${video.title}</h3>
                </div>
            </div>
        `).join("")
        : `<p class="text-center text-gray-500 col-span-full">Video tidak ditemukan</p>`;

    updatePagination(allVideos.length);
    updateLoadMoreButton();
}

function updatePagination(totalVideos) {
    const totalPages = Math.ceil(totalVideos / videosPerPage);
    const paginationContainer = document.getElementById('paginationContainer');

    if (totalPages <= 1 || showingAllVideos || searchQuery) {
        paginationContainer.classList.add('hidden');
        return;
    }

    paginationContainer.classList.remove('hidden');
    let paginationHTML = '';

    if (currentPage > 1) {
        paginationHTML += `
            <button onclick="changePage(${currentPage - 1})" class="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200">
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
        paginationHTML += i === currentPage
            ? `<button class="w-10 h-10 flex items-center justify-center rounded-full bg-orange-500 text-white font-medium">${i}</button>`
            : `<button onclick="changePage(${i})" class="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200">${i}</button>`;
    }

    if (currentPage < totalPages) {
        paginationHTML += `
            <button onclick="changePage(${currentPage + 1})" class="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200">
                <i class="fas fa-chevron-right text-sm"></i>
            </button>
        `;
    }

    paginationContainer.innerHTML = paginationHTML;
}

function changePage(page) {
    currentPage = page;
    showingAllVideos = false;
    loadMoreVideos();
}

function updateLoadMoreButton() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (!loadMoreBtn) return;

    if (searchQuery) {
        loadMoreBtn.classList.add("hidden");
        return;
    } else {
        loadMoreBtn.classList.remove("hidden");
    }

    if (showingAllVideos) {
        loadMoreBtn.innerHTML = '<i class="fas fa-times mr-1"></i>Batalkan';
        loadMoreBtn.classList.remove('bg-gradient-to-r', 'from-orange-500', 'to-green-500');
        loadMoreBtn.classList.add('bg-gray-500');
    } else {
        loadMoreBtn.innerHTML = '<i class="fas fa-reload mr-1"></i>Muat Lebih Banyak';
        loadMoreBtn.classList.remove('bg-gray-500');
        loadMoreBtn.classList.add('bg-gradient-to-r', 'from-orange-500', 'to-green-500');
    }
}

function toggleAllVideos() {
    showingAllVideos = !showingAllVideos;
    currentPage = 1;
    loadMoreVideos();
}

// =========================
// Event Listeners
// =========================
function initEventListeners() {
    // Search
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

    // Load More
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', toggleAllVideos);
    }

    // Modal backdrop click
    document.addEventListener('click', function (e) {
        const modal = document.getElementById('featuredModal');
        if (modal && e.target === modal) {
            closeModal();
        }
    });

    // "Lihat Semua" Featured
    const featuredSeeAll = document.querySelector('#featuredSection a');
    if (featuredSeeAll) {
        featuredSeeAll.addEventListener('click', function (e) {
            e.preventDefault();
            openFeaturedModal();
        });
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
        links.forEach(l => l.classList.remove("text-orange-500", "font-bold"));
        link.classList.add("text-orange-500", "font-bold");
    }

    navLinks.forEach(link => {
        link.addEventListener("click", () => setActiveLink(link, navLinks));
    });

    mobileLinks.forEach(link => {
        link.addEventListener("click", () => {
            setActiveLink(link, mobileLinks);
            if (mobileMenu) mobileMenu.classList.add("hidden");
        });
    });

    window.addEventListener("scroll", () => {
        let scrollY = window.pageYOffset;
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute("id");

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove("text-orange-500", "font-bold"));
                const activeDesktop = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                if (activeDesktop) activeDesktop.classList.add("text-orange-500", "font-bold");

                mobileLinks.forEach(link => link.classList.remove("text-orange-500", "font-bold"));
                const activeMobile = document.querySelector(`.mobile-link[href="#${sectionId}"]`);
                if (activeMobile) activeMobile.classList.add("text-orange-500", "font-bold");
            }
        });
    });
}
