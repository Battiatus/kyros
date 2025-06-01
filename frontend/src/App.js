import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Loader from './components/common/Loader';
import ProtectedRoute from './components/auth/ProtectedRoute';
import RecruteurLayout from './components/layout/RecruteurLayout';
import CandidatLayout from './components/layout/CandidatLayout';

// Auth & Redux
import { getProfile, selectIsAuthenticated } from './redux/slices/authSlice';

// Lazy loading des pages pour optimiser les performances
const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'));

// Pages Candidat
const CandidatDashboardPage = lazy(() => import('./pages/candidats/DashboardPage'));
const CandidatSwipePage = lazy(() => import('./pages/candidats/SwipePage'));
const CandidatCandidaturesPage = lazy(() => import('./pages/candidats/CandidaturesPage'));
const CandidatCandidatureDetailPage = lazy(() => import('./pages/candidats/CandidatureDetailPage'));
const CandidatProfilPage = lazy(() => import('./pages/candidats/ProfilPage'));
const CandidatEditProfilPage = lazy(() => import('./pages/candidats/EditProfilPage'));
const CandidatDisponibilitesPage = lazy(() => import('./pages/candidats/DisponibilitesPage'));
const CandidatMessagesPage = lazy(() => import('./pages/candidats/MessagesPage'));
const CandidatConversationPage = lazy(() => import('./pages/candidats/ConversationPage'));
const CandidatEntretiensPage = lazy(() => import('./pages/candidats/EntretiensPage'));
const CandidatStatistiquesPage = lazy(() => import('./pages/candidats/StatistiquesPage'));
const CandidatParametresPage = lazy(() => import('./pages/candidats/ParametresPage'));

// Pages Recruteur
const RecruteurDashboardPage = lazy(() => import('./pages/recruteur/DashboardRecruteurPage'));
const OffreCreationPage = lazy(() => import('./pages/recruteur/OffreCreationPage'));
const OffresListPage = lazy(() => import('./pages/recruteur/OffresListPage'));
const OffreDetailPage = lazy(() => import('./pages/recruteur/OffreDetailPage'));
const OffreEditPage = lazy(() => import('./pages/recruteur/OffreEditPage'));
const CandidaturesPage = lazy(() => import('./pages/recruteur/CandidaturesPage'));
const CandidatureDetailPage = lazy(() => import('./pages/recruteur/CandidatureDetailPage'));
const MatchingPage = lazy(() => import('./pages/recruteur/MatchingPage'));
const MessagesPage = lazy(() => import('./pages/recruteur/MessagesPage'));
const ConversationPage = lazy(() => import('./pages/recruteur/ConversationPage'));
const EntrepriseProfilePage = lazy(() => import('./pages/recruteur/EntrepriseProfilePage'));
const StatistiquesPage = lazy(() => import('./pages/recruteur/StatistiquesPage'));
const EntretiensPage = lazy(() => import('./pages/recruteur/EntretiensPage'));
const EntretienCreationPage = lazy(() => import('./pages/recruteur/EntretienCreationPage'));
const ParametresPage = lazy(() => import('./pages/recruteur/ParametresPage'));

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

          {/* Routes protégées - Candidat */}
          <Route element={<ProtectedRoute allowedRoles={['candidat']} />}>
            <Route path="/candidat" element={<CandidatLayout />}>
              <Route index element={<Navigate to="/candidat/dashboard" replace />} />
              <Route path="dashboard" element={<CandidatDashboardPage />} />
              <Route path="swipe" element={<CandidatSwipePage />} />
              <Route path="candidatures" element={<CandidatCandidaturesPage />} />
              <Route path="candidatures/:id" element={<CandidatCandidatureDetailPage />} />
              <Route path="profil" element={<CandidatProfilPage />} />
              <Route path="profil/edit" element={<CandidatEditProfilPage />} />
              <Route path="disponibilites" element={<CandidatDisponibilitesPage />} />
              <Route path="messages" element={<CandidatMessagesPage />} />
              <Route path="messages/:id" element={<CandidatConversationPage />} />
              <Route path="entretiens" element={<CandidatEntretiensPage />} />
              <Route path="statistiques" element={<CandidatStatistiquesPage />} />
              <Route path="parametres" element={<CandidatParametresPage />} />
            </Route>
          </Route>

          {/* Routes protégées - Recruteur */}
          <Route element={<ProtectedRoute allowedRoles={['recruteur', 'admin_entreprise']} />}>
            <Route path="/recruteur" element={<RecruteurLayout />}>
              <Route index element={<Navigate to="/recruteur/dashboard" replace />} />
              <Route path="dashboard" element={<RecruteurDashboardPage />} />
              
              {/* Routes Offres */}
              <Route path="offres" element={<OffresListPage />} />
              <Route path="offres/nouvelle" element={<OffreCreationPage />} />
              <Route path="offres/:id" element={<OffreDetailPage />} />
              <Route path="offres/:id/edit" element={<OffreEditPage />} />
              <Route path="offres/:id/candidatures" element={<CandidaturesPage />} />
              
              {/* Routes Candidatures */}
              <Route path="candidatures" element={<CandidaturesPage />} />
              <Route path="candidatures/:id" element={<CandidatureDetailPage />} />
              
              {/* Routes Matching */}
              <Route path="matching" element={<MatchingPage />} />
              
              {/* Routes Messages */}
              <Route path="messages" element={<MessagesPage />} />
              <Route path="messages/:id" element={<ConversationPage />} />
              <Route path="messages/nouveau/:candidatId" element={<ConversationPage />} />
              
              {/* Routes Entreprise */}
              <Route path="entreprise/profil" element={<EntrepriseProfilePage />} />
              
              {/* Routes Statistiques */}
              <Route path="statistiques" element={<StatistiquesPage />} />
              
              {/* Routes Entretiens */}
              <Route path="entretiens" element={<EntretiensPage />} />
              <Route path="entretiens/nouveau" element={<EntretienCreationPage />} />
              
              {/* Routes Paramètres */}
              <Route path="parametres" element={<ParametresPage />} />
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