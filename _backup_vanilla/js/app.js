/* ============================================
   DISSLAPP — Main App Controller
   ============================================ */

(function () {
    'use strict';

    // Initialize auth
    Auth.init();

    // Initialize router
    Router.init();

    // ---- Theme Toggle ----
    const themeToggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('disslapp_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    themeToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('disslapp_theme', next);
    });

    // ---- Navbar Scroll ----
    const navbar = document.getElementById('main-navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ---- Hamburger Menu ----
    const hamburger = document.getElementById('hamburger-btn');
    const navLinks = document.getElementById('navbar-links');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('open');
    });

    // Close mobile menu on link click
    navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('open');
        });
    });

    // ---- Auth State UI ----
    function updateAuthUI(user) {
        const loginBtn = document.getElementById('login-btn');
        const userMenu = document.getElementById('user-menu');
        const userInitials = document.getElementById('user-initials');
        const dropdownName = document.getElementById('dropdown-name');
        const dropdownRole = document.getElementById('dropdown-role');

        if (user) {
            loginBtn.classList.add('hidden');
            userMenu.classList.remove('hidden');
            userInitials.textContent = user.avatar || user.name.charAt(0).toUpperCase();
            dropdownName.textContent = user.name;
            dropdownRole.textContent = user.role === 'psychologist' ? 'Psicólogo' : 'Paciente';
        } else {
            loginBtn.classList.remove('hidden');
            userMenu.classList.add('hidden');
        }
    }

    Auth.onAuthChange(updateAuthUI);
    updateAuthUI(Auth.getUser());

    // ---- User Dropdown Toggle ----
    const avatarBtn = document.getElementById('user-avatar-btn');
    const dropdown = document.getElementById('user-dropdown');

    avatarBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('hidden');
    });

    document.addEventListener('click', () => {
        dropdown.classList.add('hidden');
    });

    // ---- Logout ----
    document.getElementById('logout-btn').addEventListener('click', () => {
        Auth.logout();
    });

    // ---- Footer show/hide based on page ----
    document.addEventListener('page:rendered', (e) => {
        const footer = document.getElementById('main-footer');
        const path = e.detail.path;
        
        // Hide footer on login page
        if (path === '/login') {
            footer.style.display = 'none';
        } else {
            footer.style.display = '';
        }
    });

})();
