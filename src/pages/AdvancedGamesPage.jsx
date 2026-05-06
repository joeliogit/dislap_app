/* ============================================
   DISSLAPP — Advanced Games Page
   5 new game mechanics for dyslexia therapy
   ============================================ */

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { launchConfetti } from '../utils/confetti';

/* ─── Game Data ──────────────────────────────── */

const MEMORAMA_PAIRS = [
  { id: 1, word: 'GATO',  emoji: '🐱' },
  { id: 2, word: 'PERRO', emoji: '🐶' },
  { id: 3, word: 'CASA',  emoji: '🏠' },
  { id: 4, word: 'SOL',   emoji: '☀️' },
  { id: 5, word: 'LUNA',  emoji: '🌙' },
  { id: 6, word: 'ÁRBOL', emoji: '🌳' },
  { id: 7, word: 'FLOR',  emoji: '🌸' },
  { id: 8, word: 'LIBRO', emoji: '📚' },
];

const IMAN_WORDS = [
  { word: 'GATO',  emoji: '🐱', hint: 'Animal con bigotes' },
  { word: 'LUNA',  emoji: '🌙', hint: 'Brilla en la noche' },
  { word: 'MESA',  emoji: '🪑', hint: 'Mueble para comer' },
  { word: 'LIBRO', emoji: '📚', hint: 'Para leer historias' },
  { word: 'FLOR',  emoji: '🌸', hint: 'Parte de una planta' },
  { word: 'PATO',  emoji: '🦆', hint: 'Ave que nada' },
  { word: 'NUBE',  emoji: '☁️', hint: 'Flota en el cielo' },
  { word: 'PINO',  emoji: '🌲', hint: 'Árbol de Navidad' },
];

const LLUVIA_POOL = [
  { text: 'casa',  correct: true  }, { text: 'kasa',   correct: false },
  { text: 'luna',  correct: true  }, { text: 'lhuna',  correct: false },
  { text: 'gato',  correct: true  }, { text: 'cato',   correct: false },
  { text: 'mesa',  correct: true  }, { text: 'meza',   correct: false },
  { text: 'libro', correct: true  }, { text: 'lhibro', correct: false },
  { text: 'flor',  correct: true  }, { text: 'flhor',  correct: false },
  { text: 'perro', correct: true  }, { text: 'parro',  correct: false },
  { text: 'pato',  correct: true  }, { text: 'patto',  correct: false },
  { text: 'nube',  correct: true  }, { text: 'nuve',   correct: false },
  { text: 'sol',   correct: true  }, { text: 'zol',    correct: false },
  { text: 'árbol', correct: true  }, { text: 'harbol', correct: false },
  { text: 'pino',  correct: true  }, { text: 'phino',  correct: false },
];

const ESCUCHA_WORDS = [
  'gato', 'perro', 'casa', 'luna', 'libro',
  'flor', 'árbol', 'sol', 'mesa', 'pato',
  'nube', 'verde', 'pluma', 'bravo', 'globo',
];

const SOPA_WORDS = ['GATO', 'SOL', 'LUNA', 'CASA', 'FLOR', 'PATO', 'NUBE', 'PINO'];
const SOPA_SIZE  = 10;

/* ─── Utilities ──────────────────────────────── */

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildMemoCards() {
  const cards = [];
  MEMORAMA_PAIRS.forEach(p => {
    cards.push({ uid: `w${p.id}`, pairId: p.id, content: p.word,  face: 'word'  });
    cards.push({ uid: `e${p.id}`, pairId: p.id, content: p.emoji, face: 'emoji' });
  });
  return shuffle(cards);
}

function buildWordSearch() {
  const grid = Array.from({ length: SOPA_SIZE }, () =>
    Array.from({ length: SOPA_SIZE }, () => ({ letter: '', wordId: null }))
  );
  const DIRS = [[0,1],[1,0],[1,1],[0,-1],[-1,0],[-1,-1],[1,-1],[-1,1]];
  const placed = [];

  for (let wi = 0; wi < SOPA_WORDS.length; wi++) {
    const word = SOPA_WORDS[wi];
    let done = false;
    let tries = 0;
    while (!done && tries++ < 300) {
      const [dr, dc] = DIRS[Math.floor(Math.random() * DIRS.length)];
      const r0 = Math.floor(Math.random() * SOPA_SIZE);
      const c0 = Math.floor(Math.random() * SOPA_SIZE);
      const rE = r0 + dr * (word.length - 1);
      const cE = c0 + dc * (word.length - 1);
      if (rE < 0 || rE >= SOPA_SIZE || cE < 0 || cE >= SOPA_SIZE) continue;
      let canPlace = true;
      for (let i = 0; i < word.length; i++) {
        const cell = grid[r0 + dr * i][c0 + dc * i];
        if (cell.letter && cell.letter !== word[i]) { canPlace = false; break; }
      }
      if (!canPlace) continue;
      const cells = [];
      for (let i = 0; i < word.length; i++) {
        const r = r0 + dr * i, c = c0 + dc * i;
        grid[r][c] = { letter: word[i], wordId: wi };
        cells.push({ r, c });
      }
      placed.push({ word, wordId: wi, cells });
      done = true;
    }
  }

  const ALPHA = 'ABCDEFGHIJKLMNOPRSTUVZ';
  for (let r = 0; r < SOPA_SIZE; r++)
    for (let c = 0; c < SOPA_SIZE; c++)
      if (!grid[r][c].letter)
        grid[r][c] = { letter: ALPHA[Math.floor(Math.random() * ALPHA.length)], wordId: null };

  return { grid, placed };
}

/* ─── Catalog metadata ───────────────────────── */

const GAME_CATALOG = [
  { id: 'memorama', name: 'Memorama de Palabras', emoji: '🃏', skill: 'Memoria visual',
    description: 'Voltea cartas y encuentra pares de palabras e imágenes.',
    gradient: 'linear-gradient(135deg, #6D28D9 0%, #7C3AED 100%)' },
  { id: 'iman',     name: 'Imán de Letras',       emoji: '🧲', skill: 'Decodificación',
    description: 'Toca las letras para armar la palabra que corresponde a la imagen.',
    gradient: 'linear-gradient(135deg, #DC2626 0%, #F87171 100%)' },
  { id: 'lluvia',   name: 'Lluvia de Palabras',   emoji: '⚡', skill: 'Fluidez lectora',
    description: 'Haz clic en las palabras bien escritas antes de que caigan.',
    gradient: 'linear-gradient(135deg, #BE185D 0%, #EC4899 100%)' },
  { id: 'escucha',  name: 'Escucha y Escribe',    emoji: '🔊', skill: 'Discriminación auditiva',
    description: 'Escucha la palabra y escríbela correctamente.',
    gradient: 'linear-gradient(135deg, #059669 0%, #34D399 100%)' },
  { id: 'sopa',     name: 'Sopa de Letras',       emoji: '🔍', skill: 'Reconocimiento visual',
    description: 'Encuentra las palabras ocultas en el tablero de letras.',
    gradient: 'linear-gradient(135deg, #0891B2 0%, #22D3EE 100%)' },
];

/* ─── Component ──────────────────────────────── */

export default function AdvancedGamesPage() {
  const { completeGame, isLoggedIn } = useAuth();
  const startTimeRef  = useRef(null);
  const lluviaIdRef   = useRef(0);

  const [activeGame, setActiveGame] = useState(null);
  const [gameState,  setGameState]  = useState(null);

  useEffect(() => {
    return () => { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); };
  }, []);

  const stopTimer = () =>
    Math.round((Date.now() - (startTimeRef.current ?? Date.now())) / 1000);

  const finishGame = (stars, won) => {
    const duration = stopTimer();
    const xp = stars === 3 ? 100 : stars === 2 ? 75 : 50;
    if (isLoggedIn) completeGame(activeGame, stars, xp, duration);
    if (won && stars >= 2) launchConfetti();
    setGameState(prev => ({ ...prev, results: { won, stars, xp, duration } }));
  };

  const openGame = (id) => {
    startTimeRef.current = Date.now();
    setActiveGame(id);
    switch (id) {
      case 'memorama': initMemorama(); break;
      case 'iman':     initIman();     break;
      case 'lluvia':   initLluvia();   break;
      case 'escucha':  initEscucha();  break;
      case 'sopa':     initSopa();     break;
    }
  };

  const closeGame = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setActiveGame(null);
    setGameState(null);
  };

  /* ─── MEMORAMA ──────────────────────────────── */

  const initMemorama = () =>
    setGameState({ type: 'memorama', cards: buildMemoCards(), flipped: [], matched: [], moves: 0, locked: false, results: null });

  const onMemoClick = (idx) => {
    const s = gameState;
    if (!s || s.locked || s.matched.includes(idx) || s.flipped.includes(idx) || s.flipped.length >= 2) return;
    const newFlipped = [...s.flipped, idx];
    setGameState(p => ({ ...p, flipped: newFlipped }));

    if (newFlipped.length === 2) {
      const [a, b] = newFlipped;
      const match  = s.cards[a].pairId === s.cards[b].pairId;
      const moves  = s.moves + 1;
      if (match) {
        const matched = [...s.matched, a, b];
        setGameState(p => ({ ...p, flipped: [], matched, moves, locked: false }));
        if (matched.length === s.cards.length) {
          const stars = moves <= 10 ? 3 : moves <= 14 ? 2 : 1;
          setTimeout(() => finishGame(stars, true), 500);
        }
      } else {
        setGameState(p => ({ ...p, moves, locked: true }));
        setTimeout(() => setGameState(p => ({ ...p, flipped: [], locked: false })), 1100);
      }
    }
  };

  /* ─── IMÁN DE LETRAS ────────────────────────── */

  const pickImanWord = () => IMAN_WORDS[Math.floor(Math.random() * IMAN_WORDS.length)];

  const initIman = () => {
    const entry   = pickImanWord();
    const letters = shuffle(entry.word.split('').map((ch, i) => ({ ch, id: i, placed: false })));
    setGameState({ type: 'iman', entry, letters, answer: [], feedback: null, round: 1, correct: 0, results: null });
  };

  const onImanPick = (id) =>
    setGameState(p => {
      const letter = p.letters.find(l => l.id === id);
      return { ...p, letters: p.letters.map(l => l.id === id ? { ...l, placed: true } : l), answer: [...p.answer, letter], feedback: null };
    });

  const onImanRemove = (id) =>
    setGameState(p => ({
      ...p,
      answer:  p.answer.filter(l => l.id !== id),
      letters: p.letters.map(l => l.id === id ? { ...l, placed: false } : l),
      feedback: null,
    }));

  const onImanCheck = () => {
    const s = gameState;
    const attempt = s.answer.map(l => l.ch).join('');
    if (attempt === s.entry.word) {
      const correct = s.correct + 1;
      if (s.round >= 5) {
        const stars = correct >= 5 ? 3 : correct >= 3 ? 2 : 1;
        setGameState(p => ({ ...p, feedback: 'correct', correct }));
        setTimeout(() => finishGame(stars, true), 700);
      } else {
        setGameState(p => ({ ...p, feedback: 'correct', correct }));
        setTimeout(() => {
          const entry   = pickImanWord();
          const letters = shuffle(entry.word.split('').map((ch, i) => ({ ch, id: i, placed: false })));
          setGameState(p2 => ({ ...p2, entry, letters, answer: [], feedback: null, round: p2.round + 1 }));
        }, 800);
      }
    } else {
      setGameState(p => ({ ...p, feedback: 'wrong', answer: [], letters: p.letters.map(l => ({ ...l, placed: false })) }));
    }
  };

  const onImanClear = () =>
    setGameState(p => ({ ...p, answer: [], letters: p.letters.map(l => ({ ...l, placed: false })), feedback: null }));

  /* ─── LLUVIA DE PALABRAS ────────────────────── */

  const initLluvia = () =>
    setGameState({ type: 'lluvia', words: [], score: 0, lives: 3, timeLeft: 60, running: false, gameOver: false, results: null });

  const startLluvia = () =>
    setGameState(p => ({ ...p, running: true }));

  useEffect(() => {
    if (activeGame !== 'lluvia' || !gameState?.running) return;

    const clock = setInterval(() => {
      setGameState(p => {
        if (!p?.running) return p;
        const t = p.timeLeft - 1;
        if (t <= 0) return { ...p, timeLeft: 0, running: false, gameOver: true };
        return { ...p, timeLeft: t };
      });
    }, 1000);

    const spawn = setInterval(() => {
      const entry = LLUVIA_POOL[Math.floor(Math.random() * LLUVIA_POOL.length)];
      const id    = lluviaIdRef.current++;
      setGameState(p => {
        if (!p?.running) return p;
        return { ...p, words: [...p.words, { id, text: entry.text, correct: entry.correct, x: 5 + Math.random() * 75, y: -8 }] };
      });
    }, 1700);

    const move = setInterval(() => {
      setGameState(p => {
        if (!p?.running) return p;
        let lost = 0;
        const rem = [];
        for (const w of p.words) {
          const ny = w.y + 1.4;
          if (ny > 102) { if (w.correct) lost++; }
          else rem.push({ ...w, y: ny });
        }
        const lives = p.lives - lost;
        if (lives <= 0) return { ...p, words: [], lives: 0, running: false, gameOver: true };
        return { ...p, words: rem, lives };
      });
    }, 70);

    return () => { clearInterval(clock); clearInterval(spawn); clearInterval(move); };
  }, [activeGame, gameState?.running]);

  useEffect(() => {
    if (activeGame !== 'lluvia' || !gameState?.gameOver || gameState?.results) return;
    const stars = gameState.score >= 80 ? 3 : gameState.score >= 40 ? 2 : 1;
    finishGame(stars, gameState.score > 0);
  }, [gameState?.gameOver]);

  const onLluviaClick = (wordId) =>
    setGameState(p => {
      const word  = p.words.find(w => w.id === wordId);
      if (!word) return p;
      const words = p.words.filter(w => w.id !== wordId);
      return word.correct
        ? { ...p, words, score: p.score + 10 }
        : { ...p, words, lives: Math.max(0, p.lives - 1) };
    });

  /* ─── ESCUCHA Y ESCRIBE ─────────────────────── */

  const speak = (word) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(word);
    utt.lang  = 'es-ES';
    utt.rate  = 0.82;
    window.speechSynthesis.speak(utt);
  };

  const initEscucha = () => {
    const words = shuffle(ESCUCHA_WORDS).slice(0, 5);
    setGameState({ type: 'escucha', words, round: 0, answer: '', feedback: null, replaysLeft: 3, correctCount: 0, results: null });
    setTimeout(() => speak(words[0]), 500);
  };

  const onEscuchaReplay = () => {
    if (!gameState || gameState.replaysLeft <= 0 || gameState.feedback) return;
    speak(gameState.words[gameState.round]);
    setGameState(p => ({ ...p, replaysLeft: p.replaysLeft - 1 }));
  };

  const onEscuchaSubmit = () => {
    const s = gameState;
    if (!s || !s.answer.trim() || s.feedback) return;
    const ok  = s.answer.trim().toLowerCase() === s.words[s.round].toLowerCase();
    const cnt = s.correctCount + (ok ? 1 : 0);
    if (s.round >= s.words.length - 1) {
      const stars = cnt >= 5 ? 3 : cnt >= 3 ? 2 : 1;
      setGameState(p => ({ ...p, feedback: ok ? 'correct' : 'wrong', correctCount: cnt }));
      setTimeout(() => finishGame(stars, cnt >= 3), 800);
    } else {
      setGameState(p => ({ ...p, feedback: ok ? 'correct' : 'wrong', correctCount: cnt }));
      setTimeout(() => {
        const next = s.round + 1;
        setGameState(p2 => ({ ...p2, round: next, answer: '', feedback: null, replaysLeft: 3 }));
        speak(s.words[next]);
      }, 900);
    }
  };

  /* ─── SOPA DE LETRAS ────────────────────────── */

  const initSopa = () => {
    const { grid, placed } = buildWordSearch();
    setGameState({ type: 'sopa', grid, placed, foundIds: [], wrongGuesses: 0, selecting: false, startCell: null, highlights: [], results: null });
  };

  const getSopaLine = (r0, c0, r1, c1) => {
    const dr = r1 - r0, dc = c1 - c0;
    const len = Math.max(Math.abs(dr), Math.abs(dc));
    if (len === 0) return [{ r: r0, c: c0 }];
    const sr = dr / len, sc = dc / len;
    if (!Number.isInteger(sr) || !Number.isInteger(sc)) return null;
    const cells = [];
    for (let i = 0; i <= len; i++) cells.push({ r: r0 + sr * i, c: c0 + sc * i });
    return cells;
  };

  const onSopaCell = (r, c) => {
    const s = gameState;
    if (!s || s.results) return;

    if (!s.selecting) {
      setGameState(p => ({ ...p, selecting: true, startCell: { r, c }, highlights: [...p.highlights.filter(h => { const [hr, hc] = h.split(',').map(Number); return s.foundIds.some(id => s.placed.find(pl => pl.wordId === id)?.cells.some(cell => cell.r === hr && cell.c === hc)); }), `${r},${c}`] }));
      return;
    }

    const path = getSopaLine(s.startCell.r, s.startCell.c, r, c);
    if (!path) {
      setGameState(p => ({ ...p, selecting: false, startCell: null }));
      return;
    }

    const word    = path.map(p2 => s.grid[p2.r][p2.c].letter).join('');
    const wordRev = [...word].reverse().join('');
    const match   = s.placed.find(pl => !s.foundIds.includes(pl.wordId) && (pl.word === word || pl.word === wordRev));

    if (match) {
      const pathKeys  = path.map(p2 => `${p2.r},${p2.c}`);
      const newHl     = [...new Set([...s.highlights, ...pathKeys])];
      const foundIds  = [...s.foundIds, match.wordId];
      setGameState(p => ({ ...p, selecting: false, startCell: null, highlights: newHl, foundIds }));
      if (foundIds.length === s.placed.length) {
        const stars = s.wrongGuesses === 0 ? 3 : s.wrongGuesses <= 3 ? 2 : 1;
        setTimeout(() => finishGame(stars, true), 400);
      }
    } else {
      setGameState(p => ({ ...p, selecting: false, startCell: null, wrongGuesses: p.wrongGuesses + 1 }));
    }
  };

  /* ─── Render: Results ───────────────────────── */

  const fmtTime = (s) => s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${s % 60}s`;

  const renderResults = () => {
    const r = gameState?.results;
    if (!r) return null;
    return (
      <div className="game-results">
        <div className="results-emoji">{r.won ? '🎉' : '💪'}</div>
        <div className="results-score">{r.won ? '¡Excelente!' : '¡Buen intento!'}</div>
        <div className="results-xp">+{r.xp} XP</div>
        <div className="results-stars">
          {[0, 1, 2].map(i => (
            <span key={i} className="animate-star-pop" style={{ animationDelay: `${0.2 + i * 0.2}s` }}>
              {i < r.stars ? '⭐' : '☆'}
            </span>
          ))}
        </div>
        <div className="results-metrics">
          <div className="metric-item">
            <span className="metric-label">Tiempo</span>
            <span className="metric-value">{fmtTime(r.duration)}</span>
          </div>
        </div>
        <div className="results-actions">
          <button className="btn btn-primary" onClick={() => openGame(activeGame)}>Jugar de Nuevo</button>
          <button className="btn btn-secondary" onClick={closeGame}>Volver</button>
        </div>
      </div>
    );
  };

  /* ─── Render: Memorama ──────────────────────── */

  const renderMemorama = () => {
    const s = gameState;
    if (!s) return null;
    if (s.results) return renderResults();
    return (
      <div className="memo-game">
        <div className="memo-hud">
          <span>Movimientos: <strong>{s.moves}</strong></span>
          <span>Pares: <strong>{s.matched.length / 2} / {MEMORAMA_PAIRS.length}</strong></span>
        </div>
        <div className="memo-grid">
          {s.cards.map((card, idx) => {
            const isFlipped = s.flipped.includes(idx) || s.matched.includes(idx);
            const isMatched = s.matched.includes(idx);
            return (
              <button
                key={card.uid}
                className={`memo-card ${isFlipped ? 'flipped' : ''} ${isMatched ? 'matched' : ''}`}
                onClick={() => onMemoClick(idx)}
              >
                <div className="memo-inner">
                  <div className="memo-front">?</div>
                  <div className={`memo-back ${card.face}`}>{card.content}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  /* ─── Render: Imán de Letras ────────────────── */

  const renderIman = () => {
    const s = gameState;
    if (!s) return null;
    if (s.results) return renderResults();
    return (
      <div className="iman-game">
        <div className="iman-round-bar">Ronda {s.round} de 5</div>
        <div className="iman-hint-box">
          <span className="iman-emoji">{s.entry.emoji}</span>
          <span className="iman-hint-text">{s.entry.hint}</span>
        </div>
        <div className={`iman-drop-zone ${s.feedback ? `is-${s.feedback}` : ''}`}>
          {s.answer.length === 0
            ? <span className="iman-placeholder">Toca las letras para armar la palabra</span>
            : s.answer.map(l => (
                <button key={l.id} className="iman-tile placed" onClick={() => onImanRemove(l.id)}>{l.ch}</button>
              ))
          }
        </div>
        <div className="iman-pool">
          {s.letters.filter(l => !l.placed).map(l => (
            <button key={l.id} className="iman-tile" onClick={() => onImanPick(l.id)}>{l.ch}</button>
          ))}
        </div>
        {s.feedback && (
          <p className={`iman-feedback ${s.feedback}`}>
            {s.feedback === 'correct' ? '✅ ¡Correcto!' : `❌ Era: ${s.entry.word}`}
          </p>
        )}
        <div className="iman-actions">
          <button className="btn btn-ghost" onClick={onImanClear}>Limpiar</button>
          <button className="btn btn-primary" onClick={onImanCheck}
            disabled={s.answer.length !== s.entry.word.length || !!s.feedback}>
            Verificar
          </button>
        </div>
      </div>
    );
  };

  /* ─── Render: Lluvia de Palabras ────────────── */

  const renderLluvia = () => {
    const s = gameState;
    if (!s) return null;
    if (s.results) return renderResults();
    return (
      <div className="lluvia-game">
        <div className="lluvia-hud">
          <div className="lluvia-stat">⭐ {s.score}</div>
          <div className="lluvia-stat lluvia-timer">⏱ {s.timeLeft}s</div>
          <div className="lluvia-stat">
            {'❤️'.repeat(s.lives)}{'🖤'.repeat(Math.max(0, 3 - s.lives))}
          </div>
        </div>
        {!s.running ? (
          <div className="lluvia-intro">
            <p className="lluvia-rules">
              Haz clic en las palabras <strong>correctamente escritas</strong>.<br />
              ¡Las que tienen errores: déjalas caer!
            </p>
            <button className="btn btn-primary btn-lg" onClick={startLluvia}>¡Comenzar!</button>
          </div>
        ) : (
          <div className="lluvia-arena">
            {s.words.map(w => (
              <button
                key={w.id}
                className="lluvia-word"
                style={{ left: `${w.x}%`, top: `${w.y}%` }}
                onClick={() => onLluviaClick(w.id)}
              >
                {w.text}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  /* ─── Render: Escucha y Escribe ─────────────── */

  const renderEscucha = () => {
    const s = gameState;
    if (!s) return null;
    if (s.results) return renderResults();
    const hasSpeech = typeof window !== 'undefined' && 'speechSynthesis' in window;
    return (
      <div className="escucha-game">
        <div className="escucha-progress">
          Palabra {s.round + 1} de {s.words.length} · {s.correctCount} correctas
        </div>
        {!hasSpeech && (
          <p className="escucha-warning">Tu navegador no soporta síntesis de voz. Prueba con Chrome.</p>
        )}
        <button
          className="escucha-play-btn"
          onClick={onEscuchaReplay}
          disabled={s.replaysLeft <= 0 || !!s.feedback}
        >
          🔊 Escuchar {s.replaysLeft > 0 ? `(${s.replaysLeft} restantes)` : '(sin repeticiones)'}
        </button>
        <input
          type="text"
          className={`escucha-input ${s.feedback ? `is-${s.feedback}` : ''}`}
          placeholder="Escribe lo que escuchaste..."
          value={s.answer}
          onChange={e => setGameState(p => ({ ...p, answer: e.target.value }))}
          onKeyDown={e => e.key === 'Enter' && onEscuchaSubmit()}
          disabled={!!s.feedback}
          autoCapitalize="none"
          autoComplete="off"
        />
        {s.feedback ? (
          <p className={`escucha-feedback ${s.feedback}`}>
            {s.feedback === 'correct' ? '✅ ¡Correcto!' : `❌ Era: "${s.words[s.round]}"`}
          </p>
        ) : (
          <button className="btn btn-primary" onClick={onEscuchaSubmit} disabled={!s.answer.trim()}>
            Verificar
          </button>
        )}
      </div>
    );
  };

  /* ─── Render: Sopa de Letras ────────────────── */

  const renderSopa = () => {
    const s = gameState;
    if (!s) return null;
    if (s.results) return renderResults();
    return (
      <div className="sopa-game">
        <div className="sopa-words">
          {s.placed.map(p => (
            <span key={p.wordId} className={`sopa-tag ${s.foundIds.includes(p.wordId) ? 'found' : ''}`}>
              {p.word}
            </span>
          ))}
        </div>
        {s.selecting && (
          <p className="sopa-hint-msg">Ahora toca la letra final de la palabra</p>
        )}
        <div className="sopa-board">
          {s.grid.map((row, r) => (
            <div key={r} className="sopa-row">
              {row.map((cell, c) => {
                const key = `${r},${c}`;
                const isH = s.highlights.includes(key);
                const isS = s.startCell?.r === r && s.startCell?.c === c;
                return (
                  <button
                    key={key}
                    className={`sopa-cell ${isH ? 'hl' : ''} ${isS ? 'sel' : ''}`}
                    onClick={() => onSopaCell(r, c)}
                  >
                    {cell.letter}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
        <p className="sopa-count">Encontradas: {s.foundIds.length} / {s.placed.length}</p>
      </div>
    );
  };

  /* ─── Render: Game Switcher ─────────────────── */

  const renderGame = () => {
    switch (activeGame) {
      case 'memorama': return renderMemorama();
      case 'iman':     return renderIman();
      case 'lluvia':   return renderLluvia();
      case 'escucha':  return renderEscucha();
      case 'sopa':     return renderSopa();
      default:         return null;
    }
  };

  const meta = GAME_CATALOG.find(g => g.id === activeGame);

  /* ─── Main Render ───────────────────────────── */

  return (
    <div className="adv-page">
      <div className="container">
        <div className="adv-header">
          <h1>Juegos Avanzados</h1>
          <p>Nuevas mecánicas para trabajar distintas habilidades de lectura y escritura.</p>
        </div>
        <div className="adv-catalog">
          {GAME_CATALOG.map(g => (
            <button key={g.id} className="adv-card card" onClick={() => openGame(g.id)}>
              <div className="adv-card-img" style={{ background: g.gradient }}>{g.emoji}</div>
              <div className="adv-card-body">
                <span className="adv-skill-tag">{g.skill}</span>
                <h3>{g.name}</h3>
                <p>{g.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {activeGame && (
        <div className="adv-overlay" onClick={e => e.target === e.currentTarget && closeGame()}>
          <div className="adv-modal">
            <div className="adv-modal-head" style={{ background: meta?.gradient }}>
              <span className="adv-modal-icon">{meta?.emoji}</span>
              <div>
                <h2>{meta?.name}</h2>
                <span className="adv-modal-skill">{meta?.skill}</span>
              </div>
              <button className="adv-close-btn" onClick={closeGame} aria-label="Cerrar">✕</button>
            </div>
            <div className="adv-modal-body">
              {renderGame()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
