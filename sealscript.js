// 1. Initialize AOS (Animate On Scroll)
// This ensures your Hero section and cards actually appear
AOS.init({ 
    duration: 800, 
    once: true,
    offset: 100
});

// 2. Counter Animation Logic
const counters = document.querySelectorAll('.stat-number');
const speed = 200; 

const animateCounters = () => {
    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const inc = target / speed;

            if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                setTimeout(updateCount, 1);
            } else {
                // FIXED: We now only set the raw number.
                // The "+" or "%" symbols are handled as white text in your HTML.
                counter.innerText = target; 
            }
        };
        updateCount();
    });
};

// 3. Scroll Trigger for Counters
// This detects when the user reaches the stats section
let animated = false;
window.addEventListener('scroll', () => {
    const statsSection = document.querySelector('.stats-section');
    if(statsSection) {
        const sectionPos = statsSection.getBoundingClientRect().top;
        const screenPos = window.innerHeight;

        if (sectionPos < screenPos && !animated) {
            animateCounters();
            animated = true;
        }
    }
});

// 4. Navbar Background Change
// Changes navbar from transparent to solid dark when scrolling
window.addEventListener('scroll', () => {
    const nav = document.getElementById('mainNav');
    if (nav) {
        if (window.scrollY > 50) {
            nav.style.backgroundColor = "rgba(44, 52, 62, 0.95)";
            nav.style.backdropFilter = "blur(10px)";
            nav.classList.add('shadow-sm');
        } else {
            nav.style.backgroundColor = "transparent";
            nav.style.backdropFilter = "none";
            nav.classList.remove('shadow-sm');
        }
    }
});