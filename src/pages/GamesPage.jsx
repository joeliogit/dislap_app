/* ============================================
   DISSLAPP — Games Page
   ============================================ */

import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { launchConfetti } from '../utils/confetti';

const SKILL_GRADIENTS = {
  'Conciencia fonológica': 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
  'Discriminación visual':  'linear-gradient(135deg, #059669 0%, #34D399 100%)',
  'Decodificación':         'linear-gradient(135deg, #DC2626 0%, #F87171 100%)',
  'Conciencia fonémica':    'linear-gradient(135deg, #D97706 0%, #FBBF24 100%)',
  'Segmentación silábica':  'linear-gradient(135deg, #2563EB 0%, #60A5FA 100%)',
  'Rima y fonología':       'linear-gradient(135deg, #DB2777 0%, #F472B6 100%)',
  'Memoria y secuencia':    'linear-gradient(135deg, #6D28D9 0%, #7C3AED 100%)',
  'Reconocimiento visual':  'linear-gradient(135deg, #0891B2 0%, #22D3EE 100%)',
  'Comprensión lectora':    'linear-gradient(135deg, #065F46 0%, #059669 100%)',
  'Morfología':             'linear-gradient(135deg, #92400E 0%, #D97706 100%)',
  'Vocabulario':            'linear-gradient(135deg, #1D4ED8 0%, #3B82F6 100%)',
  'Fluidez lectora':        'linear-gradient(135deg, #BE185D 0%, #EC4899 100%)',
  'Ortografía':             'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
  'Escritura creativa':     'linear-gradient(135deg, #0F766E 0%, #14B8A6 100%)',
  'Escritura':              'linear-gradient(135deg, #0F766E 0%, #14B8A6 100%)',
  'Narración':              'linear-gradient(135deg, #B45309 0%, #F59E0B 100%)',
  'Revisión general':       'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
  'Maestría':               'linear-gradient(135deg, #78350F 0%, #F59E0B 100%)',
};

export default function GamesPage() {
  const { appData, isLoggedIn, updateXP, completeGame } = useAuth();
  const navigate = useNavigate();
  const games  = appData.games;
  const skills = [...new Set(games.map(g => g.skill))];
  const [filter, setFilter]       = useState('all');
  const [activeGame, setActiveGame] = useState(null);
  const [gameState, setGameState]   = useState(null);

  // Hidden timer — tracks seconds elapsed for treatment metrics
  const timerRef    = useRef(null);
  const startTimeRef = useRef(null);

  const filteredGames = filter === 'all'
    ? games
    : games.filter(g => g.skill === filter);

  // Start timer when game opens
  const startTimer = () => {
    startTimeRef.current = Date.now();
  };

  // Return elapsed seconds
  const stopTimer = () => {
    if (!startTimeRef.current) return 0;
    return Math.round((Date.now() - startTimeRef.current) / 1000);
  };

  // Clear timers on unmount
  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const openGame = useCallback((gameId) => {
    const game = games.find(g => g.id === gameId);
    if (!game || game.locked) return;
    setActiveGame(game);
    startTimer();

    switch (game.type) {
      case 'word-scramble': {
        const words  = appData.gameWords.easy;
        const word   = words[Math.floor(Math.random() * words.length)];
        const scrambled = shuffleWord(word);
        setGameState({ type: 'word-scramble', word, scrambled, answer: '', feedback: null, attempts: 0 });
        break;
      }
      case 'word-compare': {
        const pair = appData.wordPairs[Math.floor(Math.random() * appData.wordPairs.length)];
        setGameState({ type: 'word-compare', pair, feedback: null, answered: false });
        break;
      }
      case 'syllable-build': {
        const wordData = appData.syllableWords[Math.floor(Math.random() * appData.syllableWords.length)];
        const shuffled = [...wordData.syllables].sort(() => Math.random() - 0.5);
        setGameState({ type: 'syllable-build', wordData, shuffled, picked: [], disabled: [], feedback: null });
        break;
      }
      case 'phoneme-dice': {
        const entry   = appData.phonemeData[Math.floor(Math.random() * appData.phonemeData.length)];
        const correct = entry.correct[Math.floor(Math.random() * entry.correct.length)];
        const wrongs  = entry.wrong.sort(() => Math.random() - 0.5).slice(0, 2);
        const options = [correct, ...wrongs].sort(() => Math.random() - 0.5);
        setGameState({ type: 'phoneme-dice', letter: entry.letter, correct, options, answered: false, feedback: null });
        break;
      }
      case 'syllable-color': {
        const wordData = appData.syllableWords[Math.floor(Math.random() * appData.syllableWords.length)];
        const posNames = ['primera', 'segunda', 'tercera', 'cuarta'];
        const posIndex = Math.floor(Math.random() * wordData.syllables.length);
        const answer   = wordData.syllables[posIndex];
        const posName  = posNames[posIndex] || `${posIndex + 1}ª`;
        const options  = [...wordData.syllables].sort(() => Math.random() - 0.5);
        setGameState({ type: 'syllable-color', wordData, posIndex, posName, answer, options, answered: false, feedback: null });
        break;
      }
      case 'rhyme-match': {
        const entry = appData.rhymeData[Math.floor(Math.random() * appData.rhymeData.length)];
        setGameState({ type: 'rhyme-match', word: entry.word, options: entry.options, correct: entry.correct, answered: false, chosen: null, feedback: null });
        break;
      }
      case 'memory-letters': {
        const entry = appData.memoryData[Math.floor(Math.random() * appData.memoryData.length)];
        setGameState({ type: 'memory-letters', letters: entry.letters, phase: 'memorize', input: '', attempts: 0, feedback: null });
        break;
      }
      case 'word-fill': {
        const entry = appData.wordFillData[Math.floor(Math.random() * appData.wordFillData.length)];
        setGameState({ type: 'word-fill', word: entry.word, masked: entry.masked, answer: entry.answer, hint: entry.hint, options: entry.options, answered: false, chosen: null, feedback: null });
        break;
      }
      case 'syllable-chain': {
        const entry = appData.syllableChainData[Math.floor(Math.random() * appData.syllableChainData.length)];
        setGameState({ type: 'syllable-chain', word: entry.word, lastSyl: entry.lastSyl, options: entry.options, correct: entry.correct, answered: false, chosen: null, feedback: null });
        break;
      }
      case 'sound-count': {
        const entry = appData.soundCountData[Math.floor(Math.random() * appData.soundCountData.length)];
        setGameState({ type: 'sound-count', word: entry.word, syllables: entry.syllables, count: entry.count, answered: false, chosen: null, feedback: null });
        break;
      }
      default:
        setGameState({ type: 'generic' });
    }
  }, [games, appData]);

  const closeGame = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setActiveGame(null);
    setGameState(null);
    startTimeRef.current = null;
  };

  const showResults = (won, xp, stars) => {
    const duration = stopTimer();
    if (isLoggedIn) {
      updateXP(xp);
      if (activeGame) completeGame(activeGame.id, stars, xp, duration);
    }
    if (won) launchConfetti();
    setGameState(prev => ({ ...prev, results: { won, xp, stars, duration } }));
  };

  // ── Word Scramble ──
  const checkWordAnswer = () => {
    if (!gameState) return;
    const answer = gameState.answer.trim().toUpperCase();
    if (answer === gameState.word) {
      const stars = gameState.attempts === 0 ? 3 : gameState.attempts === 1 ? 2 : 1;
      showResults(true, stars === 3 ? 100 : stars === 2 ? 75 : 50, stars);
    } else {
      setGameState(prev => ({ ...prev, feedback: 'wrong', attempts: (prev.attempts || 0) + 1 }));
      setTimeout(() => setGameState(prev => prev ? ({ ...prev, feedback: null }) : null), 600);
    }
  };

  // ── Word Compare ──
  const checkCompareAnswer = (answeredSame) => {
    if (!gameState || gameState.answered) return;
    const correct = gameState.pair.same === answeredSame;
    setGameState(prev => ({ ...prev, answered: true, feedback: correct ? 'correct' : 'wrong' }));
    setTimeout(() => {
      showResults(correct, correct ? 75 : 25, correct ? 3 : 1);
    }, 800);
  };

  // ── Syllable Build ──
  const pickSyllable = (index, syllable) => {
    if (!gameState) return;
    const newPicked   = [...gameState.picked, syllable];
    const newDisabled = [...gameState.disabled, index];
    setGameState(prev => ({ ...prev, picked: newPicked, disabled: newDisabled }));

    if (newPicked.length === gameState.wordData.syllables.length) {
      const correct = newPicked.join('') === gameState.wordData.syllables.join('');
      setTimeout(() => showResults(correct, correct ? 100 : 25, correct ? 3 : 1), 600);
    }
  };

  const resetSyllables = () => {
    setGameState(prev => prev ? ({ ...prev, picked: [], disabled: [] }) : null);
  };

  // ── Phoneme Dice ──
  const checkPhonemeAnswer = (chosen) => {
    if (!gameState || gameState.answered) return;
    const correct = chosen === gameState.correct;
    setGameState(prev => ({ ...prev, answered: true, chosen, feedback: correct ? 'correct' : 'wrong' }));
    setTimeout(() => showResults(correct, correct ? 100 : 25, correct ? 3 : 1), 800);
  };

  // ── Syllable Color ──
  const checkSyllableColorAnswer = (chosen) => {
    if (!gameState || gameState.answered) return;
    const correct = chosen === gameState.answer;
    setGameState(prev => ({ ...prev, answered: true, chosen, feedback: correct ? 'correct' : 'wrong' }));
    setTimeout(() => showResults(correct, correct ? 100 : 25, correct ? 3 : 1), 800);
  };

  // ── Rhyme Match ──
  const checkRhymeAnswer = (chosen) => {
    if (!gameState || gameState.answered) return;
    const correct = chosen === gameState.correct;
    setGameState(prev => ({ ...prev, answered: true, chosen, feedback: correct ? 'correct' : 'wrong' }));
    setTimeout(() => showResults(correct, correct ? 100 : 25, correct ? 3 : 1), 800);
  };

  // ── Word Fill ──
  const checkWordFillAnswer = (letter) => {
    if (!gameState || gameState.answered) return;
    const correct = letter === gameState.answer;
    setGameState(prev => ({ ...prev, answered: true, chosen: letter, feedback: correct ? 'correct' : 'wrong' }));
    setTimeout(() => showResults(correct, correct ? 100 : 25, correct ? 3 : 1), 800);
  };

  // ── Syllable Chain ──
  const checkSyllableChainAnswer = (chosen) => {
    if (!gameState || gameState.answered) return;
    const correct = chosen === gameState.correct;
    setGameState(prev => ({ ...prev, answered: true, chosen, feedback: correct ? 'correct' : 'wrong' }));
    setTimeout(() => showResults(correct, correct ? 100 : 25, correct ? 3 : 1), 800);
  };

  // ── Sound Count ──
  const checkSoundCountAnswer = (count) => {
    if (!gameState || gameState.answered) return;
    const correct = count === gameState.count;
    setGameState(prev => ({ ...prev, answered: true, chosen: count, feedback: correct ? 'correct' : 'wrong' }));
    setTimeout(() => showResults(correct, correct ? 100 : 25, correct ? 3 : 1), 800);
  };

  // ── Memory Letters ──
  const revealMemoryRecall = () => {
    setGameState(prev => ({ ...prev, phase: 'recall' }));
  };

  const checkMemoryAnswer = () => {
    if (!gameState) return;
    const correct = gameState.input.trim().toUpperCase() === gameState.letters.join('');
    const attempts = gameState.attempts || 0;
    if (!correct && attempts < 2) {
      setGameState(prev => ({ ...prev, feedback: 'wrong', attempts: attempts + 1, input: '', phase: 'memorize' }));
      setTimeout(() => setGameState(prev => prev ? ({ ...prev, feedback: null }) : null), 600);
    } else {
      const stars = correct ? (attempts === 0 ? 3 : 2) : 1;
      showResults(correct, correct ? (stars === 3 ? 100 : 75) : 25, stars);
    }
  };

  // ── Render Helpers ──
  const renderGameCard = (game, index) => {
    const starsHtml = Array.from({ length: game.maxStars }, (_, i) => (
      <span key={i} className={`game-star ${i < game.stars ? 'filled' : ''}`}>★</span>
    ));
    return (
      <div
        key={game.id}
        className={`card game-card card-glow animate-fade-in-up ${game.locked ? 'locked' : ''}`}
        data-skill={game.skill}
        data-game-id={game.id}
        style={{ animationDelay: `${0.1 + index * 0.08}s` }}
        onClick={() => !game.locked && openGame(game.id)}
      >
        {game.recommended && <div className="game-recommended">⭐ Recomendado</div>}
        {game.locked && game.lockReason === 'plan' && (
          <div className="game-lock-overlay plan-lock">
            <span className="lock-icon">🔒</span>
            <span className="lock-msg">Actualiza tu plan</span>
            <Link to="/precios" className="btn btn-primary btn-sm" onClick={e => e.stopPropagation()}>Ver Planes</Link>
          </div>
        )}
        <div className="game-card-image" style={{ background: SKILL_GRADIENTS[game.skill] || 'var(--gradient-accent)' }}>
          <span className="game-card-emoji">{game.emoji}</span>
        </div>
        <div className="game-card-body">
          <div className="game-card-tags">
            <span className="badge badge-purple">{game.skill}</span>
            <span className="badge badge-green">Nivel {game.level}</span>
          </div>
          <h3>{game.name}</h3>
          <p>{game.description}</p>
          <div className="game-card-footer">
            <div className="game-stars">{starsHtml}</div>
            <span className="game-level-req">Nivel {game.level}+</span>
          </div>
        </div>
      </div>
    );
  };

  const formatDuration = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  };

  const renderResults = () => {
    if (!gameState?.results) return null;
    const { won, xp, stars, duration } = gameState.results;
    return (
      <div className="game-results">
        <div className="results-emoji">{won ? '🎉' : '💪'}</div>
        <div className="results-score">{won ? '¡Excelente!' : '¡Buen intento!'}</div>
        <div className="results-xp">+{xp} XP</div>
        <div className="results-stars">
          {Array.from({ length: 3 }, (_, i) => (
            <span key={i} className="animate-star-pop" style={{ animationDelay: `${0.2 + i * 0.2}s` }}>
              {i < stars ? '⭐' : '☆'}
            </span>
          ))}
        </div>
        {/* Treatment metric — time taken */}
        <div className="results-metrics">
          <div className="metric-item">
            <span className="metric-label">Tiempo de respuesta</span>
            <span className="metric-value">{formatDuration(duration)}</span>
          </div>
          {duration > 0 && duration < 60 && won && (
            <div className="metric-badge">⚡ ¡Respuesta rápida!</div>
          )}
        </div>
        <div className="results-actions">
          <button className="btn btn-primary" onClick={() => { const id = activeGame?.id; closeGame(); if (id) openGame(id); }}>Seguir Jugando</button>
          <button className="btn btn-secondary" onClick={() => { closeGame(); navigate('/avances'); }}>Ver Avances</button>
        </div>
      </div>
    );
  };

  const renderGameModal = () => {
    if (!activeGame || !gameState) return null;

    return (
      <div className="game-play-overlay" id="game-overlay">
        <div className="game-play-modal">
          {gameState.results ? (
            renderResults()
          ) : (
            <>
              <div className="game-play-header">
                <h2>{activeGame.emoji} {activeGame.name}</h2>
                <button className="game-close-btn" onClick={closeGame}>✕</button>
              </div>
              <div className="game-play-area">

                {/* ── Word Scramble ── */}
                {gameState.type === 'word-scramble' && (
                  <>
                    <p className="game-instruction">Ordena las letras para formar una palabra:</p>
                    <div className="game-word-display">{gameState.scrambled}</div>
                    <div style={{ width: '100%', maxWidth: '300px' }}>
                      <input
                        type="text"
                        className={`form-input ${gameState.feedback === 'wrong' ? 'animate-wiggle' : ''}`}
                        placeholder="Escribe la palabra..."
                        style={{ textAlign: 'center', fontSize: 'var(--font-size-xl)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '4px' }}
                        autoFocus
                        value={gameState.answer}
                        onChange={e => setGameState(prev => ({ ...prev, answer: e.target.value }))}
                        onKeyDown={e => e.key === 'Enter' && checkWordAnswer()}
                      />
                    </div>
                    <button className="btn btn-primary btn-lg" onClick={checkWordAnswer}>Comprobar ✓</button>
                    {gameState.feedback === 'wrong' && (
                      <p style={{ color: '#EF4444', fontWeight: 700, marginTop: 'var(--space-4)' }}>¡Inténtalo de nuevo! 💪</p>
                    )}
                  </>
                )}

                {/* ── Word Compare ── */}
                {gameState.type === 'word-compare' && (
                  <>
                    <p className="game-instruction">¿Estas dos palabras son iguales o diferentes?</p>
                    <div style={{ display: 'flex', gap: 'var(--space-8)', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                      <div className="game-word-display" style={{ fontSize: 'var(--font-size-4xl)' }}>{gameState.pair.word1}</div>
                      <span style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--text-muted)' }}>vs</span>
                      <div className="game-word-display" style={{ fontSize: 'var(--font-size-4xl)' }}>{gameState.pair.word2}</div>
                    </div>
                    <div className="game-options">
                      <button
                        className={`game-option-btn ${gameState.feedback === 'correct' && gameState.pair.same ? 'correct' : ''} ${gameState.feedback === 'wrong' && !gameState.pair.same ? 'wrong' : ''}`}
                        onClick={() => checkCompareAnswer(true)}
                        disabled={gameState.answered}
                      >✅ Iguales</button>
                      <button
                        className={`game-option-btn ${gameState.feedback === 'correct' && !gameState.pair.same ? 'correct' : ''} ${gameState.feedback === 'wrong' && gameState.pair.same ? 'wrong' : ''}`}
                        onClick={() => checkCompareAnswer(false)}
                        disabled={gameState.answered}
                      >❌ Diferentes</button>
                    </div>
                  </>
                )}

                {/* ── Syllable Build ── */}
                {gameState.type === 'syllable-build' && (
                  <>
                    <p className="game-instruction">
                      Haz clic en las sílabas en orden para formar:{' '}
                      <strong style={{ color: 'var(--purple-600)' }}>{gameState.wordData.word}</strong>
                    </p>
                    <div style={{ minHeight: '60px', display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', justifyContent: 'center' }}>
                      {gameState.picked.map((s, i) => (
                        <span key={i} className="badge badge-purple animate-scale-in" style={{ fontSize: 'var(--font-size-xl)', padding: 'var(--space-2) var(--space-4)' }}>{s}</span>
                      ))}
                    </div>
                    <div className="game-options">
                      {gameState.shuffled.map((s, i) => (
                        <button
                          key={i}
                          className="game-option-btn"
                          onClick={() => pickSyllable(i, s)}
                          disabled={gameState.disabled.includes(i)}
                          style={{ opacity: gameState.disabled.includes(i) ? 0.3 : 1 }}
                        >{s}</button>
                      ))}
                    </div>
                    <button className="btn btn-ghost" onClick={resetSyllables}>🔄 Reiniciar</button>
                  </>
                )}

                {/* ── Phoneme Dice ── */}
                {gameState.type === 'phoneme-dice' && (
                  <>
                    <p className="game-instruction">¿Cuál de estas palabras empieza con el sonido de la letra?</p>
                    <div className="phoneme-dice-display">
                      <span className="dice-letter">{gameState.letter}</span>
                    </div>
                    <div className="game-options">
                      {gameState.options.map((word, i) => (
                        <button
                          key={i}
                          className={`game-option-btn ${
                            gameState.answered && word === gameState.correct ? 'correct' : ''
                          } ${
                            gameState.answered && word === gameState.chosen && word !== gameState.correct ? 'wrong' : ''
                          }`}
                          onClick={() => checkPhonemeAnswer(word)}
                          disabled={gameState.answered}
                        >{word}</button>
                      ))}
                    </div>
                  </>
                )}

                {/* ── Syllable Color ── */}
                {gameState.type === 'syllable-color' && (
                  <>
                    <p className="game-instruction">
                      ¿Cuál es la <strong style={{ color: 'var(--purple-600)' }}>{gameState.posName}</strong> sílaba de esta palabra?
                    </p>
                    <div className="syllable-color-display">
                      {gameState.wordData.syllables.map((s, i) => (
                        <span
                          key={i}
                          className={`syllable-chip syl-color-${i % 4}`}
                          style={gameState.answered && i === gameState.posIndex ? { outline: '3px solid var(--purple-600)', outlineOffset: '3px' } : {}}
                        >{s}</span>
                      ))}
                    </div>
                    <div className="game-options">
                      {gameState.options.map((syl, i) => (
                        <button
                          key={i}
                          className={`game-option-btn ${
                            gameState.answered && syl === gameState.answer ? 'correct' : ''
                          } ${
                            gameState.answered && syl === gameState.chosen && syl !== gameState.answer ? 'wrong' : ''
                          }`}
                          onClick={() => checkSyllableColorAnswer(syl)}
                          disabled={gameState.answered}
                        >{syl}</button>
                      ))}
                    </div>
                  </>
                )}

                {/* ── Rhyme Match ── */}
                {gameState.type === 'rhyme-match' && (
                  <>
                    <p className="game-instruction">
                      ¿Qué palabra <strong style={{ color: 'var(--purple-600)' }}>RIMA</strong> con...?
                    </p>
                    <div className="game-word-display">{gameState.word}</div>
                    <div className="game-options">
                      {gameState.options.map((opt, i) => (
                        <button
                          key={i}
                          className={`game-option-btn ${gameState.answered && opt === gameState.correct ? 'correct' : ''} ${gameState.answered && opt === gameState.chosen && opt !== gameState.correct ? 'wrong' : ''}`}
                          onClick={() => checkRhymeAnswer(opt)}
                          disabled={gameState.answered}
                        >{opt}</button>
                      ))}
                    </div>
                  </>
                )}

                {/* ── Memory Letters ── */}
                {gameState.type === 'memory-letters' && (
                  <>
                    {gameState.phase === 'memorize' ? (
                      <>
                        <p className="game-instruction">¡Memoriza estas letras en orden!</p>
                        <div className="memory-letters-display">
                          {gameState.letters.map((l, i) => (
                            <div key={i} className="memory-letter" style={{ animationDelay: `${i * 0.1}s` }}>{l}</div>
                          ))}
                        </div>
                        <button className="btn btn-primary btn-lg" onClick={revealMemoryRecall}>
                          ✅ ¡Listo! Esconderlas
                        </button>
                      </>
                    ) : (
                      <>
                        <p className="game-instruction">
                          Escribe las <strong style={{ color: 'var(--purple-600)' }}>{gameState.letters.length}</strong> letras que viste en el mismo orden:
                        </p>
                        <div className="memory-blanks-row">
                          {Array.from({ length: gameState.letters.length }, (_, i) => (
                            <div key={i} className="memory-letter-blank">
                              {gameState.input[i] || ''}
                            </div>
                          ))}
                        </div>
                        <input
                          type="text"
                          className={`form-input ${gameState.feedback === 'wrong' ? 'animate-wiggle' : ''}`}
                          placeholder="Escribe las letras..."
                          style={{ textAlign: 'center', fontSize: 'var(--font-size-xl)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '8px', maxWidth: '280px' }}
                          maxLength={gameState.letters.length}
                          value={gameState.input}
                          onChange={e => setGameState(prev => ({ ...prev, input: e.target.value.toUpperCase() }))}
                          onKeyDown={e => e.key === 'Enter' && checkMemoryAnswer()}
                          autoFocus
                        />
                        <button className="btn btn-primary btn-lg" onClick={checkMemoryAnswer}>Comprobar ✓</button>
                        {gameState.feedback === 'wrong' && (
                          <p style={{ color: '#EF4444', fontWeight: 700 }}>¡Inténtalo de nuevo! 💪 Mira las letras otra vez.</p>
                        )}
                      </>
                    )}
                  </>
                )}

                {/* ── Word Fill ── */}
                {gameState.type === 'word-fill' && (
                  <>
                    <p className="game-instruction">Pista: <strong>{gameState.hint}</strong></p>
                    <div className="word-fill-display">
                      {gameState.masked.split('').map((ch, i) => (
                        <span key={i} className={ch === '_' ? 'word-fill-blank' : 'word-fill-char'}>
                          {ch === '_' ? '?' : ch}
                        </span>
                      ))}
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>¿Qué letra va en el espacio marcado con <strong>?</strong></p>
                    <div className="game-options">
                      {gameState.options.map((letter, i) => (
                        <button
                          key={i}
                          className={`game-option-btn ${gameState.answered && letter === gameState.answer ? 'correct' : ''} ${gameState.answered && letter === gameState.chosen && letter !== gameState.answer ? 'wrong' : ''}`}
                          onClick={() => checkWordFillAnswer(letter)}
                          disabled={gameState.answered}
                          style={{ fontSize: 'var(--font-size-2xl)', minWidth: '72px' }}
                        >{letter}</button>
                      ))}
                    </div>
                  </>
                )}

                {/* ── Syllable Chain ── */}
                {gameState.type === 'syllable-chain' && (
                  <>
                    <p className="game-instruction">La última sílaba de una palabra es la primera de la siguiente.</p>
                    <div className="syllable-chain-container">
                      <div className="chain-word">
                        <span style={{ color: 'var(--text-secondary)' }}>
                          {gameState.word.slice(0, gameState.word.length - gameState.lastSyl.length)}
                        </span>
                        <span className="chain-highlight">{gameState.lastSyl}</span>
                      </div>
                      <div className="chain-arrow">↓</div>
                      <div className="chain-question">
                        ¿Qué palabra empieza con <strong style={{ color: 'var(--purple-600)', fontSize: 'var(--font-size-xl)' }}>{gameState.lastSyl}</strong>?
                      </div>
                    </div>
                    <div className="game-options">
                      {gameState.options.map((opt, i) => (
                        <button
                          key={i}
                          className={`game-option-btn ${gameState.answered && opt === gameState.correct ? 'correct' : ''} ${gameState.answered && opt === gameState.chosen && opt !== gameState.correct ? 'wrong' : ''}`}
                          onClick={() => checkSyllableChainAnswer(opt)}
                          disabled={gameState.answered}
                        >{opt}</button>
                      ))}
                    </div>
                  </>
                )}

                {/* ── Sound Count ── */}
                {gameState.type === 'sound-count' && (
                  <>
                    <p className="game-instruction">
                      ¿Cuántas <strong style={{ color: 'var(--purple-600)' }}>sílabas</strong> tiene esta palabra?
                    </p>
                    <div className="game-word-display">{gameState.word}</div>
                    <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>
                      💡 Tip: da palmadas mientras la pronuncias en voz alta
                    </p>
                    <div className="game-options">
                      {[1, 2, 3, 4].map(n => (
                        <button
                          key={n}
                          className={`game-option-btn ${gameState.answered && n === gameState.count ? 'correct' : ''} ${gameState.answered && n === gameState.chosen && n !== gameState.count ? 'wrong' : ''}`}
                          onClick={() => checkSoundCountAnswer(n)}
                          disabled={gameState.answered}
                          style={{ fontSize: 'var(--font-size-3xl)', minWidth: '80px', padding: 'var(--space-4) var(--space-6)' }}
                        >{n}</button>
                      ))}
                    </div>
                    {gameState.answered && (
                      <div className="syllable-reveal">
                        {gameState.syllables.map((s, i) => (
                          <span key={i} className={`syllable-chip syl-color-${i % 4}`}>{s}</span>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {/* ── Generic (coming soon) ── */}
                {gameState.type === 'generic' && (
                  <>
                    <div style={{ fontSize: '80px' }}>{activeGame.emoji}</div>
                    <p className="game-instruction" style={{ fontSize: 'var(--font-size-xl)' }}>¡Este juego estará disponible pronto!</p>
                    <p className="game-instruction">Estamos preparando una experiencia increíble. Mientras tanto, prueba los otros juegos disponibles.</p>
                    <button className="btn btn-primary" onClick={closeGame}>Volver al Catálogo</button>
                  </>
                )}

              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="games-page">
      <div className="container">
        <div className="games-header animate-fade-in-up">
          <h1>🎮 Juegos Terapéuticos</h1>
          <p>Selecciona un juego para practicar y ganar XP. Cada juego trabaja una habilidad diferente.</p>
        </div>

        <div className="games-filters animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <button className={`filter-chip${filter === 'all' ? ' active' : ''}`} onClick={() => setFilter('all')}>
            Todos
          </button>
          {skills.map(s => (
            <button key={s} className={`filter-chip${filter === s ? ' active' : ''}`} onClick={() => setFilter(s)}>
              {s}
            </button>
          ))}
        </div>

        <div className="games-grid">
          {filteredGames.map((game, i) => renderGameCard(game, i))}
        </div>
      </div>

      {renderGameModal()}
    </div>
  );
}

function shuffleWord(word) {
  let result = word.split('').sort(() => Math.random() - 0.5).join('');
  // Avoid accidental non-scramble
  if (result === word && word.length > 1) result = shuffleWord(word);
  return result;
}
