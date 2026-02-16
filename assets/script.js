(function () { const e = document.createElement("link").relList; if (e && e.supports && e.supports("modulepreload")) return; for (const r of document.querySelectorAll('link[rel="modulepreload"]')) o(r); new MutationObserver(r => { for (const s of r) if (s.type === "childList") for (const i of s.addedNodes) i.tagName === "LINK" && i.rel === "modulepreload" && o(i) }).observe(document, { childList: !0, subtree: !0 }); function t(r) { const s = {}; return r.integrity && (s.integrity = r.integrity), r.referrerPolicy && (s.referrerPolicy = r.referrerPolicy), r.crossOrigin === "use-credentials" ? s.credentials = "include" : r.crossOrigin === "anonymous" ? s.credentials = "omit" : s.credentials = "same-origin", s } function o(r) { if (r.ep) return; r.ep = !0; const s = t(r); fetch(r.href, s) } })(); const d = document.querySelector(".hamburger"), u = document.querySelector(".nav-menu"), m = document.querySelectorAll(".nav-link"), c = { days: document.getElementById("days"), hours: document.getElementById("hours"), minutes: document.getElementById("minutes"), seconds: document.getElementById("seconds") }; new Date("2024-06-15T16:00:00").getTime(); d.addEventListener("click", () => { d.classList.toggle("active"), u.classList.toggle("active") }); m.forEach(n => { n.addEventListener("click", () => { d.classList.remove("active"), u.classList.remove("active") }) }); m.forEach(n => { n.addEventListener("click", e => { e.preventDefault(); const t = n.getAttribute("href"), o = document.querySelector(t); if (o) { const r = o.offsetTop - 70; window.scrollTo({ top: r, behavior: "smooth" }) } }) }); function h() { const n = new Date("2026-06-06T14:00:00").getTime(), e = new Date().getTime(), t = n - e, o = c.days, r = c.hours, s = c.minutes, i = c.seconds, l = document.querySelector(".countdown-title"), a = document.getElementById("celebration"); if (t > 0) { const y = Math.floor(t / 864e5), v = Math.floor(t % (1e3 * 60 * 60 * 24) / (1e3 * 60 * 60)), b = Math.floor(t % (1e3 * 60 * 60) / (1e3 * 60)), S = Math.floor(t % (1e3 * 60) / 1e3); o.textContent = y.toString().padStart(2, "0"), r.textContent = v.toString().padStart(2, "0"), s.textContent = b.toString().padStart(2, "0"), i.textContent = S.toString().padStart(2, "0"), l && (l.innerHTML = "Це наш особливий день! 🎉", l.innerHTML += "<br>", l.innerHTML += "До нашого весілля залишилось:"), a && (a.style.display = "none") } else o.textContent = "00", r.textContent = "00", s.textContent = "00", i.textContent = "00", l && (l.textContent = "Це наш особливий день! 🎉"), a && (a.style.display = "block"), clearInterval(countdownInterval) } setInterval(h, 1e3); h(); const E = { threshold: .1, rootMargin: "0px 0px -50px 0px" }, x = new IntersectionObserver(n => { n.forEach(e => { e.isIntersecting && e.target.classList.add("fade-in") }) }, E); document.addEventListener("DOMContentLoaded", () => { document.querySelectorAll(".timeline-item, .detail-card, .gallery-container, .rsvp-form-container").forEach(e => { x.observe(e) }) }); class w { constructor() { this.slides = document.querySelectorAll(".gallery-slide"), this.dots = document.querySelectorAll(".dot"), this.prevBtn = document.querySelector(".prev-btn"), this.nextBtn = document.querySelector(".next-btn"), this.currentSlide = 0, this.slideInterval = null, this.init() } init() { this.showSlide(0), this.startAutoSlide(), this.prevBtn.addEventListener("click", () => this.prevSlide()), this.nextBtn.addEventListener("click", () => this.nextSlide()), this.dots.forEach((t, o) => { t.addEventListener("click", () => this.goToSlide(o)) }); const e = document.querySelector(".gallery-container"); e.addEventListener("mouseenter", () => this.stopAutoSlide()), e.addEventListener("mouseleave", () => this.startAutoSlide()) } showSlide(e) { this.slides.forEach(t => t.classList.remove("active")), this.dots.forEach(t => t.classList.remove("active")), this.slides[e].classList.add("active"), this.dots[e].classList.add("active"), this.currentSlide = e } nextSlide() { const e = (this.currentSlide + 1) % this.slides.length; this.showSlide(e) } prevSlide() { const e = (this.currentSlide - 1 + this.slides.length) % this.slides.length; this.showSlide(e) } goToSlide(e) { this.showSlide(e) } startAutoSlide() { this.slideInterval = setInterval(() => { this.nextSlide() }, 5e3) } stopAutoSlide() { this.slideInterval && (clearInterval(this.slideInterval), this.slideInterval = null) } } document.addEventListener("DOMContentLoaded", () => { new w }); class L {
    constructor() { this.form = document.getElementById("rsvpForm"), this.init() } init() { this.form.addEventListener("submit", t => this.handleSubmit(t)), this.form.querySelectorAll("input, select, textarea").forEach(t => { t.addEventListener("blur", () => this.validateField(t)), t.addEventListener("input", () => this.clearError(t)) }) } validateField(e) { const t = e.value.trim(), o = e.name; return this.clearError(e), e.hasAttribute("required") && !t ? (this.showError(e, "Це поле обов'язкове для заповнення"), !1) : o === "email" && t && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t) ? (this.showError(e, "Будь ласка, введіть коректну email адресу"), !1) : o === "phone" && t && !/^[\+]?[0-9\s\-\(\)]{10,}$/.test(t) ? (this.showError(e, "Будь ласка, введіть коректний номер телефону"), !1) : !0 } showError(e, t) { e.style.borderColor = "#e74c3c"; const o = document.createElement("div"); o.className = "error-message", o.style.color = "#e74c3c", o.style.fontSize = "0.9rem", o.style.marginTop = "0.5rem", o.textContent = t, e.parentNode.appendChild(o) } clearError(e) { e.style.borderColor = ""; const t = e.parentNode.querySelector(".error-message"); t && t.remove() } handleSubmit(e) { e.preventDefault(); const t = this.form.querySelectorAll("input, select, textarea"); let o = !0; if (t.forEach(i => { this.validateField(i) || (o = !1) }), !o) return; const r = this.form.querySelector(".submit-btn"), s = r.innerHTML; r.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Відправляємо...', r.disabled = !0, setTimeout(() => { this.showSuccessMessage(), this.form.reset(), r.innerHTML = s, r.disabled = !1 }, 2e3) } showSuccessMessage() {
        const e = document.createElement("div"); e.className = "success-message", e.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #f8b5c1, #e8a2b8);
            color: white;
            padding: 2rem;
            border-radius: 20px;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            animation: fadeInUp 0.5s ease-out;
        `, e.innerHTML = `
            <i class="fas fa-heart" style="font-size: 2rem; margin-bottom: 1rem; color: #d4af37;"></i>
            <h3 style="margin-bottom: 1rem; font-family: 'Playfair Display', serif;">Дякуємо!</h3>
            <p>Ваша відповідь успішно відправлена. Ми з нетерпінням чекаємо на зустріч з вами!</p>
            <button onclick="this.parentElement.remove()" style="
                background: rgba(255, 255, 255, 0.2);
                border: 1px solid rgba(255, 255, 255, 0.3);
                color: white;
                padding: 0.5rem 1rem;
                border-radius: 10px;
                margin-top: 1rem;
                cursor: pointer;
                transition: all 0.3s ease;
            " onmouseover="this.style.background='rgba(255, 255, 255, 0.3)'" 
               onmouseout="this.style.background='rgba(255, 255, 255, 0.2)'">
                Закрити
            </button>
        `, document.body.appendChild(e), setTimeout(() => { e.parentNode && e.remove() }, 5e3)
    }
} document.addEventListener("DOMContentLoaded", () => { new L }); window.addEventListener("scroll", () => { const n = window.pageYOffset, e = document.querySelector(".hero"), t = document.querySelector(".hero-content"); if (e && t) { const o = n * -.5; t.style.transform = `translateY(${o}px)` } }); window.addEventListener("scroll", () => { const n = document.querySelector(".navbar"); window.scrollY > 100 ? (n.style.background = "rgba(255, 255, 255, 0.98)", n.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.15)") : (n.style.background = "rgba(255, 255, 255, 0.95)", n.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.1)") }); window.addEventListener("load", () => { document.body.classList.add("loading") }); function f() { document.querySelectorAll(".fade-in").forEach(e => { const t = window.innerHeight; e.getBoundingClientRect().top < t - 150 && (e.style.opacity = "1", e.style.transform = "translateY(0)") }) } window.addEventListener("scroll", f); document.addEventListener("DOMContentLoaded", () => { f() }); function C() {
    const n = document.createElement("div"); n.innerHTML = "💕", n.style.cssText = `
        position: fixed;
        top: 100vh;
        left: ${Math.random() * 100}vw;
        font-size: ${Math.random() * 20 + 10}px;
        color: #f8b5c1;
        pointer-events: none;
        z-index: 1000;
        animation: floatUp 6s linear forwards;
    `, document.body.appendChild(n), setTimeout(() => { n.remove() }, 6e3)
} const p = document.createElement("style"); p.textContent = `
    @keyframes floatUp {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
`; document.head.appendChild(p); setInterval(C, 3e3); document.addEventListener("click", n => { n.target.matches(".detail-card, .timeline-content, .gallery-slide") && T(n) }); function T(n) {
    const e = document.createElement("div"), t = n.target.getBoundingClientRect(), o = Math.max(t.width, t.height), r = n.clientX - t.left - o / 2, s = n.clientY - t.top - o / 2; e.style.cssText = `
        position: absolute;
        width: ${o}px;
        height: ${o}px;
        left: ${r}px;
        top: ${s}px;
        background: rgba(248, 181, 193, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    `, n.target.style.position = "relative", n.target.style.overflow = "hidden", n.target.appendChild(e), setTimeout(() => { e.remove() }, 600)
} const g = document.createElement("style"); g.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`; document.head.appendChild(g); document.addEventListener("keydown", n => { document.querySelector(".gallery-container") && document.querySelector(".gallery-container:hover") && (n.key === "ArrowLeft" ? document.querySelector(".prev-btn").click() : n.key === "ArrowRight" && document.querySelector(".next-btn").click()) }); const q = document.querySelectorAll("button, .nav-link, .gallery-btn, .dot, .detail-card, .timeline-item"); q.forEach(n => { n.style.transition = "all 0.3s ease" }); console.log("💕 Wedding website loaded successfully! 💕");

/* --- Snake Program Logic --- */

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

            // Use screen center as reference point
            const screenCenter = windowHeight / 2;

            // Calculate progress based on container's position relative to screen center
            // progress will be 0 when top of container reaches center, and 1 when bottom reaches center
            let progress = (screenCenter - rect.top) / rect.height;

            if (progress < 0) progress = 0;
            if (progress > 1) progress = 1;

            // pathProgress 0 (start of path) to 1 (end of path)
            // The path in SVG starts at bottom (M260 1440) and ends at top (S... 173.5 30)
            // So we use (1 - progress) to go from 0 (start/bottom) to 1 (end/top)
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

/* --- Envelope Loader Logic --- */

document.addEventListener('DOMContentLoaded', () => {
    const envelopeLoader = document.getElementById('envelope-loader');
    const envelopeVideo = document.getElementById('envelope-video');
    const envelopeWrapper = document.querySelector('.envelope-wrapper');
    const body = document.body;

    if (envelopeLoader && envelopeVideo && envelopeWrapper) {
        envelopeWrapper.addEventListener('click', () => {
            // Запускаємо відео
            envelopeVideo.play().catch(error => {
                console.error("Playback failed:", error);
                // На випадок помилки автозапуску/блокування просто приховаємо лоадер
                finishLoading();
            });

            // Приховуємо натяк
            const hint = document.querySelector('.click-hint');
            if (hint) hint.style.opacity = '0';
        });

        // Чекаємо завершення відео
        envelopeVideo.onended = () => {
            finishLoading();
        };
    }

    function finishLoading() {
        if (!envelopeLoader) return;

        // Показуємо контент негайно, щоб не було білого екрану під час fade-out
        body.classList.remove('content-hidden');
        envelopeLoader.classList.add('fade-out');

        setTimeout(() => {
            envelopeLoader.style.display = 'none';
            window.scrollTo(0, 0);

            // Перезапуск анімацій
            if (typeof f === 'function') f();

            console.log("Welcome! Envelope sequence finished.");
        }, 1000); // Час fade-out
    }
});
