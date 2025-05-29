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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

/**
 * Composant affichant les candidatures récentes
 * 
 * @returns {JSX.Element} Composant RecentCandidaturesCard
 */
const RecentCandidaturesCard = () => {
  const navigate = useNavigate();
  
  // Données d'exemple pour les candidatures récentes
  // Dans une version réelle, ces données viendraient d'une API
  const recentCandidatures = [
    {
      id: 1,
      candidatName: 'Jean Dupont',
      candidatAvatar: null,
      offreTitle: 'Chef de Rang',
      date: '2025-05-28T10:30:00',
      status: 'new',
    },
    {
      id: 2,
      candidatName: 'Marie Martin',
      candidatAvatar: null,
      offreTitle: 'Sous-Chef',
      date: '2025-05-27T15:45:00',
      status: 'viewed',
    },
    {
      id: 3,
      candidatName: 'Lucas Bernard',
      candidatAvatar: null,
      offreTitle: 'Barman',
      date: '2025-05-27T09:15:00',
      status: 'interview',
    },
    {
      id: 4,
      candidatName: 'Emma Petit',
      candidatAvatar: null,
      offreTitle: 'Réceptionniste',
      date: '2025-05-26T14:20:00',
      status: 'rejected',
    },
  ];
  
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
  
  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper', p: 0 }}>
      {recentCandidatures.length === 0 ? (
        <Box textAlign="center" py={4}>
          <Typography variant="body2" color="text.secondary">
            Aucune candidature récente.
          </Typography>
        </Box>
      ) : (
        recentCandidatures.map((candidature, index) => (
          <React.Fragment key={candidature.id}>
            <ListItem 
              alignItems="flex-start" 
              sx={{ px: 1, cursor: 'pointer' }}
              onClick={() => navigate(`/recruteur/candidatures/${candidature.id}`)}
            >
              <ListItemAvatar>
                <Avatar alt={candidature.candidatName}>
                  {getInitials(candidature.candidatName)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle2" component="span">
                      {candidature.candidatName}
                    </Typography>
                    {renderStatus(candidature.status)}
                  </Box>
                }
                secondary={
                  <>
                    <Typography component="span" variant="body2" color="text.primary">
                      {candidature.offreTitle}
                    </Typography>
                    <Typography component="div" variant="caption" color="text.secondary">
                      {formatRelativeDate(candidature.date)}
                    </Typography>
                  </>
                }
              />
            </ListItem>
            {index < recentCandidatures.length - 1 && <Divider variant="inset" component="li" />}
          </React.Fragment>
        ))
      )}
    </List>
  );
};

export default RecentCandidaturesCard;