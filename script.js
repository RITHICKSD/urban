
// Mobile dropdown toggle logic
document.addEventListener('DOMContentLoaded', function () {
    function isMobile() {
        return window.innerWidth <= 900;
    }
    const dropdownToggles = document.querySelectorAll('.nav-dropdown-toggle');
    dropdownToggles.forEach(function (toggle) {
        toggle.addEventListener('click', function (e) {
            if (isMobile()) {
                e.preventDefault();
                const parent = toggle.closest('.nav-item');
                // Close other open dropdowns
                document.querySelectorAll('.nav-item.open').forEach(function (item) {
                    if (item !== parent) item.classList.remove('open');
                });
                parent.classList.toggle('open');
            }
        });
    });
    // Close dropdowns when clicking outside
    document.addEventListener('click', function (e) {
        if (!isMobile()) return;
        const navMenu = document.querySelector('.nav-menu');
        if (!navMenu) return;
        if (!navMenu.contains(e.target)) {
            document.querySelectorAll('.nav-item.open').forEach(function (item) {
                item.classList.remove('open');
            });
        }
    });
});

// Optional: Close menu when clicking outside (mobile)
// Moved inside DOMContentLoaded to avoid null errors
// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    lucide.createIcons();

    // 2. Theme Toggle Logic (Dark/Light Mode)
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const lightIcon = document.getElementById('theme-icon-light');
    const darkIcon = document.getElementById('theme-icon-dark');

    // Persistence Check
    if (localStorage.getItem('urban-roots-theme') === 'dark') {
        htmlElement.setAttribute('data-theme', 'dark');
        if (lightIcon) lightIcon.style.display = 'none';
        if (darkIcon) darkIcon.style.display = 'flex';
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = htmlElement.getAttribute('data-theme') === 'dark';
            if (isDark) {
                htmlElement.setAttribute('data-theme', 'light');
                if (lightIcon) lightIcon.style.display = 'flex';
                if (darkIcon) darkIcon.style.display = 'none';
                localStorage.setItem('urban-roots-theme', 'light');
            } else {
                htmlElement.setAttribute('data-theme', 'dark');
                if (lightIcon) lightIcon.style.display = 'none';
                if (darkIcon) darkIcon.style.display = 'flex';
                localStorage.setItem('urban-roots-theme', 'dark');
            }
        });
    }

    // 3. RTL / LTR Toggle Logic
    const rtlToggle = document.getElementById('rtl-toggle');
    if (rtlToggle) {
        rtlToggle.addEventListener('click', () => {
            const currentDir = htmlElement.getAttribute('dir');
            const newDir = currentDir === 'ltr' ? 'rtl' : 'ltr';
            htmlElement.setAttribute('dir', newDir);
            htmlElement.setAttribute('lang', newDir === 'rtl' ? 'ar' : 'en'); // Simplified lang switch for demo
        });
    }

    // 4. Reveal Animations on Scroll
    const reveals = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        reveals.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            const elementVisible = 150;
            if (elementTop < windowHeight - elementVisible) {
                el.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check

    // 4. Robust Stat Counter Animation
    const animateCounter = (el) => {
        const target = parseFloat(el.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const start = 0;
        const startTime = performance.now();

        const update = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(progress * (target - start) + start);
            
            if (target > 1000) {
                el.innerText = (current / 1000).toFixed(1) + 'k';
            } else {
                el.innerText = current;
            }

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                if (target > 1000) {
                    el.innerText = (target / 1000).toFixed(1) + 'k';
                } else {
                    el.innerText = target;
                }
            }
        };
        requestAnimationFrame(update);
    };

    // 5. Active Link Highlight Logic
    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll(".nav-link");

    navLinks.forEach(link => {
        const linkPath = link.getAttribute("href");
        if (linkPath === currentPath) {
            link.classList.add("active");
            // If inside a dropdown, highlight the parent too
            const dropdown = link.closest(".dropdown-menu");
            if (dropdown) {
                const parentToggle = dropdown.parentElement.querySelector(".nav-dropdown-toggle");
                if (parentToggle) parentToggle.classList.add("active");
            }
        } else {
            // Remove active if manually set in HTML but not current page
            link.classList.remove("active");
        }
    });

    const statNumbers = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    statNumbers.forEach(num => statsObserver.observe(num));

    // 6. Mobile Menu (Simple Sidebar / Overlay)
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            mobileToggle.classList.toggle('open');
            mobileToggle.setAttribute('aria-label', navMenu.classList.contains('open') ? 'Close menu' : 'Open menu');
        });
    }

    // 7. Dashboard Sidebar Toggle Logic
    const dashboardSidebar = document.querySelector('.dashboard-sidebar');
    const dashboardMenuToggle = document.querySelector('.dashboard-menu-toggle');
    const sidebarOverlay = document.querySelector('.sidebar-overlay');

    if (dashboardSidebar && dashboardMenuToggle) {
        const toggleSidebar = (e) => {
            if (e) e.stopPropagation();
            dashboardSidebar.classList.toggle('active');
            dashboardMenuToggle.classList.toggle('open');
            if (sidebarOverlay) sidebarOverlay.classList.toggle('active');
        };

        const closeSidebar = () => {
            dashboardSidebar.classList.remove('active');
            dashboardMenuToggle.classList.remove('open');
            if (sidebarOverlay) sidebarOverlay.classList.remove('active');
        };

        dashboardMenuToggle.addEventListener('click', toggleSidebar);

        if (sidebarOverlay) {
            sidebarOverlay.addEventListener('click', closeSidebar);
        }

        // Close on window resize if switching to desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth > 1200) {
                closeSidebar();
            }
        });
    }

    // 10. Header Styling on Scroll
    const header = document.getElementById('main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.style.padding = '0.5rem 0';
                header.style.background = 'var(--glass-bg)';
            } else {
                header.style.padding = '1rem 0';
            }
        });
    }

    // Optional: Close menu when clicking outside (mobile)
    document.addEventListener('click', function (e) {
        const navMenu = document.querySelector('.nav-menu');
        const hamburger = document.querySelector('.mobile-menu-toggle');
        const rtlToggle = document.querySelector('#rtl-toggle');
        const themeToggle = document.querySelector('#theme-toggle');
        if (!navMenu || !hamburger) return;
        const clickedOutsideNav = !navMenu.contains(e.target);
        const clickedOutsideHamburger = !hamburger.contains(e.target);
        const clickedOutsideRtl = !rtlToggle || !rtlToggle.contains(e.target);
        const clickedOutsideTheme = !themeToggle || !themeToggle.contains(e.target);

        if (clickedOutsideNav && clickedOutsideHamburger && clickedOutsideRtl && clickedOutsideTheme) {
            navMenu.classList.remove('open');
        }
    });

    // 8. FAQ Accordion Logic (Bulletproof Toggle)
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const title = item.querySelector('.faq-title');
        title.addEventListener('click', () => {
            // Toggle the current item
            const isActive = item.classList.toggle('active');

            // Sync the icon (plus/minus) - Target by attribute since <i> becomes <svg>
            const icon = item.querySelector('[data-lucide="plus"], [data-lucide="minus"]');
            if (icon) {
                if (isActive) {
                    icon.setAttribute('data-lucide', 'minus');
                } else {
                    icon.setAttribute('data-lucide', 'plus');
                }
                // Refresh only the icons in the clicked item
                lucide.createIcons();
            }
        });
    });

    // 11. Dashboard Charts Initialization (4 Pie Charts)
    if (typeof Chart !== 'undefined') {
        const initPieChart = (id, labels, data) => {
            const ctx = document.getElementById(id);
            if (!ctx) return;

            const chartColors = [
                '#2d5a27', '#d4af37', '#4caf50', '#8d6e63', '#64b5f6', '#ffb74d'
            ];

            new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: labels,
                    datasets: [{
                        data: data,
                        backgroundColor: chartColors,
                        borderWidth: 1,
                        borderColor: 'transparent'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                font: { size: 10 },
                                padding: 8,
                                boxWidth: 10
                            }
                        }
                    }
                }
            });
        };

        // Initialize the 4 specific pie charts with relevant urban farming data
        initPieChart('pie-chart-1', ['Tomatoes', 'Lettuce', 'Kale', 'Herbs'], [35, 25, 20, 20]);
        initPieChart('pie-chart-2', ['Moist', 'Optimal', 'Dry', 'Critical'], [15, 65, 10, 10]);
        initPieChart('pie-chart-3', ['Pending', 'Growing', 'Harvested', 'Failed'], [10, 50, 35, 5]);
        initPieChart('pie-chart-4', ['Spring', 'Summer', 'Autumn', 'Winter'], [30, 40, 20, 10]);
    }

});
