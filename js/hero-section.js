// Initialize Swiper
const bookThumbnails = new Swiper('.book-thumbnails', {
  slidesPerView: 'auto',
  spaceBetween: 8,
  centeredSlides: false,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  breakpoints: {
    640: {
      spaceBetween: 12,
      slidesPerView: 'auto',
      pagination: {
        enabled: false,
      }
    }
  }
});

// Current active book tracking
let currentActiveSlide = document.querySelector('.swiper-slide.active');

// Reset to first book
function resetToFirstBook() {
  // Set main book images
  document.getElementById('main-book-front').src = './img/7buku-seri-teknologi(2).png';
  document.getElementById('main-book-back').src = './img/7buku-seri-teknologi.png';
  
  // Reset flip state
  document.getElementById('flip-container').style.transform = 'rotateY(0deg)';
  
  // Update active class
  if (currentActiveSlide) {
    currentActiveSlide.classList.remove('active');
  }
  const firstSlide = document.querySelector('.swiper-slide');
  firstSlide.classList.add('active');
  currentActiveSlide = firstSlide;
}

// Change main book image
function changeMainBook(frontSrc, backSrc, clickedSlide) {
  // Set main book images
  document.getElementById('main-book-front').src = frontSrc;
  document.getElementById('main-book-back').src = backSrc;
  
  // Reset flip state
  document.getElementById('flip-container').style.transform = 'rotateY(0deg)';
  
  // Update active class
  if (currentActiveSlide) {
    currentActiveSlide.classList.remove('active');
  }
  clickedSlide.classList.add('active');
  currentActiveSlide = clickedSlide;
}

// Flip main book
function flipMainBook() {
  const flipContainer = document.getElementById('flip-container');
  flipContainer.style.transform = flipContainer.style.transform === 'rotateY(180deg)' ? 'rotateY(0deg)' : 'rotateY(180deg)';
}

// Add click event to main book for flipping
document.getElementById('flip-container').addEventListener('click', flipMainBook);

// ======================
// BOOK FLIP ANIMATION
// ======================
const flipContainer = document.getElementById("flip-container");
let isFlipped = false;
let flipInterval;

// Function to handle flipping
function toggleFlip() {
  isFlipped = !isFlipped;
  flipContainer.style.transform = isFlipped
    ? "rotateY(180deg)"
    : "rotateY(0deg)";
}

// Auto-flip every 3 seconds
function startAutoFlip() {
  flipInterval = setInterval(toggleFlip, 3000);
}

// Manual click interaction
flipContainer.addEventListener("click", function (e) {
  e.stopPropagation();
  clearInterval(flipInterval); // Pause auto-flip
  toggleFlip(); // Immediate flip
  setTimeout(startAutoFlip, 3000); // Resume after 3 seconds
});

// Start auto-flip on page load
startAutoFlip();

// Cleanup on page unload
window.addEventListener("beforeunload", function () {
  clearInterval(flipInterval);
});

// ======================
// BOOK THUMBNAIL SELECTION
// ======================
function resetToFirstBook() {
  // Reset to first book implementation
  document.getElementById('main-book-front').src = './img/7buku-seri-teknologi(2).png';
  document.getElementById('main-book-back').src = './img/7buku-seri-teknologi.png';
  
  // Update active state for thumbnails
  document.querySelectorAll('.swiper-slide').forEach(slide => {
    slide.classList.remove('active');
  });
  document.querySelector('.swiper-slide:first-child').classList.add('active');
}

function changeMainBook(frontSrc, backSrc, element) {
  // Change main book images
  document.getElementById('main-book-front').src = frontSrc;
  document.getElementById('main-book-back').src = backSrc;
  
  // Update active state for thumbnails
  document.querySelectorAll('.swiper-slide').forEach(slide => {
    slide.classList.remove('active');
  });
  element.classList.add('active');
  
  // Reset flip state
  isFlipped = false;
  flipContainer.style.transform = "rotateY(0deg)";
  clearInterval(flipInterval);
  startAutoFlip();
}