        // Mobile menu functionality
        document.addEventListener('DOMContentLoaded', function() {
            const mobileMenuButton = document.getElementById('mobile-menu-button');
            const mobileMenu = document.getElementById('mobile-menu');
            
            mobileMenuButton.addEventListener('click', function() {
                // Toggle hamburger animation
                mobileMenuButton.classList.toggle('active');
                
                // Toggle mobile menu
                mobileMenu.classList.toggle('active');
            });

            // Close mobile menu when clicking on menu links
            const mobileMenuLinks = mobileMenu.querySelectorAll('a');
            mobileMenuLinks.forEach(link => {
                link.addEventListener('click', function() {
                    mobileMenuButton.classList.remove('active');
                    mobileMenu.classList.remove('active');
                });
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', function(event) {
                const isClickInsideNav = event.target.closest('nav');
                if (!isClickInsideNav) {
                    mobileMenuButton.classList.remove('active');
                    mobileMenu.classList.remove('active');
                }
            });

            // Smooth scroll for navigation links
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

            // Add hover effects to floating elements
            const floatingElements = document.querySelectorAll('.floating-element');
            floatingElements.forEach(element => {
                element.addEventListener('mouseenter', function() {
                    this.style.animationPlayState = 'paused';
                    this.style.transform = 'translateY(-10px) scale(1.05)';
                });

                element.addEventListener('mouseleave', function() {
                    this.style.animationPlayState = 'running';
                    this.style.transform = '';
                });
            });

            // Parallax effect for background decorations
            window.addEventListener('scroll', function() {
                const scrolled = window.pageYOffset;
                const decorations = document.querySelectorAll('.bg-decoration');
                
                decorations.forEach((decoration, index) => {
                    const speed = 0.5 + (index * 0.1);
                    decoration.style.transform = `translateY(${scrolled * speed}px)`;
                });
            });

            // Mobile menu toggle and app download
            const getAppBtn = document.querySelector('button');
            if (getAppBtn && !getAppBtn.id) {
                getAppBtn.addEventListener('click', function() {
                    alert('App download coming soon!');
                });
            }
        });
document.addEventListener("DOMContentLoaded", () => {
    const menuButton = document.getElementById("mobile-menu-button");
    const mobileMenu = document.getElementById("mobile-menu");

    menuButton.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });
  });