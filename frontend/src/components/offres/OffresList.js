import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  Chip,
  IconButton,
  Divider,
  Badge,
  Tooltip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Person as PersonIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

/**
 * Liste des offres d'emploi
 * 
 * @param {Object} props - Propriétés du composant
 * @param {Array} props.offres - Liste des offres à afficher
 * @param {boolean} props.compact - Affichage compact (sans actions)
 * @param {function} props.onDelete - Fonction de suppression (optionnelle)
 * @param {function} props.onClose - Fonction de clôture (optionnelle)
 * @returns {JSX.Element} Composant OffresList
 */
const OffresList = ({ offres = [], compact = false, onDelete, onClose }) => {
  const navigate = useNavigate();

  // Formatage de la date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Rendu du statut avec une puce colorée
  const renderStatus = (statut) => {
    switch (statut) {
      case 'active':
        return <Chip size="small" label="Active" color="success" icon={<CheckCircleIcon />} />;
      case 'fermee':
        return <Chip size="small" label="Fermée" color="error" icon={<CancelIcon />} />;
      case 'pourvue':
        return <Chip size="small" label="Pourvue" color="secondary" icon={<CheckCircleIcon />} />;
      case 'expiration':
        return <Chip size="small" label="Expire bientôt" color="warning" icon={<ScheduleIcon />} />;
      default:
        return <Chip size="small" label={statut} color="default" />;
    }
  };

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper', p: 0 }}>
      {offres.length === 0 ? (
        <Box textAlign="center" py={4}>
          <Typography variant="body2" color="text.secondary">
            Aucune offre disponible.
          </Typography>
        </Box>
      ) : (
        offres.map((offre, index) => (
          <React.Fragment key={offre.id || index}>
            <ListItem
              alignItems="flex-start"
              sx={{ px: 1, cursor: 'pointer' }}
              onClick={() => navigate(`/recruteur/offres/${offre.id}`)}
              secondaryAction={
                !compact && (
                  <Box>
                    <Tooltip title="Voir les candidatures">
                      <IconButton
                        edge="end"
                        aria-label="candidatures"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/recruteur/offres/${offre.id}/candidatures`);
                        }}
                      >
                        <Badge badgeContent={offre.nb_candidatures || 0} color="primary">
                          <PersonIcon />
                        </Badge>
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Modifier">
                      <IconButton
                        edge="end"
                        aria-label="edit"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/recruteur/offres/${offre.id}/edit`);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    {onDelete && (
                      <Tooltip title="Supprimer">
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(offre.id);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    {onClose && offre.statut === 'active' && (
                      <Tooltip title="Clôturer">
                        <IconButton
                          edge="end"
                          aria-label="close"
                          onClick={(e) => {
                            e.stopPropagation();
                            onClose(offre.id);
                          }}
                        >
                          <CancelIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                )
              }
            >
              <ListItemText
                primary={
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle1" component="span" fontWeight="medium">
                      {offre.titre}
                    </Typography>
                    {renderStatus(offre.statut || 'active')}
                  </Box>
                }
                secondary={
                  <>
                    <Typography component="span" variant="body2" color="text.primary">
                      {`${offre.type_contrat || 'CDI'} • ${offre.localisation || 'Paris'}`}
                    </Typography>
                    <Box display="flex" justifyContent="space-between" mt={0.5}>
                      <Typography component="span" variant="caption" color="text.secondary">
                        Publiée le {formatDate(offre.date_creation || new Date())}
                      </Typography>
                      <Typography component="span" variant="caption" color="text.secondary">
                        {offre.nb_vues || 0} vues • {offre.nb_candidatures || 0} candidatures
                      </Typography>
                    </Box>
                  </>
                }
              />
            </ListItem>
            {index < offres.length - 1 && <Divider component="li" />}
          </React.Fragment>
        ))
      )}
    </List>
  );
};

export default OffresList;