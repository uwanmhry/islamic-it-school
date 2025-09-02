// Render program navigation
function renderProgramNavigation() {
    const programNav = document.getElementById('program-nav');
    let navHTML = '';

    Object.keys(programData.programs).forEach((programKey, index) => {
        const program = programData.programs[programKey];
        const isActive = index === 0 ? 'active' : '';
        navHTML += `
            <div class="program-nav-item ${isActive}" data-target="${program.id}">
                ${program.title}
            </div>
        `;
    });

    programNav.innerHTML = navHTML;
}

// Render program sections
function renderProgramSections() {
    const programSections = document.getElementById('program-sections');
    let sectionsHTML = '';

    Object.keys(programData.programs).forEach((programKey, index) => {
        const program = programData.programs[programKey];
        const isActive = index === 0 ? 'active' : '';

        let roadmapItemsHTML = '';
        program.items.forEach((item, itemIndex) => {
            const number = itemIndex + 1; // Nomor urut dimulai dari 1
            roadmapItemsHTML += `
                <div class="roadmap-item" data-modal="${item.id}">
                    <div class="roadmap-number">${number}</div>
                    <div class="roadmap-icon">
                        <i class="${item.icon}"></i>
                    </div>
                    <div class="roadmap-title">${item.title}</div>
                    <div class="roadmap-subtitle">${item.subtitle}</div>
                </div>
            `;
        });

        sectionsHTML += `
            <div id="${program.id}" class="program-section ${isActive}">
                <div class="bg-white p-8 rounded-lg shadow-md">
                    <div class="flex items-center mb-4">
                        <div class="w-16 h-16 rounded-full bg-${program.color} bg-opacity-20 flex items-center justify-center text-${program.color} text-3xl mr-4">
                            <i class="${program.icon}"></i>
                        </div>
                        <div>
                            <h3 class="text-2xl font-semibold">${program.title}</h3>
                            ${program.subtitle ? `<p class="text-gray-600 mt-2">${program.subtitle}</p>` : ''}
                        </div>
                    </div>
                    
                    <div class="roadmap-container">
                        <div class="roadmap-path"></div>
                        <div class="roadmap-items">
                            ${roadmapItemsHTML}
                        </div>
                    </div>
                    
                    <div class="timeline-note">
                        <p class="text-sm text-gray-700">
                            <i class="fas fa-clock text-secondary mr-2"></i>
                            Timeline dan roadmap diatas ditempuh di masa belajar 6 tahun (level 1 & level 2)
                        </p>
                    </div>
                </div>
            </div>
        `;
    });

    programSections.innerHTML = sectionsHTML;
}

// Untuk setiap program item
programItems.forEach((item, index) => {
    const itemElement = document.createElement('div');
    itemElement.className = 'program-item';
    itemElement.setAttribute('data-aos', 'fade-up');
    itemElement.setAttribute('data-aos-delay', (index % 4) * 100);
});