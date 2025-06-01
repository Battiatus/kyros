import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Chip,
  Divider,
  Button,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

/**
 * Composant affichant les candidatures récentes
 * 
 * @param {Object} props - Propriétés du composant
 * @param {Array} props.candidatures - Liste des candidatures
 * @param {boolean} props.loading - État de chargement
 * @returns {JSX.Element} Composant RecentCandidaturesCard
 */
const RecentCandidaturesCard = ({ candidatures = [], loading = false }) => {
  const navigate = useNavigate();
  
  // Formatage de la date relative (aujourd'hui, hier, etc.)
  const formatRelativeDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return "Aujourd'hui";
    } else if (diffDays === 1) {
      return 'Hier';
    } else {
      return `Il y a ${diffDays} jours`;
    }
  };
  
  // Rendu du statut avec une puce colorée
  const renderStatus = (status) => {
    switch (status) {
      case 'new':
        return <Chip size="small" label="Nouveau" color="primary" />;
      case 'viewed':
        return <Chip size="small" label="Vu" color="default" />;
      case 'interview':
        return <Chip size="small" label="Entretien" color="secondary" />;
      case 'rejected':
        return <Chip size="small" label="Refusé" color="error" />;
      default:
        return null;
    }
  };
  
  // Génération des initiales pour l'avatar
  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper', p: 0 }}>
      {candidatures.length === 0 ? (
        <Box textAlign="center" py={4}>
          <Typography variant="body2" color="text.secondary">
            Aucune candidature récente.
          </Typography>
        </Box>
      ) : (
        candidatures.map((candidature, index) => (
          <React.Fragment key={candidature.id}>
            <ListItem 
              alignItems="flex-start" 
              sx={{ px: 1, cursor: 'pointer' }}
              onClick={() => navigate(`/recruteur/candidatures/${candidature.id}`)}
            >
              <ListItemAvatar>
                <Avatar alt={candidature.candidat?.nom ? `${candidature.candidat.prenom} ${candidature.candidat.nom}` : ''}>
                  {candidature.candidat?.nom ? getInitials(`${candidature.candidat.prenom} ${candidature.candidat.nom}`) : '?'}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle2" component="span">
                      {candidature.candidat?.prenom} {candidature.candidat?.nom}
                    </Typography>
                    {renderStatus(candidature.status)}
                  </Box>
                }
                secondary={
                  <>
                    <Typography component="span" variant="body2" color="text.primary">
                      {candidature.offre?.titre}
                    </Typography>
                    <Typography component="div" variant="caption" color="text.secondary">
                      {formatRelativeDate(candidature.date_candidature)}
                    </Typography>
                  </>
                }
              />
            </ListItem>
            {index < candidatures.length - 1 && <Divider variant="inset" component="li" />}
          </React.Fragment>
        ))
      )}
    </List>
  );
};

export default RecentCandidaturesCard;