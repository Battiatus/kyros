import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAuth } from '../../redux/slices/authSlice';
import Loader from '../common/Loader';

/**
 * Composant pour protéger les routes nécessitant une authentification
 * et des rôles spécifiques
 * 
 * @param {Object} props - Propriétés du composant
 * @param {Array} props.allowedRoles - Tableau des rôles autorisés
 * @returns {JSX.Element} Le composant de route protégée
 */
const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useSelector(selectAuth);

  // Afficher le loader pendant la vérification
  if (loading) {
    return <Loader />;
  }

  // Rediriger vers la page de connexion si non authentifié
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Vérifier si l'utilisateur a un rôle autorisé
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    // Rediriger selon le rôle
    if (user?.role === 'candidat') {
      return <Navigate to="/candidat/dashboard" replace />;
    } else if (user?.role === 'recruteur' || user?.role === 'admin_entreprise') {
      return <Navigate to="/recruteur/dashboard" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  // Rendre les routes protégées
  return <Outlet />;
};

export default ProtectedRoute;