// Advanced Neon Cursor with Falling Stars
const cursor = document.querySelector('.cursor-neon');
let trailElements = [];
let starElements = [];

// Create trail elements pool
for (let i = 0; i < 8; i++) {
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    document.body.appendChild(trail);
    trailElements.push(trail);
}

// Create star elements pool
for (let i = 0; i < 5; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    document.body.appendChild(star);
    starElements.push(star);
}

let trailIndex = 0;
let starIndex = 0;
let lastX = 0;
let lastY = 0;
let velocity = 0;

// Main cursor movement
window.addEventListener('mousemove', (e) => {
    const x = e.clientX;
    const y = e.clientY;
    
    // Calculate velocity
    const deltaX = x - lastX;
    const deltaY = y - lastY;
    velocity = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    lastX = x;
    lastY = y;
    
    // Move main cursor
    cursor.style.left = `${x}px`;
    cursor.style.top = `${y}px`;
    
    // Add trail effect when moving fast
    if (velocity > 5) {
        const trail = trailElements[trailIndex];
        trail.style.left = `${x}px`;
        trail.style.top = `${y}px`;
        trail.style.opacity = '0.8';
        trail.style.transition = 'opacity 0.3s ease-out';
        
        // Fade out trail
        setTimeout(() => {
            trail.style.opacity = '0';
        }, 100);
        
        trailIndex = (trailIndex + 1) % trailElements.length;
    }
    
    // Random falling star effect (less frequent)
    if (Math.random() > 0.95 && velocity > 10) {
        const star = starElements[starIndex];
        star.style.left = `${x + (Math.random() * 20 - 10)}px`;
        star.style.top = `${y}px`;
        star.style.opacity = '1';
        star.style.animation = 'none';
        void star.offsetWidth; // Trigger reflow
        star.style.animation = `fall ${0.5 + Math.random() * 0.5}s linear forwards`;
        
        // Random neon color variation
        const hue = 20 + Math.random() * 20; // Orange color range
        star.style.background = `linear-gradient(to bottom, transparent, hsl(${hue}, 100%, 70%))`;
        star.style.boxShadow = `0 0 5px hsl(${hue}, 100%, 70%), 0 0 10px hsl(${hue}, 100%, 70%)`;
        
        starIndex = (starIndex + 1) % starElements.length;
    }
});

// Click effect
document.addEventListener('click', (e) => {
    const clickEffect = document.createElement('div');
    clickEffect.className = 'click-effect';
    clickEffect.style.left = `${e.clientX}px`;
    clickEffect.style.top = `${e.clientY}px`;
    document.body.appendChild(clickEffect);
    
    // Remove after animation
    setTimeout(() => {
        clickEffect.remove();
    }, 500);
});

// Hover effects
document.querySelectorAll('a, button, .menu-item').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.width = '30px';
        cursor.style.height = '30px';
        cursor.style.borderColor = '#fbbf24';
        cursor.style.boxShadow = '0 0 15px #fbbf24, 0 0 30px #fbbf24, 0 0 45px #fbbf24';
    });
    
    el.addEventListener('mouseleave', () => {
        cursor.style.width = '20px';
        cursor.style.height = '20px';
        cursor.style.borderColor = '#fb923c';
        cursor.style.boxShadow = '0 0 10px #fb923c, 0 0 20px #fb923c, 0 0 30px #fb923c';
    });
});

// Hide cursor on touch devices
if ('ontouchstart' in window) {
    cursor.style.display = 'none';
    trailElements.forEach(t => t.style.display = 'none');
    starElements.forEach(s => s.style.display = 'none');
}