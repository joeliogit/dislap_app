/* ============================================
   DISSLAPP — Main App (React Router)
   ============================================ */

import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ConfettiCanvas from './components/ConfettiCanvas';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import GamesPage from './pages/GamesPage';
import LevelsPage from './pages/LevelsPage';
import ProgressPage from './pages/ProgressPage';
import DoctorPage from './pages/DoctorPage';
import DoctorPanelPage from './pages/DoctorPanelPage';
import AboutPage from './pages/AboutPage';
import PricingPage from './pages/PricingPage';

function AppContent() {
  const location = useLocation();
  const hideFooter = location.pathname === '/login';

  return (
    <>
      <Navbar />
      <main id="app-content">
        <Routes>
          <Route path="/"              element={<LandingPage />} />
          <Route path="/login"         element={<LoginPage />} />
          <Route path="/dashboard"     element={<DashboardPage />} />
          <Route path="/panel-doctor"  element={<DoctorPanelPage />} />
          <Route path="/juegos"        element={<GamesPage />} />
          <Route path="/niveles"       element={<LevelsPage />} />
          <Route path="/avances"       element={<ProgressPage />} />
          <Route path="/doctora"       element={<DoctorPage />} />
          <Route path="/nosotros"      element={<AboutPage />} />
          <Route path="/precios"       element={<PricingPage />} />
        </Routes>
      </main>
      {!hideFooter && <Footer />}
      <ConfettiCanvas />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
