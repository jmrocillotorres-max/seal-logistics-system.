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

// ============================================================================
// 5. CBM CALCULATOR LOGIC (Request Page)
// ============================================================================
function runCalculator() {
    const lengthInput = document.getElementById('calcLength');
    if (!lengthInput) return; 

    const length = parseFloat(lengthInput.value) || 0;
    const width = parseFloat(document.getElementById('calcWidth').value) || 0;
    const height = parseFloat(document.getElementById('calcHeight').value) || 0;
    const weight = parseFloat(document.getElementById('calcWeight').value) || 0;
    const qty = parseFloat(document.getElementById('calcQty').value) || 1;

    const totalVolume = ((length * width * height) / 1000000) * qty;
    const totalWeight = weight * qty;

    document.getElementById('totalCBM').innerText = totalVolume.toFixed(4);
    document.getElementById('totalWeight').innerText = totalWeight.toFixed(2);

    // Update the tiny recommendation badge next to the CBM text
    const recBadge = document.getElementById('cargoRecommendation');
    
    if (totalVolume === 0) {
        recBadge.classList.add('d-none'); // Hide the badge if inputs are 0
    } else {
        recBadge.classList.remove('d-none'); // Show the badge
        
        // NEW TIER: Air Freight (Under 1.5 CBM AND Under 300kg)
        if (totalVolume < 1.5 && totalWeight < 300) {
            recBadge.innerText = "💡 Best Option: Air Freight";
            recBadge.className = "badge bg-info text-dark ms-2 shadow-sm";
        } 
        // LCL: Bigger than Air Freight, but not big enough for a whole container
        else if (totalVolume < 15) {
            recBadge.innerText = "💡 Best Option: LCL";
            recBadge.className = "badge bg-primary ms-2 shadow-sm";
        } 
        // 20ft FCL: Fits perfectly in a standard container
        else if (totalVolume >= 15 && totalVolume <= 33) {
            recBadge.innerText = "💡 Best Option: 20ft FCL";
            recBadge.className = "badge bg-success ms-2 shadow-sm";
        } 
        // 40ft/HQ FCL: Massive shipments
        else {
            recBadge.innerText = "💡 Best Option: 40ft/HQ FCL";
            recBadge.className = "badge bg-success ms-2 shadow-sm";
        }
    }
}

// LIVE AUTO-CALCULATE MAGIC
document.addEventListener("DOMContentLoaded", () => {
    const inputs = document.querySelectorAll('#calcLength, #calcWidth, #calcHeight, #calcWeight, #calcQty');
    inputs.forEach(input => {
        input.addEventListener('input', runCalculator);
    });
});