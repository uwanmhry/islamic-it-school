// =========================
// App Initialization
// =========================
document.addEventListener('DOMContentLoaded', initApp);

function initApp() {
    renderProgramNavigation();
    renderProgramSections();
    renderPendaftaranItems();
    initEventListeners();
    initNavbarHighlight();
    initModal();
}

// =========================
// Event Listeners
// =========================
function initEventListeners() {
    // Smooth scrolling untuk semua anchor link
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Sticky header (beri shadow saat scroll)
    window.addEventListener('scroll', function () {
        const header = document.querySelector('header');
        if (window.scrollY > 100) {
            header.classList.add('shadow-lg');
        } else {
            header.classList.remove('shadow-lg');
        }
    });

    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function () {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Program navigation (switch tab program)
    const programNavItems = document.querySelectorAll('.program-nav-item');
    const programSections = document.querySelectorAll('.program-section');

    programNavItems.forEach(item => {
        item.addEventListener('click', function () {
            const target = this.getAttribute('data-target');

            // Update active nav item
            programNavItems.forEach(navItem => navItem.classList.remove('active'));
            this.classList.add('active');

            // Tampilkan section sesuai nav
            programSections.forEach(section => section.classList.remove('active'));
            document.getElementById(target).classList.add('active');
        });
    });
}

// =========================
// Navbar Active Link (Desktop & Mobile)
// =========================
function initNavbarHighlight() {
    const navLinks = document.querySelectorAll(".nav-link");
    const mobileLinks = document.querySelectorAll(".mobile-link");
    const sections = document.querySelectorAll("section[id]");
    const mobileMenu = document.getElementById("mobile-menu");

    // Fungsi set active link
    function setActiveLink(link, links) {
        links.forEach(l => l.classList.remove("text-orange-500", "font-bold"));
        link.classList.add("text-orange-500", "font-bold");
    }

    // Klik desktop
    navLinks.forEach(link => {
        link.addEventListener("click", () => setActiveLink(link, navLinks));
    });

    // Klik mobile
    mobileLinks.forEach(link => {
        link.addEventListener("click", () => {
            setActiveLink(link, mobileLinks);
            if (mobileMenu) mobileMenu.classList.add("hidden"); // otomatis tutup menu
        });
    });

    // Scroll: update active link otomatis
    window.addEventListener("scroll", () => {
        let scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100; // offset untuk header
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute("id");

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                // Desktop
                navLinks.forEach(link => link.classList.remove("text-orange-500", "font-bold"));
                const activeDesktop = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                if (activeDesktop) activeDesktop.classList.add("text-orange-500", "font-bold");

                // Mobile
                mobileLinks.forEach(link => link.classList.remove("text-orange-500", "font-bold"));
                const activeMobile = document.querySelector(`.mobile-link[href="#${sectionId}"]`);
                if (activeMobile) activeMobile.classList.add("text-orange-500", "font-bold");
            }
        });
    });
}

// =========================
// Modal Program
// =========================
function initModal() {
    const modal = document.getElementById('programModal');
    const modalBody = document.getElementById('modal-body');
    const closeBtn = document.querySelector('.close');

    if (!modal || !modalBody || !closeBtn) return;

    // Buat objek konten modal dari programData
    const modalContent = {};
    Object.keys(programData.programs).forEach(programKey => {
        programData.programs[programKey].items.forEach(item => {
            modalContent[item.id] = {
                title: item.title,
                icon: item.icon,
                content: item.content
            };
        });
    });

    // Klik item roadmap -> buka modal
    document.addEventListener('click', function (e) {
        const roadmapItem = e.target.closest('.roadmap-item');
        if (roadmapItem) {
            const modalKey = roadmapItem.getAttribute('data-modal');
            const content = modalContent[modalKey];

            if (content) {
                modalBody.innerHTML = `
                    <div class="flex items-center mb-6">
                        <div class="w-16 h-16 rounded-full bg-primary bg-opacity-20 flex items-center justify-center text-primary text-2xl mr-4">
                            <i class="${content.icon}"></i>
                        </div>
                        <h2 class="text-2xl font-bold text-gray-800">${content.title}</h2>
                    </div>
                    <p class="text-gray-700 leading-relaxed text-lg">${content.content}</p>
                `;
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            }
        }
    });

    // Tutup modal (X button)
    closeBtn.addEventListener('click', function () {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    // Tutup modal klik luar
    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Tutup modal dengan ESC
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

// =========================
// Form Contact via WhatsApp
// =========================
document.getElementById("contactForm").addEventListener("submit", function (e) {
    e.preventDefault();

    // Ambil value dari form
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    // Nomor tujuan WA (ganti dengan nomor admin)
    const phoneNumber = "6281312633302";

    // Format pesan
    const whatsappMessage = `Assalamu'alaikum, saya ${name} (${email}) ingin menghubungi:\n\n${message}`;

    // Buka WhatsApp
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappURL, "_blank");
});