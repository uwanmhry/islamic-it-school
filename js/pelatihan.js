
  const gallery = document.getElementById('gallery');

  const galleryData = [
  {
    image: "img/webinar.JPG",
    alt: "Seminar IT Bersertifikat",
    category: "seminar",
    badgeColor: "bg-orange-500",
    badgeText: "SEMINAR",
    date: "12 Jan 2024",
    title: "Seminar IT Bersertifikat",
    description: "Seminar interaktif dengan pembicara ahli di bidang teknologi informasi terkini"
  },
  {
    image: "img/BedahBuku.JPG",
    alt: "Sesi Bedah Buku",
    category: "diskusi",
    badgeColor: "bg-teal-500",
    badgeText: "DISKUSI",
    date: "15 Jan 2024",
    title: "Sesi Bedah Buku",
    description: "Diskusi mendalam tentang konsep-konsep penting dalam literatur IT terbaru"
  },
  {
    image: "img/praktekIt.JPG",
    alt: "Praktek Lab IT",
    category: "praktik",
    badgeColor: "bg-purple-500",
    badgeText: "PRAKTIK",
    date: "18 Jan 2024",
    title: "Praktek Lab IT",
    description: "Pengalaman hands-on dengan teknologi terbaru dalam lingkungan lab yang modern"
  },
  {
    image: "img/IIC/1.jpg",
    alt: "Praktek Lab IT",
    category: "praktik",
    badgeColor: "bg-purple-500",
    badgeText: "PRAKTIK",
    // date: "18 Jan 2024",
    title: "Praktek Lab IT",
    // description: "Pengalaman hands-on dengan teknologi terbaru dalam lingkungan lab yang modern"
  },
  {
    image: "img/IIC/2.jpg",
    alt: "Praktek Lab IT",
    category: "praktik",
    badgeColor: "bg-purple-500",
    badgeText: "PRAKTIK",
    // date: "18 Jan 2024",
    title: "Praktek Lab IT",
    // description: "Pengalaman hands-on dengan teknologi terbaru dalam lingkungan lab yang modern"
  },
  {
    image: "img/IIC/3.jpg",
    alt: "Praktek Lab IT",
    category: "praktik",
    badgeColor: "bg-purple-500",
    badgeText: "PRAKTIK",
    // date: "18 Jan 2024",
    title: "Praktek Lab IT",
    // description: "Pengalaman hands-on dengan teknologi terbaru dalam lingkungan lab yang modern"
  },
  {
    image: "img/IIC/4.jpg",
    alt: "Praktek Lab IT",
    category: "praktik",
    badgeColor: "bg-purple-500",
    badgeText: "PRAKTIK",
    // date: "18 Jan 2024",
    title: "Praktek Lab IT",
    // description: "Pengalaman hands-on dengan teknologi terbaru dalam lingkungan lab yang modern"
  },
  {
    image: "img/IIC/5.jpg",
    alt: "Praktek Lab IT",
    category: "praktik",
    badgeColor: "bg-purple-500",
    badgeText: "PRAKTIK",
    // date: "18 Jan 2024",
    title: "Praktek Lab IT",
    // description: "Pengalaman hands-on dengan teknologi terbaru dalam lingkungan lab yang modern"
  },
  {
    image: "img/IIC/6.jpg",
    alt: "Seminar",
    category: "seminar",
    badgeColor: "bg-purple-500",
    badgeText: "SEMINAR",
    // date: "18 Jan 2024",
    title: "Seminar",
    // description: "Pengalaman hands-on dengan teknologi terbaru dalam lingkungan lab yang modern"
  },
  {
    image: "img/IIC/7.jpg",
    alt: "Seminar",
    category: "seminar",
    badgeColor: "bg-purple-500",
    badgeText: "SEMINAR",
    // date: "18 Jan 2024",
    title: "Praktek Lab IT",
    // description: "Pengalaman hands-on dengan teknologi terbaru dalam lingkungan lab yang modern"
  },
  {
    image: "img/IIC/8.jpg",
    alt: "Praktek Lab IT",
    category: "praktik",
    badgeColor: "bg-purple-500",
    badgeText: "PRAKTIK",
    // date: "18 Jan 2024",
    title: "Praktek Lab IT",
    // description: "Pengalaman hands-on dengan teknologi terbaru dalam lingkungan lab yang modern"
  },
  {
    image: "img/IIC/9.jpg",
    alt: "Praktek Lab IT",
    category: "praktik",
    badgeColor: "bg-purple-500",
    badgeText: "PRAKTIK",
    // date: "18 Jan 2024",
    title: "Praktek Lab IT",
    // description: "Pengalaman hands-on dengan teknologi terbaru dalam lingkungan lab yang modern"
  },
]

const galleryContainer = document.getElementById('gallery');
const paginationContainer = document.getElementById('pagination');
const itemsPerPage = 8;
let currentPage = 1;

function renderGalleryPage(page) {
  galleryContainer.innerHTML = '';
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const items = galleryData.slice(start, end);

  items.forEach(item => {
    galleryContainer.innerHTML += `
      <div class="gallery-item image-card relative overflow-hidden rounded-2xl shadow-lg group transition-all duration-500" data-category="${item.category}">
        <img src="${item.image}" alt="${item.alt}" class="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700">
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 flex flex-col justify-end">
          <div class="text-white">
            <div class="flex items-center mb-2">
              <span class="${item.badgeColor} text-xs font-semibold px-2 py-1 rounded-full mr-2">${item.badgeText}</span>
             
            </div>
            <h3 class="text-lg font-bold mb-2">${item.title}</h3>
            <div class="h-1 w-16 bg-gradient-to-r from-orange-400 to-teal-500 rounded-full mb-2"></div>
            
          </div>
        </div>
      </div>
    `;
  });
}

function renderPagination() {
  paginationContainer.innerHTML = '';
  const totalPages = Math.ceil(galleryData.length / itemsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    paginationContainer.innerHTML += `
      <button class="px-4 py-2 text-sm font-semibold rounded-lg border border-gray-300 hover:bg-orange-500 hover:text-white ${i === currentPage ? 'bg-orange-500 text-white' : ''}" onclick="goToPage(${i})">
        ${i}
      </button>
    `;
  }
}

function goToPage(page) {
  currentPage = page;
  renderGalleryPage(page);
  renderPagination();
}

// Initialize
renderGalleryPage(currentPage);
renderPagination();

