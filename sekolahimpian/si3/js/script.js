// Initialize AOS
AOS.init({
    duration: 800,
    once: true,
    offset: 100,
});

// ==== Search Function (tampilkan di modal) ====
function searchVideos(keyword) {
  const allVideos = [...videoData.featuredVideos, ...videoData.moreVideos];

  // kalau kosong → modal ditutup
  if (keyword === "") {
    closeModal();
    return;
  }

  // kalau ada keyword → filter video
  const results = allVideos.filter(video =>
    video.title.toLowerCase().includes(keyword.toLowerCase())
  );

  // buka modal kalau belum ada
  if (!document.getElementById("featuredModal")) {
    openFeaturedModal("Hasil Pencarian");
  }

  // update judul modal jadi "Hasil Pencarian"
  const modalTitle = document.querySelector("#featuredModal h3");
  modalTitle.textContent = "Hasil Pencarian";

  // render isi video
  renderVideosInModal(results, true);
}

// ==== Helper untuk render isi modal ====
function renderVideosInModal(videos) {
  const container = document.getElementById("modalVideosContainer");
  if (!container) return;

  container.innerHTML = videos.length
    ? videos.map(video => `
        <div class="video-card bg-white rounded-xl shadow-md overflow-hidden">
          <div class="relative pt-[56.25%]">
            <iframe src="${video.iframe}" title="${video.title}" frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen class="absolute top-0 left-0 w-full h-full"></iframe>
          </div>
          <div class="p-4">
            <h3 class="font-semibold text-gray-800 text-sm line-clamp-2">${video.title}</h3>
          </div>
        </div>
      `).join("")
    : `<p class="text-center text-gray-500 col-span-full">Video tidak ditemukan</p>`;
}

// ==== Event Binding ====
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");

// realtime search saat ngetik
searchInput.addEventListener("input", () => {
  searchVideos(searchInput.value.trim());
});

// tombol klik
searchButton.addEventListener("click", () => {
  searchVideos(searchInput.value.trim());
});

// enter
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    searchVideos(searchInput.value.trim());
  }
});


// Pagination variables
let currentPage = 1;
const videosPerPage = 15; // 5 columns x 3 rows = 15 videos per page

// Track if we're showing all videos
let showingAllVideos = false;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function () {
    // Initialize the application
    initializeApp();

    // Initialize event listeners
    initEventListeners();

    // Initialize navbar highlight
    initNavbarHighlight();
});

function initializeApp() {
    // Load categories
    loadCategories();

    // Load videos with delay for smooth animation
    setTimeout(() => {
        loadFeaturedVideos();
        loadMoreVideos();
    }, 500);
}

function loadCategories() {
    const container = document.getElementById('categoriesContainer');
    container.innerHTML = videoData.categories.map((category, index) => `
        <button class="px-4 py-1.5 ${index === 0 ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} 
        rounded-full font-medium whitespace-nowrap transition">
            ${category.name}
        </button>
    `).join('');
}

function loadFeaturedVideos() {
    const container = document.getElementById('featuredVideosContainer');
    // Clear loading skeletons
    container.innerHTML = '';

    // Create 3-column grid for featured videos
    container.classList.remove('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-5');
    container.classList.add('grid-cols-1', 'md:grid-cols-3', 'gap-6');

    // Get only 3 featured videos for the main display
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

function openFeaturedModal() {
    // Create modal element
    const modal = document.createElement('div');
    modal.id = 'featuredModal';
    modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 modal';
    modal.innerHTML = `
        <div class="bg-white rounded-xl w-full max-w-6xl max-h-[90vh] overflow-hidden modal-content">
            <div class="flex justify-between items-center p-4 border-b">
                <h3 class="text-xl font-bold text-gray-800">Semua Video Terpopuler</h3>
                <button onclick="closeModal()" class="text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            <div class="p-4 overflow-y-auto max-h-[calc(90vh-80px)]">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="modalVideosContainer">
                    <!-- Videos will be loaded here -->
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Load videos into modal
    const container = document.getElementById('modalVideosContainer');
    container.innerHTML = videoData.featuredVideos.map(video => `
        <div class="video-card bg-white rounded-xl shadow-md overflow-hidden">
            <div class="relative pt-[56.25%]">
                <iframe src="${video.iframe}" title="${video.title}" frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen class="absolute top-0 left-0 w-full h-full"></iframe>
            </div>
            <div class="p-4">
                <h3 class="font-semibold text-gray-800 text-sm line-clamp-2">${video.title}</h3>
            </div>
        </div>
    `).join('');

    // Show modal with animation
    setTimeout(() => {
        modal.classList.add('open');
    }, 10);
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

function loadMoreVideos() {
    const container = document.getElementById('moreVideosContainer');
    const startIndex = (currentPage - 1) * videosPerPage;
    const paginatedVideos = videoData.moreVideos.slice(startIndex, startIndex + videosPerPage);

    // Always clear container first (replace instead of append)
    container.innerHTML = '';

    // Add videos for current page (5 columns layout)
    container.innerHTML = paginatedVideos.map(video => `
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
    `).join('');

    // Update pagination controls
    updatePagination();

    // Update load more button text
    updateLoadMoreButton();
}

function updatePagination() {
    const totalPages = Math.ceil(videoData.moreVideos.length / videosPerPage);
    const paginationContainer = document.getElementById('paginationContainer');

    if (totalPages <= 1) {
        paginationContainer.classList.add('hidden');
        return;
    }

    paginationContainer.classList.remove('hidden');

    let paginationHTML = '';

    // Previous button
    if (currentPage > 1) {
        paginationHTML += `
            <button onclick="changePage(${currentPage - 1})" class="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                <i class="fas fa-chevron-left text-sm"></i>
            </button>
        `;
    }

    // Page numbers - show up to 5 pages with ellipsis if needed
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        if (i === currentPage) {
            paginationHTML += `
                <button class="w-10 h-10 flex items-center justify-center rounded-full bg-orange-500 text-white font-medium">
                    ${i}
                </button>
            `;
        } else {
            paginationHTML += `
                <button onclick="changePage(${i})" class="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                    ${i}
                </button>
            `;
        }
    }

    // Next button
    if (currentPage < totalPages) {
        paginationHTML += `
            <button onclick="changePage(${currentPage + 1})" class="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                <i class="fas fa-chevron-right text-sm"></i>
            </button>
        `;
    }

    paginationContainer.innerHTML = paginationHTML;
}

function updateLoadMoreButton() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');

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

function changePage(page) {
    currentPage = page;
    showingAllVideos = false;
    loadMoreVideos();
    // Tidak perlu scroll otomatis, tetap di posisi saat ini
}

function toggleAllVideos() {
    if (showingAllVideos) {
        // Kembali ke pagination
        showingAllVideos = false;
        currentPage = 1;
        loadMoreVideos();
    } else {
        // Tampilkan semua video
        showingAllVideos = true;
        const container = document.getElementById('moreVideosContainer');
        container.innerHTML = videoData.moreVideos.map(video => `
            <div class="video-card bg-white rounded-xl shadow-md overflow-hidden">
                <div class="relative pt-[56.25%]">
                    <iframe src="${video.iframe}" title="${video.title}" frameborder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen class="absolute top-0 left-0 w-full h-full"></iframe>
                </div>
                <div class="p-3">
                    <h3 class="font-medium text-gray-800 text-xs line-clamp-2">${video.title}</h3>
                </div>
            </div>
        `).join('');

        // Sembunyikan pagination
        document.getElementById('paginationContainer').classList.add('hidden');
    }

    // Update tombol
    updateLoadMoreButton();
}

// =========================
// Event Listeners
// =========================
function initEventListeners() {
    // Smooth scrolling untuk semua anchor link
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Sticky header (beri shadow saat scroll)
    window.addEventListener('scroll', function () {
        const header = document.querySelector('header');
        if (window.scrollY > 100) {
            header.classList.add('shadow-lg');
        } else {
            header.classList.remove('shadow-lg');
        }
    });

    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function () {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Load more button
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', toggleAllVideos);
    }

    // Close modal when clicking outside
    document.addEventListener('click', function (e) {
        const modal = document.getElementById('featuredModal');
        if (modal && e.target === modal) {
            closeModal();
        }
    });

    // Add event listener to "Lihat Semua" link for featured videos
    const featuredSeeAllLinks = document.querySelectorAll('a.text-orange-500.font-semibold');
    if (featuredSeeAllLinks.length > 0) {
        // Link kedua biasanya adalah "Lihat Semua" untuk video terpopuler
        const featuredSeeAllLink = featuredSeeAllLinks[1];
        if (featuredSeeAllLink) {
            featuredSeeAllLink.addEventListener('click', function (e) {
                e.preventDefault();
                openFeaturedModal();
            });
        }
    }
}

// =========================
// Navbar Active Link (Desktop & Mobile)
// =========================
function initNavbarHighlight() {
    const navLinks = document.querySelectorAll(".nav-link");
    const mobileLinks = document.querySelectorAll(".mobile-link");
    const sections = document.querySelectorAll("section[id]");
    const mobileMenu = document.getElementById("mobile-menu");

    // Fungsi set active link
    function setActiveLink(link, links) {
        links.forEach(l => l.classList.remove("text-orange-500", "font-bold"));
        link.classList.add("text-orange-500", "font-bold");
    }

    // Klik desktop
    navLinks.forEach(link => {
        link.addEventListener("click", () => setActiveLink(link, navLinks));
    });

    // Klik mobile
    mobileLinks.forEach(link => {
        link.addEventListener("click", () => {
            setActiveLink(link, mobileLinks);
            if (mobileMenu) mobileMenu.classList.add("hidden"); // otomatis tutup menu
        });
    });

    // Scroll: update active link otomatis
    window.addEventListener("scroll", () => {
        let scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100; // offset untuk header
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute("id");

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                // Desktop
                navLinks.forEach(link => link.classList.remove("text-orange-500", "font-bold"));
                const activeDesktop = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                if (activeDesktop) activeDesktop.classList.add("text-orange-500", "font-bold");

                // Mobile
                mobileLinks.forEach(link => link.classList.remove("text-orange-500", "font-bold"));
                const activeMobile = document.querySelector(`.mobile-link[href="#${sectionId}"]`);
                if (activeMobile) activeMobile.classList.add("text-orange-500", "font-bold");
            }
        });
    });
}