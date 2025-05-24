// import React, { useEffect, lazy, Suspense } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// // Components
// import Loader from './components/common/Loader';
// import AdminLayout from './components/layout/AdminLayout';
// import ProtectedRoute from './components/auth/ProtectedRoute';

// // Auth & Redux
// import { getProfile, selectIsAuthenticated } from './redux/slices/authSlice';

// // Lazy loading des pages pour optimiser les performances
// const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
// const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'));
// const ResetPasswordPage = lazy(() => import('./pages/auth/ResetPasswordPage'));

// // Pages Admin
// const DashboardPage = lazy(() => import('./pages/DashboardPage'));
// const UsersPage = lazy(() => import('./pages/UsersPage'));
// const UserDetailsPage = lazy(() => import('./pages/UserDetailsPage'));
// const EntreprisesPage = lazy(() => import('./pages/EntreprisesPage'));
// const EntrepriseDetailsPage = lazy(() => import('./pages/EntrepriseDetailsPage'));
// const OffresPage = lazy(() => import('./pages/OffresPage'));
// const OffreDetailsPage = lazy(() => import('./pages/OffreDetailsPage'));
// const PaymentsPage = lazy(() => import('./pages/PaymentsPage'));
// const SettingsPage = lazy(() => import('./pages/SettingsPage'));

// /**
//  * Composant principal de l'application admin
//  */
// function App() {
//   const dispatch = useDispatch();
//   const isAuthenticated = useSelector(selectIsAuthenticated);

//   // Récupérer le profil de l'utilisateur connecté
//   useEffect(() => {
//     if (isAuthenticated) {
//       dispatch(getProfile());
//     }
//   }, [dispatch, isAuthenticated]);

//   return (
//     <Router>
//       <ToastContainer position="top-right" autoClose={5000} />
//       <Suspense fallback={<Loader />}>
//         <Routes>
//           {/* Routes publiques */}
//           <Route path="/login" element={<LoginPage />} />
//           <Route path="/forgot-password" element={<ForgotPasswordPage />} />
//           <Route path="/reset-password" element={<ResetPasswordPage />} />

//           {/* Routes protégées Admin */}
//           <Route element={<ProtectedRoute allowedRoles={['admin_plateforme']} />}>
//             <Route element={<AdminLayout />}>
//               <Route path="/" element={<DashboardPage />} />
//               <Route path="/users" element={<UsersPage />} />
//               <Route path="/users/:id" element={<UserDetailsPage />} />
//               <Route path="/entreprises" element={<EntreprisesPage />} />
//               <Route path="/entreprises/:id" element={<EntrepriseDetailsPage />} />
//               <Route path="/offres" element={<OffresPage />} />
//               <Route path="/offres/:id" element={<OffreDetailsPage />} />
//               <Route path="/payments" element={<PaymentsPage />} />
//               <Route path="/settings" element={<SettingsPage />} />
//             </Route>
//           </Route>

//           {/* Redirection des routes inconnues */}
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//       </Suspense>
//     </Router>
//   );
// }

// export default App;

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

// Lazy loading des pages
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));

/**
 * Composant principal de l'application admin
 */
function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);

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
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Routes protégées Admin */}
          <Route element={<ProtectedRoute allowedRoles={['admin_plateforme']} />}>
            <Route path="/" element={<DashboardPage />} />
          </Route>

          {/* Redirection des routes inconnues */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;