document.addEventListener('DOMContentLoaded', () => {
    // 1. Intersection Observer for Fade-in Items
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const items = document.querySelectorAll('.snake-program-item');
    items.forEach(item => {
        observer.observe(item);
    });

    // 2. Snake Scroll Animation
    const snakePath = document.getElementById('snakePath');
    const pomegranate = document.getElementById('pomegranate');
    const section = document.getElementById('program');

    if (snakePath && pomegranate && section) {
        const pathLength = snakePath.getTotalLength();

        // Show pomegranate when ready
        pomegranate.classList.add('visible');

        function updatePomegranatePosition() {
            const container = document.querySelector('.snake-animation-container');
            if (!container) return;

            const rect = container.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const elementHeight = rect.height;

            // Define trigger points
            const startY = windowHeight * 0.9;
            const endY = windowHeight * 0.1;

            const startTop = startY;
            const endTop = endY - elementHeight;

            // Calculate progress (0 start, 1 end)
            let progress = (rect.top - startTop) / (endTop - startTop);

            if (progress < 0) progress = 0;
            if (progress > 1) progress = 1;

            // Invert progress: as we scroll down (progress 0->1), 
            // pomegranate moves from top of path (pathProgress 1) to bottom (pathProgress 0).
            const pathProgress = 1 - progress;

            const point = snakePath.getPointAtLength(pathLength * pathProgress);

            // Convert to percentages relative to original viewBox 347x1450
            const percentX = (point.x / 347) * 100;
            const percentY = (point.y / 1450) * 100;

            pomegranate.style.left = `${percentX}%`;
            pomegranate.style.top = `${percentY}%`;

            pomegranate.classList.add('visible');
        }

        window.addEventListener('scroll', () => {
            requestAnimationFrame(updatePomegranatePosition);
        });

        // Initial call
        updatePomegranatePosition();

        // Handle window resize
        window.addEventListener('resize', updatePomegranatePosition);
    }
});
