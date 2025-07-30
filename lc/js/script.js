// Main gallery variables
let currentSlide = 0;
const totalSlides = 4;
const gallery = document.getElementById("book-gallery");

// Calculate card width to show 3 at a time
function updateCardSizing() {
  const containerWidth = gallery.parentElement.offsetWidth;
  const cardWidth = Math.floor(containerWidth / 3) - 16; // minus gap
  gallery.style.gridAutoColumns = `${cardWidth}px`;
}

// Initialize and update on resize
updateCardSizing();
window.addEventListener("resize", updateCardSizing); // Lightbox variables
let lightboxCurrentSlide = 0;
const lightboxSlider = document.getElementById("lightbox-slider");

// Main gallery functions
function scrollGallery(direction) {
  const gallery = document.getElementById("book-gallery");
  const scrollAmount = gallery.offsetWidth * 0.8 * direction;
  gallery.scrollBy({ left: scrollAmount, behavior: "smooth" });

  setTimeout(() => {
    updateActiveDot();
  }, 300);
}

function goToSlide(index) {
  const gallery = document.getElementById("book-gallery");
  const slide = gallery.children[index];
  slide.scrollIntoView({
    behavior: "smooth",
    block: "nearest",
    inline: "center",
  });
  currentSlide = index;
  updateActiveDot();
}

function updateActiveDot() {
  const dots = document.querySelectorAll("#gallery-dots button");
  dots.forEach((dot, index) => {
    if (index === currentSlide) {
      dot.classList.remove("bg-gray-300");
      dot.classList.add("bg-emerald-500", "w-4");
    } else {
      dot.classList.add("bg-gray-300");
      dot.classList.remove("bg-emerald-500", "w-4");
    }
  });
}

// Lightbox functions
function openLightbox(index) {
  const lightbox = document.getElementById("lightbox");
  lightboxCurrentSlide = index;
  updateLightboxSlider();
  lightbox.classList.remove("hidden");
  document.body.style.overflow = "hidden";
  updateLightboxDots();
}

function closeLightbox() {
  const lightbox = document.getElementById("lightbox");
  lightbox.classList.add("hidden");
  document.body.style.overflow = "auto";
}

function lightboxPrev() {
  lightboxCurrentSlide =
    (lightboxCurrentSlide - 1 + totalSlides) % totalSlides;
  updateLightboxSlider();
  updateLightboxDots();
}

function lightboxNext() {
  lightboxCurrentSlide = (lightboxCurrentSlide + 1) % totalSlides;
  updateLightboxSlider();
  updateLightboxDots();
}

function lightboxGoToSlide(index) {
  lightboxCurrentSlide = index;
  updateLightboxSlider();
  updateLightboxDots();
}

function updateLightboxSlider() {
  const offset = -lightboxCurrentSlide * 100;
  lightboxSlider.style.transform = `translateX(${offset}%)`;
}

function updateLightboxDots() {
  const dots = document.querySelectorAll("#lightbox-dots button");
  dots.forEach((dot, index) => {
    if (index === lightboxCurrentSlide) {
      dot.classList.remove("bg-gray-300");
      dot.classList.add("bg-emerald-500", "w-4");
    } else {
      dot.classList.add("bg-gray-300");
      dot.classList.remove("bg-emerald-500", "w-4");
    }
  });
}

// Event listeners
document
  .getElementById("book-gallery")
  .addEventListener("scroll", function () {
    const gallery = this;
    const scrollPosition = gallery.scrollLeft;
    const slideWidth = gallery.children[0].offsetWidth;
    currentSlide = Math.round(scrollPosition / slideWidth);
    updateActiveDot();
  });

document
  .getElementById("lightbox")
  .addEventListener("click", function (e) {
    if (e.target === this) {
      closeLightbox();
    }
  });

document.addEventListener("keydown", function (e) {
  const lightbox = document.getElementById("lightbox");
  if (!lightbox.classList.contains("hidden")) {
    if (e.key === "Escape") {
      closeLightbox();
    } else if (e.key === "ArrowLeft") {
      lightboxPrev();
    } else if (e.key === "ArrowRight") {
      lightboxNext();
    }
  }
});

// Touch events for lightbox swipe
let touchStartX = 0;
let touchEndX = 0;

lightboxSlider.addEventListener(
  "touchstart",
  (e) => {
    touchStartX = e.changedTouches[0].screenX;
  },
  { passive: true }
);

lightboxSlider.addEventListener(
  "touchend",
  (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  },
  { passive: true }
);

function handleSwipe() {
  const threshold = 50;
  if (touchStartX - touchEndX > threshold) {
    lightboxNext();
  } else if (touchEndX - touchStartX > threshold) {
    lightboxPrev();
  }
}

// Initialize
updateActiveDot();

// Initialize page
function init() {
  setupEventListeners();
  setupScrollEffects();
}

// Setup event listeners
function setupEventListeners() {
  // Smooth scrolling
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
}

// Setup scroll effects
function setupScrollEffects() {
  // Intersection Observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // Observe all fade-in elements
  document.querySelectorAll(".fade-in-element").forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition =
      "opacity 0.8s ease-out, transform 0.8s ease-out";
    observer.observe(el);
  });
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", init);
