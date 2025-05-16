import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Loader from './components/common/Loader';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Auth & Redux
import { getProfile, selectIsAuthenticated } from './redux/slices/authSlice';

// Lazy loading des pages pour optimiser les performances
const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/auth/ResetPasswordPage'));
const ConfirmEmailPage = lazy(() => import('./pages/auth/ConfirmEmailPage'));

// Pages Candidat
const CandidatDashboardPage = lazy(() => import('./pages/candidat/DashboardPage'));
const CandidatProfilePage = lazy(() => import('./pages/candidat/ProfilePage'));
const CandidatOffresPage = lazy(() => import('./pages/candidat/OffresPage'));
const CandidatOffreDetailPage = lazy(() => import('./pages/candidat/OffreDetailPage'));
const CandidatCandidaturesPage = lazy(() => import('./pages/candidat/CandidaturesPage'));
const CandidatMessagesPage = lazy(() => import('./pages/candidat/MessagesPage'));

// Pages Recruteur
const RecruteurDashboardPage = lazy(() => import('./pages/recruteur/DashboardPage'));
const RecruteurProfilePage = lazy(() => import('./pages/recruteur/ProfilePage'));
const RecruteurEntreprisePage = lazy(() => import('./pages/recruteur/EntreprisePage'));
const RecruteurOffresList = lazy(() => import('./pages/recruteur/OffresListPage'));
const RecruteurCreateOffrePage = lazy(() => import('./pages/recruteur/CreateOffrePage'));
const RecruteurEditOffrePage = lazy(() => import('./pages/recruteur/EditOffrePage'));
const RecruteurCandidatsPage = lazy(() => import('./pages/recruteur/CandidatsPage'));
const RecruteurCandidatureDetailPage = lazy(() => import('./pages/recruteur/CandidatureDetailPage'));
const RecruteurMessagesPage = lazy(() => import('./pages/recruteur/MessagesPage'));

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
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/confirm-email" element={<ConfirmEmailPage />} />

          {/* Routes protégées pour Candidat */}
          <Route element={<ProtectedRoute allowedRoles={['candidat']} />}>
            <Route element={<Layout userRole="candidat" />}>
              <Route path="/candidat/dashboard" element={<CandidatDashboardPage />} />
              <Route path="/candidat/profile" element={<CandidatProfilePage />} />
              <Route path="/candidat/offres" element={<CandidatOffresPage />} />
              <Route path="/candidat/offres/:id" element={<CandidatOffreDetailPage />} />
              <Route path="/candidat/candidatures" element={<CandidatCandidaturesPage />} />
              <Route path="/candidat/messages" element={<CandidatMessagesPage />} />
              <Route path="/candidat/messages/:conversationId" element={<CandidatMessagesPage />} />
            </Route>
          </Route>

          {/* Routes protégées pour Recruteur */}
          <Route element={<ProtectedRoute allowedRoles={['recruteur', 'admin_entreprise']} />}>
            <Route element={<Layout userRole="recruteur" />}>
              <Route path="/recruteur/dashboard" element={<RecruteurDashboardPage />} />
              <Route path="/recruteur/profile" element={<RecruteurProfilePage />} />
              <Route path="/recruteur/entreprise" element={<RecruteurEntreprisePage />} />
              <Route path="/recruteur/offres" element={<RecruteurOffresList />} />
              <Route path="/recruteur/offres/create" element={<RecruteurCreateOffrePage />} />
              <Route path="/recruteur/offres/edit/:id" element={<RecruteurEditOffrePage />} />
              <Route path="/recruteur/candidats" element={<RecruteurCandidatsPage />} />
              <Route path="/recruteur/candidatures/:id" element={<RecruteurCandidatureDetailPage />} />
              <Route path="/recruteur/messages" element={<RecruteurMessagesPage />} />
              <Route path="/recruteur/messages/:conversationId" element={<RecruteurMessagesPage />} />
            </Route>
          </Route>

          {/* Redirection des routes inconnues */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;