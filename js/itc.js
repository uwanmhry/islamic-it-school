 function showProgram(city) {
      // Hide all program sections
      document.getElementById('programs-bogor').classList.add('hidden');
      document.getElementById('programs-bandung').classList.add('hidden');
      
      // Remove active styles from all buttons
      document.getElementById('btn-bogor').className = 'px-6 py-3 rounded-xl font-bold text-lg transition-all text-gray-600 hover:bg-gray-100';
      document.getElementById('btn-bandung').className = 'px-6 py-3 rounded-xl font-bold text-lg transition-all text-gray-600 hover:bg-gray-100 ml-2';
      
      // Show selected program section and activate button
      if (city === 'bogor') {
        document.getElementById('programs-bogor').classList.remove('hidden');
        document.getElementById('btn-bogor').className = 'px-6 py-3 rounded-xl font-bold text-lg transition-all bg-green-500 text-white shadow-lg';
      } else if (city === 'bandung') {
        document.getElementById('programs-bandung').classList.remove('hidden');
        document.getElementById('btn-bandung').className = 'px-6 py-3 rounded-xl font-bold text-lg transition-all bg-blue-500 text-white shadow-lg ml-2';
      }
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });



      const scrollBtn = document.getElementById("scrollToTopBtn");

  // Tampilkan tombol jika scroll ke bawah
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      scrollBtn.classList.remove("hidden");
    } else {
      scrollBtn.classList.add("hidden");
    }
  });

  // Scroll ke atas saat tombol diklik
  scrollBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  
    // Add floating animation to emojis with random delays
    document.querySelectorAll('.floating-emoji').forEach((emoji, index) => {
      emoji.style.animationDelay = (Math.random() * 3) + 's';
    });