/* ============================================
   DISSLAPP — Advanced Games Page (16 juegos)
   ============================================ */

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { launchConfetti } from '../utils/confetti';

/* ─── DATA ───────────────────────────────────── */

const MEMORAMA_PAIRS = [
  { id:1, word:'GATO',  emoji:'🐱' }, { id:2, word:'PERRO', emoji:'🐶' },
  { id:3, word:'CASA',  emoji:'🏠' }, { id:4, word:'SOL',   emoji:'☀️' },
  { id:5, word:'LUNA',  emoji:'🌙' }, { id:6, word:'ÁRBOL', emoji:'🌳' },
  { id:7, word:'FLOR',  emoji:'🌸' }, { id:8, word:'LIBRO', emoji:'📚' },
];

const IMAN_WORDS = [
  { word:'GATO',  emoji:'🐱', hint:'Animal con bigotes' },
  { word:'LUNA',  emoji:'🌙', hint:'Brilla en la noche' },
  { word:'MESA',  emoji:'🪑', hint:'Mueble para comer' },
  { word:'LIBRO', emoji:'📚', hint:'Para leer historias' },
  { word:'FLOR',  emoji:'🌸', hint:'Parte de una planta' },
  { word:'PATO',  emoji:'🦆', hint:'Ave que nada' },
  { word:'NUBE',  emoji:'☁️', hint:'Flota en el cielo' },
  { word:'PINO',  emoji:'🌲', hint:'Árbol de Navidad' },
];

const LLUVIA_POOL = [
  {text:'casa',correct:true},{text:'kasa',correct:false},
  {text:'luna',correct:true},{text:'lhuna',correct:false},
  {text:'gato',correct:true},{text:'cato',correct:false},
  {text:'mesa',correct:true},{text:'meza',correct:false},
  {text:'libro',correct:true},{text:'lhibro',correct:false},
  {text:'flor',correct:true},{text:'flhor',correct:false},
  {text:'perro',correct:true},{text:'parro',correct:false},
  {text:'pato',correct:true},{text:'patto',correct:false},
  {text:'nube',correct:true},{text:'nuve',correct:false},
  {text:'sol',correct:true},{text:'zol',correct:false},
  {text:'árbol',correct:true},{text:'harbol',correct:false},
  {text:'pino',correct:true},{text:'phino',correct:false},
];

const CLASIFICADOR_RONDAS = [
  { cats:['Animales','Frutas'],
    words:[{w:'gato',c:'Animales'},{w:'perro',c:'Animales'},{w:'pájaro',c:'Animales'},{w:'conejo',c:'Animales'},
           {w:'manzana',c:'Frutas'},{w:'pera',c:'Frutas'},{w:'uva',c:'Frutas'},{w:'naranja',c:'Frutas'}] },
  { cats:['Colores','Cuerpo'],
    words:[{w:'rojo',c:'Colores'},{w:'azul',c:'Colores'},{w:'verde',c:'Colores'},{w:'amarillo',c:'Colores'},
           {w:'mano',c:'Cuerpo'},{w:'pie',c:'Cuerpo'},{w:'nariz',c:'Cuerpo'},{w:'oreja',c:'Cuerpo'}] },
  { cats:['Comida','Transporte'],
    words:[{w:'pan',c:'Comida'},{w:'arroz',c:'Comida'},{w:'sopa',c:'Comida'},{w:'leche',c:'Comida'},
           {w:'auto',c:'Transporte'},{w:'tren',c:'Transporte'},{w:'bici',c:'Transporte'},{w:'avión',c:'Transporte'}] },
];

const ORACION_DATA = [
  {words:['El','gato','come','pescado'],       ans:'El gato come pescado'},
  {words:['La','niña','lee','un','libro'],      ans:'La niña lee un libro'},
  {words:['El','perro','corre','rápido'],       ans:'El perro corre rápido'},
  {words:['Mamá','hace','una','torta'],         ans:'Mamá hace una torta'},
  {words:['El','sol','brilla','hoy'],           ans:'El sol brilla hoy'},
];

const CARRERA_DATA = [
  { texto:'Lucía tiene un gato llamado Michi. Michi es muy juguetón y le gusta saltar sobre las cajas. Un día, Michi encontró un ratón de juguete y no paró de perseguirlo por toda la casa.',
    preguntas:[
      {p:'¿Cómo se llama el gato?',      ops:['Michi','Lucía','Ratón','Caja'],                       r:0},
      {p:'¿Qué encontró el gato?',        ops:['Una caja','Un pájaro','Un ratón de juguete','Una pelota'], r:2},
      {p:'¿Cómo es Michi?',              ops:['Dormilón','Juguetón','Asustadizo','Tranquilo'],        r:1},
    ]},
  { texto:'Pedro vive cerca del mar. Cada mañana va a la playa con su red y pesca muchos peces. A veces, su perro Bruno lo acompaña y juegan en la orilla mientras el sol sale.',
    preguntas:[
      {p:'¿Dónde vive Pedro?',           ops:['En la montaña','Cerca del mar','En el campo','En la ciudad'], r:1},
      {p:'¿Qué lleva Pedro a la playa?', ops:['Una pelota','Su red','Su bici','Un libro'],            r:1},
      {p:'¿Cómo se llama su perro?',     ops:['Toby','Max','Bruno','Rex'],                            r:2},
    ]},
];

const BOMBA_WORDS = [
  {wrong:'kasa',  correct:'casa'},  {wrong:'lhuna', correct:'luna'},
  {wrong:'cato',  correct:'gato'},  {wrong:'meza',  correct:'mesa'},
  {wrong:'flhor', correct:'flor'},  {wrong:'lhibro',correct:'libro'},
  {wrong:'harbol',correct:'árbol'}, {wrong:'parro', correct:'perro'},
  {wrong:'patto', correct:'pato'},  {wrong:'nuve',  correct:'nube'},
  {wrong:'zol',   correct:'sol'},   {wrong:'phino', correct:'pino'},
];

const DIFERENCIAS_DATA = [
  { A:'El niño jugaba en el parque con su pelota roja. La tarde era soleada y el viento soplaba suave.'.split(' '),
    B:'El niño jugaba en el jardín con su pelota azul. La tarde era nublada y el viento soplaba fuerte.'.split(' '),
    di:[5,9,13,18] },
  { A:'María tenía un perro blanco muy tranquilo. Le gustaba dormir junto a la puerta de su casa.'.split(' '),
    B:'María tenía un gato negro muy travieso. Le gustaba correr junto a la ventana de su casa.'.split(' '),
    di:[3,4,6,8] },
];

const HISTORIA_DATA = [
  { titulo:'El ratón y el queso',
    panels:[{id:0,text:'Un ratón tenía mucha hambre.'},{id:1,text:'Vio un trozo de queso en la mesa.'},
            {id:2,text:'Saltó con cuidado para alcanzarlo.'},{id:3,text:'¡Lo logró! El ratón comió feliz.'}] },
  { titulo:'La nube viajera',
    panels:[{id:0,text:'Había una nube que quería ver el mundo.'},{id:1,text:'Viajó por montañas y ciudades.'},
            {id:2,text:'Se cansó y decidió llover.'},{id:3,text:'Las flores del jardín le dieron las gracias.'}] },
];

const ESCALERA_RONDAS = [
  [{w:'sol',s:1},{w:'gato',s:2},{w:'pelota',s:3},{w:'mariposa',s:4},{w:'dinosaurio',s:5}],
  [{w:'pan',s:1},{w:'mesa',s:2},{w:'ventana',s:3},{w:'televisión',s:4},{w:'computadora',s:5}],
  [{w:'mar',s:1},{w:'libro',s:2},{w:'naranja',s:3},{w:'helicóptero',s:4},{w:'universidad',s:5}],
];

const COMPLETA_DATA = [
  { partes:['El ',' y la ',' vivían en un bosque. Cada mañana salían a ',' entre los árboles.'],
    hints:['Animal gris que aúlla','Animal de orejas largas','Moverse rápido con los pies'],
    resps:['lobo','liebre','correr'] },
  { partes:['La ',' brillaba en el ',' cielo. Los niños salían a ',' copos de nieve.'],
    hints:['Astro del día','Período frío del año','Atrapar algo que cae'],
    resps:['luna','invierno','atrapar'] },
  { partes:['El ',' nadaba en el ',' azul. De repente vio un ',' y salió corriendo.'],
    hints:['Animal con escamas','Cuerpo grande de agua salada','Animal peligroso del mar'],
    resps:['pez','mar','tiburón'] },
];

const RIMAS_DATA = [
  {word:'gato', rimas:['pato','plato','rato','mato','dato','nato','lato','ingrato','barato','relato','beato','magneto']},
  {word:'luna', rimas:['una','tuna','cuna','laguna','fortuna','tribuna','ninguna','duna','bruma','pluma']},
  {word:'sol',  rimas:['col','rol','alcohol','caracol','español','girasol','farol','parasol','arrasol']},
  {word:'flor', rimas:['amor','calor','color','dolor','error','favor','labor','valor','vapor','señor','mayor','mejor','menor']},
  {word:'casa', rimas:['masa','taza','brasa','pasa','grasa','rasa','frase','base','fase','traza','asa']},
];

const ESCUCHA_WORDS = [
  'gato','perro','casa','luna','libro','flor','árbol','sol','mesa','pato',
  'nube','verde','pluma','bravo','globo',
];

const SOPA_WORDS = ['GATO','SOL','LUNA','CASA','FLOR','PATO','NUBE','PINO'];
const SOPA_SIZE  = 10;

const TRAZA_LETTERS = ['A','E','M','O','S'];
const TRAZA_CPS = {
  'A':[{x:.5,y:.05},{x:.25,y:.5},{x:.75,y:.5},{x:.1,y:.95},{x:.9,y:.95}],
  'E':[{x:.15,y:.05},{x:.85,y:.05},{x:.15,y:.5},{x:.7,y:.5},{x:.15,y:.95},{x:.85,y:.95}],
  'M':[{x:.1,y:.95},{x:.1,y:.05},{x:.5,y:.6},{x:.9,y:.05},{x:.9,y:.95}],
  'O':[{x:.5,y:.05},{x:.95,y:.5},{x:.5,y:.95},{x:.05,y:.5}],
  'S':[{x:.85,y:.15},{x:.5,y:.05},{x:.15,y:.2},{x:.5,y:.5},{x:.85,y:.75},{x:.5,y:.95},{x:.15,y:.85}],
};

/* ─── CATALOG ────────────────────────────────── */

const CATEGORIES = [
  { label:'🖱️ Arrastrar y Soltar',    ids:['iman','clasificador','oracion'] },
  { label:'⏱️ Contrarreloj',           ids:['lluvia','carrera','bomba'] },
  { label:'🧠 Memoria',                ids:['memorama','diferencias'] },
  { label:'📐 Secuenciación',          ids:['historia','escalera'] },
  { label:'✏️ Escritura',              ids:['completa','rimas'] },
  { label:'🎯 Interacción Espacial',   ids:['sopa','traza'] },
  { label:'🎵 Audio',                  ids:['escucha','leeVoz'] },
];

const META = {
  iman:        {name:'Imán de Letras',          emoji:'🧲', skill:'Decodificación',        g:'linear-gradient(135deg,#DC2626,#F87171)'},
  clasificador:{name:'Clasificador de Palabras', emoji:'🗂️', skill:'Vocabulario',           g:'linear-gradient(135deg,#1D4ED8,#3B82F6)'},
  oracion:     {name:'Ordena la Oración',        emoji:'📝', skill:'Sintaxis',              g:'linear-gradient(135deg,#0F766E,#14B8A6)'},
  lluvia:      {name:'Lluvia de Palabras',        emoji:'⚡', skill:'Fluidez lectora',       g:'linear-gradient(135deg,#BE185D,#EC4899)'},
  carrera:     {name:'Carrera de Lectura',        emoji:'🏃', skill:'Comprensión lectora',   g:'linear-gradient(135deg,#065F46,#059669)'},
  bomba:       {name:'Desactiva la Bomba',        emoji:'💣', skill:'Ortografía',            g:'linear-gradient(135deg,#92400E,#D97706)'},
  memorama:    {name:'Memorama de Palabras',      emoji:'🃏', skill:'Memoria visual',        g:'linear-gradient(135deg,#6D28D9,#7C3AED)'},
  diferencias: {name:'Encuentra las Diferencias', emoji:'🔦', skill:'Discriminación visual', g:'linear-gradient(135deg,#0891B2,#22D3EE)'},
  historia:    {name:'Constructor de Historias',  emoji:'📖', skill:'Narración',             g:'linear-gradient(135deg,#B45309,#F59E0B)'},
  escalera:    {name:'Escalera Fonética',         emoji:'🔢', skill:'Conciencia fonológica', g:'linear-gradient(135deg,#2563EB,#60A5FA)'},
  completa:    {name:'Completa la Historia',      emoji:'🎭', skill:'Escritura creativa',    g:'linear-gradient(135deg,#DB2777,#F472B6)'},
  rimas:       {name:'Fábrica de Rimas',          emoji:'🏷️', skill:'Rima y fonología',      g:'linear-gradient(135deg,#7C3AED,#A855F7)'},
  sopa:        {name:'Sopa de Letras',            emoji:'🔍', skill:'Reconocimiento visual', g:'linear-gradient(135deg,#0891B2,#22D3EE)'},
  traza:       {name:'Traza la Letra',            emoji:'✍️', skill:'Grafomotricidad',       g:'linear-gradient(135deg,#059669,#34D399)'},
  escucha:     {name:'Escucha y Escribe',         emoji:'🔊', skill:'Discriminación auditiva',g:'linear-gradient(135deg,#059669,#34D399)'},
  leeVoz:      {name:'Lee en Voz Alta',           emoji:'🎙️', skill:'Pronunciación',         g:'linear-gradient(135deg,#6D28D9,#7C3AED)'},
};

/* ─── UTILS ──────────────────────────────────── */

function shuffle(arr) {
  const a=[...arr];
  for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}
  return a;
}

function buildMemoCards() {
  const cards=[];
  MEMORAMA_PAIRS.forEach(p=>{
    cards.push({uid:`w${p.id}`,pairId:p.id,content:p.word,face:'word'});
    cards.push({uid:`e${p.id}`,pairId:p.id,content:p.emoji,face:'emoji'});
  });
  return shuffle(cards);
}

function buildWordSearch() {
  const grid=Array.from({length:SOPA_SIZE},()=>Array.from({length:SOPA_SIZE},()=>({letter:'',wordId:null})));
  const DIRS=[[0,1],[1,0],[1,1],[0,-1],[-1,0],[-1,-1],[1,-1],[-1,1]];
  const placed=[];
  for(let wi=0;wi<SOPA_WORDS.length;wi++){
    const word=SOPA_WORDS[wi];let done=false,tries=0;
    while(!done&&tries++<300){
      const[dr,dc]=DIRS[Math.floor(Math.random()*DIRS.length)];
      const r0=Math.floor(Math.random()*SOPA_SIZE),c0=Math.floor(Math.random()*SOPA_SIZE);
      const rE=r0+dr*(word.length-1),cE=c0+dc*(word.length-1);
      if(rE<0||rE>=SOPA_SIZE||cE<0||cE>=SOPA_SIZE)continue;
      let ok=true;
      for(let i=0;i<word.length;i++){const cell=grid[r0+dr*i][c0+dc*i];if(cell.letter&&cell.letter!==word[i]){ok=false;break;}}
      if(!ok)continue;
      const cells=[];
      for(let i=0;i<word.length;i++){const r=r0+dr*i,c=c0+dc*i;grid[r][c]={letter:word[i],wordId:wi};cells.push({r,c});}
      placed.push({word,wordId:wi,cells});done=true;
    }
  }
  const AL='ABCDEFGHIJKLMNOPRSTUVZ';
  for(let r=0;r<SOPA_SIZE;r++)for(let c=0;c<SOPA_SIZE;c++)if(!grid[r][c].letter)grid[r][c]={letter:AL[Math.floor(Math.random()*AL.length)],wordId:null};
  return{grid,placed};
}

/* ─── COMPONENT ──────────────────────────────── */

export default function AdvancedGamesPage() {
  const { completeGame, isLoggedIn } = useAuth();
  const startTimeRef = useRef(null);
  const lluviaIdRef  = useRef(0);
  const canvasRef    = useRef(null);
  const isDrawingRef = useRef(false);
  const drawnPtsRef  = useRef([]);

  const [activeGame, setActiveGame] = useState(null);
  const [gameState,  setGameState]  = useState(null);

  useEffect(()=>{ return()=>{ if('speechSynthesis'in window)window.speechSynthesis.cancel(); }; },[]);

  const stopTimer = () => Math.round((Date.now()-(startTimeRef.current??Date.now()))/1000);

  const finishGame = (stars, won) => {
    const duration=stopTimer(), xp=stars===3?100:stars===2?75:50;
    if(isLoggedIn)completeGame(activeGame,stars,xp,duration);
    if(won&&stars>=2)launchConfetti();
    setGameState(p=>({...p,results:{won,stars,xp,duration}}));
  };

  const openGame = (id) => {
    startTimeRef.current=Date.now();
    setActiveGame(id);
    switch(id){
      case'memorama':    initMemorama();    break;
      case'iman':        initIman();        break;
      case'lluvia':      initLluvia();      break;
      case'clasificador':initClasificador();break;
      case'oracion':     initOracion();     break;
      case'carrera':     initCarrera();     break;
      case'bomba':       initBomba();       break;
      case'diferencias': initDiferencias(); break;
      case'historia':    initHistoria();    break;
      case'escalera':    initEscalera();    break;
      case'completa':    initCompleta();    break;
      case'rimas':       initRimas();       break;
      case'sopa':        initSopa();        break;
      case'traza':       initTraza();       break;
      case'escucha':     initEscucha();     break;
      case'leeVoz':      initLeeVoz();      break;
    }
  };

  const closeGame = () => {
    if('speechSynthesis'in window)window.speechSynthesis.cancel();
    setActiveGame(null); setGameState(null);
  };

  /* ── MEMORAMA ─────────────────────────────── */
  const initMemorama = () =>
    setGameState({type:'memorama',cards:buildMemoCards(),flipped:[],matched:[],moves:0,locked:false,results:null});

  const onMemoClick = (idx) => {
    const s=gameState;
    if(!s||s.locked||s.matched.includes(idx)||s.flipped.includes(idx)||s.flipped.length>=2)return;
    const nf=[...s.flipped,idx];
    setGameState(p=>({...p,flipped:nf}));
    if(nf.length===2){
      const[a,b]=nf, match=s.cards[a].pairId===s.cards[b].pairId, moves=s.moves+1;
      if(match){
        const matched=[...s.matched,a,b];
        setGameState(p=>({...p,flipped:[],matched,moves,locked:false}));
        if(matched.length===s.cards.length){const stars=moves<=10?3:moves<=14?2:1;setTimeout(()=>finishGame(stars,true),500);}
      } else {
        setGameState(p=>({...p,moves,locked:true}));
        setTimeout(()=>setGameState(p=>({...p,flipped:[],locked:false})),1100);
      }
    }
  };

  /* ── IMÁN DE LETRAS ───────────────────────── */
  const initIman = () => {
    const entry=IMAN_WORDS[Math.floor(Math.random()*IMAN_WORDS.length)];
    setGameState({type:'iman',entry,letters:shuffle(entry.word.split('').map((ch,i)=>({ch,id:i,placed:false}))),answer:[],feedback:null,round:1,correct:0,results:null});
  };
  const onImanPick = id => setGameState(p=>{const l=p.letters.find(x=>x.id===id);return{...p,letters:p.letters.map(x=>x.id===id?{...x,placed:true}:x),answer:[...p.answer,l],feedback:null};});
  const onImanRemove = id => setGameState(p=>({...p,answer:p.answer.filter(x=>x.id!==id),letters:p.letters.map(x=>x.id===id?{...x,placed:false}:x),feedback:null}));
  const onImanClear  = () => setGameState(p=>({...p,answer:[],letters:p.letters.map(l=>({...l,placed:false})),feedback:null}));
  const onImanCheck  = () => {
    const s=gameState, attempt=s.answer.map(l=>l.ch).join('');
    if(attempt===s.entry.word){
      const correct=s.correct+1;
      if(s.round>=5){setGameState(p=>({...p,feedback:'correct',correct}));setTimeout(()=>finishGame(correct>=5?3:correct>=3?2:1,true),700);}
      else{setGameState(p=>({...p,feedback:'correct',correct}));setTimeout(()=>{const entry=IMAN_WORDS[Math.floor(Math.random()*IMAN_WORDS.length)];setGameState(p2=>({...p2,entry,letters:shuffle(entry.word.split('').map((ch,i)=>({ch,id:i,placed:false}))),answer:[],feedback:null,round:p2.round+1}));},800);}
    } else {
      setGameState(p=>({...p,feedback:'wrong',answer:[],letters:p.letters.map(l=>({...l,placed:false}))}));
    }
  };

  /* ── LLUVIA DE PALABRAS ───────────────────── */
  const initLluvia  = () => setGameState({type:'lluvia',words:[],score:0,lives:3,timeLeft:60,running:false,gameOver:false,results:null});
  const startLluvia = () => setGameState(p=>({...p,running:true}));
  const onLluviaClick = wid => setGameState(p=>{const w=p.words.find(x=>x.id===wid);if(!w)return p;const words=p.words.filter(x=>x.id!==wid);return w.correct?{...p,words,score:p.score+10}:{...p,words,lives:Math.max(0,p.lives-1)};});

  useEffect(()=>{
    if(activeGame!=='lluvia'||!gameState?.running)return;
    const clock=setInterval(()=>setGameState(p=>{if(!p?.running)return p;const t=p.timeLeft-1;return t<=0?{...p,timeLeft:0,running:false,gameOver:true}:{...p,timeLeft:t};}),1000);
    const spawn=setInterval(()=>{const e=LLUVIA_POOL[Math.floor(Math.random()*LLUVIA_POOL.length)],id=lluviaIdRef.current++;setGameState(p=>{if(!p?.running)return p;return{...p,words:[...p.words,{id,text:e.text,correct:e.correct,x:5+Math.random()*75,y:-8}]};});},1700);
    const move=setInterval(()=>setGameState(p=>{if(!p?.running)return p;let lost=0;const rem=[];for(const w of p.words){const ny=w.y+1.4;if(ny>102){if(w.correct)lost++;}else rem.push({...w,y:ny});}const lives=p.lives-lost;if(lives<=0)return{...p,words:[],lives:0,running:false,gameOver:true};return{...p,words:rem,lives};}),70);
    return()=>{clearInterval(clock);clearInterval(spawn);clearInterval(move);};
  },[activeGame,gameState?.running]);

  useEffect(()=>{
    if(activeGame!=='lluvia'||!gameState?.gameOver||gameState?.results)return;
    const stars=gameState.score>=80?3:gameState.score>=40?2:1;
    finishGame(stars,gameState.score>0);
  },[gameState?.gameOver]);

  /* ── CLASIFICADOR ─────────────────────────── */
  const initClasificador = () => {
    const ronda=CLASIFICADOR_RONDAS[Math.floor(Math.random()*CLASIFICADOR_RONDAS.length)];
    setGameState({type:'clasificador',ronda,selected:null,placements:{},feedback:null,results:null});
  };
  const onClasifWord = w => setGameState(p=>({...p,selected:p.selected===w?null:w,feedback:null}));
  const onClasifCat  = cat => {
    const s=gameState; if(!s.selected)return;
    setGameState(p=>({...p,placements:{...p.placements,[p.selected]:cat},selected:null,feedback:null}));
  };
  const onClasifCheck = () => {
    const s=gameState;
    let correct=0;
    s.ronda.words.forEach(({w,c})=>{ if(s.placements[w]===c)correct++; });
    const total=s.ronda.words.length, stars=correct===total?3:correct>=total*0.75?2:correct>=total*0.5?1:0;
    setGameState(p=>({...p,feedback:{correct,total}}));
    setTimeout(()=>finishGame(stars,correct>=total*0.75),1200);
  };

  /* ── ORDENA LA ORACIÓN ────────────────────── */
  const initOracion = () => {
    const data=ORACION_DATA[Math.floor(Math.random()*ORACION_DATA.length)];
    setGameState({type:'oracion',data,pool:shuffle([...data.words]),answer:[],feedback:null,round:1,results:null});
  };
  const onOracionPick   = w => setGameState(p=>({...p,pool:p.pool.filter(x=>x!==w),answer:[...p.answer,w],feedback:null}));
  const onOracionRemove = w => setGameState(p=>({...p,answer:p.answer.filter(x=>x!==w),pool:[...p.pool,w],feedback:null}));
  const onOracionCheck  = () => {
    const s=gameState, attempt=s.answer.join(' ');
    if(attempt===s.data.ans){
      if(s.round>=5){setGameState(p=>({...p,feedback:'correct'}));setTimeout(()=>finishGame(3,true),700);}
      else{setGameState(p=>({...p,feedback:'correct'}));setTimeout(()=>{const data=ORACION_DATA[Math.floor(Math.random()*ORACION_DATA.length)];setGameState(p2=>({...p2,data,pool:shuffle([...data.words]),answer:[],feedback:null,round:p2.round+1}));},900);}
    } else {
      setGameState(p=>({...p,feedback:'wrong',pool:[...p.data.words],answer:[]}));
    }
  };

  /* ── CARRERA DE LECTURA ───────────────────── */
  const initCarrera = () => {
    const data=CARRERA_DATA[Math.floor(Math.random()*CARRERA_DATA.length)];
    setGameState({type:'carrera',data,phase:'reading',timeLeft:45,running:false,qIdx:0,answers:[],correctCount:0,results:null});
  };
  const startCarrera = () => setGameState(p=>({...p,running:true}));
  const onCarreraAnswer = (optIdx) => {
    const s=gameState, correct=optIdx===s.data.preguntas[s.qIdx].r;
    const cnt=s.correctCount+(correct?1:0);
    if(s.qIdx>=s.data.preguntas.length-1){
      setGameState(p=>({...p,answers:[...p.answers,optIdx],correctCount:cnt}));
      setTimeout(()=>finishGame(cnt>=3?3:cnt>=2?2:1,cnt>=2),700);
    } else {
      setGameState(p=>({...p,qIdx:p.qIdx+1,answers:[...p.answers,optIdx],correctCount:cnt}));
    }
  };

  useEffect(()=>{
    if(activeGame!=='carrera'||!gameState?.running||gameState?.phase!=='reading')return;
    const iv=setInterval(()=>setGameState(p=>{if(!p?.running||p.phase!=='reading')return p;const t=p.timeLeft-1;return t<=0?{...p,timeLeft:0,running:false,phase:'questions'}:{...p,timeLeft:t};}),1000);
    return()=>clearInterval(iv);
  },[activeGame,gameState?.running,gameState?.phase]);

  /* ── DESACTIVA LA BOMBA ───────────────────── */
  const initBomba = () => {
    const words=shuffle(BOMBA_WORDS).slice(0,8);
    setGameState({type:'bomba',words,wordIdx:0,timeLeft:10,timerRunning:false,answer:'',feedback:null,score:0,results:null});
  };
  const startBomba = () => setGameState(p=>({...p,timerRunning:true,answer:'',feedback:null}));
  const onBombaSubmit = () => {
    const s=gameState; if(!s.answer.trim()||!s.timerRunning)return;
    const ok=s.answer.trim().toLowerCase()===s.words[s.wordIdx].correct;
    setGameState(p=>({...p,timerRunning:false,feedback:ok?'correct':'wrong',score:p.score+(ok?10:0)}));
  };

  useEffect(()=>{
    if(activeGame!=='bomba'||!gameState?.timerRunning)return;
    const iv=setInterval(()=>setGameState(p=>{if(!p?.timerRunning)return p;const t=p.timeLeft-1;return t<=0?{...p,timeLeft:0,timerRunning:false,feedback:'timeout'}:{...p,timeLeft:t};}),1000);
    return()=>clearInterval(iv);
  },[activeGame,gameState?.timerRunning]);

  useEffect(()=>{
    if(activeGame!=='bomba'||!['correct','wrong','timeout'].includes(gameState?.feedback)||gameState?.results)return;
    const s=gameState;
    const id=setTimeout(()=>{
      const nextIdx=s.wordIdx+1;
      if(nextIdx>=s.words.length){finishGame(s.score>=60?3:s.score>=30?2:1,s.score>0);return;}
      const newTime=Math.max(5,10-Math.floor(nextIdx/2));
      setGameState(p=>({...p,wordIdx:nextIdx,timeLeft:newTime,timerRunning:true,answer:'',feedback:null}));
    },1500);
    return()=>clearTimeout(id);
  },[gameState?.feedback,gameState?.wordIdx]);

  /* ── ENCUENTRA LAS DIFERENCIAS ────────────── */
  const initDiferencias = () => {
    const data=DIFERENCIAS_DATA[Math.floor(Math.random()*DIFERENCIAS_DATA.length)];
    setGameState({type:'diferencias',data,found:[],wrong:[],results:null});
  };
  const onDifClick = (idx) => {
    const s=gameState;
    if(s.found.includes(idx)||s.wrong.includes(idx))return;
    if(s.data.di.includes(idx)){
      const found=[...s.found,idx];
      setGameState(p=>({...p,found}));
      if(found.length===s.data.di.length){setTimeout(()=>finishGame(s.wrong.length===0?3:s.wrong.length<=2?2:1,true),500);}
    } else {
      setGameState(p=>({...p,wrong:[...p.wrong,idx]}));
    }
  };

  /* ── CONSTRUCTOR DE HISTORIAS ─────────────── */
  const initHistoria = () => {
    const h=HISTORIA_DATA[Math.floor(Math.random()*HISTORIA_DATA.length)];
    setGameState({type:'historia',titulo:h.titulo,panels:shuffle([...h.panels]),selected:[],results:null});
  };
  const onHistoriaPanel = (id) => {
    const s=gameState; if(s.selected.includes(id))return;
    const selected=[...s.selected,id];
    setGameState(p=>({...p,selected}));
    if(selected.length===s.panels.length){
      const correct=selected.every((id2,i)=>id2===i);
      setTimeout(()=>finishGame(correct?3:selected.filter((id2,i)=>id2===i).length>=2?2:1,correct),500);
    }
  };
  const onHistoriaReset = () => setGameState(p=>({...p,selected:[]}));

  /* ── ESCALERA FONÉTICA ────────────────────── */
  const initEscalera = () => {
    const ronda=ESCALERA_RONDAS[Math.floor(Math.random()*ESCALERA_RONDAS.length)];
    setGameState({type:'escalera',words:shuffle([...ronda]),nextS:1,selected:[],errors:0,results:null});
  };
  const onEscaleraClick = ({w,s}) => {
    const gs=gameState;
    if(gs.selected.includes(w))return;
    if(s===gs.nextS){
      const selected=[...gs.selected,w];
      setGameState(p=>({...p,selected,nextS:p.nextS+1,feedback:'correct'}));
      setTimeout(()=>setGameState(p=>({...p,feedback:null})),500);
      if(selected.length===gs.words.length)setTimeout(()=>finishGame(gs.errors===0?3:gs.errors<=2?2:1,true),700);
    } else {
      setGameState(p=>({...p,errors:p.errors+1,feedback:'wrong'}));
      setTimeout(()=>setGameState(p=>({...p,feedback:null})),600);
    }
  };

  /* ── COMPLETA LA HISTORIA ─────────────────── */
  const initCompleta = () => {
    const data=COMPLETA_DATA[Math.floor(Math.random()*COMPLETA_DATA.length)];
    setGameState({type:'completa',data,answers:data.resps.map(()=>''),feedback:null,results:null});
  };
  const onCompletaChange = (i,v) => setGameState(p=>{const a=[...p.answers];a[i]=v;return{...p,answers:a,feedback:null};});
  const onCompletaSubmit = () => {
    const s=gameState;
    const correct=s.answers.filter((a,i)=>a.trim().toLowerCase()===s.data.resps[i].toLowerCase()).length;
    const stars=correct===s.data.resps.length?3:correct>=s.data.resps.length-1?2:1;
    setGameState(p=>({...p,feedback:s.answers.map((a,i)=>a.trim().toLowerCase()===s.data.resps[i].toLowerCase()?'correct':'wrong')}));
    setTimeout(()=>finishGame(stars,correct>=s.data.resps.length-1),1200);
  };

  /* ── FÁBRICA DE RIMAS ─────────────────────── */
  const initRimas = () => {
    const entry=RIMAS_DATA[Math.floor(Math.random()*RIMAS_DATA.length)];
    setGameState({type:'rimas',entry,input:'',found:[],timeLeft:30,running:false,gameOver:false,results:null});
  };
  const startRimas = () => setGameState(p=>({...p,running:true}));
  const onRimasInput = v => setGameState(p=>({...p,input:v}));
  const onRimasSubmit = () => {
    const s=gameState; const v=s.input.trim().toLowerCase();
    if(!v||s.found.includes(v))return;
    if(s.entry.rimas.includes(v)){setGameState(p=>({...p,found:[...p.found,v],input:''}));}
    else{setGameState(p=>({...p,input:''}));}
  };

  useEffect(()=>{
    if(activeGame!=='rimas'||!gameState?.running||gameState?.results)return;
    const iv=setInterval(()=>setGameState(p=>{if(!p?.running)return p;const t=p.timeLeft-1;return t<=0?{...p,timeLeft:0,running:false,gameOver:true}:{...p,timeLeft:t};}),1000);
    return()=>clearInterval(iv);
  },[activeGame,gameState?.running]);

  useEffect(()=>{
    if(activeGame!=='rimas'||!gameState?.gameOver||gameState?.results)return;
    const n=gameState.found.length;
    finishGame(n>=5?3:n>=3?2:1,n>0);
  },[gameState?.gameOver]);

  /* ── SOPA DE LETRAS ───────────────────────── */
  const initSopa = () => {
    const{grid,placed}=buildWordSearch();
    setGameState({type:'sopa',grid,placed,foundIds:[],wrongGuesses:0,selecting:false,startCell:null,highlights:[],results:null});
  };
  const getSopaLine = (r0,c0,r1,c1) => {
    const dr=r1-r0,dc=c1-c0,len=Math.max(Math.abs(dr),Math.abs(dc));
    if(len===0)return[{r:r0,c:c0}];
    const sr=dr/len,sc=dc/len;
    if(!Number.isInteger(sr)||!Number.isInteger(sc))return null;
    return Array.from({length:len+1},(_,i)=>({r:r0+sr*i,c:c0+sc*i}));
  };
  const onSopaCell = (r,c) => {
    const s=gameState; if(!s||s.results)return;
    if(!s.selecting){setGameState(p=>({...p,selecting:true,startCell:{r,c},highlights:[...p.highlights.filter(h=>{const[hr,hc]=h.split(',').map(Number);return s.foundIds.some(id=>s.placed.find(pl=>pl.wordId===id)?.cells.some(cell=>cell.r===hr&&cell.c===hc));}),`${r},${c}`]}));return;}
    const path=getSopaLine(s.startCell.r,s.startCell.c,r,c);
    if(!path){setGameState(p=>({...p,selecting:false,startCell:null}));return;}
    const word=path.map(p2=>s.grid[p2.r][p2.c].letter).join(''),wordRev=[...word].reverse().join('');
    const match=s.placed.find(pl=>!s.foundIds.includes(pl.wordId)&&(pl.word===word||pl.word===wordRev));
    if(match){
      const hl=[...new Set([...s.highlights,...path.map(p2=>`${p2.r},${p2.c}`)])];
      const foundIds=[...s.foundIds,match.wordId];
      setGameState(p=>({...p,selecting:false,startCell:null,highlights:hl,foundIds}));
      if(foundIds.length===s.placed.length){const stars=s.wrongGuesses===0?3:s.wrongGuesses<=3?2:1;setTimeout(()=>finishGame(stars,true),400);}
    } else {
      setGameState(p=>({...p,selecting:false,startCell:null,wrongGuesses:p.wrongGuesses+1}));
    }
  };

  /* ── TRAZA LA LETRA ───────────────────────── */
  const initTraza = () => {
    drawnPtsRef.current=[];
    setGameState({type:'traza',letters:TRAZA_LETTERS,idx:0,letter:TRAZA_LETTERS[0],hits:0,totalCps:TRAZA_CPS[TRAZA_LETTERS[0]].length,results:null});
  };

  useEffect(()=>{
    if(activeGame!=='traza'||!gameState?.letter)return;
    const canvas=canvasRef.current; if(!canvas)return;
    const ctx=canvas.getContext('2d'),W=canvas.width,H=canvas.height;
    ctx.clearRect(0,0,W,H);
    ctx.font=`bold ${Math.min(W,H)*0.78}px Nunito,sans-serif`;
    ctx.fillStyle='rgba(124,58,237,0.1)';ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText(gameState.letter,W/2,H/2);
    const cps=TRAZA_CPS[gameState.letter];
    cps.forEach((cp,i)=>{
      ctx.beginPath();ctx.arc(cp.x*W,cp.y*H,10,0,Math.PI*2);
      ctx.fillStyle='rgba(124,58,237,0.25)';ctx.fill();
      ctx.fillStyle='#7C3AED';ctx.font='bold 11px Nunito,sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
      ctx.fillText(i+1,cp.x*W,cp.y*H);
    });
    drawnPtsRef.current=[];
  },[activeGame,gameState?.letter]);

  const getCanvasPt = (e) => {
    const canvas=canvasRef.current,rect=canvas.getBoundingClientRect();
    const sx=canvas.width/rect.width,sy=canvas.height/rect.height;
    const cx=e.touches?e.touches[0].clientX:e.clientX, cy=e.touches?e.touches[0].clientY:e.clientY;
    return{x:(cx-rect.left)*sx,y:(cy-rect.top)*sy};
  };
  const onTrazaDown = (e) => { e.preventDefault();isDrawingRef.current=true;const pt=getCanvasPt(e);drawnPtsRef.current.push(pt);const ctx=canvasRef.current?.getContext('2d');if(ctx){ctx.beginPath();ctx.moveTo(pt.x,pt.y);} };
  const onTrazaMove = (e) => { if(!isDrawingRef.current)return;e.preventDefault();const pt=getCanvasPt(e);drawnPtsRef.current.push(pt);const ctx=canvasRef.current?.getContext('2d');if(ctx){ctx.lineTo(pt.x,pt.y);ctx.strokeStyle='#7C3AED';ctx.lineWidth=5;ctx.lineCap='round';ctx.lineJoin='round';ctx.stroke();} };
  const onTrazaUp   = () => { isDrawingRef.current=false;const ctx=canvasRef.current?.getContext('2d');if(ctx)ctx.beginPath(); };
  const onTrazaDone = () => {
    const s=gameState,canvas=canvasRef.current;if(!canvas)return;
    const W=canvas.width,H=canvas.height,R=28;
    const cps=TRAZA_CPS[s.letter].map(cp=>({x:cp.x*W,y:cp.y*H,hit:false}));
    for(const pt of drawnPtsRef.current)for(const cp of cps)if(!cp.hit){const dx=pt.x-cp.x,dy=pt.y-cp.y;if(Math.sqrt(dx*dx+dy*dy)<=R)cp.hit=true;}
    const hitCount=cps.filter(cp=>cp.hit).length;
    const ratio=hitCount/cps.length;
    if(s.idx>=s.letters.length-1){
      const stars=ratio>=.8?3:ratio>=.5?2:1;
      setTimeout(()=>finishGame(stars,ratio>=.5),500);
    } else {
      const nextIdx=s.idx+1,nextLetter=s.letters[nextIdx];
      const ctx=canvas.getContext('2d');ctx.clearRect(0,0,W,H);
      setGameState(p=>({...p,idx:nextIdx,letter:nextLetter,totalCps:TRAZA_CPS[nextLetter].length}));
    }
  };

  /* ── ESCUCHA Y ESCRIBE ────────────────────── */
  const speak = (word) => { if(!('speechSynthesis'in window))return;window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(word);u.lang='es-ES';u.rate=0.82;window.speechSynthesis.speak(u); };
  const initEscucha = () => { const words=shuffle(ESCUCHA_WORDS).slice(0,5);setGameState({type:'escucha',words,round:0,answer:'',feedback:null,replaysLeft:3,correctCount:0,results:null});setTimeout(()=>speak(words[0]),500); };
  const onEscuchaReplay  = () => { if(!gameState||gameState.replaysLeft<=0||gameState.feedback)return;speak(gameState.words[gameState.round]);setGameState(p=>({...p,replaysLeft:p.replaysLeft-1})); };
  const onEscuchaSubmit  = () => {
    const s=gameState; if(!s||!s.answer.trim()||s.feedback)return;
    const ok=s.answer.trim().toLowerCase()===s.words[s.round].toLowerCase(), cnt=s.correctCount+(ok?1:0);
    if(s.round>=s.words.length-1){setGameState(p=>({...p,feedback:ok?'correct':'wrong',correctCount:cnt}));setTimeout(()=>finishGame(cnt>=5?3:cnt>=3?2:1,cnt>=3),800);}
    else{setGameState(p=>({...p,feedback:ok?'correct':'wrong',correctCount:cnt}));setTimeout(()=>{const next=s.round+1;setGameState(p2=>({...p2,round:next,answer:'',feedback:null,replaysLeft:3}));speak(s.words[next]);},900);}
  };

  /* ── LEE EN VOZ ALTA ──────────────────────── */
  const leeVozRecRef=useRef(null);
  const initLeeVoz = () => {
    const words=shuffle(ESCUCHA_WORDS).slice(0,5);
    setGameState({type:'leeVoz',words,round:0,listening:false,transcript:'',feedback:null,correctCount:0,noSupport:false,results:null});
  };
  const onLeeVozListen = () => {
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SR){setGameState(p=>({...p,noSupport:true}));return;}
    const rec=new SR();rec.lang='es-ES';rec.interimResults=false;rec.maxAlternatives=3;
    rec.onresult=(e)=>{
      const results=Array.from(e.results[0]).map(r=>r.transcript.toLowerCase().trim());
      setGameState(p=>{
        const expected=p.words[p.round].toLowerCase();
        const ok=results.some(r=>r===expected);
        const cnt=p.correctCount+(ok?1:0);
        return{...p,listening:false,transcript:results[0]||'',feedback:ok?'correct':'wrong',correctCount:cnt};
      });
    };
    rec.onerror=()=>setGameState(p=>({...p,listening:false,feedback:'wrong'}));
    rec.onend=()=>setGameState(p=>({...p,listening:p.listening?false:p.listening}));
    rec.start();leeVozRecRef.current=rec;
    setGameState(p=>({...p,listening:true,transcript:'',feedback:null}));
  };

  useEffect(()=>{
    if(activeGame!=='leeVoz'||!['correct','wrong'].includes(gameState?.feedback)||gameState?.results)return;
    const s=gameState;
    const id=setTimeout(()=>{
      if(s.round>=s.words.length-1){finishGame(s.correctCount>=5?3:s.correctCount>=3?2:1,s.correctCount>=3);}
      else{setGameState(p=>({...p,round:p.round+1,transcript:'',feedback:null}));}
    },1600);
    return()=>clearTimeout(id);
  },[gameState?.feedback]);

  /* ── RESULTS ──────────────────────────────── */
  const fmtTime = s => s<60?`${s}s`:`${Math.floor(s/60)}m ${s%60}s`;
  const renderResults = () => {
    const r=gameState?.results; if(!r)return null;
    return(
      <div className="game-results">
        <div className="results-emoji">{r.won?'🎉':'💪'}</div>
        <div className="results-score">{r.won?'¡Excelente!':'¡Buen intento!'}</div>
        <div className="results-xp">+{r.xp} XP</div>
        <div className="results-stars">
          {[0,1,2].map(i=><span key={i} className="animate-star-pop" style={{animationDelay:`${.2+i*.2}s`}}>{i<r.stars?'⭐':'☆'}</span>)}
        </div>
        <div className="results-metrics"><div className="metric-item"><span className="metric-label">Tiempo</span><span className="metric-value">{fmtTime(r.duration)}</span></div></div>
        <div className="results-actions">
          <button className="btn btn-primary" onClick={()=>openGame(activeGame)}>Jugar de Nuevo</button>
          <button className="btn btn-secondary" onClick={closeGame}>Volver</button>
        </div>
      </div>
    );
  };

  /* ── RENDERS ──────────────────────────────── */

  const renderMemorama = () => {
    const s=gameState; if(!s)return null; if(s.results)return renderResults();
    return(
      <div className="memo-game">
        <div className="memo-hud"><span>Movimientos: <strong>{s.moves}</strong></span><span>Pares: <strong>{s.matched.length/2}/{MEMORAMA_PAIRS.length}</strong></span></div>
        <div className="memo-grid">
          {s.cards.map((card,idx)=>{
            const flip=s.flipped.includes(idx)||s.matched.includes(idx),mat=s.matched.includes(idx);
            return(<button key={card.uid} className={`memo-card${flip?' flipped':''}${mat?' matched':''}`} onClick={()=>onMemoClick(idx)}>
              <div className="memo-inner"><div className="memo-front">?</div><div className={`memo-back ${card.face}`}>{card.content}</div></div>
            </button>);
          })}
        </div>
      </div>
    );
  };

  const renderIman = () => {
    const s=gameState; if(!s)return null; if(s.results)return renderResults();
    return(
      <div className="iman-game">
        <div className="iman-round-bar">Ronda {s.round} de 5</div>
        <div className="iman-hint-box"><span className="iman-emoji">{s.entry.emoji}</span><span className="iman-hint-text">{s.entry.hint}</span></div>
        <div className={`iman-drop-zone${s.feedback?` is-${s.feedback}`:''}`}>
          {s.answer.length===0?<span className="iman-placeholder">Toca las letras para armar la palabra</span>:s.answer.map(l=><button key={l.id} className="iman-tile placed" onClick={()=>onImanRemove(l.id)}>{l.ch}</button>)}
        </div>
        <div className="iman-pool">{s.letters.filter(l=>!l.placed).map(l=><button key={l.id} className="iman-tile" onClick={()=>onImanPick(l.id)}>{l.ch}</button>)}</div>
        {s.feedback&&<p className={`iman-feedback ${s.feedback}`}>{s.feedback==='correct'?'✅ ¡Correcto!':`❌ Era: ${s.entry.word}`}</p>}
        <div className="iman-actions"><button className="btn btn-ghost" onClick={onImanClear}>Limpiar</button><button className="btn btn-primary" onClick={onImanCheck} disabled={s.answer.length!==s.entry.word.length||!!s.feedback}>Verificar</button></div>
      </div>
    );
  };

  const renderLluvia = () => {
    const s=gameState; if(!s)return null; if(s.results)return renderResults();
    return(
      <div className="lluvia-game">
        <div className="lluvia-hud"><div className="lluvia-stat">⭐ {s.score}</div><div className="lluvia-stat lluvia-timer">⏱ {s.timeLeft}s</div><div className="lluvia-stat">{'❤️'.repeat(s.lives)}{'🖤'.repeat(Math.max(0,3-s.lives))}</div></div>
        {!s.running?(<div className="lluvia-intro"><p className="lluvia-rules">Haz clic en las palabras <strong>correctamente escritas</strong>.<br/>¡Las que tienen errores: déjalas caer!</p><button className="btn btn-primary btn-lg" onClick={startLluvia}>¡Comenzar!</button></div>)
        :(<div className="lluvia-arena">{s.words.map(w=><button key={w.id} className="lluvia-word" style={{left:`${w.x}%`,top:`${w.y}%`}} onClick={()=>onLluviaClick(w.id)}>{w.text}</button>)}</div>)}
      </div>
    );
  };

  const renderClasificador = () => {
    const s=gameState; if(!s)return null; if(s.results)return renderResults();
    const placed=Object.keys(s.placements), unplaced=s.ronda.words.filter(({w})=>!placed.includes(w));
    return(
      <div className="clasif-game">
        <p className="clasif-instr">Selecciona una palabra y luego su categoría.</p>
        <div className="clasif-pool">
          {unplaced.map(({w})=><button key={w} className={`clasif-word${s.selected===w?' sel':''}`} onClick={()=>onClasifWord(w)}>{w}</button>)}
        </div>
        <div className="clasif-cats">
          {s.ronda.cats.map(cat=>(
            <div key={cat} className={`clasif-cat${s.selected?' droppable':''}`} onClick={()=>onClasifCat(cat)}>
              <div className="clasif-cat-label">{cat}</div>
              <div className="clasif-cat-words">
                {s.ronda.words.filter(({w})=>s.placements[w]===cat).map(({w})=><span key={w} className="clasif-placed" onClick={e=>{e.stopPropagation();setGameState(p=>{const pl={...p.placements};delete pl[w];return{...p,placements:pl,selected:null};});}}>{w} ×</span>)}
              </div>
            </div>
          ))}
        </div>
        {s.feedback&&<p className="clasif-feedback">✅ {s.feedback.correct}/{s.feedback.total} correctas</p>}
        <button className="btn btn-primary" onClick={onClasifCheck} disabled={Object.keys(s.placements).length<s.ronda.words.length||!!s.feedback}>Verificar</button>
      </div>
    );
  };

  const renderOracion = () => {
    const s=gameState; if(!s)return null; if(s.results)return renderResults();
    return(
      <div className="oracion-game">
        <div className="oracion-round">Ronda {s.round} de 5</div>
        <div className="oracion-answer">
          {s.answer.length===0?<span className="oracion-ph">Toca las palabras en el orden correcto</span>:s.answer.map((w,i)=><button key={i} className="oracion-word placed" onClick={()=>onOracionRemove(w)}>{w}</button>)}
        </div>
        <div className="oracion-pool">{s.pool.map((w,i)=><button key={i} className="oracion-word" onClick={()=>onOracionPick(w)}>{w}</button>)}</div>
        {s.feedback&&<p className={`oracion-feedback ${s.feedback}`}>{s.feedback==='correct'?'✅ ¡Correcto!':`❌ Era: "${s.data.ans}"`}</p>}
        <div className="iman-actions">
          <button className="btn btn-ghost" onClick={()=>setGameState(p=>({...p,pool:[...p.data.words],answer:[],feedback:null}))}>Limpiar</button>
          <button className="btn btn-primary" onClick={onOracionCheck} disabled={s.answer.length!==s.data.words.length||!!s.feedback}>Verificar</button>
        </div>
      </div>
    );
  };

  const renderCarrera = () => {
    const s=gameState; if(!s)return null; if(s.results)return renderResults();
    if(s.phase==='reading')return(
      <div className="carrera-game">
        <div className="carrera-hud"><span className="carrera-timer">⏱ {s.timeLeft}s para leer</span></div>
        <div className="carrera-texto">{s.data.texto}</div>
        {!s.running?<button className="btn btn-primary btn-lg" onClick={startCarrera}>¡Comenzar a leer!</button>
        :<button className="btn btn-secondary" onClick={()=>setGameState(p=>({...p,running:false,phase:'questions'}))}>Ya leí → Responder</button>}
      </div>
    );
    const q=s.data.preguntas[s.qIdx];
    return(
      <div className="carrera-game">
        <div className="carrera-hud"><span>Pregunta {s.qIdx+1}/{s.data.preguntas.length}</span><span>✅ {s.correctCount}</span></div>
        <p className="carrera-pregunta">{q.p}</p>
        <div className="carrera-ops">{q.ops.map((op,i)=><button key={i} className="game-option" onClick={()=>onCarreraAnswer(i)}>{op}</button>)}</div>
      </div>
    );
  };

  const renderBomba = () => {
    const s=gameState; if(!s)return null; if(s.results)return renderResults();
    const w=s.words[s.wordIdx];
    const pct=s.timeLeft/10*100;
    const timerColor=s.timeLeft>5?'#059669':s.timeLeft>2?'#D97706':'#DC2626';
    return(
      <div className="bomba-game">
        <div className="bomba-hud"><span>Palabra {s.wordIdx+1}/{s.words.length}</span><span>⭐ {s.score}</span></div>
        {!s.timerRunning&&!s.feedback&&s.wordIdx===0?(<div className="lluvia-intro"><p className="lluvia-rules">Escribe la palabra correctamente<br/>antes de que explote la bomba.</p><button className="btn btn-primary btn-lg" onClick={startBomba}>¡Comenzar!</button></div>):(
          <>
            <div className="bomba-timer-bar"><div className="bomba-timer-fill" style={{width:`${pct}%`,background:timerColor}}/></div>
            <div className="bomba-display">
              <span className="bomba-emoji">{s.timeLeft<=3?'💥':'💣'}</span>
              <span className="bomba-word">{w?.wrong}</span>
              <span className="bomba-secs" style={{color:timerColor}}>{s.timeLeft}s</span>
            </div>
            {s.feedback?(<p className={`bomba-feedback ${s.feedback}`}>{s.feedback==='correct'?'✅ ¡Correcto!':s.feedback==='wrong'?`❌ Era: ${w?.correct}`:'⏰ ¡Tiempo! Era: '+w?.correct}</p>):(
              <>
                <input className="bomba-input" type="text" value={s.answer} onChange={e=>setGameState(p=>({...p,answer:e.target.value}))} onKeyDown={e=>e.key==='Enter'&&onBombaSubmit()} placeholder="Escribe la corrección..." autoFocus autoComplete="off" autoCapitalize="none"/>
                <button className="btn btn-primary" onClick={onBombaSubmit} disabled={!s.answer.trim()}>Enviar</button>
              </>
            )}
          </>
        )}
      </div>
    );
  };

  const renderDiferencias = () => {
    const s=gameState; if(!s)return null; if(s.results)return renderResults();
    return(
      <div className="dif-game">
        <p className="dif-instr">Haz clic en las palabras que son <strong>diferentes</strong> en el texto de la derecha. ({s.found.length}/{s.data.di.length} encontradas)</p>
        <div className="dif-cols">
          <div className="dif-col">
            <div className="dif-label">Texto A</div>
            <div className="dif-text">{s.data.A.map((w,i)=><span key={i} className="dif-word">{w} </span>)}</div>
          </div>
          <div className="dif-col">
            <div className="dif-label">Texto B</div>
            <div className="dif-text">
              {s.data.B.map((w,i)=>{
                const isFound=s.found.includes(i),isWrong=s.wrong.includes(i);
                return(<button key={i} className={`dif-word clickable${isFound?' found':isWrong?' wrong':''}`} onClick={()=>onDifClick(i)}>{w} </button>);
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderHistoria = () => {
    const s=gameState; if(!s)return null; if(s.results)return renderResults();
    return(
      <div className="historia-game">
        <p className="historia-instr">Haz clic en las escenas en el orden correcto para reconstruir la historia <strong>"{s.titulo}"</strong>.</p>
        <div className="historia-panels">
          {s.panels.map((p)=>{
            const posInSel=s.selected.indexOf(p.id)+1;
            return(<button key={p.id} className={`historia-panel${posInSel>0?' selected':''}`} onClick={()=>onHistoriaPanel(p.id)}>
              {posInSel>0&&<span className="historia-num">{posInSel}</span>}
              <p>{p.text}</p>
            </button>);
          })}
        </div>
        {s.selected.length>0&&<button className="btn btn-ghost" onClick={onHistoriaReset}>Reintentar</button>}
      </div>
    );
  };

  const renderEscalera = () => {
    const s=gameState; if(!s)return null; if(s.results)return renderResults();
    return(
      <div className="escalera-game">
        <p className="escalera-instr">Toca las palabras de <strong>menor a mayor</strong> número de sílabas.</p>
        <div className="escalera-instr-sub">Esperando: <strong>{s.nextS} sílaba{s.nextS!==1?'s':''}</strong> · Errores: {s.errors}</div>
        <div className="escalera-words">
          {s.words.map(({w,s:syl})=>{
            const done=s.selected.includes(w);
            return(<button key={w} className={`escalera-word${done?' done':''}${s.feedback==='correct'&&!done?'':''}`} onClick={()=>!done&&onEscaleraClick({w,s:syl})} disabled={done}>{w}<span className="escalera-syl-hint">{done?`${syl} síl.`:''}</span></button>);
          })}
        </div>
        {s.feedback&&<p className={`escalera-fb ${s.feedback}`}>{s.feedback==='correct'?'✅ ¡Correcto!':'❌ Inténtalo de nuevo'}</p>}
      </div>
    );
  };

  const renderCompleta = () => {
    const s=gameState; if(!s)return null; if(s.results)return renderResults();
    const parts=s.data.partes;
    return(
      <div className="completa-game">
        <p className="completa-texto">
          {parts.map((part,i)=>(
            <span key={i}>{part}{i<s.data.resps.length&&(
              <input className={`completa-input${s.feedback?` is-${s.feedback[i]}`:''}`} type="text" value={s.answers[i]} onChange={e=>onCompletaChange(i,e.target.value)} placeholder={s.data.hints[i]} disabled={!!s.feedback} autoComplete="off" autoCapitalize="none"/>
            )}</span>
          ))}
        </p>
        {s.feedback&&<p className="completa-result">{s.feedback.filter(f=>f==='correct').length}/{s.data.resps.length} correctas</p>}
        {!s.feedback&&<button className="btn btn-primary" onClick={onCompletaSubmit} disabled={s.answers.some(a=>!a.trim())}>Verificar</button>}
      </div>
    );
  };

  const renderRimas = () => {
    const s=gameState; if(!s)return null; if(s.results)return renderResults();
    return(
      <div className="rimas-game">
        {!s.running?(
          <div className="lluvia-intro">
            <div className="rimas-word-big">{s.entry.word}</div>
            <p className="lluvia-rules">Escribe todas las palabras que rimen con <strong>"{s.entry.word}"</strong> en 30 segundos.</p>
            <button className="btn btn-primary btn-lg" onClick={startRimas}>¡Comenzar!</button>
          </div>
        ):(
          <>
            <div className="rimas-hud"><div className="rimas-word-big">{s.entry.word}</div><div className="rimas-timer">⏱ {s.timeLeft}s · {s.found.length} rimas</div></div>
            <div className="rimas-found">{s.found.map(r=><span key={r} className="rimas-chip">{r}</span>)}</div>
            <div className="rimas-input-row">
              <input className="escucha-input" type="text" value={s.input} onChange={e=>onRimasInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&onRimasSubmit()} placeholder="Escribe una rima..." autoFocus autoComplete="off" autoCapitalize="none"/>
              <button className="btn btn-primary" onClick={onRimasSubmit} disabled={!s.input.trim()}>+</button>
            </div>
          </>
        )}
      </div>
    );
  };

  const renderSopa = () => {
    const s=gameState; if(!s)return null; if(s.results)return renderResults();
    return(
      <div className="sopa-game">
        <div className="sopa-words">{s.placed.map(p=><span key={p.wordId} className={`sopa-tag${s.foundIds.includes(p.wordId)?' found':''}`}>{p.word}</span>)}</div>
        {s.selecting&&<p className="sopa-hint-msg">Ahora toca la letra final</p>}
        <div className="sopa-board">
          {s.grid.map((row,r)=>(
            <div key={r} className="sopa-row">
              {row.map((cell,c)=>{const key=`${r},${c}`,isH=s.highlights.includes(key),isS=s.startCell?.r===r&&s.startCell?.c===c;
                return<button key={key} className={`sopa-cell${isH?' hl':''}${isS?' sel':''}`} onClick={()=>onSopaCell(r,c)}>{cell.letter}</button>;
              })}
            </div>
          ))}
        </div>
        <p className="sopa-count">Encontradas: {s.foundIds.length}/{s.placed.length}</p>
      </div>
    );
  };

  const renderTraza = () => {
    const s=gameState; if(!s)return null; if(s.results)return renderResults();
    return(
      <div className="traza-game">
        <div className="traza-hud"><span>Letra {s.idx+1}/{s.letters.length}</span><span className="traza-letter-label">{s.letter}</span></div>
        <p className="traza-instr">Traza la letra sobre el lienzo. Pasa por los puntos numerados.</p>
        <canvas ref={canvasRef} className="traza-canvas" width={260} height={260}
          onPointerDown={onTrazaDown} onPointerMove={onTrazaMove} onPointerUp={onTrazaUp} onPointerLeave={onTrazaUp}
          style={{touchAction:'none'}}/>
        <div className="iman-actions">
          <button className="btn btn-ghost" onClick={()=>{const ctx=canvasRef.current?.getContext('2d');if(ctx)ctx.clearRect(0,0,260,260);drawnPtsRef.current=[];setGameState(p=>({...p,letter:p.letter}));}}>Borrar</button>
          <button className="btn btn-primary" onClick={onTrazaDone}>Listo →</button>
        </div>
      </div>
    );
  };

  const renderEscucha = () => {
    const s=gameState; if(!s)return null; if(s.results)return renderResults();
    const hasSpeech=typeof window!=='undefined'&&'speechSynthesis'in window;
    return(
      <div className="escucha-game">
        <div className="escucha-progress">Palabra {s.round+1} de {s.words.length} · {s.correctCount} correctas</div>
        {!hasSpeech&&<p className="escucha-warning">Tu navegador no soporta síntesis de voz. Prueba con Chrome.</p>}
        <button className="escucha-play-btn" onClick={onEscuchaReplay} disabled={s.replaysLeft<=0||!!s.feedback}>🔊 Escuchar {s.replaysLeft>0?`(${s.replaysLeft})`:'(sin rep.)'}</button>
        <input type="text" className={`escucha-input${s.feedback?` is-${s.feedback}`:''}`} placeholder="Escribe lo que escuchaste..." value={s.answer} onChange={e=>setGameState(p=>({...p,answer:e.target.value}))} onKeyDown={e=>e.key==='Enter'&&onEscuchaSubmit()} disabled={!!s.feedback} autoCapitalize="none" autoComplete="off"/>
        {s.feedback?<p className={`escucha-feedback ${s.feedback}`}>{s.feedback==='correct'?'✅ ¡Correcto!':`❌ Era: "${s.words[s.round]}"`}</p>:<button className="btn btn-primary" onClick={onEscuchaSubmit} disabled={!s.answer.trim()}>Verificar</button>}
      </div>
    );
  };

  const renderLeeVoz = () => {
    const s=gameState; if(!s)return null; if(s.results)return renderResults();
    return(
      <div className="leevoz-game">
        <div className="escucha-progress">Palabra {s.round+1} de {s.words.length} · {s.correctCount} correctas</div>
        <div className="leevoz-word">{s.words[s.round]}</div>
        {s.noSupport&&<p className="escucha-warning">Tu navegador no soporta reconocimiento de voz. Usa Chrome en Android/PC.</p>}
        {!s.feedback&&!s.noSupport&&(
          <button className={`leevoz-btn${s.listening?' listening':''}`} onClick={onLeeVozListen} disabled={s.listening}>
            {s.listening?'🎙️ Escuchando...':'🎙️ Hablar'}
          </button>
        )}
        {s.transcript&&<p className="leevoz-transcript">Detecté: <em>"{s.transcript}"</em></p>}
        {s.feedback&&<p className={`escucha-feedback ${s.feedback}`}>{s.feedback==='correct'?'✅ ¡Correcto!':`❌ Era: "${s.words[s.round]}"`}</p>}
      </div>
    );
  };

  /* ── SWITCH ───────────────────────────────── */
  const renderGame = () => {
    switch(activeGame){
      case'memorama':    return renderMemorama();
      case'iman':        return renderIman();
      case'lluvia':      return renderLluvia();
      case'clasificador':return renderClasificador();
      case'oracion':     return renderOracion();
      case'carrera':     return renderCarrera();
      case'bomba':       return renderBomba();
      case'diferencias': return renderDiferencias();
      case'historia':    return renderHistoria();
      case'escalera':    return renderEscalera();
      case'completa':    return renderCompleta();
      case'rimas':       return renderRimas();
      case'sopa':        return renderSopa();
      case'traza':       return renderTraza();
      case'escucha':     return renderEscucha();
      case'leeVoz':      return renderLeeVoz();
      default:           return null;
    }
  };

  const meta=META[activeGame];

  /* ── MAIN RENDER ──────────────────────────── */
  return(
    <div className="adv-page">
      <div className="container">
        <div className="adv-header">
          <h1>Juegos Avanzados</h1>
          <p>16 juegos con distintas mecánicas para trabajar habilidades de lectura y escritura.</p>
        </div>
        {CATEGORIES.map(cat=>(
          <div key={cat.label} className="adv-category">
            <h2 className="adv-cat-label">{cat.label}</h2>
            <div className="adv-catalog">
              {cat.ids.map(id=>{const m=META[id];return(
                <button key={id} className="adv-card card" onClick={()=>openGame(id)}>
                  <div className="adv-card-img" style={{background:m.g}}>{m.emoji}</div>
                  <div className="adv-card-body">
                    <span className="adv-skill-tag">{m.skill}</span>
                    <h3>{m.name}</h3>
                  </div>
                </button>
              );})}
            </div>
          </div>
        ))}
      </div>

      {activeGame&&(
        <div className="adv-overlay" onClick={e=>e.target===e.currentTarget&&closeGame()}>
          <div className="adv-modal">
            <div className="adv-modal-head" style={{background:meta?.g}}>
              <span className="adv-modal-icon">{meta?.emoji}</span>
              <div><h2>{meta?.name}</h2><span className="adv-modal-skill">{meta?.skill}</span></div>
              <button className="adv-close-btn" onClick={closeGame} aria-label="Cerrar">✕</button>
            </div>
            <div className="adv-modal-body">{renderGame()}</div>
          </div>
        </div>
      )}
    </div>
  );
}
