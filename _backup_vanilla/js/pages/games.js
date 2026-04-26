/* ============================================
   DISSLAPP — Games Section
   ============================================ */

function renderGames() {
    const games = AppData.games;
    const skills = [...new Set(games.map(g => g.skill))];

    return `
    <div class="games-page">
        <div class="container">
            <div class="games-header animate-fade-in-up">
                <h1>🎮 Juegos Terapéuticos</h1>
                <p>Selecciona un juego para practicar y ganar XP. Cada juego trabaja una habilidad diferente.</p>
            </div>

            <div class="games-filters animate-fade-in-up" id="games-filters" style="animation-delay:0.1s">
                <button class="filter-chip active" data-filter="all">Todos</button>
                ${skills.map(s => `<button class="filter-chip" data-filter="${s}">${s}</button>`).join('')}
            </div>

            <div class="games-grid" id="games-grid">
                ${games.map((game, i) => renderGameCard(game, i)).join('')}
            </div>
        </div>
    </div>
    `;
}

function renderGameCard(game, index) {
    const starsHtml = Array.from({ length: game.maxStars }, (_, i) =>
        `<span class="game-star ${i < game.stars ? 'filled' : ''}">★</span>`
    ).join('');

    return `
    <div class="card game-card card-glow animate-fade-in-up ${game.locked ? 'locked' : ''}"
         data-skill="${game.skill}" data-game-id="${game.id}"
         style="animation-delay:${0.1 + index * 0.08}s"
         ${!game.locked ? `onclick="openGame(${game.id})"` : ''}>
        ${game.recommended ? '<div class="game-recommended">⭐ Recomendado</div>' : ''}
        <div class="game-card-image">${game.emoji}</div>
        <div class="game-card-body">
            <div class="game-card-tags">
                <span class="badge badge-purple">${game.skill}</span>
                <span class="badge badge-green">Nivel ${game.level}</span>
            </div>
            <h3>${game.name}</h3>
            <p>${game.description}</p>
            <div class="game-card-footer">
                <div class="game-stars">${starsHtml}</div>
                <span class="game-level-req">Nivel ${game.level}+</span>
            </div>
        </div>
    </div>
    `;
}

// Filter logic
document.addEventListener('page:rendered', (e) => {
    if (e.detail.path === '/juegos') {
        initGamesFilters();
    }
});

function initGamesFilters() {
    const chips = document.querySelectorAll('.filter-chip');
    const cards = document.querySelectorAll('.game-card');

    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            chips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            const filter = chip.getAttribute('data-filter');

            cards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-skill') === filter) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Open game modal
function openGame(gameId) {
    const game = AppData.games.find(g => g.id === gameId);
    if (!game || game.locked) return;

    switch (game.type) {
        case 'word-scramble':
            openWordScrambleGame(game);
            break;
        case 'word-compare':
            openWordCompareGame(game);
            break;
        case 'syllable-build':
            openSyllableBuildGame(game);
            break;
        default:
            openGenericGame(game);
    }
}

// --- Word Scramble Game ---
function openWordScrambleGame(game) {
    const words = AppData.gameWords.easy;
    const word = words[Math.floor(Math.random() * words.length)];
    const scrambled = word.split('').sort(() => Math.random() - 0.5).join('');

    const overlay = document.createElement('div');
    overlay.className = 'game-play-overlay';
    overlay.id = 'game-overlay';
    overlay.innerHTML = `
        <div class="game-play-modal">
            <div class="game-play-header">
                <h2>${game.emoji} ${game.name}</h2>
                <button class="game-close-btn" onclick="closeGame()">✕</button>
            </div>
            <div class="game-play-area">
                <p class="game-instruction">Ordena las letras para formar una palabra:</p>
                <div class="game-word-display" id="scrambled-word">${scrambled}</div>
                <div style="width:100%;max-width:300px;">
                    <input type="text" class="form-input" id="word-answer" placeholder="Escribe la palabra..." style="text-align:center;font-size:var(--font-size-xl);font-weight:700;text-transform:uppercase;letter-spacing:4px;" autofocus>
                </div>
                <button class="btn btn-primary btn-lg" id="check-word-btn" onclick="checkWordAnswer('${word}')">Comprobar ✓</button>
                <div id="word-feedback"></div>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    // Allow Enter key
    setTimeout(() => {
        const input = document.getElementById('word-answer');
        if (input) {
            input.focus();
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') checkWordAnswer(word);
            });
        }
    }, 100);
}

function checkWordAnswer(correctWord) {
    const input = document.getElementById('word-answer');
    const answer = input.value.trim().toUpperCase();
    const feedback = document.getElementById('word-feedback');

    if (answer === correctWord) {
        const xp = 100;
        feedback.innerHTML = '';
        showGameResults(true, xp, 3);
        if (Auth.isLoggedIn()) Auth.updateXP(xp);
    } else {
        input.classList.add('animate-wiggle');
        feedback.innerHTML = '<p style="color:#EF4444;font-weight:700;margin-top:var(--space-4);">¡Inténtalo de nuevo! 💪</p>';
        setTimeout(() => input.classList.remove('animate-wiggle'), 600);
    }
}

// --- Word Compare Game ---
function openWordCompareGame(game) {
    const pair = AppData.wordPairs[Math.floor(Math.random() * AppData.wordPairs.length)];

    const overlay = document.createElement('div');
    overlay.className = 'game-play-overlay';
    overlay.id = 'game-overlay';
    overlay.innerHTML = `
        <div class="game-play-modal">
            <div class="game-play-header">
                <h2>${game.emoji} ${game.name}</h2>
                <button class="game-close-btn" onclick="closeGame()">✕</button>
            </div>
            <div class="game-play-area">
                <p class="game-instruction">¿Estas dos palabras son iguales o diferentes?</p>
                <div style="display:flex;gap:var(--space-8);align-items:center;">
                    <div class="game-word-display" style="font-size:var(--font-size-4xl)">${pair.word1}</div>
                    <span style="font-size:var(--font-size-2xl);color:var(--text-muted)">vs</span>
                    <div class="game-word-display" style="font-size:var(--font-size-4xl)">${pair.word2}</div>
                </div>
                <div class="game-options">
                    <button class="game-option-btn" onclick="checkCompareAnswer(${pair.same}, true, this)">✅ Iguales</button>
                    <button class="game-option-btn" onclick="checkCompareAnswer(${pair.same}, false, this)">❌ Diferentes</button>
                </div>
                <div id="compare-feedback"></div>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
}

function checkCompareAnswer(isSame, answeredSame, btn) {
    const correct = isSame === answeredSame;
    const buttons = document.querySelectorAll('.game-option-btn');
    buttons.forEach(b => b.disabled = true);

    if (correct) {
        btn.classList.add('correct');
        const xp = 75;
        setTimeout(() => showGameResults(true, xp, 3), 800);
        if (Auth.isLoggedIn()) Auth.updateXP(xp);
    } else {
        btn.classList.add('wrong');
        setTimeout(() => showGameResults(false, 25, 1), 800);
        if (Auth.isLoggedIn()) Auth.updateXP(25);
    }
}

// --- Syllable Build Game ---
function openSyllableBuildGame(game) {
    const wordData = AppData.syllableWords[Math.floor(Math.random() * AppData.syllableWords.length)];
    const shuffled = [...wordData.syllables].sort(() => Math.random() - 0.5);

    const overlay = document.createElement('div');
    overlay.className = 'game-play-overlay';
    overlay.id = 'game-overlay';
    overlay.innerHTML = `
        <div class="game-play-modal">
            <div class="game-play-header">
                <h2>${game.emoji} ${game.name}</h2>
                <button class="game-close-btn" onclick="closeGame()">✕</button>
            </div>
            <div class="game-play-area">
                <p class="game-instruction">Haz clic en las sílabas en orden para formar: <strong style="color:var(--purple-600);">${wordData.word}</strong></p>
                <div id="syllable-result" style="min-height:60px;display:flex;gap:var(--space-2);flex-wrap:wrap;justify-content:center;"></div>
                <div class="game-options" id="syllable-options">
                    ${shuffled.map(s => `<button class="game-option-btn" onclick="pickSyllable(this, '${s}')">${s}</button>`).join('')}
                </div>
                <button class="btn btn-ghost" onclick="resetSyllables()">🔄 Reiniciar</button>
                <div id="syllable-feedback"></div>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    window._syllableTarget = wordData.syllables;
    window._syllablePicked = [];
}

function pickSyllable(btn, syllable) {
    window._syllablePicked.push(syllable);
    btn.disabled = true;
    btn.style.opacity = '0.3';

    const result = document.getElementById('syllable-result');
    const chip = document.createElement('span');
    chip.className = 'badge badge-purple';
    chip.style.cssText = 'font-size:var(--font-size-xl); padding: var(--space-2) var(--space-4);';
    chip.textContent = syllable;
    chip.classList.add('animate-scale-in');
    result.appendChild(chip);

    if (window._syllablePicked.length === window._syllableTarget.length) {
        const correct = window._syllablePicked.join('') === window._syllableTarget.join('');
        if (correct) {
            const xp = 100;
            setTimeout(() => showGameResults(true, xp, 3), 600);
            if (Auth.isLoggedIn()) Auth.updateXP(xp);
        } else {
            setTimeout(() => showGameResults(false, 25, 1), 600);
            if (Auth.isLoggedIn()) Auth.updateXP(25);
        }
    }
}

function resetSyllables() {
    window._syllablePicked = [];
    const result = document.getElementById('syllable-result');
    result.innerHTML = '';
    document.querySelectorAll('#syllable-options .game-option-btn').forEach(b => {
        b.disabled = false;
        b.style.opacity = '1';
    });
}

// --- Generic Game (for locked/other types) ---
function openGenericGame(game) {
    const overlay = document.createElement('div');
    overlay.className = 'game-play-overlay';
    overlay.id = 'game-overlay';
    overlay.innerHTML = `
        <div class="game-play-modal">
            <div class="game-play-header">
                <h2>${game.emoji} ${game.name}</h2>
                <button class="game-close-btn" onclick="closeGame()">✕</button>
            </div>
            <div class="game-play-area">
                <div style="font-size:80px">${game.emoji}</div>
                <p class="game-instruction" style="font-size:var(--font-size-xl)">¡Este juego estará disponible pronto!</p>
                <p class="game-instruction">Estamos preparando una experiencia increíble para ti. Mientras tanto, prueba los otros juegos disponibles.</p>
                <button class="btn btn-primary" onclick="closeGame()">Volver al Catálogo</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
}

// --- Show results ---
function showGameResults(won, xp, stars) {
    const overlay = document.getElementById('game-overlay');
    if (!overlay) return;

    const modal = overlay.querySelector('.game-play-modal');
    const starsHtml = Array.from({ length: 3 }, (_, i) =>
        `<span class="animate-star-pop" style="animation-delay:${0.2 + i * 0.2}s">${i < stars ? '⭐' : '☆'}</span>`
    ).join('');

    modal.innerHTML = `
        <div class="game-results">
            <div class="results-emoji">${won ? '🎉' : '💪'}</div>
            <div class="results-score">${won ? '¡Excelente!' : '¡Buen intento!'}</div>
            <div class="results-xp">+${xp} XP</div>
            <div class="results-stars">${starsHtml}</div>
            <div class="results-actions">
                <button class="btn btn-primary" onclick="closeGame(); setTimeout(() => Router.navigate('/juegos'), 200);">Seguir Jugando</button>
                <button class="btn btn-secondary" onclick="closeGame(); setTimeout(() => Router.navigate('/avances'), 200);">Ver Avances</button>
            </div>
        </div>
    `;

    if (won) {
        // Trigger confetti
        if (typeof launchConfetti === 'function') launchConfetti();
    }
}

function closeGame() {
    const overlay = document.getElementById('game-overlay');
    if (overlay) overlay.remove();
}

Router.register('/juegos', renderGames);
