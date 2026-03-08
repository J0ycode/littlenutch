/* ==============================
   LittleNutch — Main JavaScript
   ============================== */

document.addEventListener('DOMContentLoaded', () => {

    // ---------- Scroll Reveal (Intersection Observer) ----------
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger the animation for siblings
                const siblings = entry.target.parentElement.querySelectorAll('.reveal');
                let delay = 0;
                siblings.forEach((sibling, i) => {
                    if (sibling === entry.target) {
                        delay = i * 80;
                    }
                });
                setTimeout(() => {
                    entry.target.classList.add('active');
                }, delay);
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));


    // ---------- Sticky Navbar ----------
    const navbar = document.getElementById('navbar');
    let lastScrollY = 0;

    const handleScroll = () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Run on load


    // ---------- Mobile Hamburger Menu ----------
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('open');
            navLinks.classList.toggle('open');
            document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
        });

        // Close menu when a link is clicked
        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('open');
                navLinks.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }


    // ---------- Smooth Scroll for Anchor Links ----------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navHeight = navbar.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });


    // ---------- Product Card Tilt Effect ----------
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -3;
            const rotateY = ((x - centerX) / centerX) * 3;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });


    // ---------- Active Nav Link Highlight on Scroll ----------
    const sections = document.querySelectorAll('section[id]');
    const navLinkElements = document.querySelectorAll('.nav-link:not(.nav-cta)');

    const updateActiveNav = () => {
        const scrollPos = window.scrollY + navbar.offsetHeight + 100;

        sections.forEach(section => {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < bottom) {
                navLinkElements.forEach(link => {
                    link.classList.remove('active-link');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active-link');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', updateActiveNav, { passive: true });


    // ---------- Counter Animation for Hero Stats ----------
    const statNums = document.querySelectorAll('.hero-stat-num');
    let statsAnimated = false;

    const animateStats = () => {
        if (statsAnimated) return;
        statsAnimated = true;

        statNums.forEach(stat => {
            const text = stat.textContent;
            const numMatch = text.match(/(\d+)/);
            if (!numMatch) return;

            const target = parseInt(numMatch[1]);
            const suffix = text.replace(numMatch[1], '');
            let current = 0;
            const increment = Math.ceil(target / 40);
            const duration = 1200;
            const stepTime = duration / (target / increment);

            const counter = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(counter);
                }
                stat.textContent = current + suffix;
            }, stepTime);
        });
    };

    // Trigger counter on hero visible
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(animateStats, 800);
                heroObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    const heroSection = document.getElementById('hero');
    if (heroSection) heroObserver.observe(heroSection);

});
