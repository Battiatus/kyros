import React from 'react';
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Box,
  Chip,
  IconButton,
  Divider,
  Button,
} from '@mui/material';
import {
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Message as MessageIcon,
  PersonAdd as PersonAddIcon,
  Visibility as VisibilityIcon,
  LocationOn as LocationIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

/**
 * Liste de candidats suggérés
 * 
 * @param {Object} props - Propriétés du composant
 * @param {Array} props.candidats - Liste des candidats (optionnelle)
 * @returns {JSX.Element} Composant CandidatsList
 */
const CandidatsList = ({ candidats: propsCandidats }) => {
  const navigate = useNavigate();
  
  // Données d'exemple pour les candidats
  const defaultCandidats = [
    {
      id: 1,
      prenom: 'Marie',
      nom: 'Dupont',
      titre: 'Chef de Rang expérimentée',
      photo: null,
      localisation: 'Paris, France',
      matchScore: 94,
      verified: true,
      competences: ['Service en salle', 'Sommellerie', 'Gestion de caisse'],
    },
    {
      id: 2,
      prenom: 'Thomas',
      nom: 'Martin',
      titre: 'Barman créatif',
      photo: null,
      localisation: 'Lyon, France',
      matchScore: 87,
      verified: false,
      competences: ['Cocktails', 'Gestion de bar', 'Service client'],
    },
    {
      id: 3,
      prenom: 'Sophie',
      nom: 'Bernard',
      titre: 'Serveuse polyvalente',
      photo: null,
      localisation: 'Marseille, France',
      matchScore: 82,
      verified: true,
      competences: ['Service en salle', 'Prise de commandes', 'Gestion de caisse'],
    },
  ];
  
  // Utiliser les candidats fournis ou les données d'exemple
  const candidats = propsCandidats || defaultCandidats;
  
  // Obtenir les initiales pour l'avatar
  const getInitials = (prenom, nom) => {
    return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();
  };
  
  // Naviguer vers le détail d'un candidat
  const handleViewCandidat = (id) => {
    navigate(`/recruteur/candidats/${id}`);
  };
  
  // Envoyer un message à un candidat
  const handleContactCandidat = (e, id) => {
    e.stopPropagation();
    navigate(`/recruteur/messages/nouveau/${id}`);
  };
  
  // Inviter un candidat à postuler
  const handleInviteCandidat = (e, id) => {
    e.stopPropagation();
    // Dans une application réelle, nous enverrions cette action à l'API
    console.log(`Invité candidat: ${id}`);
  };
  
  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper', p: 0 }}>
      {candidats.length === 0 ? (
        <Box textAlign="center" py={3}>
          <Typography variant="body2" color="text.secondary">
            Aucun candidat suggéré pour le moment.
          </Typography>
        </Box>
      ) : (
        candidats.map((candidat, index) => (
          <React.Fragment key={candidat.id}>
            <ListItem
              alignItems="flex-start"
              sx={{ 
                py: 2, 
                cursor: 'pointer',
                '&:hover': { bgcolor: 'action.hover' },
              }}
              onClick={() => handleViewCandidat(candidat.id)}
            >
              <ListItemAvatar>
                <Avatar
                  src={candidat.photo}
                  alt={`${candidat.prenom} ${candidat.nom}`}
                  sx={{ width: 50, height: 50 }}
                >
                  {getInitials(candidat.prenom, candidat.nom)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" alignItems="center">
                      <Typography variant="subtitle1" component="span" fontWeight="medium">
                        {candidat.prenom} {candidat.nom}
                      </Typography>
                      {candidat.verified && (
                        <Tooltip title="Profil vérifié">
                          <CheckCircleIcon color="info" fontSize="small" sx={{ ml: 1 }} />
                        </Tooltip>
                      )}
                    </Box>
                    <Chip
                      label={`${candidat.matchScore}% match`}
                      color={candidat.matchScore >= 90 ? 'success' : 'primary'}
                      size="small"
                    />
                  </Box>
                }
                secondary={
                  <>
                    <Typography component="span" variant="body2" color="text.primary">
                      {candidat.titre}
                    </Typography>
                    <Box display="flex" alignItems="center" mt={0.5}>
                      <LocationIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {candidat.localisation}
                      </Typography>
                    </Box>
                    <Box display="flex" flexWrap="wrap" gap={0.5} mt={1}>
                      {candidat.competences.map((competence, i) => (
                        <Chip key={i} label={competence} size="small" variant="outlined" />
                      ))}
                    </Box>
                    <Box display="flex" gap={1} mt={1.5}>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<MessageIcon />}
                        onClick={(e) => handleContactCandidat(e, candidat.id)}
                      >
                        Contacter
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<PersonAddIcon />}
                        onClick={(e) => handleInviteCandidat(e, candidat.id)}
                      >
                        Inviter
                      </Button>
                    </Box>
                  </>
                }
              />
            </ListItem>
            {index < candidats.length - 1 && <Divider variant="inset" component="li" />}
          </React.Fragment>
        ))
      )}
    </List>
  );
};

export default CandidatsList;