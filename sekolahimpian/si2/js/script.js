document.addEventListener('DOMContentLoaded', function () {
  // ==========================
  // AOS Initialization
  // ==========================
  AOS.init({
    duration: 800,
    easing: 'ease-out-quad',
    once: true,
    mirror: false,
    offset: 100,
    throttleDelay: 99,
    disable: false // AOS selalu aktif
  });

  // ==========================
  // Element References
  // ==========================
  const progressBar = document.getElementById('progressBar');
  const navDots = document.getElementById('navDots');
  const scrollIndicator = document.getElementById('scrollIndicator');
  const scrollToTop = document.getElementById('scrollToTop');
  const daftarButton = document.getElementById('daftarButton');
  const stacks = document.querySelectorAll('.image-stack');
  const totalStacks = stacks.length;

  // ==========================
  // Navigation Dots
  // ==========================
  for (let i = 0; i < totalStacks; i++) {
    const dot = document.createElement('div');
    dot.className = 'dot';
    dot.dataset.index = i;

    dot.addEventListener('click', () => {
      scrollToStack(i);
    });

    navDots.appendChild(dot);
  }

  // ==========================
  // Debounce Helper
  // ==========================
  function debounce(func, wait, immediate) {
    let timeout;

    return function () {
      const context = this, args = arguments;

      const later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };

      const callNow = immediate && !timeout;

      clearTimeout(timeout);
      timeout = setTimeout(later, wait);

      if (callNow) func.apply(context, args);
    };
  }

  // ==========================
  // Update Progress + Nav
  // ==========================
  const updateProgress = debounce(function () {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const scrolled = window.scrollY;
    const scrollPercent = (scrolled / documentHeight) * 100;

    // Update progress bar
    progressBar.style.width = scrollPercent + '%';

    // Update active dot
    const dots = document.querySelectorAll('.dot');
    const stackPositions = Array.from(stacks).map(stack =>
      stack.getBoundingClientRect().top + window.scrollY
    );

    let activeIndex = 0;
    for (let i = 0; i < stackPositions.length; i++) {
      if (window.scrollY >= stackPositions[i] - windowHeight / 2) {
        activeIndex = i;
      }
    }

    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === activeIndex);
    });

    // Show/hide scroll to top + indicator
    if (window.scrollY > windowHeight) {
      scrollToTop.classList.add('visible');
      scrollIndicator.style.display = 'none';
    } else {
      scrollToTop.classList.remove('visible');
      scrollIndicator.style.display = 'block';
    }
  }, 10);

  // ==========================
  // Scroll To Stack
  // ==========================
  function scrollToStack(index) {
    const targetStack = stacks[index];
    if (targetStack) {
      window.scrollTo({
        top: targetStack.offsetTop,
        behavior: 'smooth'
      });
    }
  }

  // ==========================
  // Scroll To Top Button
  // ==========================
  scrollToTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // ==========================
  // Event Listeners
  // ==========================
  window.addEventListener('scroll', updateProgress);
  window.addEventListener('resize', updateProgress);

  // Refresh AOS setelah semua gambar dimuat
  window.addEventListener('load', function () {
    setTimeout(function () {
      AOS.refresh();
    }, 500);
  });

  // Initial state
  updateProgress();
});

// ==========================
// Bottom Navbar
// ==========================
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', function (e) {
    const href = this.getAttribute('href');

    // Jalankan khusus untuk link dummy
    if (href === '#' || !href) {
      e.preventDefault();

      // Reset semua item
      document.querySelectorAll('.nav-item').forEach(el => {
        el.classList.remove('active');
      });

      // Set active
      this.classList.add('active');

      // Animasi feedback
      this.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.style.transform = '';
      }, 200);
    }
  });
});
