import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

/* Import all CSS - same order as original */
import './assets/css/index.css'
import './assets/css/animations.css'
import './assets/css/landing.css'
import './assets/css/auth.css'
import './assets/css/dashboard.css'
import './assets/css/games.css'
import './assets/css/levels.css'
import './assets/css/progress.css'
import './assets/css/doctor.css'
import './assets/css/doctor-panel.css'
import './assets/css/about.css'
import './assets/css/navbar.css'
import './assets/css/footer.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
