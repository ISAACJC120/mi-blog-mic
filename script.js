/**
 * INTERACTIVE LOGIC & PEDAGOGICAL BLOG ANIMATIONS
 * MIC Quito - Frontend Programming
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. CORE VARIABLES ---
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navbar = document.getElementById('navbar');
    const progressBar = document.getElementById('progress-bar');
    const header = document.getElementById('main-header');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section, main');

    // --- 2. THEME TOGGLER (DARK / LIGHT MODE) ---
    // Check local storage or system default
    const savedTheme = localStorage.getItem('mic-blog-theme');
    if (savedTheme) {
        body.classList.remove('dark-theme', 'light-theme');
        body.classList.add(savedTheme);
    } else {
        // Default to dark theme as requested by style specs
        body.classList.add('dark-theme');
    }

    themeToggle.addEventListener('click', () => {
        if (body.classList.contains('dark-theme')) {
            body.classList.replace('dark-theme', 'light-theme');
            localStorage.setItem('mic-blog-theme', 'light-theme');
        } else {
            body.classList.replace('light-theme', 'dark-theme');
            localStorage.setItem('mic-blog-theme', 'dark-theme');
        }
    });

    // --- 3. RESPONSIVE MOBILE MENU ---
    const toggleMenu = () => {
        const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
        mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
        mobileMenuToggle.classList.toggle('active');
        navbar.classList.toggle('active');
    };

    mobileMenuToggle.addEventListener('click', toggleMenu);

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbar.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // --- 4. INTERACTIVE TABS (PEDAGOGICAL MODELS) ---
    const tabContainers = document.querySelectorAll('.experiment-info');

    tabContainers.forEach(container => {
        const tabs = container.querySelectorAll('.tab-btn');
        const panels = container.querySelectorAll('.tab-panel');

        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const targetId = tab.getAttribute('data-target');

                // Update active state of tabs
                tabs.forEach(t => {
                    t.classList.remove('active');
                    t.setAttribute('aria-selected', 'false');
                });
                tab.classList.add('active');
                tab.setAttribute('aria-selected', 'true');

                // Update active state of panels with transition
                panels.forEach(panel => {
                    if (panel.id === targetId) {
                        panel.style.display = 'block';
                        // Short delay to allow display change to register before animation triggers
                        setTimeout(() => {
                            panel.classList.add('active');
                        }, 20);
                    } else {
                        panel.style.display = 'none';
                        panel.classList.remove('active');
                    }
                });
            });
        });
    });

    // --- 5. READING PROGRESS & HEADER SHADOW ON SCROLL ---
    window.addEventListener('scroll', () => {
        // Calculate scroll percentage
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';

        // Toggle header scrolled class
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Active Navigation Link on Scroll
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= (sectionTop - 120)) {
                currentSection = section.getAttribute('id');
            }
        });

        // Corner case: at the bottom of the page
        if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 50) {
            currentSection = 'referencias';
        }

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });

    // --- 6. SCROLL REVEAL (ENTRANCE ANIMATION) ---
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        root: null, // viewport
        threshold: 0.15, // 15% of element visible
        rootMargin: '0px 0px -50px 0px' // offset bottom triggers slightly earlier
    });

    const revealElements = document.querySelectorAll('.scroll-reveal');
    revealElements.forEach(el => {
        revealObserver.observe(el);
    });
});
