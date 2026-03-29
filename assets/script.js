(function () {
    const relList = document.createElement("link").relList;
    if (relList && relList.supports && relList.supports("modulepreload")) return;

    for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
        processPreload(link);
    }

    new MutationObserver(mutations => {
        for (const mutation of mutations) {
            if (mutation.type === "childList") {
                for (const node of mutation.addedNodes) {
                    if (node.tagName === "LINK" && node.rel === "modulepreload") {
                        processPreload(node);
                    }
                }
            }
        }
    }).observe(document, { childList: true, subtree: true });

    function getFetchOpts(link) {
        const opts = {};
        if (link.integrity) opts.integrity = link.integrity;
        if (link.referrerPolicy) opts.referrerPolicy = link.referrerPolicy;

        if (link.crossOrigin === "use-credentials") {
            opts.credentials = "include";
        } else if (link.crossOrigin === "anonymous") {
            opts.credentials = "omit";
        } else {
            opts.credentials = "same-origin";
        }
        return opts;
    }

    function processPreload(link) {
        if (link.ep) return;
        link.ep = true;
        const opts = getFetchOpts(link);
        fetch(link.href, opts);
    }
})();

/* --- Navigation & Menu Logic --- */
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");
const navItems = document.querySelectorAll(".nav-item");

if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navMenu.classList.toggle("active");

        // Lock scroll when menu is active
        if (navMenu.classList.contains("active")) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
    });
}

navItems.forEach(item => {
    item.addEventListener("click", () => {
        if (hamburger && navMenu) {
            hamburger.classList.remove("active");
            navMenu.classList.remove("active");
            document.body.style.overflow = "";
        }
    });

    item.addEventListener("click", (e) => {
        e.preventDefault();
        const link = item.querySelector(".nav-link");
        if (!link) return;

        const href = link.getAttribute("href");
        const targetSection = document.querySelector(href);

        if (targetSection) {
            const offsetTop = targetSection.getBoundingClientRect().top + window.pageYOffset - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: "smooth"
            });
        }
    });
});

/* --- Countdown Logic --- */
const countdownElements = {
    days: document.getElementById("days"),
    hours: document.getElementById("hours"),
    minutes: document.getElementById("minutes"),
    seconds: document.getElementById("seconds")
};

// Target Date: 06 June 2026, 14:00:00
const WEDDING_DATE = new Date("2026-06-06T14:00:00").getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const distance = WEDDING_DATE - now;

    const daysEl = countdownElements.days;
    const hoursEl = countdownElements.hours;
    const minutesEl = countdownElements.minutes;
    const secondsEl = countdownElements.seconds;

    // We only access these to potentially show the "Time is up" message
    const titleEl = document.querySelector(".countdown-title");
    const celebrationEl = document.getElementById("celebration");

    if (distance > 0) {
        // Calculate time
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Update DOM
        if (daysEl) daysEl.textContent = days.toString().padStart(2, "0");
        if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, "0");
        if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, "0");
        if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, "0");

        // IMPORTANT: We DO NOT overwrite titleEl here, preserving the HTML static text "Чекаємо на вас через..."
        // If there was previously "Time is up" text, we might want to reset it, but since 
        // the static HTML is correct, we just leave it alone.

        if (celebrationEl) celebrationEl.style.display = "none";

    } else {
        // Time is up
        if (daysEl) daysEl.textContent = "00";
        if (hoursEl) hoursEl.textContent = "00";
        if (minutesEl) minutesEl.textContent = "00";
        if (secondsEl) secondsEl.textContent = "00";

        if (titleEl) {
            titleEl.innerHTML = "Це наш особливий день! 🎉";
        }

        if (celebrationEl) celebrationEl.style.display = "block";
        clearInterval(countdownInterval);
    }
}

const countdownInterval = setInterval(updateCountdown, 1000);
updateCountdown(); // Initial call

/* --- Intersection Observer for Animations --- */
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("fade-in");
        }
    });
}, observerOptions);

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".timeline-item, .detail-card, .gallery-container, .rsvp-form-container").forEach(el => {
        fadeObserver.observe(el);
    });
});

/* --- RSVP Form Class --- */
class RSVPForm {
    constructor() {
        this.form = document.getElementById("rsvpForm");
        if (this.form) {
            this.init();
        } else {
            // console.error("RSVP Form not found!");
        }
    }

    init() {
        this.form.addEventListener("submit", (e) => this.handleSubmit(e));
        this.form.querySelectorAll("input, select, textarea").forEach(input => {
            input.addEventListener("blur", () => this.validateField(input));
            input.addEventListener("input", () => this.clearError(input));
        });

        // Add conditional logic for "Children" field based on attendance
        this.attendanceRadios = this.form.querySelectorAll('input[name="attendance"]');
        if (this.attendanceRadios.length) {
            this.attendanceRadios.forEach(radio => {
                radio.addEventListener('change', () => this.handleAttendanceChange());
            });
            // Initial check
            this.handleAttendanceChange();
        }
    }

    handleAttendanceChange() {
        // No conditional field logic needed (children field removed)
    }

    validateField(field) {
        const value = field.value.trim();
        const name = field.name;
        this.clearError(field);

        if (field.hasAttribute("required") && !value) {
            this.showError(field, "Це поле обов'язкове для заповнення");
            return false;
        }

        // Email validation removed as field is removed

        if (name === "phone") {
            if (!value) {
                this.showError(field, "Це поле обов'язкове для заповнення");
                return false;
            }
            if (!/^[\+]?[0-9\s\-\(\)]{10,}$/.test(value)) {
                this.showError(field, "Будь ласка, введіть коректний номер телефону");
                return false;
            }
        }

        return true;
    }

    showError(element, message) {
        element.style.borderColor = "#e74c3c";
        const errorDiv = document.createElement("div");
        errorDiv.className = "error-message";
        errorDiv.style.color = "#e74c3c";
        errorDiv.style.fontSize = "0.9rem";
        errorDiv.style.marginTop = "0.5rem";
        errorDiv.textContent = message;
        element.parentNode.appendChild(errorDiv);

        // Remove error after 3 seconds automatically (optional UX improvement)
        setTimeout(() => {
            if (errorDiv.parentNode) errorDiv.remove();
            element.style.borderColor = "";
        }, 3000);
    }

    clearError(element) {
        element.style.borderColor = "";
        const errorDiv = element.parentNode.querySelector(".error-message");
        if (errorDiv) errorDiv.remove();
    }

    async handleSubmit(e) {
        e.preventDefault();
        console.log("Form submission started");

        const inputs = this.form.querySelectorAll("input, select, textarea");
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        if (!isValid) {
            console.log("Validation failed");
            return;
        }

        const submitBtn = this.form.querySelector(".submit-btn");
        const originalBtnContent = submitBtn.innerHTML;

        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Відправляємо...';
        submitBtn.disabled = true;

        const scriptURL = 'https://script.google.com/macros/s/AKfycbx-WnDzRrgLpLHfNR2E6Ij2BjVmFr9nVuN66rvk2SHhkHB9UurZnLj1ZAaiXdZPGqjb0w/exec';

        try {
            const formData = new FormData(this.form);
            const data = new URLSearchParams();
            for (const pair of formData) {
                data.append(pair[0], pair[1]);
            }
            console.log("Sending data:", Object.fromEntries(data));

            // We use no-cors mode because Google Scripts don't valid CORS headers for redirects
            await fetch(scriptURL, {
                method: 'POST',
                mode: 'no-cors',
                body: data
            });

            console.log("Fetch completed (opaque)");

            // Get attendance value
            const attendance = formData.get('attendance');
            this.showSuccessMessage(attendance);
            this.form.reset();

        } catch (error) {
            console.error('Submission error:', error);
            alert('Не вдалося відправити дані. Перевірте інтернет з\'єднання.');
        } finally {
            submitBtn.innerHTML = originalBtnContent;
            submitBtn.disabled = false;
        }
    }

    showSuccessMessage(attendance) {
        let title = "Дякуємо!";
        let message = "Ваша відповідь успішно відправлена. Ми з нетерпінням чекаємо на зустріч з вами!";
        let iconColor = "var(--primary-blue)";

        if (attendance === 'yes') {
            message = "З нетерпінням чекаємо на зустріч!";
        } else if (attendance === 'no') {
            message = "Дуже шкода, але надіємося, що ви передумаєте.";
        }

        const overlay = document.createElement("div");
        overlay.className = "success-message";
        overlay.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, var(--secondary-blue), var(--primary-blue));
            color: white;
            padding: 2rem;
            border-radius: 20px;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            animation: fadeInUp 0.5s ease-out;
            min-width: 300px;
        `;

        overlay.innerHTML = `
            <i class="fas fa-heart" style="font-size: 2rem; margin-bottom: 1rem; color: ${iconColor};"></i>
            <h3 style="margin-bottom: 1rem; font-family: 'Playfair Display', serif;">${title}</h3>
            <p>${message}</p>
            <button class="close-msg-btn" style="
                background: rgba(255, 255, 255, 0.2);
                border: 1px solid rgba(255, 255, 255, 0.3);
                color: white;
                padding: 0.5rem 1rem;
                border-radius: 10px;
                margin-top: 1rem;
                cursor: pointer;
                transition: all 0.3s ease;
            ">
                Закрити
            </button>
        `;

        document.body.appendChild(overlay);

        // Add event listener to button
        const closeBtn = overlay.querySelector('.close-msg-btn');
        closeBtn.addEventListener('click', () => {
            overlay.remove();
        });

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (overlay.parentNode) overlay.remove();
        }, 5000);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new RSVPForm();
});

/* --- Navbar Scroll Effect --- */
window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".navbar");
    if (!navbar) return;

    if (window.scrollY > 100) {
        navbar.style.background = "rgba(255, 255, 255, 0.98)";
        navbar.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.15)";
    } else {
        navbar.style.background = "rgba(255, 255, 255, 0.95)";
        navbar.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.1)";
    }
});

/* --- Hero Parallax (Disabled to fix calendar scrolling distance) --- */
/*
window.addEventListener("scroll", () => {
    const offset = window.pageYOffset;
    const heroContent = document.querySelector(".hero-content");

    if (heroContent) {
        const translateY = offset * -0.5;
        heroContent.style.transform = `translateY(${translateY}px)`;
    }
});
*/

/* --- Body Load Class --- */
window.addEventListener("load", () => {
    document.body.classList.add("loading");
});

function handleScrollFade() {
    document.querySelectorAll(".fade-in").forEach(el => {
        const windowHeight = window.innerHeight;
        if (el.getBoundingClientRect().top < windowHeight - 150) {
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
        }
    });
}
window.addEventListener("scroll", handleScrollFade);
document.addEventListener("DOMContentLoaded", handleScrollFade);

/* --- Floating Hearts Animation --- */
function createFloatingHeart() {
    const heart = document.createElement("div");
    heart.innerHTML = "💍";
    heart.style.cssText = `
        position: fixed;
        top: 100vh;
        left: ${Math.random() * 90 + 5}vw;
        font-size: ${Math.random() * 20 + 10}px;
        color: #f8b5c1;
        pointer-events: none;
        z-index: 1000;
        animation: floatUp 6s linear forwards;
        overflow: hidden;
        white-space: nowrap;
        user-select: none;
    `;
    document.body.appendChild(heart);
    setTimeout(() => { heart.remove() }, 6000);
}

// Add styles for floatUp animation
const heartStyle = document.createElement("style");
heartStyle.textContent = `
    @keyframes floatUp {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(-110vh) rotate(360deg); opacity: 0; }
    }
`;
document.head.appendChild(heartStyle);

// Start hearts interval
setInterval(createFloatingHeart, 3000);

/* --- Click Ripple Effect on Cards --- */
document.addEventListener("click", (e) => {
    if (e.target.matches(".detail-card, .timeline-content, .gallery-slide")) {
        createRipple(e);
    }
});

function createRipple(e) {
    const circle = document.createElement("div");
    const rect = e.target.getBoundingClientRect();
    const diameter = Math.max(rect.width, rect.height);
    const radius = diameter / 2;

    const x = e.clientX - rect.left - radius;
    const y = e.clientY - rect.top - radius;

    circle.style.cssText = `
        position: absolute;
        width: ${diameter}px;
        height: ${diameter}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(248, 181, 193, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    `;

    // Ensure parent is relative and hidden overflow
    const previousPosition = e.target.style.position;
    if (getComputedStyle(e.target).position === 'static') {
        e.target.style.position = "relative";
    }
    e.target.style.overflow = "hidden";

    e.target.appendChild(circle);

    setTimeout(() => {
        circle.remove();
        // Restore if needed, but usually safe to leave as relative
    }, 600);
}

const rippleStyle = document.createElement("style");
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Add transition to interactive elements
const interactiveElements = document.querySelectorAll("button, .nav-link, .gallery-btn, .dot, .detail-card, .timeline-item");
interactiveElements.forEach(el => {
    el.style.transition = "all 0.3s ease";
});

console.log("💕 Wedding website loaded successfully! 💕");

/* --- Snake Program Logic --- */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Intersection Observer for Fade-in Items
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const snakeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const items = document.querySelectorAll('.snake-program-item');
    items.forEach(item => {
        snakeObserver.observe(item);
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

            // Use screen center as reference point
            const screenCenter = windowHeight / 2;

            // Calculate progress based on container's position relative to screen center
            // progress will be 0 when top of container reaches center, and 1 when bottom reaches center
            let progress = (screenCenter - rect.top) / rect.height;

            if (progress < 0) progress = 0;
            if (progress > 1) progress = 1;

            // pathProgress 0 (start of path) to 1 (end of path)
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
    // 3. Seamless Program Video Loop
    function initSeamlessLoop() {
        const video1 = document.getElementById('snake-program-video-1');
        const video2 = document.getElementById('snake-program-video-2');
        if (!video1 || !video2) return;

        let activeVideo = video1;
        let idleVideo = video2;
        const fadeDuration = 1; // seconds before end to start fade
        const playbackRate = 0.3;

        // Apply playback speed
        [video1, video2].forEach(v => {
            v.playbackRate = playbackRate;
            v.addEventListener('play', () => { v.playbackRate = playbackRate; });
        });

        // Set initial start time to 6 seconds for the active video (safely)
        const startOffset = 6;
        const setInitialTime = () => {
            if (video1.duration > startOffset) {
                video1.currentTime = startOffset;
            }
            video1.play().catch(e => console.log("Initial video play failed:", e));
        };

        if (video1.readyState >= 1) { // HAVE_METADATA
            setInitialTime();
        } else {
            video1.addEventListener('loadedmetadata', setInitialTime, { once: true });
        }

        function performCrossfade() {
            // Pre-load/play the idle video from 6 seconds
            idleVideo.currentTime = 6;
            const playPromise = idleVideo.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    activeVideo.classList.remove('active');
                    idleVideo.classList.add('active');

                    // Swap roles
                    const temp = activeVideo;
                    activeVideo = idleVideo;
                    idleVideo = temp;
                }).catch(error => {
                    console.log("Idle video playback failed:", error);
                });
            }
        }

        function checkFade() {
            const currentTime = activeVideo.currentTime;
            const duration = activeVideo.duration;

            // Trigger crossfade 1 second before completion (adjusting for playbackRate)
            // If the video is playing at 0.3 speed, 1 second of "video time" takes 3.33 seconds real time.
            const threshold = duration - fadeDuration;

            if (duration > 0 && currentTime >= threshold && idleVideo.paused) {
                performCrossfade();
            }
            requestAnimationFrame(checkFade);
        }

        requestAnimationFrame(checkFade);
    }

    initSeamlessLoop();
});

/* --- Premium Intro & 3D Envelope Animation --- */

document.addEventListener('DOMContentLoaded', () => {
    const premiumIntro = document.getElementById('premium-intro');
    const envelope = document.getElementById('envelope-main');
    const flap = document.getElementById('envelope-flap-top');
    const letter = document.getElementById('envelope-letter');
    const seal = document.getElementById('envelope-seal');
    const introBg = document.getElementById('intro-bg');
    const body = document.body;

    if (!premiumIntro || !envelope) return;

    // --- 1. Initial Intro Entrance ---
    gsap.to(envelope, { 
        opacity: 1, 
        y: 0, 
        scale: 1, 
        rotateX: 0,
        filter: "blur(0px)",
        duration: 3, 
        ease: "power4.out",
        delay: 0.2 
    });

    // --- 2. Envelope Interaction ---
    let isOpening = false;
    envelope.addEventListener('click', () => {
        if (isOpening) return;
        isOpening = true;

        const tl = gsap.timeline({
            onComplete: () => {
                premiumIntro.style.display = 'none';
                window.scrollTo(0, 0);
                if (typeof handleScrollFade === 'function') handleScrollFade();
            }
        });

        // Step 1: Break seal and open flap
        tl.to(seal, { opacity: 0, duration: 0.4 })
          .to(flap, { 
              rotateX: 90, 
              duration: 1.8, 
              ease: "power2.in",
              z: 2 // Ensure it stays on top during rotation
          }, "<") // Start immediately with seal fade
          .set(flap, { zIndex: 1, z: 0 })
          .to(flap, { 
              rotateX: 180, 
              duration: 1.8, 
              ease: "power2.out"
          })
          
          // Step 2: Letter rises slowly
          .to(letter, { 
              y: "-55%", 
              duration: 3.0, 
              ease: "power2.inOut"
          }, "-=1.5") // Start rising as soon as flap is mostly open

          // Step 3: Mega Zoom into the envelope and letter / site
          .to(envelope, {
              scale: 8,
              opacity: 0,
              duration: 2,
              ease: "expo.in"
          }, "+=0.2")
          .to(introBg, {
              scale: 3,
              filter: "blur(0px) brightness(1.2)",
              duration: 2.5,
              ease: "expo.inOut"
          }, "-=2")
          .to(premiumIntro, {
              opacity: 0,
              duration: 1.5,
              ease: "power2.inOut"
          }, "-=1.5")

          // Step 4: Show site content
          .call(() => {
              body.classList.remove('content-hidden');
              initHeroAnimations();
          }, null, "-=1.5");

        // Start Background Music
        const bgMusic = document.getElementById('bg-music');
        if (bgMusic) {
            bgMusic.volume = 0.4;
            bgMusic.play().then(() => {
                const musicToggle = document.getElementById('music-toggle');
                if (musicToggle) musicToggle.classList.add('visible', 'playing');
            }).catch(e => {
                console.log("Audio autoplay blocked.", e);
                const musicToggle = document.getElementById('music-toggle');
                if (musicToggle) musicToggle.classList.add('visible');
            });
        }

        // Hide hint
        gsap.to(".click-hint", { opacity: 0, duration: 0.5 });
    });
});

// --- 3. Hero Section Entrance Animations ---
function initHeroAnimations() {
    const tlHero = gsap.timeline({ defaults: { ease: "power4.out" } });

    tlHero
        .from(".navbar", { y: -100, opacity: 0, duration: 1.2 })
        .from(".hero-title .name", { 
            y: 100, 
            opacity: 0, 
            rotateX: -45, 
            stagger: 0.2, 
            duration: 1.5 
        }, "-=0.8")
        .from(".hero-title .ampersand", { 
            scale: 0, 
            opacity: 0, 
            duration: 1 
        }, "-=1.2")
        .from(".hero-invitation", { 
            y: 30, 
            opacity: 0, 
            duration: 1 
        }, "-=1")
        .from(".hero-calendar-card", { 
            y: 50, 
            opacity: 0, 
            scale: 0.95, 
            duration: 1.2 
        }, "-=0.8");
}


/* --- Scroll Indicator Interactivity --- */
document.addEventListener('DOMContentLoaded', () => {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const storySection = document.getElementById('story');
            if (storySection) {
                const offset = storySection.offsetTop - 70;
                window.scrollTo({
                    top: offset,
                    behavior: 'smooth'
                });
            }
        });
        scrollIndicator.style.cursor = 'pointer';
    }
});

/* --- Music Toggle Logic --- */
document.addEventListener('DOMContentLoaded', () => {
    const bgMusic = document.getElementById('bg-music');
    const musicToggle = document.getElementById('music-toggle');

    if (musicToggle && bgMusic) {
        const musicIcon = musicToggle.querySelector('i');

        musicToggle.addEventListener('click', () => {
            if (bgMusic.paused) {
                bgMusic.play();
                musicToggle.classList.add('playing');
                musicIcon.classList.remove('fa-play');
                musicIcon.classList.add('fa-pause');
            } else {
                bgMusic.pause();
                musicToggle.classList.remove('playing');
                musicIcon.classList.remove('fa-pause');
                musicIcon.classList.add('fa-play');
            }
        });
    }
});
