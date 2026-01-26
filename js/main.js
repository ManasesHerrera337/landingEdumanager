/**
 * EdumanagerApp - Landing Page JavaScript
 */

// ============================================
// 🎨 CURSOR GLOW EFFECT - Cambia a false para desactivar
// ============================================
const ENABLE_CURSOR_GLOW = false;

// Cursor Glow Effect
function initCursorGlow() {
    if (!ENABLE_CURSOR_GLOW) return;

    // Create glow element
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);

    // Add styles
    const style = document.createElement('style');
    /* Antes (Esfera sólida) */
    // background: radial-gradient(circle, rgba(0, 119, 182, 0.15) 0%, rgba(3, 4, 95, 0.08) 40%, transparent 70%);
    /* Nueva (Esfera con gradiente) */
    // background: radial-gradient(circle, transparent 25%, rgba(0, 119, 182, 0.2) 45%, rgba(3, 4, 95, 0.1) 60%, transparent 50%);
    style.textContent = `
        .cursor-glow {
            position: fixed;
            width: 900px;
            height: 900px;
            background: radial-gradient(circle, transparent 20%, rgba(0, 119, 182, 0.2) 40%, rgba(3, 4, 95, 0.05) 60%, transparent 80%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transform: translate(-50%, -50%);
            transition: opacity 0.3s ease;
            opacity: 0;
        }
        .cursor-glow.active {
            opacity: 1;
        }
        @media (max-width: 768px) {
            .cursor-glow { display: none; }
        }
    `;
    document.head.appendChild(style);

    // Track mouse movement
    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        glow.classList.add('active');
    });

    document.addEventListener('mouseleave', () => {
        glow.classList.remove('active');
    });

    // Smooth animation
    function animateGlow() {
        glowX += (mouseX - glowX) * 0.1;
        glowY += (mouseY - glowY) * 0.1;
        glow.style.left = glowX + 'px';
        glow.style.top = glowY + 'px';
        requestAnimationFrame(animateGlow);
    }
    animateGlow();
}

// Initialize cursor glow
initCursorGlow();

document.addEventListener('DOMContentLoaded', function () {
    // Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 100,
        delay: 0,
    });

    // Header scroll effect
    const header = document.getElementById('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // Mobile menu toggle
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking a link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

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

    // Contact form handling
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);

            // Simulate form submission
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            submitBtn.innerHTML = `
                <svg class="btn-icon spinning" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10" stroke-dasharray="60" stroke-dashoffset="20"/>
                </svg>
                Enviando...
            `;
            submitBtn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                submitBtn.innerHTML = `
                    <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 6L9 17l-5-5"/>
                    </svg>
                    ¡Mensaje Enviado!
                `;
                submitBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';

                // Reset form
                setTimeout(() => {
                    contactForm.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.background = '';
                }, 3000);
            }, 1500);
        });
    }

    // Parallax effect for hero shapes
    const shapes = document.querySelectorAll('.shape, .blob');

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;

        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 0.05;
            shape.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    // Counter animation for stats
    const animateCounters = () => {
        const counters = document.querySelectorAll('.stat-number');

        counters.forEach(counter => {
            const target = counter.innerText;
            const hasPlus = target.includes('+');
            const hasPercent = target.includes('%');
            const hasK = target.includes('K');
            const hasSlash = target.includes('/');

            let numericValue;

            if (hasSlash) {
                // Handle "24/7" format
                counter.innerText = '24/7';
                return;
            } else if (hasK) {
                numericValue = parseFloat(target.replace('K', '').replace('+', ''));
            } else if (hasPercent) {
                numericValue = parseFloat(target.replace('%', '').replace('+', ''));
            } else {
                numericValue = parseFloat(target.replace('+', '').replace(',', ''));
            }

            let current = 0;
            const increment = numericValue / 50;
            const duration = 2000;
            const stepTime = duration / 50;

            const updateCounter = () => {
                current += increment;
                if (current < numericValue) {
                    let display = Math.floor(current);
                    if (hasK) display = display + 'K';
                    if (hasPercent) display = display + '%';
                    if (hasPlus && !hasK) display = display + '+';
                    if (hasPlus && hasK) display = display + '+';
                    counter.innerText = display;
                    setTimeout(updateCounter, stepTime);
                } else {
                    counter.innerText = target;
                }
            };

            updateCounter();
        });
    };

    // Intersection Observer for counter animation
    const statsSection = document.querySelector('.about-stats');

    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(statsSection);
    }

    // Add spinning animation style
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        .spinning {
            animation: spin 1s linear infinite;
        }
    `;
    document.head.appendChild(style);

    // Active nav link on scroll
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });

    console.log('🎓 EdumanagerApp Landing Page loaded successfully!');
});
