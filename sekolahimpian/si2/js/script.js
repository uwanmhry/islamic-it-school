document.addEventListener('DOMContentLoaded', function() {
  // Inisialisasi AOS dengan konfigurasi yang tepat
  AOS.init({
    duration: 800,
    easing: 'ease-out-quad',
    once: true,
    mirror: false,
    offset: 100,
    throttleDelay: 99,
    disable: false // Pastikan AOS selalu aktif
  });
  
  // Progress bar
  const progressBar = document.getElementById('progressBar');
  
  // Navigation dots
  const navDots = document.getElementById('navDots');
  const scrollIndicator = document.getElementById('scrollIndicator');
  const scrollToTop = document.getElementById('scrollToTop');
  const daftarButton = document.getElementById('daftarButton');
  
  const stacks = document.querySelectorAll('.image-stack');
  const totalStacks = stacks.length;
  
  // Create navigation dots
  for (let i = 0; i < totalStacks; i++) {
    const dot = document.createElement('div');
    dot.className = 'dot';
    dot.dataset.index = i;
    dot.addEventListener('click', () => {
      scrollToStack(i);
    });
    navDots.appendChild(dot);
  }
  
  // Debounce function untuk meningkatkan performa scroll
  function debounce(func, wait, immediate) {
    let timeout;
    return function() {
      const context = this, args = arguments;
      const later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }
  
  // Update progress bar and navigation
  const updateProgress = debounce(function() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const scrolled = window.scrollY;
    const scrollPercent = (scrolled / documentHeight) * 100;
    
    progressBar.style.width = scrollPercent + '%';
    
    // Update active dot
    const dots = document.querySelectorAll('.dot');
    const stackPositions = Array.from(stacks).map(stack => {
      return stack.getBoundingClientRect().top + window.scrollY;
    });
    
    let activeIndex = 0;
    for (let i = 0; i < stackPositions.length; i++) {
      if (window.scrollY >= stackPositions[i] - windowHeight / 2) {
        activeIndex = i;
      }
    }
    
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === activeIndex);
    });
    
    // Show/hide scroll to top button
    if (window.scrollY > windowHeight) {
      scrollToTop.classList.add('visible');
      scrollIndicator.style.display = 'none';
    } else {
      scrollToTop.classList.remove('visible');
      scrollIndicator.style.display = 'block';
    }
  }, 10);
  
  // Scroll to specific stack
  function scrollToStack(index) {
    const targetStack = stacks[index];
    if (targetStack) {
      window.scrollTo({
        top: targetStack.offsetTop,
        behavior: 'smooth'
      });
    }
  }
  
  // Scroll to top function
  scrollToTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  // Event listeners dengan debounce
  window.addEventListener('scroll', updateProgress);
  window.addEventListener('resize', updateProgress);
  
  // Refresh AOS setelah semua gambar dimuat untuk memastikan animasi bekerja dengan benar
  window.addEventListener('load', function() {
    setTimeout(function() {
      AOS.refresh();
    }, 500);
  });
  
  // Initial update
  updateProgress();
});
