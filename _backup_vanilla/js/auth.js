/* ============================================
   DISSLAPP — Auth State
   ============================================ */

const Auth = {
    _user: null,
    _listeners: [],

    init() {
        const saved = localStorage.getItem('disslapp_user');
        if (saved) {
            try {
                this._user = JSON.parse(saved);
                this._notifyListeners();
            } catch(e) {
                localStorage.removeItem('disslapp_user');
            }
        }
    },

    login(username, password, role = 'patient') {
        // Demo login - accept any credentials
        const user = {
            id: Date.now(),
            name: username || 'Paciente Demo',
            role: role,
            xp: 1250,
            level: 2,
            levelName: 'Aventurero',
            streak: 5,
            totalSessions: 24,
            totalGamesPlayed: 87,
            joinDate: '2026-01-15',
            avatar: username ? username.charAt(0).toUpperCase() : 'P'
        };

        this._user = user;
        localStorage.setItem('disslapp_user', JSON.stringify(user));
        this._notifyListeners();
        return user;
    },

    logout() {
        this._user = null;
        localStorage.removeItem('disslapp_user');
        this._notifyListeners();
        Router.navigate('/');
    },

    getUser() {
        return this._user;
    },

    isLoggedIn() {
        return this._user !== null;
    },

    onAuthChange(fn) {
        this._listeners.push(fn);
    },

    _notifyListeners() {
        this._listeners.forEach(fn => fn(this._user));
    },

    updateXP(amount) {
        if (this._user) {
            this._user.xp += amount;
            // Check for level up
            const levels = [
                { min: 0, max: 499, level: 1, name: 'Explorador', emoji: '🌱' },
                { min: 500, max: 1499, level: 2, name: 'Aventurero', emoji: '🌟' },
                { min: 1500, max: 3499, level: 3, name: 'Constructor', emoji: '🚀' },
                { min: 3500, max: 6999, level: 4, name: 'Narrador', emoji: '🦁' },
                { min: 7000, max: 9999, level: 5, name: 'Maestro', emoji: '📖' },
                { min: 10000, max: Infinity, level: 6, name: 'Maestro Disslapp', emoji: '🏆' }
            ];
            const currentLevel = levels.find(l => this._user.xp >= l.min && this._user.xp <= l.max);
            if (currentLevel && currentLevel.level > this._user.level) {
                this._user.level = currentLevel.level;
                this._user.levelName = currentLevel.name;
                // Trigger celebration
                document.dispatchEvent(new CustomEvent('levelUp', { detail: currentLevel }));
            }
            localStorage.setItem('disslapp_user', JSON.stringify(this._user));
        }
    }
};
