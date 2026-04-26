# 🧠 Disslapp — Plataforma Web para el Tratamiento de la Dislexia

> Herramienta clínica digital diseñada para psicólogos, que facilita el tratamiento de pacientes con dislexia mediante módulos de juegos terapéuticos, seguimiento de avances y un sistema de logros motivacional.

---

## 📋 Tabla de Contenidos

1. [Descripción General](#descripción-general)
2. [Mercado Objetivo](#mercado-objetivo)
3. [Paleta de Diseño](#paleta-de-diseño)
4. [Arquitectura de Secciones](#arquitectura-de-secciones)
   - [Landing Page / Home](#1-landing-page--home)
   - [Autenticación (Login & Registro)](#2-autenticación-login--registro)
   - [Dashboard del Paciente](#3-dashboard-del-paciente)
   - [Sección de Juegos](#4-sección-de-juegos)
   - [Niveles de Tratamiento](#5-niveles-de-tratamiento)
   - [Avances y Logros](#6-avances-y-logros)
   - [Panel del Psicólogo / Administrador](#7-panel-del-psicólogo--administrador)
   - [Sobre la Doctora](#8-sobre-la-doctora)
   - [Sobre Nosotros — Disslapp](#9-sobre-nosotros--disslapp)
5. [Sistema de Logros y Gamificación](#sistema-de-logros-y-gamificación)
6. [Flujos de Usuario](#flujos-de-usuario)
7. [Stack Tecnológico Propuesto](#stack-tecnológico-propuesto)
8. [Estructura de Archivos](#estructura-de-archivos)
9. [Consideraciones de Accesibilidad](#consideraciones-de-accesibilidad)
10. [Roadmap de Implementación](#roadmap-de-implementación)

---

## 📖 Descripción General

**Disslapp** es una plataforma web terapéutica que apoya el tratamiento de la dislexia. Está pensada para ser usada por psicólogos como herramienta clínica complementaria; el profesional configura el tratamiento y el paciente interactúa con los módulos de juegos y ejercicios durante y entre sesiones.

La plataforma combina:
- **Intervención lúdica**: juegos diseñados con principios pedagógicos para dislexia.
- **Progresión estructurada**: niveles de dificultad alineados con etapas del tratamiento.
- **Seguimiento clínico**: reportes visuales y exportables del avance del paciente.
- **Motivación intrínseca**: sistema de logros, insignias y recompensas.

---

## 🎯 Mercado Objetivo

| Rol | Descripción |
|-----|-------------|
| **Psicólogo / Terapeuta** | Usuario principal. Crea perfiles de pacientes, asigna niveles y monitorea avances. |
| **Paciente (niño/adulto)** | Usuario secundario. Juega, completa retos y visualiza sus logros. |
| **Institución / Clínica** | Entidad que licencia la plataforma para múltiples profesionales. |

---

## 🎨 Paleta de Diseño

### Colores Principales

| Nombre | Hex | Uso |
|--------|-----|-----|
| **Morado Profundo** | `#4A1D96` | Fondos principales, headers |
| **Morado Vibrante** | `#7C3AED` | Botones primarios, acentos |
| **Lila Suave** | `#C4B5FD` | Textos secundarios, bordes |
| **Verde Esmeralda** | `#059669` | Éxito, logros, progreso |
| **Verde Lima** | `#34D399` | Barras de progreso, badges |
| **Verde Menta** | `#A7F3D0` | Fondos de tarjetas de logro |
| **Blanco Humo** | `#F8F5FF` | Fondos claros, texto sobre oscuro |
| **Gris Suave** | `#E5E7EB` | Divisores, inputs inactivos |

### Gradientes Clave

```css
/* Gradiente hero principal */
background: linear-gradient(135deg, #4A1D96 0%, #7C3AED 50%, #059669 100%);

/* Gradiente de tarjetas de logro */
background: linear-gradient(135deg, #A7F3D0 0%, #C4B5FD 100%);

/* Gradiente de botón primario */
background: linear-gradient(90deg, #7C3AED, #059669);
```

### Tipografía

| Uso | Fuente | Peso |
|-----|--------|------|
| Títulos | `Nunito` (Google Fonts) | 700, 800 |
| Cuerpo | `Nunito` | 400, 600 |
| Juegos / Ejercicios | `OpenDyslexic` o `Lexie Readable` | 400 |

> ⚠️ **Nota de accesibilidad**: Todas las fuentes usadas en los módulos de ejercicios deben ser tipografías diseñadas para dislexia. `OpenDyslexic` es de uso libre.

### Elementos Visuales

- **Glassmorphism** para tarjetas: fondo semitransparente con `backdrop-filter: blur(12px)`
- **Bordes redondeados** (`border-radius: 16px–24px`) para entorno amigable
- **Micro-animaciones** en hover, transiciones de nivel y celebración de logros
- **Iconografía**: Lucide Icons o Heroicons (línea limpia y moderna)
- **Ilustraciones**: estilo flat/cartoon amigable para todas las edades
- **Logo Disslapp**: cerebro estilizado + libro abierto, en degradado morado-verde

---

## 🏗️ Arquitectura de Secciones

### 1. Landing Page / Home

**URL**: `/`

**Propósito**: Primera impresión de la plataforma para psicólogos y/o instituciones interesadas.

**Contenido**:
- **Hero Section**: Headline impactante + ilustración animada + CTA principal ("Comenzar Gratis" / "Ver Demo")
- **Propuesta de Valor**: 3–4 tarjetas con los pilares de la plataforma (Juegos, Niveles, Avances, Comunidad)
- **Cómo funciona**: Proceso en 3 pasos con iconos animados
  1. El psicólogo crea el perfil del paciente
  2. El paciente juega y completa ejercicios
  3. El profesional monitorea el progreso en tiempo real
- **Testimonios**: Carrusel de reseñas de psicólogos (con foto, nombre, especialidad)
- **Estadísticas**: Contador animado (pacientes atendidos, sesiones completadas, logros desbloqueados)
- **CTA Final**: Sección de registro / contacto con formulario
- **Footer**: Links de navegación, redes sociales, política de privacidad

---

### 2. Autenticación (Login & Registro)

**URLs**: `/login`, `/registro`

#### Login de Pacientes
- Campo: Nombre de usuario o código de paciente
- Campo: Contraseña
- Opción: "Recordarme"
- CTA secundario: "¿Olvidaste tu contraseña?"
- Diseño: Pantalla dividida — ilustración animada (izquierda) + formulario (derecha)
- Botón de acceso rápido con código QR (el psicólogo puede mostrar el QR al paciente)

#### Login de Psicólogos / Admin
- Email institucional
- Contraseña
- Activación de 2FA (TOTP) como capa de seguridad opcional
- Acceso al Panel de Administración

#### Registro
- Sólo disponible para psicólogos (rol profesional)
- Campos: Nombre completo, Correo, Cédula/No. de licencia, Contraseña, Confirmar contraseña
- Verificación de correo mediante enlace
- Los pacientes son creados por el psicólogo, no se registran solos

#### Recuperación de Contraseña
- Flujo por correo electrónico con enlace temporal

---

### 3. Dashboard del Paciente

**URL**: `/paciente/dashboard`

**Propósito**: Pantalla principal tras el login del paciente. Amigable, visual y motivacional.

**Elementos**:
- **Saludo personalizado**: "¡Hola, [Nombre]! 🌟 ¿Listo para jugar hoy?"
- **Nivel actual**: Badge prominente con el nivel en curso y barra de XP
- **Acceso rápido** a:
  - Juego del día (recomendado por el psicólogo)
  - Continuar donde dejé (último juego)
  - Ver mis logros
- **Racha diaria**: Contador de días consecutivos jugando (estilo Duolingo)
- **Mini avance visual**: Rueda o mapa de progreso del tratamiento
- **Motivación diaria**: Frase inspiradora rotativa
- **Notificaciones**: Badges de nuevos logros o mensajes del psicólogo

---

### 4. Sección de Juegos

**URL**: `/paciente/juegos`

**Propósito**: Catálogo y acceso a todos los juegos terapéuticos disponibles según el nivel del paciente.

#### Tipos de Juegos Planificados

| Juego | Descripción | Habilidad trabajada |
|-------|-------------|---------------------|
| **Letras Saltarinas** | Ordenar letras mezcladas para formar palabras | Conciencia fonológica |
| **El Espejo de Palabras** | Identificar si dos palabras son iguales o diferentes | Discriminación visual |
| **Construye la Palabra** | Arrastrar sílabas para formar palabras | Decodificación |
| **El Dado Mágico** | Lanzar dado y pronunciar el fonema que cae | Conciencia fonémica |
| **Rima y Encuentra** | Seleccionar imágenes que rimen con la palabra mostrada | Rima y fonología |
| **Lectura Veloz** | Leer un párrafo corto y responder preguntas | Comprensión lectora |
| **El Laberinto de Letras** | Navegar un laberinto encontrando letras en orden | Memoria y secuencia |
| **Colorea la Sílaba** | Colorear sílabas según su posición en la palabra | Segmentación silábica |

#### Diseño del Catálogo
- Grid de tarjetas con ilustración del juego, nombre, nivel requerido y estrellas obtenidas
- Filtro por: Habilidad, Nivel, Duración estimada
- Badge "BLOQUEADO" para juegos de niveles superiores
- Badge "NUEVO" o "RECOMENDADO HOY" según asignación del psicólogo
- Barra de progreso dentro de cada tarjeta (# intentos / # estrellas)

#### Pantalla de Juego
- Instrucciones breves con opción de audio (texto a voz)
- Zona de juego central limpia y amplia
- Temporizador opcional (configurable por el psicólogo)
- Botón de pausa / salir
- Retroalimentación inmediata: animación de ✅ o ❌ con sonido
- Pantalla de resultados: puntaje, estrellas ganadas, XP obtenida, botón "Jugar de nuevo" o "Siguiente"

---

### 5. Niveles de Tratamiento

**URL**: `/paciente/niveles`

**Propósito**: Mostrar la progresión estructurada del tratamiento, con una visual tipo "mapa de aventura".

#### Estructura de Niveles

| Nivel | Nombre | Enfoque | Desbloqueo |
|-------|--------|---------|------------|
| 1 | **Explorador** | Conciencia fonológica básica | Inicial (siempre disponible) |
| 2 | **Aventurero** | Discriminación visual y fonémica | Completar 80% del Nivel 1 |
| 3 | **Constructor** | Decodificación de palabras | Completar 80% del Nivel 2 |
| 4 | **Narrador** | Comprensión lectora sencilla | Completar 80% del Nivel 3 |
| 5 | **Maestro** | Fluidez lectora y escritura | Completar 80% del Nivel 4 |

#### Visualización
- **Mapa de aventura**: Ruta visual con paradas (niveles) conectadas por un camino
- Cada "parada" muestra: ícono, nombre del nivel, % completado, estado (activo/bloqueado/completado)
- Efecto de "desbloqueo" animado cuando el paciente alcanza un nuevo nivel
- Línea de tiempo lateral opcional para ver avance histórico

#### Avance por Nivel
- Cada nivel contiene **5–8 juegos asignados**
- El psicólogo puede personalizar qué juegos forman parte de cada nivel para cada paciente
- Se requiere un mínimo de XP y sesiones para avanzar
- El psicólogo tiene la aprobación final para desbloquear el siguiente nivel

---

### 6. Avances y Logros

**URL**: `/paciente/avances`

**Propósito**: Mostrar de forma visual y motivacional el progreso del paciente a lo largo del tratamiento.

#### Subsecciones

##### 6.1 Resumen de Avance
- Gráfico de línea / área: XP acumulada por semana
- Gráfico de barras: Sesiones completadas por mes
- Gráfico radial (spider/radar): Habilidades trabajadas (fonología, decodificación, comprensión, etc.)
- Estadísticas clave: Total de sesiones, tiempo jugado, racha máxima, nivel actual

##### 6.2 Sistema de Logros (Badges / Insignias)

| Categoría | Ejemplos de Logros |
|-----------|-------------------|
| **Primera vez** | Primera sesión completada, Primer juego perfecto |
| **Constancia** | 3 días seguidos, 7 días seguidos, 30 días seguidos |
| **Rendimiento** | 3 estrellas en 5 juegos, Puntaje perfecto en un nivel |
| **Exploración** | Probar todos los tipos de juego, Completar un nivel extra |
| **Especiales** | Logro del mes, MVP de la semana (asignado por el psicólogo) |

Cada logro tiene:
- Ilustración/icono colorido
- Nombre y descripción
- Fecha de obtención
- Estado: obtenido (color) / bloqueado (gris con candado)

##### 6.3 Historial de Sesiones
- Lista cronológica de sesiones pasadas
- Por sesión: fecha, juegos jugados, XP ganada, notas del psicólogo (si las hay)

##### 6.4 Reporte Exportable (solo para el psicólogo)
- PDF generado con: resumen del paciente, gráficos de avance, logros obtenidos, recomendaciones automáticas
- Formato clínico/profesional con branding de Disslapp

---

### 7. Panel del Psicólogo / Administrador

**URL**: `/psicologo/dashboard`

**Propósito**: Panel de control para el profesional. Gestión de pacientes, asignación de niveles/juegos y monitoreo.

**Funcionalidades**:

#### 7.1 Vista General
- Cards de resumen: total de pacientes, sesiones esta semana, logros desbloqueados hoy, pacientes sin actividad reciente
- Lista de actividad reciente de todos los pacientes

#### 7.2 Gestión de Pacientes
- Crear, editar y archivar pacientes
- Campos por paciente: Nombre, apellido, edad, fecha de diagnóstico, nivel inicial asignado, notas clínicas
- Generar código de acceso / QR para el paciente

#### 7.3 Asignación de Tratamiento
- Seleccionar qué juegos son accesibles por nivel para cada paciente
- Configurar parámetros: temporizador activado/desactivado, dificultad del juego, número de repeticiones recomendadas

#### 7.4 Monitoreo de Avance
- Vista de progreso individual por paciente
- Alertas automáticas: paciente sin actividad en X días, paciente listo para subir de nivel
- Exportar reporte de avance en PDF

#### 7.5 Mensajes / Notas
- El psicólogo puede dejar notas motivacionales visibles para el paciente en su dashboard
- Historial de notas por sesión

---

### 8. Sobre la Doctora

**URL**: `/doctora`

**Propósito**: Presentar a la profesional detrás de Disslapp, generando confianza y credibilidad.

**Contenido**:
- **Foto profesional** de la doctora (alta calidad, fondo neutro o de consultorio)
- **Nombre completo** y título profesional
- **Trayectoria**:
  - Formación académica (licenciatura, maestría, doctorado)
  - Especializaciones en dislexia y neurodesarrollo
  - Años de experiencia clínica
- **Filosofía de tratamiento**: Párrafo breve sobre su enfoque terapéutico
- **Publicaciones / Investigaciones** (si aplica): lista de artículos o presentaciones
- **Afiliaciones**: Colegios, asociaciones o instituciones a las que pertenece
- **Cita / testimonio personal**: Sus palabras sobre por qué creó Disslapp
- **CTA**: Botón para contactarla o agendar una consulta
- **Redes Profesionales**: LinkedIn, ResearchGate (opcional)

**Diseño**:
- Layout de dos columnas: foto (izquierda) + info (derecha)
- Fondo con degradado suave morado-blanco
- Timeline visual para la trayectoria académica/profesional

---

### 9. Sobre Nosotros — Disslapp

**URL**: `/nosotros`

**Propósito**: Contar la historia y misión de Disslapp como empresa/plataforma.

**Contenido**:
- **Nuestra Historia**: Cómo nació Disslapp, el problema que resuelve y la motivación detrás
- **Misión**: Democratizar el acceso a herramientas terapéuticas efectivas para la dislexia
- **Visión**: Ser la plataforma líder en Latinoamérica para el tratamiento digital de la dislexia
- **Valores**: Empatía, Innovación, Evidencia Científica, Inclusión
- **El Equipo**: Cards del equipo con foto, nombre y rol (desarrolladores, diseñadores, asesores clínicos)
- **Impacto**: Métricas animadas (pacientes, países, sesiones)
- **Alianzas / Partners**: Logos de instituciones o universidades aliadas
- **Contacto**:
  - Formulario de contacto (nombre, correo, mensaje)
  - Correo institucional
  - Redes sociales
- **Prensa / Media Kit** (opcional): Enlace de descarga del kit de prensa

---

## 🏆 Sistema de Logros y Gamificación

### Puntos de Experiencia (XP)

| Acción | XP Otorgada |
|--------|-------------|
| Completar una sesión | +50 XP |
| Puntaje perfecto en un juego | +100 XP |
| 3 estrellas en un juego | +75 XP |
| Racha diaria (3 días) | +150 XP |
| Completar un nivel | +500 XP |
| Primer intento sin errores | +200 XP |

### Niveles de XP del Paciente

| Rango XP | Título |
|----------|--------|
| 0 – 499 | 🌱 Semilla |
| 500 – 1499 | 🌟 Explorador |
| 1500 – 3499 | 🚀 Aventurero |
| 3500 – 6999 | 🦁 Constructor |
| 7000 – 9999 | 📖 Narrador |
| 10000+ | 🏆 Maestro Disslapp |

### Racha Diaria
- El sistema registra días consecutivos de actividad
- Racha perdida → animación de "reinicio" amigable (sin penalización negativa)
- Bonus de XP por mantener la racha: +10% acumulativo por cada semana

### Celebraciones
- **Confetti animado** al completar un nivel o desbloquear un logro especial
- **Modal de celebración** con ilustración, nombre del logro y XP ganada
- **Sonido opcional** (toggle de audio en configuración)

---

## 🧭 Flujos de Usuario

### Flujo del Paciente
```
Landing → Login (código) → Dashboard Personal
  → Jugar (Catálogo → Seleccionar Juego → Jugar → Resultados)
  → Ver Avances (Gráficos + Logros)
  → Ver Niveles (Mapa de Aventura)
```

### Flujo del Psicólogo
```
Landing → Login (email + contraseña) → Panel del Psicólogo
  → Crear/Gestionar Pacientes
  → Asignar Niveles y Juegos
  → Monitorear Avances
  → Generar Reportes PDF
  → Dejar Notas al Paciente
```

---

## 💻 Stack Tecnológico Propuesto

### Frontend
| Tecnología | Rol |
|-----------|-----|
| **React + Vite** | Framework SPA principal |
| **React Router v6** | Navegación entre vistas |
| **Framer Motion** | Animaciones y transiciones |
| **Chart.js / Recharts** | Gráficas de avance |
| **Lucide React** | Sistema de iconos |
| **Google Fonts (Nunito)** | Tipografía principal |
| **OpenDyslexic** (CDN) | Tipografía para ejercicios |

### Backend (Recomendado)
| Tecnología | Rol |
|-----------|-----|
| **Node.js + Express** | API REST |
| **MySQL / PostgreSQL** | Base de datos relacional |
| **JWT + bcrypt** | Autenticación segura |
| **Nodemailer** | Correos de verificación y recuperación |
| **PDFKit / Puppeteer** | Generación de reportes PDF |
| **Multer** | Carga de imágenes (fotos de perfil) |

### Hosting Sugerido
| Servicio | Uso |
|---------|-----|
| **Vercel / Netlify** | Frontend React |
| **Railway / Render** | Backend Node.js |
| **PlanetScale / Supabase** | Base de datos en la nube |
| **Cloudinary** | Almacenamiento de imágenes |

---

## 📁 Estructura de Archivos

```
dislap_app/
├── public/
│   ├── favicon.ico
│   ├── logo-disslapp.svg
│   └── fonts/
│       └── OpenDyslexic-Regular.woff2
├── src/
│   ├── assets/
│   │   ├── images/
│   │   ├── illustrations/
│   │   └── icons/
│   ├── components/
│   │   ├── common/          # Navbar, Footer, Button, Card, Modal
│   │   ├── auth/            # LoginForm, RegisterForm
│   │   ├── dashboard/       # StatsCard, ProgressMap, StreakBadge
│   │   ├── games/           # GameCard, GamePlayer, ResultsScreen
│   │   ├── achievements/    # BadgeCard, AchievementModal, XPBar
│   │   └── charts/          # ProgressChart, SkillsRadar
│   ├── pages/
│   │   ├── LandingPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── PatientDashboard.jsx
│   │   ├── GamesSection.jsx
│   │   ├── LevelsMap.jsx
│   │   ├── ProgressPage.jsx
│   │   ├── PsychologistPanel.jsx
│   │   ├── DoctorPage.jsx
│   │   └── AboutPage.jsx
│   ├── context/             # AuthContext, PatientContext
│   ├── hooks/               # useAuth, useProgress, useAchievements
│   ├── services/            # api.js, auth.service.js
│   ├── styles/
│   │   ├── index.css        # Design tokens + global styles
│   │   └── animations.css   # Keyframes y micro-animaciones
│   ├── utils/               # helpers, xpCalculator, dateUtils
│   ├── App.jsx
│   └── main.jsx
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── services/
│   └── server.js
├── .env.example
├── package.json
└── README.md
```

---

## ♿ Consideraciones de Accesibilidad

> La plataforma debe ser especialmente accesible dado el perfil de los usuarios.

- **Tipografía para dislexia**: Opción de cambiar a `OpenDyslexic` en toda la plataforma desde configuración
- **Tamaño de fuente ajustable**: Control deslizante de tamaño de texto
- **Alto contraste**: Modo de alto contraste disponible
- **Texto a voz**: Las instrucciones de los juegos deben poder escucharse (Web Speech API)
- **Espaciado amplio**: `line-height` mínimo de 1.8, `letter-spacing` ajustable
- **Evitar saturación**: No usar patrones visuales complejos en fondos de juegos
- **Navegación por teclado**: Todos los controles accesibles sin ratón
- **WCAG 2.1 AA**: Cumplimiento de estándar internacional de accesibilidad
- **Modo oscuro / claro**: Toggle disponible en la barra de navegación
- **Sin tiempo límite por defecto**: Los temporizadores de juegos son opcionales

---

## 🗺️ Roadmap de Implementación

### Fase 1 — Fundación (Semanas 1–3)
- [ ] Setup del proyecto (Vite + React)
- [ ] Sistema de diseño global (CSS tokens, tipografía, colores)
- [ ] Componentes base (Navbar, Footer, Button, Card, Modal)
- [ ] Landing Page completa
- [ ] Páginas de Login y Registro (UI)
- [ ] Backend: setup inicial, modelos de BD, auth con JWT

### Fase 2 — Core del Paciente (Semanas 4–6)
- [ ] Dashboard del Paciente
- [ ] Catálogo de Juegos (UI)
- [ ] Primeros 3 juegos funcionales (Letras Saltarinas, El Espejo, Construye la Palabra)
- [ ] Mapa de Niveles
- [ ] Sistema de XP y progreso básico

### Fase 3 — Avances y Logros (Semanas 7–9)
- [ ] Sistema de logros completo (30+ badges)
- [ ] Gráficas de avance (Chart.js / Recharts)
- [ ] Racha diaria
- [ ] Animaciones de celebración (confetti, modales)
- [ ] Historial de sesiones

### Fase 4 — Panel del Psicólogo (Semanas 10–12)
- [ ] Dashboard del psicólogo
- [ ] CRUD completo de pacientes
- [ ] Asignación de tratamientos
- [ ] Generación de reportes PDF
- [ ] Sistema de notas para pacientes

### Fase 5 — Páginas Institucionales y Polish (Semanas 13–14)
- [ ] Página "Sobre la Doctora"
- [ ] Página "Sobre Nosotros"
- [ ] Juegos adicionales (4 restantes)
- [ ] Accesibilidad completa (OpenDyslexic toggle, TTS, alto contraste)
- [ ] Pruebas con usuarios reales
- [ ] Optimización de rendimiento y SEO

### Fase 6 — Lanzamiento (Semana 15)
- [ ] Deploy en producción (Vercel + Railway)
- [ ] Dominio personalizado
- [ ] SSL, seguridad final
- [ ] Documentación de usuario / manual del psicólogo
- [ ] Analytics básico (Umami o Plausible, respetando privacidad)

---

## 📞 Contacto y Colaboración

Para preguntas sobre el plan de implementación o decisiones técnicas, contactar al equipo de desarrollo de **Disslapp**.

---

*Documento creado por el equipo técnico de Disslapp — Versión 1.0 — Abril 2026*
