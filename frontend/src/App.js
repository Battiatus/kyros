import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Loader from './components/common/Loader';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Auth & Redux
import { getProfile, selectIsAuthenticated } from './redux/slices/authSlice';

// Lazy loading des pages pour optimiser les performances
const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'));

// Pages temporaires
const DashboardPage = lazy(() => import('./pages/DashboardPage'));

/**
 * Composant principal de l'application
 */
function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Récupérer le profil de l'utilisateur connecté
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getProfile());
    }
  }, [dispatch, isAuthenticated]);

  return (
    <Router>
      <ToastContainer position="top-right" autoClose={5000} />
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Routes protégées temporaires */}
          <Route element={<ProtectedRoute allowedRoles={['candidat']} />}>
            <Route path="/candidat/dashboard" element={<DashboardPage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['recruteur', 'admin_entreprise']} />}>
            <Route path="/recruteur/dashboard" element={<DashboardPage />} />
          </Route>

          {/* Redirection des routes inconnues */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;