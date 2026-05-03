# Disslapp — Plataforma Web para el Tratamiento de la Dislexia

> Herramienta clínica digital que conecta psicólogos con sus pacientes a través de juegos terapéuticos, seguimiento de avances en tiempo real y un panel de control profesional.

---

## Tabla de Contenidos

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
12. [Planes y Pagos](#planes-y-pagos)
13. [Variables de Entorno](#variables-de-entorno)
14. [Credenciales de Prueba](#credenciales-de-prueba)

---

## Descripción General

**Disslapp** es una plataforma web terapéutica con dos tipos de usuarios:

- **Pacientes**: juegan minijuegos diseñados para trabajar habilidades afectadas por la dislexia (fonología, decodificación, segmentación silábica, etc.). Ganan XP, suben de nivel y desbloquean logros.
- **Psicólogos**: acceden a un panel de control donde ven el progreso de todos sus pacientes, el historial de sesiones, el tiempo de respuesta por habilidad y métricas de tratamiento.

---

## Stack Tecnológico

### Frontend
| Tecnología | Versión | Uso |
|-----------|---------|-----|
| React | 19 | Framework principal SPA |
| Vite | 8 | Bundler y servidor de desarrollo |
| React Router | 7 | Navegación entre páginas |
| @paypal/react-paypal-js | 9 | Integración de pagos PayPal |
| lucide-react | 1 | Iconos SVG |
| CSS Variables | — | Sistema de diseño (tokens) |

### Backend
| Tecnología | Versión | Uso |
|-----------|---------|-----|
| Node.js | 18+ | Runtime del servidor |
| Express | 4 | Framework HTTP / API REST |
| MySQL2 | 3 | Driver de base de datos |
| bcrypt | 5 | Hash de contraseñas |
| jsonwebtoken | 9 | Tokens JWT para sesiones |
| google-auth-library | 10 | Verificación de tokens Google OAuth |
| stripe | 22 | Procesamiento de pagos con tarjeta |
| express-rate-limit | 7 | Limitación de tasa de peticiones |
| express-validator | 7 | Validación de datos en endpoints |
| helmet | 7 | Cabeceras HTTP de seguridad |
| cors | 2 | Peticiones cross-origin del frontend |
| dotenv | 16 | Variables de entorno |

### Base de Datos
| Tecnología | Uso |
|-----------|-----|
| MySQL 8 | Almacenamiento principal |

---

## Estructura del Proyecto

```
dislap_app/
├── backend/                        # API REST (Node.js + Express)
│   ├── config/
│   │   └── db.js                   # Pool de conexiones MySQL
│   ├── controllers/
│   │   ├── authController.js       # Login, registro, Google OAuth, /me
│   │   ├── gameController.js       # Guardar sesiones, obtener progreso
│   │   ├── doctorController.js     # Lista de pacientes, detalle por paciente
│   │   └── paymentsController.js   # Suscripciones, Stripe y PayPal
│   ├── middleware/
│   │   ├── auth.js                 # Verificación de JWT (verifyToken)
│   │   └── errorHandler.js         # Manejo global de errores
│   ├── routes/
│   │   ├── auth.routes.js          # /api/auth/*
│   │   ├── game.routes.js          # /api/games/*
│   │   ├── doctor.routes.js        # /api/doctor/*
│   │   └── payments.routes.js      # /api/payments/*
│   ├── seeds/
│   │   └── seed.js                 # Crea la BD y carga datos de prueba
│   ├── database.sql                # Esquema completo de la BD
│   ├── server.js                   # Punto de entrada del backend
│   ├── .env                        # Variables de entorno (no subir a git)
│   └── .env.example                # Plantilla de variables
│
├── src/                            # Frontend React
│   ├── assets/
│   │   └── css/                    # Hojas de estilo por sección
│   │       ├── index.css           # Tokens de diseño globales
│   │       ├── animations.css      # Keyframes y clases de animación
│   │       ├── navbar.css
│   │       ├── footer.css
│   │       ├── auth.css
│   │       ├── dashboard.css
│   │       ├── games.css
│   │       ├── levels.css
│   │       ├── progress.css
│   │       ├── doctor-panel.css
│   │       ├── doctor.css
│   │       ├── landing.css
│   │       ├── about.css
│   │       └── pricing.css
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   └── ConfettiCanvas.jsx
│   ├── context/
│   │   └── AuthContext.jsx         # Estado global: usuario, sesión, juegos, XP
│   ├── hooks/
│   │   └── useAuth.js
│   ├── pages/
│   │   ├── LandingPage.jsx         # / — página principal
│   │   ├── LoginPage.jsx           # /login
│   │   ├── DashboardPage.jsx       # /dashboard
│   │   ├── GamesPage.jsx           # /juegos
│   │   ├── LevelsPage.jsx          # /niveles
│   │   ├── ProgressPage.jsx        # /avances
│   │   ├── DoctorPanelPage.jsx     # /panel-doctor (solo psicólogos)
│   │   ├── DoctorPage.jsx          # /doctora
│   │   ├── AboutPage.jsx           # /nosotros
│   │   └── PricingPage.jsx         # /precios
│   ├── services/
│   │   └── api.js                  # Funciones fetch hacia /api
│   ├── utils/
│   │   ├── confetti.js
│   │   └── xpCalculator.js
│   ├── App.jsx                     # Router principal + layout
│   └── main.jsx                    # Punto de entrada React
│
├── disslapp_react/                 # Copia de trabajo alternativa del frontend
├── _backup_vanilla/                # Prototipo original en JS/HTML puro (referencia)
├── public/                         # Archivos estáticos
├── start-mysql.ps1                 # Script PowerShell para iniciar MySQL sin admin
├── vite.config.js                  # Config Vite (proxy /api → localhost:3001)
├── package.json
└── README.md
```

---

## Instalación y Configuración

### Requisitos previos
- Node.js 18+
- MySQL 8 corriendo en el puerto 3306

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

Crea `backend/.env` a partir de `backend/.env.example` y `frontend/.env` a partir de `.env.example`:

```env
# backend/.env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=disslapp
JWT_SECRET=cadena_larga_y_aleatoria
JWT_EXPIRES_IN=24h
PORT=3001
GOOGLE_CLIENT_ID=tu_google_client_id.apps.googleusercontent.com
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_PRO=
STRIPE_PRICE_PREMIUM=
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
PAYPAL_ENV=sandbox
FRONTEND_URL=http://localhost:5173
```

```env
# .env (raíz — frontend)
VITE_PAYPAL_CLIENT_ID=tu_paypal_client_id
VITE_STRIPE_PUBLISHABLE_KEY=tu_stripe_publishable_key
```

### 5. Crear la base de datos y cargar datos de prueba

```bash
cd backend
node seeds/seed.js
```

Esto ejecuta `database.sql` y crea usuarios, juegos y logros de prueba.

### 6. Iniciar MySQL (Windows sin admin)

Si MySQL no está corriendo como servicio, usa el script incluido:

```powershell
.\start-mysql.ps1
```

### 7. Iniciar los servidores

**Backend** (puerto 3001):
```bash
cd backend
npm run dev
```

**Frontend** (puerto 5173):
```bash
npm run dev
```

La app estará disponible en `http://localhost:5173`. Las peticiones a `/api` se proxean al backend.

---

## Base de Datos

### Esquema — `database.sql`

#### Tabla `users`

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
| `level_name` | VARCHAR(50) | Nombre del nivel |
| `streak` | INT | Días consecutivos de actividad |
| `avatar` | VARCHAR(10) | Emoji o inicial del avatar |
| `total_sessions` | INT | Total de sesiones completadas |
| `total_games_played` | INT | Total de juegos jugados |
| `oauth_id` | VARCHAR(255) | ID de Google (si inició con OAuth) |
| `oauth_provider` | VARCHAR(50) | `google` o NULL |
| `last_login_date` | DATE | Último día de acceso (para calcular racha) |
| `subscription_plan` | ENUM | `free`, `pro`, `premium` |
| `stripe_customer_id` | VARCHAR(255) | ID de cliente en Stripe |
| `created_at` | TIMESTAMP | Fecha de registro |

#### Tabla `games`

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

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | INT PK | ID de la sesión |
| `user_id` | INT FK | Referencia al usuario |
| `game_id` | INT FK | Referencia al juego |
| `score` | INT | Puntuación obtenida |
| `stars` | INT | Estrellas obtenidas (0–3) |
| `xp_earned` | INT | XP ganada en esta sesión |
| `completed` | BOOLEAN | Si el juego fue completado |
| `duration_seconds` | INT | Tiempo en completarlo (cronómetro oculto) |
| `played_at` | TIMESTAMP | Fecha y hora de la partida |

#### Tablas `achievements` y `user_achievements`

Catálogo de 12 logros e historial de desbloqueos por usuario.

---

## Backend — API REST

El servidor Express corre en el puerto **3001**.

### Autenticación — `/api/auth`

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/api/auth/login` | Login con usuario/contraseña | No |
| POST | `/api/auth/register` | Registro de nuevo psicólogo | No |
| POST | `/api/auth/google` | Login con token de Google Identity Services | No |
| GET | `/api/auth/me` | Datos del usuario autenticado | JWT |

**`POST /api/auth/login`**
```json
{ "username": "doctora@clinica.com", "password": "dislexia123", "role": "psychologist" }
```

**`POST /api/auth/register`**
```json
{ "name": "Dr. Juan", "email": "juan@clinica.com", "password": "mi_password" }
```

**`POST /api/auth/google`**
```json
{ "credential": "<id_token de Google>" }
```

Todos los endpoints de login retornan:
```json
{ "success": true, "token": "<JWT>", "user": { ... } }
```

---

### Juegos — `/api/games`

Todos requieren `Authorization: Bearer <token>`.

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/games/session` | Guardar sesión completada |
| GET | `/api/games/sessions` | Últimas 50 sesiones del usuario |
| GET | `/api/games/progress` | XP semanal, juegos completados, tiempos |

**`POST /api/games/session`**
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

Al guardar una sesión el backend inserta en `game_sessions`, suma XP al usuario y recalcula su nivel.

---

### Doctor — `/api/doctor`

Requieren JWT con `role = 'psychologist'`. Devuelve HTTP 403 a pacientes.

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/doctor/patients` | Lista de pacientes con estadísticas |
| GET | `/api/doctor/patients/:id` | Detalle completo de un paciente |

**`GET /api/doctor/patients/:id`** retorna:
```json
{
  "patient": { ... },
  "sessions": [ ... ],
  "completedGames": [ ... ],
  "weeklyXP": [ ... ],
  "skillTimes": [ ... ]
}
```

---

### Pagos — `/api/payments`

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| GET | `/api/payments/plans` | Listado de planes disponibles | No |
| GET | `/api/payments/subscription` | Suscripción activa del usuario | JWT |
| POST | `/api/payments/checkout` | Crear sesión de pago con Stripe | JWT |
| POST | `/api/payments/demo-checkout` | Activar plan de demo sin pago | JWT |
| POST | `/api/payments/cancel` | Cancelar suscripción activa | JWT |
| POST | `/api/payments/paypal/create-order` | Crear orden de PayPal | JWT |
| POST | `/api/payments/paypal/capture-order` | Capturar pago de PayPal | JWT |
| POST | `/api/payments/webhook` | Webhook de eventos de Stripe | No |

---

### Middleware

**`middleware/auth.js` — verifyToken**: extrae y verifica el JWT del header `Authorization`. Adjunta `req.user = { id, role, name }` o devuelve HTTP 401.

**`middleware/errorHandler.js`**: captura errores no manejados y retorna respuesta JSON uniforme.

---

## Frontend — React App

### `src/context/AuthContext.jsx`

Estado global de la aplicación.

| Valor | Tipo | Descripción |
|-------|------|-------------|
| `user` | Object | Datos del usuario (null si no hay sesión) |
| `isLoggedIn` | Boolean | Indica si hay sesión activa |
| `loading` | Boolean | True mientras se verifica el token |
| `login(username, password, role)` | Function | Login manual con fallback demo offline |
| `loginWithGoogle(credential)` | Function | Login con token de Google |
| `logout()` | Function | Cierra sesión y limpia localStorage |
| `completeGame(gameId, stars, xp, duration)` | Function | Registra juego terminado local y en backend |
| `updateXP(amount)` | Function | Actualiza XP en el estado local |
| `appData` | Object | Juegos con estado, logros, sesiones, XP semanal |

Los datos se guardan en `localStorage` por `userId`. Al iniciar sesión se ejecuta `syncProgressFromDB()`.

### `src/services/api.js`

```js
authAPI.login(credentials)       // POST /api/auth/login
authAPI.register(userData)       // POST /api/auth/register
authAPI.googleLogin(credential)  // POST /api/auth/google
authAPI.getMe()                  // GET  /api/auth/me

gamesAPI.saveSession(data)       // POST /api/games/session
gamesAPI.getSessions()           // GET  /api/games/sessions
gamesAPI.getProgress()           // GET  /api/games/progress

paymentsAPI.getPlans()           // GET  /api/payments/plans
paymentsAPI.checkout(planId)     // POST /api/payments/checkout
```

Ante respuesta 401 limpia el token y redirige a `/login`.

### Rutas — `src/App.jsx`

| Ruta | Componente | Acceso |
|------|-----------|--------|
| `/` | LandingPage | Público |
| `/login` | LoginPage | Público |
| `/dashboard` | DashboardPage | Autenticado |
| `/juegos` | GamesPage | Autenticado |
| `/niveles` | LevelsPage | Autenticado |
| `/avances` | ProgressPage | Autenticado |
| `/panel-doctor` | DoctorPanelPage | Solo psicólogos |
| `/doctora` | DoctorPage | Público |
| `/nosotros` | AboutPage | Público |
| `/precios` | PricingPage | Público |

---

## Autenticación

### Login manual
Formulario con dos pestañas: **Paciente** (nombre o `patient_code`) y **Psicólogo** (email + contraseña).

### Google OAuth
El frontend usa Google Identity Services y envía el `credential` al backend via `POST /api/auth/google`. El backend lo verifica con `google-auth-library`. Si el email no existe, crea un usuario paciente automáticamente.

### Registro de psicólogos
En la misma página de login, pestaña "¿Eres profesional?". La contraseña se hashea con bcrypt.

### JWT
Token guardado en `localStorage` como `disslapp_token`. Caduca en 24 horas. Se incluye como `Authorization: Bearer <token>` en todas las peticiones protegidas.

### Racha diaria
En cada login, el backend compara la fecha actual con `last_login_date`. Si fue ayer incrementa `streak`; si fue hace 2+ días la resetea a 1.

---

## Sistema de Juegos

### Juegos implementados (Tier 1 — libres)

| ID | Nombre | Tipo | Mecánica |
|----|--------|------|----------|
| 1 | Letras Saltarinas | `word-scramble` | Escribir la palabra a partir de letras mezcladas |
| 2 | El Espejo de Palabras | `word-compare` | Indicar si dos palabras son iguales o diferentes |
| 3 | Construye la Palabra | `syllable-build` | Hacer clic en las sílabas en el orden correcto |
| 4 | El Dado Mágico | `phoneme-dice` | Elegir qué palabra empieza con el fonema mostrado |
| 5 | Colorea la Sílaba | `syllable-color` | Identificar la posición de una sílaba en la palabra |

Los juegos 6–24 están bloqueados por tier y plan de suscripción (`type: "generic"`).

### Cronómetro oculto
Se registra `Date.now()` al abrir el juego. Al terminar se calcula `Math.round((Date.now() - start) / 1000)`. No es visible durante el juego; se guarda en `duration_seconds` y aparece en la pantalla de resultados.

### Sistema de estrellas
- 3 estrellas: sin errores
- 2 estrellas: 1 intento fallido
- 1 estrella: 2+ intentos fallidos

### Desbloqueo por tier
24 juegos en 5 tiers de 5 cada uno. Hay que completar todos los juegos de un tier para desbloquear el siguiente. El plan de suscripción limita los tiers accesibles.

---

## Panel del Doctor

Solo accesible con `role = 'psychologist'`. Pacientes son redirigidos a `/dashboard`.

**Vista principal**:
- Métricas globales: total pacientes, sesiones, XP promedio, rachas activas
- Buscador por nombre o código
- Grid de tarjetas con XP, racha, juegos jugados y última sesión

**Modal de detalle** (3 pestañas):

| Pestaña | Contenido |
|---------|-----------|
| Resumen | Gráfico de barras de XP por día (2 semanas) + juegos completados con estrellas y tiempo promedio |
| Historial | Últimas 30 sesiones con juego, fecha, estrellas, duración y XP |
| Métricas | Tiempo promedio por habilidad: verde (<30s), amarillo (30–60s), rojo (>60s) |

---

## Sistema de XP y Niveles

| XP | Nivel | Nombre |
|----|-------|--------|
| 0 – 499 | 1 | Explorador |
| 500 – 1499 | 2 | Aventurero |
| 1500 – 3499 | 3 | Constructor |
| 3500 – 6999 | 4 | Narrador |
| 7000 – 9999 | 5 | Maestro |
| 10000+ | 6 | Maestro Disslapp |

La lógica de nivel está duplicada en `AuthContext.jsx` y en `gameController.js` para mantener sincronía frontend/backend.

### Logros automáticos (12 en total)

| ID | Logro | Condición |
|----|-------|-----------|
| 1 | Primera Sesión | Completar 1 juego |
| 2 | Juego Perfecto | 3 estrellas en 1 juego |
| 3 | Racha de 3 Días | streak >= 3 |
| 4 | Explorador Completo | 5 juegos del Tier 1 |
| 5 | Racha de 7 Días | streak >= 7 |
| 6 | Veloz como el Rayo | Completar en < 60 segundos |
| 7 | Racha de 30 Días | streak >= 30 |
| 8 | Maestro Constructor | 5 juegos del Tier 3 |
| 9 | 5 Perfectos | 3 estrellas en 5 juegos distintos |
| 10 | Explorador Total | 8 juegos distintos completados |
| 11 | MVP Semanal | Asignado manualmente por psicólogo |
| 12 | Narrador Experto | 5 juegos del Tier 4 |

---

## Planes y Pagos

| Plan | Precio | Tiers | Pacientes | Características |
|------|--------|-------|-----------|-----------------|
| Free | $0 | 1 | 1 | 5 juegos, logros básicos |
| Pro | $9.99/mes | 3 | 10 | 15 juegos, reportes, email support |
| Premium | $24.99/mes | 5 | Ilimitados | 24 juegos, análisis avanzados, soporte 24/7 |

**Integraciones**:
- **Stripe**: checkout sessions, webhooks para eventos de suscripción
- **PayPal**: crear y capturar órdenes via PayPal REST API

---

## Variables de Entorno

### `backend/.env`

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=disslapp
JWT_SECRET=cadena_larga_y_aleatoria
JWT_EXPIRES_IN=24h
PORT=3001
GOOGLE_CLIENT_ID=tu_google_client_id.apps.googleusercontent.com
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_PRO=
STRIPE_PRICE_PREMIUM=
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
PAYPAL_ENV=sandbox
FRONTEND_URL=http://localhost:5173
```

### `.env` (raíz — frontend)

```env
VITE_PAYPAL_CLIENT_ID=tu_paypal_client_id
VITE_STRIPE_PUBLISHABLE_KEY=tu_stripe_publishable_key
```

---

## Credenciales de Prueba

Generadas al correr `node seeds/seed.js`:

| Rol | Usuario | Contraseña |
|-----|---------|-----------|
| Psicólogo | `doctora@clinica.com` | `dislexia123` |
| Paciente | `PAC-001` o `mateo@mail.com` | `dislexia123` |
| Paciente | `PAC-002` o `sofia@mail.com` | `dislexia123` |

---

## Sistema de Diseño

Tokens definidos en `src/assets/css/index.css`:

```css
--purple-600: #7C3AED;   /* color principal */
--green-600:  #059669;   /* éxito */
--space-4:    1rem;       /* unidad base de espaciado */
--radius-md:  12px;       /* bordes redondeados */
```

Modo oscuro/claro via atributo `data-theme` en `<html>`, guardado en `localStorage` como `disslapp_theme`.

---

*Disslapp — Versión 1.0 — Mayo 2026*
