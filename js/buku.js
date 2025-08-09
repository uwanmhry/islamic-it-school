const books = [
  {
    id: "book-1",
    title: "Liquid Curriculum", // Fixed typo: "Curicullum" -> "Curriculum"
    description: `Tujuan pendidikan dari Liquid Curriculum adalah mencapai stabilisasi
      moral, mental, dan produktifitas lebih cepat.
      Siapapun yang mendambakan lahirnya generasi impian, baik anda
      adalah seorang guru maupun orang tua, Liquid Curriculum adalah
      jawabannya. InsyaAllah`,
    author: "Ustadz Purwanto Abdul Ghaffar",
    publisher: "Bintang Semesta Media",
    categories: ["Pendidikan", "Parenting", "Islami"],
    pageCount: "x + 326",
    language: "Indonesia",
    dimensions: "14 x 20",
    isbn: "978-623-129-470-8",
    series: "Karya Independen",
    images: ["img/LC/cover.jpg", "img/LC/b-cover.jpg","img/LC/1.jpg","img/LC/2.jpg"],
    linkid: "https://gsiofficial.xyz/gsiofficial/rYM9yVK",
    linkshopee: "https://shopee.co.id/Liquid-Curicullum-Kurikulum-untuk-Sekolah-Impian-yang-Akan-Menghasilkan-Generasi-Impian-i.1344216734.28786791996",
    harga: 187000
  },
  {
    id: "book-2",
    title: "Islamic Technology Mindset Installation",
    description: `ITMI adalah bagian
      dari Liquid Curriculum yang memiliki dua fungsi utama.

      Fungsi ITMI yang pertama adalah sebagai metode preventif & kuratif
      untuk mudhorotnya teknologi, seperti nomophobia, narkolema, game
      addiction, dsb.

      Fungsi kedua dari ITMI adalah sebagai metode belajar mapel IT yang
      efektif, lebih cepat, sebab menggunakan strategi ajar yang unik`,
    author: "Ustadz Purwanto Abdul Ghaffar",
    publisher: "Bintang Semesta Media",
    categories: ["Agama Islam", "Teknologi"],
    pageCount: "xii + 311",
    language: "Indonesia",
    dimensions: "14 x 20",
    isbn: "978-623-129-458-6",
    series: "Seri Teknologi Islami",
    images: ["img/ITMI/cover.jpg", "img/ITMI/b-cover.jpg","img/ITMI/1.jpg","img/ITMI/2.jpg", "img/ITMI/3.jpg", "img/ITMI/4.jpg", "img/ITMI/5.jpg"],
    linkid: "https://gsiofficial.xyz/gsiofficial/aYgaVW1",
    linkshopee: "https://shopee.co.id/Islamic-Technology-Mindset-Installation-(ITMI)-i.1344216734.42701668117",
    harga: 181000
  },
  {
    id: "book-3",
    title: "Sejarah Teknologi",
    description: `Buku ini adalah buku tentang sejarah teknologi yang jujur, di dalam buku ini
      dijabarkan tentang keterlibatan kaum muslimin dalam mempelopori
      kebangkitan teknologi.

      Bagaimana ilmuwan muslim menjaga dan memelihara khazanah keilmuan
      peradaban peradaban hebat di masa lalu, seperti Yunani, Persia, bahkan
      China. Bagaimana ilmuwan muslim meneruskan penelitian mereka dengan
      berpandu dengan Al-Quran yang hasilnya adalah penemuan-penemuan
      yang orisinil.

      Buku ini juga menjelaskan bagaimana peradaban keilmuan itu bisa runtuh
      dan berpindah ke barat. Semua isi buku ini insya Allah akan membangkitkan
      semangat dan gairah pemuda muslim untuk kembali bangkit dan kembali
      mendekati teknologi`,
    author: "Ustadz Purwanto Abdul Ghaffar",
    publisher: "Bintang Semesta Media",
    categories: ["Agama Islam", "Sejarah", "Teknologi"],
    pageCount: "x + 156",
    language: "Indonesia",
    dimensions: "14 x 20",
    isbn: "978-623-129-466-1",
    series: "Seri Teknologi Islami",
    images: ["img/ST/cover.jpg", "img/ST/b-cover.jpg", "img/ST/1.jpg","img/ST/2.jpg", "img/ST/3.jpg", "img/ST/4.jpg"],
    linkid: "https://gsiofficial.xyz/gsiofficial/glPZKz9",
    linkshopee: "https://shopee.co.id/Seri-Teknologi-Islami-Sejarah-Teknologi-dari-Perspektif-Kaum-Muslim-i.1344216734.40751654113",
    harga: 121000
  },
  {
    id: "book-4",
    title: "Mental Belajar Teknologi",
    description: `Teknologi bagaikan kotak pandora, di dalamnya terdapat keburukan dan
      manfaat.

      Menghindari teknologi sudah tak mungkin! Yang logis adalah menyiapkan
      anak dan siswa kita agar dia punya mental yang tangguh untuk mampu
      menjauhi keburukan teknologi dan punya mental yang tangguh untuk
      hanya fokus kepada manfaatnya serta punya mental yang produktif
      bahkan monetitatif dalam berteknologi.

      Buku ini menjadi penting bagi pendidik (orang tua dan guru) karena di
      dalamnya terdapat langkah demi langkah untuk membangun "mental-
      mental berteknologi" tersebut.`,
    author: "Ustadz Purwanto Abdul Ghaffar",
    publisher: "Bintang Semesta Media",
    categories: ["Agama Islam", "Teknologi"],
    pageCount: "x + 114",
    language: "Indonesia",
    dimensions: "14 x 20",
    isbn: "978-623-129-460-9",
    series: "Seri Teknologi Islami",
    images: ["img/BT/cover.jpg", "img/BT/b-cover.jpg", "img/BT/1.jpg","img/BT/2.jpg"],
    linkid: "https://gsiofficial.xyz/gsiofficial/9QGJL29",
    linkshopee: "https://shopee.co.id/Seri-Teknologi-Islam-Mental-Belajar-i.1344216734.42801659863",
    harga: 105000
  },
  {
    id: "book-5",
    title: "IT DENGAN PROYEK FESTIVAL",
    description: `Efektivitas pembelajaran IT tidak akan sempurna tanpa jam dan strategi
      praktik yang baik.

      Pembelajaran yang disertai dengan praktik lebih efektif dengan
      persentase keberhasilan yang lebih tinggi (85%) dibandingkan dengan
      pembelajaran melalui teori saja (55%).

      Buku ini membahas tentang bagaimana menjalankan strategi
      pembelajaran berbasis project. Buku ini juga membahas tentang
      peningkatan kualitas guru agar mampu menciptakan dan mengawal
      proyek-proyek di mapel IT`,
    author: "Ustadz Purwanto Abdul Ghaffar",
    publisher: "Bintang Semesta Media",
    categories: ["Agama Islam", "Teknologi"],
    pageCount: "x + 114",
    language: "Indonesia",
    dimensions: "14 x 20",
    isbn: "978-623-129-460-9",
    series: "Seri Teknologi Islami",
    images: ["img/IT-PF/cover.jpg", "img/IT-PF/b-cover.jpg", "img/IT-PF/1.jpg","img/IT-PF/2.jpg"],
    linkid: "https://gsiofficial.xyz/gsiofficial/ep5AkLv",
    linkshopee: "https://shopee.co.id/Seri-Teknologi-Islami-IT-dengan-Proyek-Festival-i.1344216734.43501664649",
    harga: 121000
  },
  {
    id: "book-6",
    title: "IT BERORIENTASI PRODUKTIF",
    description: `Jaman sudah berubah, portofolio menjadi 
      lebih penting daripada ijazah.

      Perusahaan zaman sekarang lebih sering 
      bertanya, "Berapa perangkat lunak yang 
      pernah Anda buat?", "Anda sudah terlibat 
      dalam berapa proyek?" 

      Oleh karena itu, mari kita dorong anak dan 
      siswa kita untuk mencari ide, untuk 
      mengerjakan proyek dan menciptakan atau 
      membuat produk.

      Buku ini memandu guru dan orangtua untuk 
      menuntun tahap demi tahap agar anak dan 
      siswa kita belajar IT secara produktif.`,
    author: "Ustadz Purwanto Abdul Ghaffar",
    publisher: "Bintang Semesta Media",
    categories: ["Agama Islam", "Teknologi"],
    pageCount: "x + 114",
    language: "Indonesia",
    dimensions: "14 x 20",
    isbn: "978-623-129-460-9",
    series: "Seri Teknologi Islami",
    images: ["img/IT-BP/cover.jpg", "img/IT-BP/b-cover.jpg", "img/IT-BP/1.jpg","img/IT-BP/2.jpg"],
    linkid: "https://gsiofficial.xyz/gsiofficial/oPNVqAV",
    linkshopee: "https://shopee.co.id/Seri-Teknologi-Islami-IT-Berorientasi-Produktif-i.1344216734.41351680050",
    harga: 93000
  },
  {
    id: "book-7",
    title: "IT BERORIENTASI MONETITATIF",
    description: `Keahlian teknologi menjadi salah satu kunci 
      utama untuk meraih kesuksesan finansial.

      Monetisasi harus menjadi target 
      pembelajaran, sehingga pelajar di bidang IT 
      selalu berpikir tentang bagaimana cara 
      menghasilkan pendapatan dari teknologi.

      Buku ini mengarahkan anak dan siswa kita 
      untuk bercita-cita menjadi seorang 
      technopreneur, yaitu wirausaha berbasis 
      teknologi, dengan cara mencipta dan 
      membuat suatu produk dan berlatih untuk 
      memonetisasinya.`,
    author: "Ustadz Purwanto Abdul Ghaffar",
    publisher: "Bintang Semesta Media",
    categories: ["Agama Islam", "Teknologi"],
    pageCount: "x + 114",
    language: "Indonesia",
    dimensions: "14 x 20",
    isbn: "978-623-129-460-9",
    series: "Seri Teknologi Islami",
    images: ["img/IT-BM/cover.jpg", "img/IT-BM/b-cover.jpg", "img/IT-BM/1.jpg","img/IT-BM/2.jpg", "img/IT-BM/3.jpg"],
    linkid: "https://gsiofficial.xyz/gsiofficial/xQAKrGZ",
    linkshopee: "https://shopee.co.id/Seri-Teknologi-Islami-IT-Berorientasi-Monetitatif-i.1344216734.43551675445",
    harga: 117000
  },
  {
    id: "book-8",
    title: "Paket 1",
    description: `Paket komplit berisi 7 buku + Akses Video Tutorial:
      1. Liquid Curicullum
      2. Islamic Technology Mindset Installation (ITMI)
      3. Sejarah Teknologi dari Perspektif Kaum Muslimin
      4. Mental Belajar Teknologi
      5. IT dengan Proyek Festival
      6. IT Berorientasi Produktif
      7. IT Berorientasi Monetitatif
      
      Plus: Akses eksklusif video tutorial pendamping
      
      Paket ini cocok untuk:
      - Lembaga pendidikan/pesantren
      - Guru/dosen teknologi
      - Keluarga muslim yang ingin membangun mindset teknologi Islami
      - Praktisi teknologi muslim`,
    author: "Ustadz Purwanto Abdul Ghaffar",
    publisher: "Bintang Semesta Media",
    categories: ["Paket", "Teknologi Islam", "Bundle", "Kitab"],
    pageCount: "Complete Set",
    language: "Bahasa Indonesia",
    dimensions: "Paket Lengkap",
    isbn: "-",
    series: "Seri Teknologi Islami (Complete Bundle)",
    images: ["img/paket1.png"],
    linkid: "https://gsiofficial.xyz/gsiofficial/67ejrz6xdwgp",
    linkshopee: "https://shopee.co.id/Paket-Lengkap-7-Buku-Teknologi-Islami",
    harga: 914000, // Harga khusus paket (lebih hemat dari beli satuan)
    isBundle: true,
    bundleContents: [
      "book-1",
      "book-2", 
      "book-3",
      "book-4",
      "book-5",
      "book-6",
      "book-7"
    ],
    bonus: "Akses Video Tutorial Eksklusif"
  }
];

// Utility functions
const Utils = {
  // Get parameter from URL
  getUrlParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  },

  // Format price to Indonesian currency
  formatPrice(price) {
    return `Rp${parseInt(price).toLocaleString('id-ID')}`;
  },

  // Create safe HTML string (basic XSS prevention)
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  // Update URL without page reload
  updateUrl(bookId, ref = null) {
    const url = new URL(window.location);
    url.searchParams.set('id', bookId);
    if (ref) url.searchParams.set('ref', ref);
    window.history.pushState({}, '', url);
  }
};

// Book operations
const BookOperations = {
  // Find book by ID
  findById(id) {
    return books.find(book => book.id === id);
  },

  // Get book index
  getIndex(bookId) {
    return books.findIndex(book => book.id === bookId);
  },

  // Get navigation books
  getNavigationBooks(currentBookId) {
    const currentIndex = this.getIndex(currentBookId);
    return {
      prev: currentIndex > 0 ? books[currentIndex - 1] : null,
      next: currentIndex < books.length - 1 ? books[currentIndex + 1] : null
    };
  }
};

// UI Components
const UIComponents = {
  // Create category badges
  createCategoryBadges(categories) {
    return categories.map(category =>
      `<span class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-2 mb-2">
        ${Utils.escapeHtml(category)}
      </span>`
    ).join('');
  },

  // Create thumbnail images
  createThumbnails(images, bookTitle) {
    return images.map((image, index) =>
      `<img src="${image}" 
            alt="${Utils.escapeHtml(bookTitle)} - Image ${index + 1}" 
            class="w-16 h-20 object-cover border-2 cursor-pointer transition-all duration-200 hover:opacity-80 ${
              index === 0 ? 'border-blue-500' : 'border-gray-200 hover:border-blue-300'
            }" 
            onclick="ImageGallery.changeMainImage('${image}', this)"
            role="button"
            tabindex="0"
            onkeypress="if(event.key==='Enter') ImageGallery.changeMainImage('${image}', this)">`
    ).join('');
  },

  // Create order buttons
// Create order buttons
createOrderButtons(book, hasRef) {
  const buttons = [];
  
  // Check if URL has 'ref' parameter
  const urlParams = new URLSearchParams(window.location.search);
  const hasRefParam = urlParams.has('ref');

  // If URL has 'ref' parameter, only show "Pesan Sekarang" button
  if (hasRefParam) {
    buttons.push(`
      <button type="button"
              class="wa-button w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500" 
              data-book="${Utils.escapeHtml(book.title)}"
              data-price="${book.harga}">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z">
          </path>
        </svg>
        Pesan Sekarang
      </button>
    `);
  } else {
    // If no 'ref' parameter, show all 3 buttons as usual
    
    // Main order button (ID link)
    if (book.linkid) {
      buttons.push(`
        <a href="${book.linkid}" 
           target="_blank"
           rel="noopener noreferrer"
           class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-green-500">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z">
            </path>
          </svg>
          Pesan di Lynk.id
        </a>
      `);
    }

    // Shopee button
    if (book.linkshopee) {
      buttons.push(`
        <a href="${book.linkshopee}" 
           target="_blank"
           rel="noopener noreferrer"
           class="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-orange-500">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z">
            </path>
          </svg>
          Beli di Shopee
        </a>
      `);
    }

    // Pesan Sekarang button (always show when no ref)
    buttons.push(`
      <button type="button"
              class="wa-button w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500" 
              data-book="${Utils.escapeHtml(book.title)}"
              data-price="${book.harga}">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z">
          </path>
        </svg>
        Pesan Sekarang
      </button>
    `);
  }

  return `<div class="mt-4 flex flex-col gap-3">${buttons.join('')}</div>`;
},
  // Create navigation buttons
  createNavigationButtons(prevBook, nextBook, ref) {
    const buttons = [];
    const refParam = ref ? `&ref=${encodeURIComponent(ref)}` : '';

    if (prevBook) {
      buttons.push(`
        <button type="button" 
                id="prevBookBtn" 
                class="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-6 rounded transition duration-200 flex items-center focus:outline-none focus:ring-2 focus:ring-gray-500"
                data-book-id="${prevBook.id}">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          Sebelumnya
        </button>
      `);
    }

    if (nextBook) {
      buttons.push(`
        <button type="button" 
                id="nextBookBtn" 
                class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded transition duration-200 flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                data-book-id="${nextBook.id}">
          Berikutnya
          <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
      `);
    }

    return buttons.length > 0 ? 
      `<div class="mt-8 flex gap-4">${buttons.join('')}</div>` : '';
  },

  // Create book details grid
  createBookDetailsGrid(book) {
    const details = [
      { label: 'Publisher', value: book.publisher },
      { label: 'Page Count', value: book.pageCount },
      { label: 'Language', value: book.language },
      { label: 'Dimensions', value: book.dimensions },
      { label: 'ISBN', value: book.isbn },
      { label: 'Series', value: book.series }
    ];

    return details.map(detail => `
      <div class="flex flex-col">
        <span class="text-sm text-gray-500">${detail.label}</span>
        <span class="font-medium text-gray-800">${Utils.escapeHtml(detail.value)}</span>
      </div>
    `).join('');
  }
};

// Image gallery functionality
const ImageGallery = {
  changeMainImage(src, element) {
    try {
      const mainImage = document.getElementById('mainBookImage');
      if (!mainImage) {
        console.error('Main image element not found');
        return;
      }

      // Update main image
      mainImage.src = src;

      // Update active thumbnail
      const thumbnailContainer = element.parentElement;
      if (thumbnailContainer) {
        const thumbnails = thumbnailContainer.querySelectorAll('img');
        thumbnails.forEach(thumb => {
          thumb.classList.remove('border-blue-500');
          thumb.classList.add('border-gray-200');
        });

        element.classList.remove('border-gray-200');
        element.classList.add('border-blue-500');
      }
    } catch (error) {
      console.error('Error changing main image:', error);
    }
  }
};

// Event handlers
const EventHandlers = {
  // Setup navigation button events
  setupNavigationEvents(ref) {
    const prevBtn = document.getElementById('prevBookBtn');
    const nextBtn = document.getElementById('nextBookBtn');

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        const bookId = e.currentTarget.dataset.bookId;
        if (bookId) {
          window.location.href = `detailbuku.html?id=${bookId}${ref ? `&ref=${ref}` : ''}`;
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        const bookId = e.currentTarget.dataset.bookId;
        if (bookId) {
          window.location.href = `detailbuku.html?id=${bookId}${ref ? `&ref=${ref}` : ''}`;
        }
      });
    }
  },

  // Setup WhatsApp button events
 setupWhatsAppEvents(ref) {
  const waButtons = document.querySelectorAll('.wa-button');
  waButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();

      const bookTitle = button.dataset.book || 'Tanpa Judul';
      const price = button.dataset.price || '0';

      const params = new URLSearchParams({
        book_title: bookTitle,
        price: price
      });

      // Add ref parameter only if it exists
      if (ref) {
        params.set('ref', ref);
      }

      window.location.href = `form_beli.html?${params.toString()}`;
    });
  });
}
};

// Main render function
function renderBookDetail(book) {
  const container = document.getElementById('bookDetailContainer');
  if (!container) {
    console.error('Book detail container not found');
    return;
  }

  if (!book) {
    container.innerHTML = `
      <div class="p-8 text-center">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Buku tidak ditemukan</h2>
        <p class="text-gray-600 mb-4">Maaf, buku yang Anda cari tidak dapat ditemukan.</p>
        <a href="index.html" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-200">
          Kembali ke Beranda
        </a>
      </div>
    `;
    return;
  }

  try {
    const ref = Utils.getUrlParam('ref');
    const navigation = BookOperations.getNavigationBooks(book.id);
    const mainImage = book.images && book.images.length > 0 ? book.images[0] : '/api/placeholder/300/450';

    container.innerHTML = `
      <div class="max-w-6xl mx-auto p-4 bg-white rounded-lg shadow-lg">
        <div class="flex flex-col md:flex-row gap-8">
          <!-- Image and Thumbnails Column -->
          <div class="flex flex-col w-full md:w-1/3">
            <div class="mb-4">
              <img src="${mainImage}" 
                   alt="${Utils.escapeHtml(book.title)}" 
                   class="w-full h-auto object-cover rounded-lg shadow-md" 
                   id="mainBookImage"
                   onerror="this.src='/api/placeholder/300/450'">
            </div>
            <div class="flex flex-wrap gap-2 justify-center mb-4">
              ${UIComponents.createThumbnails(book.images, book.title)}
            </div>
            ${UIComponents.createOrderButtons(book, !!ref)}
          </div>

          <!-- Book Details Column -->
          <div class="w-full md:w-2/3">
            <h1 class="text-3xl font-bold text-gray-900 mb-2">${Utils.escapeHtml(book.title)}</h1>
            <h2 class="text-xl text-gray-700 mb-1">by ${Utils.escapeHtml(book.author)}</h2>
            
            <!-- Book Price -->
            <div class="text-2xl text-green-600 font-semibold mb-4">
              ${Utils.formatPrice(book.harga)}
            </div>

            <div class="text-gray-600 mb-6 leading-relaxed whitespace-pre-line">${Utils.escapeHtml(book.description)}</div>

            <div class="bg-gray-50 p-4 rounded-lg mb-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-y-4">
                ${UIComponents.createBookDetailsGrid(book)}
              </div>
            </div>

            <div class="mb-6">
              <h3 class="text-sm text-gray-500 mb-2">Categories</h3>
              <div class="flex flex-wrap">
                ${UIComponents.createCategoryBadges(book.categories)}
              </div>
            </div>

            ${UIComponents.createNavigationButtons(navigation.prev, navigation.next, ref)}
          </div>
        </div>
      </div>
    `;

    // Setup event listeners
    EventHandlers.setupNavigationEvents(ref);
    EventHandlers.setupWhatsAppEvents(ref);

  } catch (error) {
    console.error('Error rendering book detail:', error);
    container.innerHTML = `
      <div class="p-8 text-center">
        <h2 class="text-2xl font-bold text-red-600 mb-4">Terjadi Kesalahan</h2>
        <p class="text-gray-600 mb-4">Maaf, terjadi kesalahan saat memuat detail buku.</p>
        <button onclick="window.location.reload()" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-200">
          Muat Ulang
        </button>
      </div>
    `;
  }
}

// Initialize application
function initializeApp() {
  try {
    const bookId = Utils.getUrlParam('id');
    if (!bookId) {
      console.error('No book ID provided in URL');
      return;
    }

    const book = BookOperations.findById(bookId);
    renderBookDetail(book);

    // Update page title if book found
    if (book) {
      document.title = `${book.title} - Detail Buku`;
    }

  } catch (error) {
    console.error('Error initializing app:', error);
  }
}

// Make functions available globally for onclick handlers
window.ImageGallery = ImageGallery;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);

// Handle browser back/forward buttons
window.addEventListener('popstate', () => {
  initializeApp();
});