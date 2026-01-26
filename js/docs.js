/**
 * EdumanagerApp - Documentation Page JavaScript
 */

// ============================================
// 🌓 DARK MODE TOGGLE
// ============================================
function initThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    const html = document.documentElement;

    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('docs-theme') || 'light';
    html.setAttribute('data-theme', savedTheme);
    updateLogo(savedTheme);

    // Sync checkbox state with saved theme
    if (toggle) {
        toggle.checked = savedTheme === 'dark';

        toggle.addEventListener('change', () => {
            const newTheme = toggle.checked ? 'dark' : 'light';
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('docs-theme', newTheme);
            updateLogo(newTheme);
        });
    }
}

function updateLogo(theme) {
    const logoImg = document.querySelector('.logo .logo-icon img');
    if (logoImg) {
        if (theme === 'dark') {
            logoImg.src = 'img/isotipoblanco.png';
        } else {
            logoImg.src = 'img/isotipoazul.png';
        }
    }
}

// Initialize theme immediately to prevent flash
(function () {
    const savedTheme = localStorage.getItem('docs-theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
})();

document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const sidebar = document.getElementById('docs-sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const navItems = document.querySelectorAll('.nav-item');
    const sectionToggles = document.querySelectorAll('.nav-section-toggle');
    const breadcrumbCurrent = document.getElementById('breadcrumb-current');
    const tocNav = document.getElementById('toc-nav');
    const navPrev = document.getElementById('nav-prev');
    const navNext = document.getElementById('nav-next');
    const prevTitle = document.getElementById('prev-title');
    const nextTitle = document.getElementById('next-title');

    // Topics configuration
    const topics = [
        { id: 'overview', title: 'Descripción General', section: 'intro' },
        { id: 'getting-started', title: 'Comenzar', section: 'intro' },
        { id: 'installation', title: 'Instalación', section: 'intro' },
        { id: 'requirements', title: 'Requisitos del Sistema', section: 'config' },
        { id: 'initial-setup', title: 'Configuración Inicial', section: 'config' },
        // { id: 'environment', title: 'Variables de Entorno', section: 'config' },
        { id: 'uploadNomina', title: 'Carga de Datos', section: 'config' },
        { id: 'students', title: 'Estudiantes', section: 'users' },
        { id: 'teachers', title: 'Docentes', section: 'users' },
        { id: 'admins', title: 'Administrativos', section: 'users' },
        { id: 'grades', title: 'Calificaciones', section: 'modules' },
        { id: 'attendance', title: 'Asistencia', section: 'modules' },
        { id: 'reports', title: 'Reportes', section: 'modules' },
        { id: 'communication', title: 'Comunicación', section: 'modules' },
        { id: 'authentication', title: 'Autenticación', section: 'api' },
        { id: 'endpoints', title: 'Endpoints', section: 'api' },
        { id: 'webhooks', title: 'Webhooks', section: 'api' },
        { id: 'general-faq', title: 'Preguntas Generales', section: 'faq' },
        { id: 'troubleshooting', title: 'Solución de Problemas', section: 'faq' }
    ];

    let currentTopicIndex = 0;

    // Mobile sidebar toggle
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');

            // Create/toggle overlay
            let overlay = document.querySelector('.sidebar-overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.className = 'sidebar-overlay';
                document.body.appendChild(overlay);

                overlay.addEventListener('click', () => {
                    sidebar.classList.remove('active');
                    overlay.classList.remove('active');
                });
            }
            overlay.classList.toggle('active');
        });
    }

    // Section toggle
    sectionToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const section = toggle.closest('.nav-section');
            const items = section.querySelector('.nav-section-items');
            const isActive = toggle.classList.contains('active');

            // Toggle current section
            toggle.classList.toggle('active');
            items.classList.toggle('show');
        });
    });

    // Topic navigation
    navItems.forEach((item, index) => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const topicId = item.dataset.topic;
            navigateToTopic(topicId);
        });
    });

    // Navigate to specific topic
    function navigateToTopic(topicId) {
        const topicIndex = topics.findIndex(t => t.id === topicId);
        if (topicIndex === -1) return;

        currentTopicIndex = topicIndex;
        const topic = topics[topicIndex];

        // Hide all topics
        document.querySelectorAll('.topic-content').forEach(el => {
            el.classList.add('hidden');
        });

        // Show selected topic
        const topicElement = document.getElementById(`topic-${topicId}`);
        if (topicElement) {
            topicElement.classList.remove('hidden');
        }

        // Update active nav item
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.topic === topicId) {
                item.classList.add('active');

                // Expand parent section
                const section = item.closest('.nav-section');
                const toggle = section.querySelector('.nav-section-toggle');
                const items = section.querySelector('.nav-section-items');
                toggle.classList.add('active');
                items.classList.add('show');
            }
        });

        // Update breadcrumb
        if (breadcrumbCurrent) {
            breadcrumbCurrent.textContent = topic.title;
        }

        // Update TOC
        updateTableOfContents(topicId);

        // Update prev/next navigation
        updateNavigation(topicIndex);

        // Close mobile sidebar
        sidebar.classList.remove('active');
        const overlay = document.querySelector('.sidebar-overlay');
        if (overlay) overlay.classList.remove('active');

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Update URL hash
        history.pushState(null, '', `#${topicId}`);
    }

    // Update table of contents based on current topic
    function updateTableOfContents(topicId) {
        if (!tocNav) return;

        const topicElement = document.getElementById(`topic-${topicId}`);
        if (!topicElement) return;

        // Get all h2 headings in the topic
        const headings = topicElement.querySelectorAll('h2[id]');

        tocNav.innerHTML = '';

        headings.forEach(heading => {
            const link = document.createElement('a');
            link.href = `#${heading.id}`;
            link.className = 'toc-link';
            link.textContent = heading.textContent;
            link.addEventListener('click', (e) => {
                e.preventDefault();
                heading.scrollIntoView({ behavior: 'smooth' });
            });
            tocNav.appendChild(link);
        });
    }

    // Update prev/next navigation
    function updateNavigation(index) {
        // Previous
        if (index > 0) {
            const prevTopic = topics[index - 1];
            prevTitle.textContent = prevTopic.title;
            navPrev.classList.remove('disabled');
            navPrev.onclick = (e) => {
                e.preventDefault();
                navigateToTopic(prevTopic.id);
            };
        } else {
            prevTitle.textContent = '-';
            navPrev.classList.add('disabled');
            navPrev.onclick = null;
        }

        // Next
        if (index < topics.length - 1) {
            const nextTopic = topics[index + 1];
            nextTitle.textContent = nextTopic.title;
            navNext.classList.remove('disabled');
            navNext.onclick = (e) => {
                e.preventDefault();
                navigateToTopic(nextTopic.id);
            };
        } else {
            nextTitle.textContent = '-';
            navNext.classList.add('disabled');
            navNext.onclick = null;
        }
    }

    // Copy button functionality
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const codeBlock = btn.closest('.code-block');
            const code = codeBlock.querySelector('code').textContent;

            navigator.clipboard.writeText(code).then(() => {
                const originalHTML = btn.innerHTML;
                btn.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 6L9 17l-5-5"/>
                    </svg>
                    ¡Copiado!
                `;
                btn.style.color = '#10b981';

                setTimeout(() => {
                    btn.innerHTML = originalHTML;
                    btn.style.color = '';
                }, 2000);
            });
        });
    });

    // Keyboard navigation (Ctrl+K for search)
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.getElementById('docs-search-input');
            if (searchInput) searchInput.focus();
        }
    });

    // Scroll spy for TOC
    function initScrollSpy() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    document.querySelectorAll('.toc-link').forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, {
            rootMargin: '-20% 0px -80% 0px'
        });

        document.querySelectorAll('.article-content h2[id]').forEach(heading => {
            observer.observe(heading);
        });
    }

    // Handle initial hash
    function handleInitialHash() {
        const hash = window.location.hash.slice(1);
        if (hash) {
            const topic = topics.find(t => t.id === hash);
            if (topic) {
                navigateToTopic(hash);
                return;
            }
        }
        // Default to overview
        navigateToTopic('overview');
    }

    // Handle browser back/forward
    window.addEventListener('popstate', () => {
        handleInitialHash();
    });

    // Initialize
    initThemeToggle();
    handleInitialHash();
    initScrollSpy();

    console.log('📚 EdumanagerApp Docs loaded successfully!');
});
