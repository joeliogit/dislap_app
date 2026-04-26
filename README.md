# 🧠 Disslapp — Plataforma Web para el Tratamiento de la Dislexia

> Herramienta clínica digital que conecta psicólogos con sus pacientes a través de juegos terapéuticos, seguimiento de avances en tiempo real y un panel de control profesional.

---

## 📋 Tabla de Contenidos

1. [Descripción General](#descripción-general)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Estructura del Proyecto](#estructura-del-proyecto)
4. [Instalación y Configuración](#instalación-y-configuración)
5. [Base de Datos](#base-de-datos)
6. [Backend — API REST](#backend--api-rest)
7. [Frontend — React App](#frontend--react-app)
8. [Autenticación](#autenticación)
9. [Sistema de Juegos](#sistema-de-juegos)
10. [Panel del Doctor](#panel-del-doctor)
11. [Sistema de XP y Niveles](#sistema-de-xp-y-niveles)
12. [Variables de Entorno](#variables-de-entorno)
13. [Credenciales de Prueba](#credenciales-de-prueba)

---

## 📖 Descripción General

**Disslapp** es una plataforma web terapéutica con dos tipos de usuarios:

- **Pacientes**: juegan minijuegos diseñados para trabajar habilidades afectadas por la dislexia (fonología, decodificación, segmentación silábica, etc.). Ganan XP, suben de nivel y desbloquean logros.
- **Psicólogos**: acceden a un panel de control donde ven el progreso de todos sus pacientes, el historial de sesiones, el tiempo de respuesta por habilidad y métricas de tratamiento.

---

## 💻 Stack Tecnológico

### Frontend
| Tecnología | Versión | Uso |
|-----------|---------|-----|
| React | 19 | Framework principal SPA |
| Vite | 6 | Bundler y servidor de desarrollo |
| React Router | 7 | Navegación entre páginas |
| CSS Variables | — | Sistema de diseño (tokens) |

### Backend
| Tecnología | Versión | Uso |
|-----------|---------|-----|
| Node.js | 18+ | Runtime del servidor |
| Express | 4 | Framework HTTP / API REST |
| MySQL2 | — | Driver de base de datos |
| bcrypt | — | Hash de contraseñas |
| jsonwebtoken | — | Tokens JWT para sesiones |
| google-auth-library | — | Verificación de tokens Google OAuth |
| dotenv | — | Variables de entorno |
| helmet | — | Cabeceras HTTP de seguridad |
| cors | — | Permitir peticiones del frontend |

### Base de Datos
| Tecnología | Uso |
|-----------|-----|
| MySQL 8 (XAMPP) | Almacenamiento principal |

---

## 📁 Estructura del Proyecto

```
dislap_app/
├── backend/                      # API REST (Node.js + Express)
│   ├── config/
│   │   └── db.js                 # Pool de conexiones MySQL
│   ├── controllers/
│   │   ├── authController.js     # Login, registro, Google OAuth, /me
│   │   ├── gameController.js     # Guardar sesiones, obtener progreso
│   │   ├── doctorController.js   # Lista de pacientes, detalle por paciente
│   │   └── paymentsController.js # Suscripciones y planes
│   ├── middleware/
│   │   ├── auth.js               # Verificación de JWT (verifyToken)
│   │   └── errorHandler.js       # Manejo global de errores
│   ├── routes/
│   │   ├── auth.routes.js        # /api/auth/*
│   │   ├── game.routes.js        # /api/games/*
│   │   ├── doctor.routes.js      # /api/doctor/*
│   │   └── payments.routes.js    # /api/payments/*
│   ├── seeds/
│   │   └── seed.js               # Crea la BD y carga datos de prueba
│   ├── database.sql              # Esquema completo de la BD
│   ├── server.js                 # Punto de entrada del backend
│   ├── .env                      # Variables de entorno (no subir a git)
│   └── .env.example              # Plantilla de variables
│
├── src/                          # Frontend React
│   ├── assets/
│   │   └── css/                  # Hojas de estilo por sección
│   │       ├── index.css         # Tokens de diseño globales (colores, tipografía, espaciado)
│   │       ├── animations.css    # Keyframes y clases de animación
│   │       ├── navbar.css        # Estilos de la barra de navegación
│   │       ├── footer.css        # Estilos del footer
│   │       ├── auth.css          # Login y registro
│   │       ├── dashboard.css     # Dashboard del paciente
│   │       ├── games.css         # Catálogo y pantalla de juego
│   │       ├── levels.css        # Mapa de niveles
│   │       ├── progress.css      # Página de avances y logros
│   │       ├── doctor-panel.css  # Panel de control del psicólogo
│   │       ├── doctor.css        # Página "Sobre la Doctora"
│   │       ├── landing.css       # Landing page
│   │       ├── about.css         # Página "Nosotros"
│   │       └── pricing.css       # Página de precios
│   ├── components/
│   │   ├── Navbar.jsx            # Barra de navegación con menú de usuario
│   │   ├── Footer.jsx            # Footer del sitio
│   │   └── ConfettiCanvas.jsx    # Efecto de confetti al ganar logros
│   ├── context/
│   │   └── AuthContext.jsx       # Estado global: usuario, sesión, juegos, XP
│   ├── hooks/
│   │   └── useAuth.js            # Hook para consumir AuthContext
│   ├── pages/
│   │   ├── LandingPage.jsx       # Página principal (/)
│   │   ├── LoginPage.jsx         # Login + registro de psicólogos (/login)
│   │   ├── DashboardPage.jsx     # Dashboard del paciente (/dashboard)
│   │   ├── GamesPage.jsx         # Catálogo y motor de juegos (/juegos)
│   │   ├── LevelsPage.jsx        # Mapa de niveles (/niveles)
│   │   ├── ProgressPage.jsx      # Avances y logros (/avances)
│   │   ├── DoctorPanelPage.jsx   # Panel del psicólogo (/panel-doctor)
│   │   ├── DoctorPage.jsx        # Perfil de la doctora (/doctora)
│   │   ├── AboutPage.jsx         # Sobre nosotros (/nosotros)
│   │   └── PricingPage.jsx       # Precios (/precios)
│   ├── services/
│   │   └── api.js                # Funciones fetch hacia /api (authAPI, gamesAPI, paymentsAPI)
│   ├── utils/
│   │   ├── confetti.js           # Lanzador de confetti
│   │   └── xpCalculator.js       # Cálculo de XP y nivel siguiente
│   ├── App.jsx                   # Router principal + layout
│   └── main.jsx                  # Punto de entrada React
│
├── _backup_vanilla/              # Prototipo original en JS/HTML puro (referencia)
├── public/                       # Archivos estáticos
├── vite.config.js                # Config de Vite (proxy /api → localhost:3001)
├── package.json                  # Dependencias del frontend
└── README.md                     # Este archivo
```

---

## ⚙️ Instalación y Configuración

### Requisitos previos
- Node.js 18+
- XAMPP con MySQL corriendo en el puerto 3306

### 1. Clonar el repositorio

```bash
git clone https://github.com/joeliogit/dislap_app.git
cd dislap_app
```

### 2. Instalar dependencias del frontend

```bash
npm install
```

### 3. Instalar dependencias del backend

```bash
cd backend
npm install
```

### 4. Configurar variables de entorno

Crea el archivo `backend/.env` basado en `backend/.env.example`:

```env
GOOGLE_CLIENT_ID=tu_google_client_id
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=disslapp
JWT_SECRET=clave_secreta_aqui
PORT=3001
```

### 5. Crear la base de datos y cargar datos de prueba

```bash
cd backend
node seeds/seed.js
```

Esto ejecuta `database.sql` automáticamente y crea usuarios, juegos y logros de prueba.

### 6. Iniciar los servidores

**Backend** (puerto 3001):
```bash
cd backend
node server.js
```

**Frontend** (puerto 5173):
```bash
# desde la raíz del proyecto
npm run dev
```

La app estará disponible en `http://localhost:5173`. Las peticiones a `/api` se proxean automáticamente al backend en el puerto 3001.

---

## 🗄️ Base de Datos

### Esquema — `database.sql`

#### Tabla `users`
Almacena tanto pacientes como psicólogos en una sola tabla diferenciada por el campo `role`.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | INT PK | ID autoincremental |
| `name` | VARCHAR(100) | Nombre completo |
| `email` | VARCHAR(255) | Correo único |
| `password_hash` | VARCHAR(255) | Contraseña hasheada con bcrypt (NULL si usa OAuth) |
| `role` | ENUM | `patient` o `psychologist` |
| `patient_code` | VARCHAR(20) | Código único del paciente (ej. PAC-001) |
| `xp` | INT | Puntos de experiencia acumulados |
| `level` | INT | Nivel actual (1–6) |
| `level_name` | VARCHAR(50) | Nombre del nivel (Explorador, Aventurero, etc.) |
| `streak` | INT | Días consecutivos de actividad |
| `avatar` | VARCHAR(10) | Emoji o inicial del avatar |
| `total_sessions` | INT | Total de sesiones completadas |
| `total_games_played` | INT | Total de juegos jugados |
| `oauth_id` | VARCHAR(255) | ID de Google (si inició con OAuth) |
| `oauth_provider` | VARCHAR(50) | `google` o NULL |
| `last_login_date` | DATE | Último día de acceso (para calcular racha) |
| `subscription_plan` | ENUM | `free`, `pro`, `premium` |
| `created_at` | TIMESTAMP | Fecha de registro |

#### Tabla `games`
Catálogo de juegos disponibles en la plataforma.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | INT PK | ID del juego |
| `name` | VARCHAR(100) | Nombre del juego |
| `emoji` | VARCHAR(10) | Emoji representativo |
| `description` | TEXT | Descripción breve |
| `skill` | VARCHAR(100) | Habilidad que trabaja |
| `level_required` | INT | Nivel mínimo requerido |
| `type` | VARCHAR(50) | Tipo de mecánica del juego |
| `max_stars` | INT | Máximo de estrellas obtenibles |
| `is_recommended` | BOOLEAN | Si está marcado como recomendado |

#### Tabla `game_sessions`
Registro de cada partida completada por un paciente.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | INT PK | ID de la sesión |
| `user_id` | INT FK | Referencia al usuario |
| `game_id` | INT FK | Referencia al juego |
| `score` | INT | Puntuación obtenida |
| `stars` | INT | Estrellas obtenidas (0–3) |
| `xp_earned` | INT | XP ganada en esta sesión |
| `completed` | BOOLEAN | Si el juego fue completado |
| `duration_seconds` | INT | Tiempo que tardó en completarlo (cronómetro oculto) |
| `played_at` | TIMESTAMP | Fecha y hora de la partida |

#### Tabla `achievements`
Catálogo de logros disponibles en el sistema.

#### Tabla `user_achievements`
Relación de qué logros ha desbloqueado cada usuario.

---

## 🔌 Backend — API REST

El servidor Express corre en el puerto **3001**.

### Endpoints de Autenticación — `/api/auth`

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/api/auth/login` | Login con usuario/contraseña. Acepta correo (psicólogos) o nombre/código (pacientes) | No |
| POST | `/api/auth/register` | Registro de nuevo psicólogo | No |
| POST | `/api/auth/google` | Login con token de Google Identity Services | No |
| GET | `/api/auth/me` | Obtener datos del usuario autenticado | JWT |

**`POST /api/auth/login`** — Body:
```json
{ "username": "doctora@clinica.com", "password": "dislexia123", "role": "psychologist" }
```

**`POST /api/auth/register`** — Body:
```json
{ "name": "Dr. Juan", "email": "juan@clinica.com", "password": "mi_password" }
```

**`POST /api/auth/google`** — Body:
```json
{ "credential": "<id_token de Google>" }
```

Todos los endpoints de login retornan:
```json
{ "success": true, "token": "<JWT>", "user": { ... } }
```

---

### Endpoints de Juegos — `/api/games`

Todos requieren JWT en el header `Authorization: Bearer <token>`.

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/games/session` | Guardar una sesión de juego completada |
| GET | `/api/games/sessions` | Obtener las últimas 50 sesiones del usuario |
| GET | `/api/games/progress` | Obtener progreso completo (XP semanal, juegos completados, tiempos) |

**`POST /api/games/session`** — Body:
```json
{
  "gameId": 1,
  "score": 150,
  "stars": 3,
  "xpEarned": 75,
  "completed": true,
  "durationSeconds": 45
}
```

Al guardar una sesión completada, el backend:
1. Inserta el registro en `game_sessions`
2. Suma el XP al usuario en `users`
3. Recalcula el nivel del usuario según el nuevo XP total

---

### Endpoints del Doctor — `/api/doctor`

Requieren JWT **y** que el usuario tenga `role = 'psychologist'`. Si un paciente intenta acceder, recibe HTTP 403.

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/doctor/patients` | Lista todos los pacientes con sus estadísticas |
| GET | `/api/doctor/patients/:id` | Detalle completo de un paciente |

**`GET /api/doctor/patients/:id`** retorna:
```json
{
  "patient": { ... },
  "sessions": [ ... ],          // Últimas 30 sesiones
  "completedGames": [ ... ],    // Juegos completados con estrellas y tiempo promedio
  "weeklyXP": [ ... ],          // XP por día en las últimas 2 semanas
  "skillTimes": [ ... ]         // Tiempo promedio de respuesta por habilidad
}
```

---

### Middleware

#### `middleware/auth.js` — verifyToken
Extrae y verifica el JWT del header `Authorization`. Si es válido, adjunta `req.user = { id, role, name }`. Si es inválido o no existe, retorna HTTP 401.

#### `middleware/errorHandler.js`
Captura todos los errores no manejados y retorna una respuesta JSON uniforme con el mensaje de error.

---

## ⚛️ Frontend — React App

### `src/context/AuthContext.jsx`
Estado global de la aplicación. Provee a todos los componentes:

| Valor | Tipo | Descripción |
|-------|------|-------------|
| `user` | Object | Datos del usuario logueado (null si no hay sesión) |
| `isLoggedIn` | Boolean | Indica si hay sesión activa |
| `loading` | Boolean | True mientras se verifica el token al cargar |
| `login(username, password, role)` | Function | Login manual. Si el backend falla, usa modo demo offline |
| `loginWithGoogle(credential)` | Function | Login con token de Google |
| `logout()` | Function | Cierra sesión y limpia localStorage |
| `completeGame(gameId, stars, xp, duration)` | Function | Registra un juego terminado localmente y en el backend |
| `updateXP(amount)` | Function | Actualiza el XP del usuario en el estado local |
| `appData` | Object | Datos calculados: juegos con estado, logros, sesiones, XP semanal |

**Estrategia offline-first**: Los datos se guardan en `localStorage` con clave por `userId`. Al iniciar sesión, se hace un `syncProgressFromDB()` que actualiza el estado local con los datos del servidor.

### `src/services/api.js`
Capa de abstracción para todas las peticiones HTTP al backend. Todas las funciones usan `fetch` apuntando a `/api` (proxeado por Vite).

```js
authAPI.login(credentials)        // POST /api/auth/login
authAPI.register(userData)        // POST /api/auth/register
authAPI.googleLogin(credential)   // POST /api/auth/google
authAPI.getMe()                   // GET  /api/auth/me

gamesAPI.saveSession(data)        // POST /api/games/session
gamesAPI.getSessions()            // GET  /api/games/sessions
gamesAPI.getProgress()            // GET  /api/games/progress
```

Si el servidor responde 401, limpia el token de localStorage y redirige a `/login` automáticamente.

### `src/App.jsx`
Define todas las rutas con React Router y envuelve la app en `<AuthProvider>`.

| Ruta | Componente | Acceso |
|------|-----------|--------|
| `/` | LandingPage | Público |
| `/login` | LoginPage | Público |
| `/dashboard` | DashboardPage | Paciente autenticado |
| `/juegos` | GamesPage | Autenticado |
| `/niveles` | LevelsPage | Autenticado |
| `/avances` | ProgressPage | Autenticado |
| `/panel-doctor` | DoctorPanelPage | Solo psicólogos |
| `/doctora` | DoctorPage | Público |
| `/nosotros` | AboutPage | Público |
| `/precios` | PricingPage | Público |

---

## 🔐 Autenticación

### Login manual
El formulario de login tiene dos pestañas: **Paciente** y **Psicólogo**.
- **Paciente**: busca por nombre o `patient_code` en la BD
- **Psicólogo**: busca por email + contraseña

### Google OAuth
Usa [Google Identity Services](https://developers.google.com/identity). El frontend renderiza el botón oficial de Google, que devuelve un `credential` (ID token). Este se envía al backend vía `POST /api/auth/google`, donde se verifica con `google-auth-library`. Si el email no existe en la BD, se crea un nuevo usuario paciente automáticamente.

### Registro de psicólogos
Disponible en la misma página de login (pestaña "¿Eres profesional?"). El formulario envía nombre, correo y contraseña a `POST /api/auth/register`. La contraseña se hashea con bcrypt antes de guardarse.

### JWT
El token se guarda en `localStorage` como `disslapp_token`. Caduca en 24 horas. Cada petición protegida lo incluye en el header `Authorization: Bearer <token>`.

### Racha diaria
En cada login, el backend compara la fecha actual con `last_login_date`. Si fue ayer, incrementa `streak`. Si fue hace 2+ días, la resetea a 1.

---

## 🎮 Sistema de Juegos

### `src/pages/GamesPage.jsx`
Motor principal de juegos. Maneja el estado de cada minijuego, el cronómetro oculto y la pantalla de resultados.

### Juegos implementados

| ID | Nombre | Tipo | Mecánica |
|----|--------|------|----------|
| 1 | Letras Saltarinas | `word-scramble` | El usuario escribe la palabra correcta a partir de letras mezcladas |
| 2 | El Espejo de Palabras | `word-compare` | El usuario indica si dos palabras son iguales o diferentes |
| 3 | Construye la Palabra | `syllable-build` | El usuario hace clic en las sílabas en el orden correcto |
| 4 | El Dado Mágico | `phoneme-dice` | Se muestra una letra; el usuario elige qué palabra empieza con ese fonema |
| 5 | Colorea la Sílaba | `syllable-color` | Se pregunta qué sílaba ocupa una posición dada en la palabra |
| 6–24 | Juegos adicionales | `generic` | Bloqueados según tier y plan de suscripción |

### Cronómetro oculto
Al abrir un juego, se registra `startTimeRef.current = Date.now()`. Al terminar, se calcula `Math.round((Date.now() - startTimeRef.current) / 1000)`. Este valor se guarda en `game_sessions.duration_seconds` y se muestra en la pantalla de resultados. **No es visible durante el juego.**

### Sistema de estrellas
- 3 estrellas: completado sin errores
- 2 estrellas: 1 intento fallido
- 1 estrella: 2+ intentos fallidos

### Desbloqueo por tier
Los 24 juegos están organizados en 5 tiers de 5 juegos cada uno. Para desbloquear el siguiente tier hay que completar todos los del anterior. El plan de suscripción también limita los tiers accesibles (`free` = 1 tier, `pro` = 3, `premium` = 5).

---

## 🩺 Panel del Doctor

### `src/pages/DoctorPanelPage.jsx`
Solo accesible para usuarios con `role = 'psychologist'`. Si un paciente intenta entrar, es redirigido a `/dashboard`.

### Funcionalidades

**Vista principal**:
- Resumen con 4 métricas: total de pacientes, sesiones totales, XP promedio, pacientes con racha activa
- Buscador de pacientes por nombre o código
- Grid de tarjetas de paciente con XP, racha, juegos jugados y última sesión

**Modal de detalle del paciente** (3 pestañas):

| Pestaña | Contenido |
|---------|-----------|
| **Resumen** | Gráfico de barras de XP por día (últimas 2 semanas) + lista de juegos completados con estrellas, intentos y tiempo promedio |
| **Historial** | Últimas 30 sesiones con nombre del juego, fecha, estrellas, duración y XP ganada |
| **Métricas** | Tiempo promedio de respuesta por habilidad (verde <30s, amarillo 30-60s, rojo >60s) — indicador clínico de automatización |

### `backend/controllers/doctorController.js`
- `getPatients`: consulta todos los usuarios con `role='patient'`, incluye `last_session` como subconsulta
- `getPatientDetail`: 4 consultas paralelas (sesiones, juegos completados, XP semanal, tiempos por habilidad)

---

## 🏆 Sistema de XP y Niveles

### Niveles del paciente

| XP | Nivel | Nombre |
|----|-------|--------|
| 0 – 499 | 1 | Explorador |
| 500 – 1499 | 2 | Aventurero |
| 1500 – 3499 | 3 | Constructor |
| 3500 – 6999 | 4 | Narrador |
| 7000 – 9999 | 5 | Maestro |
| 10000+ | 6 | Maestro Disslapp |

La lógica de nivel está duplicada en el frontend (`AuthContext.jsx`) y en el backend (`gameController.js`) para que ambos estén sincronizados.

### Logros automáticos (12 en total)

| ID | Logro | Condición |
|----|-------|-----------|
| 1 | Primera Sesión | Completar 1 juego |
| 2 | Juego Perfecto | Obtener 3 estrellas en 1 juego |
| 3 | Racha de 3 Días | streak >= 3 |
| 4 | Explorador Completo | Completar los 5 juegos del Tier 1 |
| 5 | Racha de 7 Días | streak >= 7 |
| 6 | Veloz como el Rayo | Completar un juego en < 60 segundos |
| 7 | Racha de 30 Días | streak >= 30 |
| 8 | Maestro Constructor | Completar los 5 juegos del Tier 3 |
| 9 | 5 Perfectos | 3 estrellas en 5 juegos distintos |
| 10 | Explorador Total | Completar 8 juegos distintos |
| 11 | MVP Semanal | Asignado manualmente por el psicólogo |
| 12 | Narrador Experto | Completar los 5 juegos del Tier 4 |

---

## 🔑 Variables de Entorno

Archivo `backend/.env`:

```env
# Google OAuth
GOOGLE_CLIENT_ID=111402690615-2kadqma0ep1rc9h77scumkgphrdi1d6e.apps.googleusercontent.com

# Base de datos MySQL
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=disslapp

# JWT
JWT_SECRET=disslapp_super_secret_key_change_in_production_2026
JWT_EXPIRES_IN=24h

# Servidor
PORT=3001
```

> El archivo `.env` está en `.gitignore` y nunca se sube al repositorio. Usa `.env.example` como plantilla.

---

## 🧪 Credenciales de Prueba

Generadas al correr `node seeds/seed.js`:

| Rol | Usuario | Contraseña |
|-----|---------|-----------|
| Psicólogo | `doctora@clinica.com` | `dislexia123` |
| Paciente | `PAC-001` o `mateo@mail.com` | `dislexia123` |
| Paciente | `PAC-002` o `sofia@mail.com` | `dislexia123` |

---

## 🎨 Sistema de Diseño

Todos los colores, tipografías y espaciados están definidos como CSS custom properties en `src/assets/css/index.css`:

```css
--purple-600: #7C3AED;   /* color principal */
--green-600:  #059669;   /* color de éxito */
--space-4:    1rem;       /* unidad base de espaciado */
--radius-md:  12px;       /* bordes redondeados */
```

Soporte de modo oscuro/claro mediante el atributo `data-theme` en el `<html>`, guardado en `localStorage` como `disslapp_theme`.

---

*Disslapp — Versión 1.0 — Abril 2026*
