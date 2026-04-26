/* ============================================
   DISSLAPP — Hash Router
   ============================================ */

const Router = {
    routes: {},
    currentPage: null,

    register(path, renderFn) {
        this.routes[path] = renderFn;
    },

    navigate(path) {
        window.location.hash = path;
    },

    init() {
        window.addEventListener('hashchange', () => this._handleRoute());
        window.addEventListener('load', () => this._handleRoute());
    },

    _handleRoute() {
        const hash = window.location.hash.slice(1) || '/';
        const path = hash.split('?')[0];
        const content = document.getElementById('app-content');

        // Page exit animation
        content.classList.add('page-exit');

        setTimeout(() => {
            const renderFn = this.routes[path] || this.routes['/'];
            if (renderFn) {
                content.innerHTML = renderFn();
                this.currentPage = path;
                this._updateNavLinks(path);
                this._scrollToTop();
                this._initRevealAnimations();
                
                // Dispatch a custom event so pages can run post-render logic
                document.dispatchEvent(new CustomEvent('page:rendered', { detail: { path } }));
            }
            content.classList.remove('page-exit');
        }, 150);
    },

    _updateNavLinks(path) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === '#' + path) {
                link.classList.add('active');
            }
        });
    },

    _scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'instant' });
    },

    _initRevealAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    }
};
