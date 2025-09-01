// Variabel global untuk slider
let currentSlide = 0;
let isMobileView = false;

// Fungsi untuk memuat logo universitas di grid desktop/tablet
function loadUniversityGrid() {
  const gridContainer = document.getElementById('university-grid');
  gridContainer.innerHTML = '';

  universityLogos.forEach((university, index) => {
    const card = createUniversityCard(university, index);
    gridContainer.appendChild(card);
  });
}

// Fungsi untuk memuat slider di mobile
function loadUniversitySlider() {
  const sliderTrack = document.getElementById('slider-track');
  const sliderNav = document.getElementById('slider-nav');
  
  sliderTrack.innerHTML = '';
  sliderNav.innerHTML = '';
  
  // Hitung jumlah slide yang diperlukan (8 logo per slide - 2x4)
  const slidesCount = Math.ceil(universityLogos.length / 8);
  
  // Buat slide
  for (let i = 0; i < slidesCount; i++) {
    const slide = document.createElement('div');
    slide.className = 'slider-item';
    
    // Tambahkan 8 logo ke dalam slide (2 kolom x 4 baris)
    for (let j = 0; j < 8; j++) {
      const index = i * 8 + j;
      if (index < universityLogos.length) {
        const card = createUniversityCard(universityLogos[index], index);
        slide.appendChild(card);
      }
    }
    
    sliderTrack.appendChild(slide);
    
    // Buat dot navigasi
    const dot = document.createElement('div');
    dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
    dot.dataset.slide = i;
    dot.addEventListener('click', () => goToSlide(i));
    sliderNav.appendChild(dot);
  }
  
  // Tambahkan event listeners untuk swipe
  setupSwipeEvents();
}

// Fungsi pembuat card universitas
function createUniversityCard(university, index) {
  const card = document.createElement('div');
  card.className = `university-card relative backdrop-blur-lg bg-white/20 rounded-2xl p-6 flex items-center justify-center shadow-xl border border-white/30`;
  card.style.animationDelay = `${index * 0.1}s`;

  const img = document.createElement('img');
  img.src = university.logo;
  img.alt = university.name;
  img.className = 'max-h-16 object-contain opacity-80 hover:opacity-100 transition-opacity duration-300 drop-shadow-md';

  const tooltip = document.createElement('div');
  tooltip.className = 'tooltip';
  tooltip.textContent = university.name;

  card.appendChild(img);
  card.appendChild(tooltip);

  return card;
}

// Fungsi untuk navigasi slider
function goToSlide(slideIndex) {
  const sliderTrack = document.getElementById('slider-track');
  const slides = document.querySelectorAll('.slider-item');
  const slidesCount = slides.length;
  
  if (slideIndex < 0) slideIndex = 0;
  if (slideIndex >= slidesCount) slideIndex = slidesCount - 1;
  
  currentSlide = slideIndex;
  const slideWidth = sliderTrack.offsetWidth;
  currentTranslate = -slideIndex * slideWidth;
  
  sliderTrack.style.transform = `translateX(${currentTranslate}px)`;
  
  // Update dot aktif
  document.querySelectorAll('.slider-dot').forEach((dot, index) => {
    dot.classList.toggle('active', index === currentSlide);
  });
}

// Setup event listeners untuk swipe
function setupSwipeEvents() {
  const sliderTrack = document.getElementById('slider-track');
  let startX, moveX, currentX = 0;
  
  sliderTrack.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  });
  
  sliderTrack.addEventListener('touchmove', (e) => {
    moveX = e.touches[0].clientX;
    const diff = moveX - startX;
    sliderTrack.style.transform = `translateX(calc(${currentX}px + ${diff}px))`;
  });
  
  sliderTrack.addEventListener('touchend', (e) => {
    const diff = moveX - startX;
    
    // Jika pergeseran cukup signifikan, pindah slide
    if (diff < -50) {
      goToSlide(currentSlide + 1);
    } else if (diff > 50) {
      goToSlide(currentSlide - 1);
    } else {
      // Kembali ke slide semula
      goToSlide(currentSlide);
    }
  });
}

// Fungsi untuk mengatur tampilan berdasarkan ukuran layar
function setupResponsiveView() {
  const gridContainer = document.getElementById('university-grid');
  const sliderContainer = document.getElementById('slider-container');
  
  if (window.innerWidth <= 425) {
    // Mode mobile
    if (!isMobileView) {
      isMobileView = true;
      gridContainer.style.display = 'none';
      sliderContainer.style.display = 'block';
      loadUniversitySlider();
    }
  } else {
    // Mode tablet/desktop
    if (isMobileView) {
      isMobileView = false;
      gridContainer.style.display = 'grid';
      sliderContainer.style.display = 'none';
      loadUniversityGrid();
    }
  }
}

// Jalankan setelah halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
  // Inisialisasi tampilan
  setupResponsiveView();
  
  // Handle resize event dengan debounce untuk performa
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      setupResponsiveView();
    }, 250);
  });
});