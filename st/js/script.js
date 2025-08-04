// Main gallery variables
let currentSlide = 0;
let lightboxCurrentSlide = 0;
const totalSlides = 4;
let currentMobileSlide = 0;
const images = [
    '/img/LC/cover.jpg',
    '/img/LC/b-cover.jpg',
    '/img/LC/1.jpg',
    '/img/LC/2.jpg'
];

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
    init();
    // Initialize first thumbnail as active
    const firstThumbnail = document.querySelector('[onclick^="changeMainImage"]');
    if (firstThumbnail) {
        firstThumbnail.classList.add('border-emerald-400', 'scale-105');
        firstThumbnail.classList.remove('border-transparent');
    }
});

// Initialize page
function init() {
    setupEventListeners();
    setupScrollEffects();
    updateActiveDot();
    updateCardSizing();
}

// Calculate card width based on screen size
function updateCardSizing() {
    const gallery = document.getElementById("book-gallery");
    if (!gallery) return;
    
    const containerWidth = gallery.parentElement.offsetWidth;
    let cardWidth;
    
    // Responsive card sizing
    if (window.innerWidth < 768) { // Mobile
        cardWidth = containerWidth - 32; // Full width minus padding
    } else if (window.innerWidth < 1024) { // Tablet
        cardWidth = Math.floor(containerWidth / 2) - 16; // 2 cards
    } else { // Desktop
        cardWidth = Math.floor(containerWidth / 3) - 16; // 3 cards
    }
    
    // Update CSS custom property for responsive design
    document.documentElement.style.setProperty('--card-width', cardWidth + 'px');
}

// Thumbnail functionality
function changeMainImage(src, element) {
    document.getElementById('main-image').src = src;
    
    // Remove active class from all thumbnails
    document.querySelectorAll('[onclick^="changeMainImage"]').forEach(thumb => {
        thumb.classList.remove('border-emerald-400', 'scale-105');
        thumb.classList.add('border-transparent');
    });
    
    // Add active class to clicked thumbnail
    if (element) {
        element.classList.add('border-emerald-400', 'scale-105');
        element.classList.remove('border-transparent');
    }
    
    // Update current slide index based on image
    const index = images.indexOf(src);
    if (index !== -1) {
        currentSlide = index;
        updateActiveDot();
    }
}

// Main gallery functions
function scrollGallery(direction) {
    const gallery = document.getElementById("book-gallery");
    if (!gallery) return;
    
    // Get actual card width including gap based on screen size
    let cardWidth;
    if (window.innerWidth < 768) { // Mobile - 1 card
        cardWidth = gallery.children[0].offsetWidth;
    } else if (window.innerWidth < 1024) { // Tablet - 2 cards
        cardWidth = gallery.children[0].offsetWidth + 16;
    } else { // Desktop - 3 cards  
        cardWidth = gallery.children[0].offsetWidth + 16;
    }
    
    const scrollAmount = cardWidth * direction;
    
    gallery.scrollBy({ 
        left: scrollAmount, 
        behavior: "smooth" 
    });

    // Update current slide based on scroll position
    setTimeout(() => {
        updateCurrentSlideFromScroll();
        updateActiveDot();
    }, 300);
}

function goToSlide(index) {
    const gallery = document.getElementById("book-gallery");
    if (!gallery || index < 0 || index >= totalSlides) return;
    
    const slide = gallery.children[index];
    if (slide) {
        slide.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center",
        });
        currentSlide = index;
        updateActiveDot();
    }
}

function updateCurrentSlideFromScroll() {
    const gallery = document.getElementById("book-gallery");
    if (!gallery) return;
    
    const scrollPosition = gallery.scrollLeft;
    let cardWidth;
    
    // Calculate card width based on screen size
    if (window.innerWidth < 768) { // Mobile - 1 card
        cardWidth = gallery.children[0].offsetWidth;
    } else if (window.innerWidth < 1024) { // Tablet - 2 cards
        cardWidth = gallery.children[0].offsetWidth + 16;
    } else { // Desktop - 3 cards
        cardWidth = gallery.children[0].offsetWidth + 16;
    }
    
    currentSlide = Math.round(scrollPosition / cardWidth);
    
    // Ensure currentSlide is within bounds
    currentSlide = Math.max(0, Math.min(currentSlide, totalSlides - 1));
}

function updateActiveDot() {
    const dots = document.querySelectorAll("#gallery-dots button");
    dots.forEach((dot, index) => {
        const isActive = index === currentSlide;
        
        if (isActive) {
            dot.classList.remove("bg-gray-300");
            dot.classList.add("bg-emerald-500", "scale-125");
        } else {
            dot.classList.add("bg-gray-300");
            dot.classList.remove("bg-emerald-500", "scale-125");
        }
    });
}

// Lightbox functions
function openLightbox(index) {
    const lightbox = document.getElementById("lightbox");
    if (!lightbox) return;
    
    lightboxCurrentSlide = index;
    updateLightboxSlider();
    updateLightboxDots();
    
    // Show lightbox
    lightbox.classList.remove("hidden");
    lightbox.classList.add("flex");
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    
    // Focus trap for accessibility
    lightbox.focus();
}

function closeLightbox() {
    const lightbox = document.getElementById("lightbox");
    if (!lightbox) return;
    
    lightbox.classList.add("hidden");
    lightbox.classList.remove("flex");
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";
}

function lightboxPrev() {
    lightboxCurrentSlide = (lightboxCurrentSlide - 1 + totalSlides) % totalSlides;
    updateLightboxSlider();
    updateLightboxDots();
}

function lightboxNext() {
    lightboxCurrentSlide = (lightboxCurrentSlide + 1) % totalSlides;
    updateLightboxSlider();
    updateLightboxDots();
}

function lightboxGoToSlide(index) {
    if (index < 0 || index >= totalSlides) return;
    
    lightboxCurrentSlide = index;
    updateLightboxSlider();
    updateLightboxDots();
}

function updateLightboxSlider() {
    const lightboxSlider = document.getElementById("lightbox-slider");
    if (!lightboxSlider) return;
    
    const offset = -lightboxCurrentSlide * 100;
    lightboxSlider.style.transform = `translateX(${offset}%)`;
}

function updateLightboxDots() {
    const dots = document.querySelectorAll("#lightbox-dots button");
    dots.forEach((dot, index) => {
        const isActive = index === lightboxCurrentSlide;
        
        if (isActive) {
            dot.classList.remove("bg-gray-300");
            dot.classList.add("bg-emerald-500", "scale-125");
        } else {
            dot.classList.add("bg-gray-300");
            dot.classList.remove("bg-emerald-500", "scale-125");
        }
    });
}

// Mobile Lightbox functions
function openLightboxMobile(index) {
    currentMobileSlide = index;
    const mobileLightbox = document.getElementById("mobile-lightbox");
    if (!mobileLightbox) return;
    
    mobileLightbox.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    updateMobileLightbox();
}

function closeLightboxMobile() {
    const mobileLightbox = document.getElementById("mobile-lightbox");
    if (!mobileLightbox) return;
    
    mobileLightbox.classList.add("hidden");
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
}

function lightboxMobilePrev() {
    currentMobileSlide = (currentMobileSlide - 1 + images.length) % images.length;
    updateMobileLightbox();
}

function lightboxMobileNext() {
    currentMobileSlide = (currentMobileSlide + 1) % images.length;
    updateMobileLightbox();
}

function lightboxMobileGoToSlide(index) {
    currentMobileSlide = index;
    updateMobileLightbox();
}

function updateMobileLightbox() {
    const mobileLightboxSlider = document.getElementById("mobile-lightbox-slider");
    if (!mobileLightboxSlider) return;
    
    mobileLightboxSlider.style.transform = `translateX(-${currentMobileSlide * 100}%)`;
    
    // Update dots
    const mobileLightboxDots = document.querySelectorAll('#mobile-lightbox [data-slide]');
    mobileLightboxDots.forEach((dot, index) => {
        dot.classList.toggle('bg-emerald-500', index === currentMobileSlide);
        dot.classList.toggle('bg-gray-300', index !== currentMobileSlide);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Gallery scroll listener
    const gallery = document.getElementById("book-gallery");
    if (gallery) {
        gallery.addEventListener("scroll", function() {
            updateCurrentSlideFromScroll();
            updateActiveDot();
        });
    }

    // Lightbox click outside to close
    const lightbox = document.getElementById("lightbox");
    if (lightbox) {
        lightbox.addEventListener("click", function(e) {
            if (e.target === this) {
                closeLightbox();
            }
        });
    }

    // Mobile lightbox click outside to close
    const mobileLightbox = document.getElementById("mobile-lightbox");
    if (mobileLightbox) {
        mobileLightbox.addEventListener("click", function(e) {
            if (e.target === this) {
                closeLightboxMobile();
            }
        });
    }

    // Keyboard navigation
    document.addEventListener("keydown", function(e) {
        const lightbox = document.getElementById("lightbox");
        const mobileLightbox = document.getElementById("mobile-lightbox");
        
        if (lightbox && !lightbox.classList.contains("hidden")) {
            switch(e.key) {
                case "Escape":
                    closeLightbox();
                    break;
                case "ArrowLeft":
                    e.preventDefault();
                    lightboxPrev();
                    break;
                case "ArrowRight":
                    e.preventDefault();
                    lightboxNext();
                    break;
            }
        }
        
        if (mobileLightbox && !mobileLightbox.classList.contains("hidden")) {
            switch(e.key) {
                case "Escape":
                    closeLightboxMobile();
                    break;
                case "ArrowLeft":
                    e.preventDefault();
                    lightboxMobilePrev();
                    break;
                case "ArrowRight":
                    e.preventDefault();
                    lightboxMobileNext();
                    break;
            }
        }
    });

    // Touch events for mobile swipe
    const mobileLightboxSlider = document.getElementById("mobile-lightbox-slider");
    if (mobileLightboxSlider) {
        let touchStartX = 0;
        let touchEndX = 0;

        mobileLightboxSlider.addEventListener("touchstart", (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        mobileLightboxSlider.addEventListener("touchend", (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleMobileSwipe();
        }, { passive: true });

        function handleMobileSwipe() {
            const threshold = 50;
            const swipeDistance = touchStartX - touchEndX;
            
            if (Math.abs(swipeDistance) > threshold) {
                if (swipeDistance > 0) {
                    lightboxMobileNext();
                } else {
                    lightboxMobilePrev();
                }
            }
        }
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute("href"));
            if (target) {
                target.scrollIntoView({ behavior: "smooth" });
            }
        });
    });

    // Resize listener
    window.addEventListener("resize", function() {
        updateCardSizing();
        // Update current slide on resize
        updateCurrentSlideFromScroll();
        updateActiveDot();
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
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all fade-in elements
    document.querySelectorAll(".fade-in-element").forEach((el) => {
        observer.observe(el);
    });
}

document.addEventListener(
"DOMContentLoaded",
function () {
    const urlParams = new URLSearchParams(
    window.location.search
    );
    const ref = urlParams.get("ref");
    const button = document.getElementById("pesanButton");

    if (ref) {
    button.href += "&ref=" + encodeURIComponent(ref);
    }
}
);

// Check for ref parameter on page load
document.addEventListener("DOMContentLoaded", function () {
const urlParams = new URLSearchParams(
    window.location.search
);
if (urlParams.has("ref")) {
    // Hide all elements with the hidden-ref-button class
    document
    .querySelectorAll(".hidden-ref-button")
    .forEach((button) => {
        button.classList.add("hidden");
    });
}
});
