import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Avatar,
  Chip,
  IconButton,
  Divider,
  Menu,
  MenuItem,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  VideoCall as VideoCallIcon,
  Event as EventIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
  EventBusy as EventBusyIcon,
  Send as SendIcon,
  Link as LinkIcon,
} from '@mui/icons-material';
import PersonIcon from '@mui/icons-material/Person';

import { useNavigate } from 'react-router-dom';

/**
 * Page de gestion des entretiens
 */
const EntretiensPage = () => {
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [entretiens, setEntretiens] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [search, setSearch] = useState('');
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedEntretien, setSelectedEntretien] = useState(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [entretienLink, setEntretienLink] = useState('');
  
  // Charger les entretiens
  useEffect(() => {
    // Dans une application réelle, nous ferions un appel API
    setLoading(true);
    
    // Simulation de délai réseau avec données fictives
    setTimeout(() => {
      const mockEntretiens = [
        {
          id: 1,
          candidat: {
            id: 101,
            prenom: 'Marie',
            nom: 'Dupont',
            photo: null,
            titre: 'Chef de Rang',
          },
          offre: {
            id: 201,
            titre: 'Chef de Rang - Restaurant Le Gourmet',
          },
          date: '2025-06-03T14:00:00',
          duree: 45,
          type: 'video',
          statut: 'planifie',
          notes: '',
          lien: 'https://meet.hereoz.com/entretien/123456',
        },
        {
          id: 2,
          candidat: {
            id: 102,
            prenom: 'Thomas',
            nom: 'Martin',
            photo: null,
            titre: 'Barman',
          },
          offre: {
            id: 202,
            titre: 'Barman expérimenté - Bar Le Cocktail',
          },
          date: '2025-06-01T10:30:00',
          duree: 60,
          type: 'physique',
          statut: 'realise',
          notes: 'Très bon entretien, candidat expérimenté et motivé.',
          lieu: 'Bar Le Cocktail, 15 rue des Lilas, Paris',
        },
        {
          id: 3,
          candidat: {
            id: 103,
            prenom: 'Sophie',
            nom: 'Bernard',
            photo: null,
            titre: 'Serveuse',
          },
          offre: {
            id: 201,
            titre: 'Chef de Rang - Restaurant Le Gourmet',
          },
          date: '2025-05-28T15:45:00',
          duree: 30,
          type: 'video',
          statut: 'annule',
          notes: 'Annulé par le candidat pour raisons personnelles.',
          lien: 'https://meet.hereoz.com/entretien/789012',
        },
        {
          id: 4,
          candidat: {
            id: 104,
            prenom: 'Lucas',
            nom: 'Petit',
            photo: null,
            titre: 'Second de cuisine',
          },
          offre: {
            id: 203,
            titre: 'Second de cuisine - Restaurant Le Gourmet',
          },
          date: '2025-06-05T11:00:00',
          duree: 45,
          type: 'physique',
          statut: 'planifie',
          lieu: 'Restaurant Le Gourmet, 25 avenue Victor Hugo, Paris',
        },
        {
          id: 5,
          candidat: {
            id: 105,
            prenom: 'Emma',
            nom: 'Leroy',
            photo: null,
            titre: 'Réceptionniste',
          },
          offre: {
            id: 204,
            titre: 'Réceptionniste - Hôtel Le Palace',
          },
          date: '2025-05-30T09:15:00',
          duree: 60,
          type: 'video',
          statut: 'realise',
          notes: 'Bonne candidate, à l\'aise à l\'oral, expérience pertinente.',
          lien: 'https://meet.hereoz.com/entretien/345678',
        },
      ];
      
      setEntretiens(mockEntretiens);
      setLoading(false);
    }, 1000);
  }, []);
  
  // Changer d'onglet
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Ouvrir le menu
  const handleMenuOpen = (event, entretien) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedEntretien(entretien);
  };
  
  // Fermer le menu
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };
  
  // Ouvrir le dialog d'annulation
  const handleOpenCancelDialog = () => {
    setCancelDialogOpen(true);
    handleMenuClose();
  };
  
  // Ouvrir le dialog de suppression
  const handleOpenDeleteDialog = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };
  
  // Ouvrir le dialog de lien
  const handleOpenLinkDialog = () => {
    setEntretienLink(selectedEntretien?.lien || '');
    setLinkDialogOpen(true);
    handleMenuClose();
  };
  
  // Annuler un entretien
  const handleCancelEntretien = () => {
    // Dans une application réelle, nous enverrions cette action à l'API
    setEntretiens(
      entretiens.map(entretien =>
        entretien.id === selectedEntretien.id
          ? { ...entretien, statut: 'annule' }
          : entretien
      )
    );
    setCancelDialogOpen(false);
  };
  
  // Supprimer un entretien
  const handleDeleteEntretien = () => {
    // Dans une application réelle, nous enverrions cette action à l'API
    setEntretiens(
      entretiens.filter(entretien => entretien.id !== selectedEntretien.id)
    );
    setDeleteDialogOpen(false);
  };
  
  // Partager le lien d'entretien
  const handleShareLink = () => {
    // Dans une application réelle, nous enverrions le lien par email ou message
    console.log('Lien d\'entretien partagé:', entretienLink);
    setLinkDialogOpen(false);
  };
  
  // Formater la date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };
  
  // Formater l'heure
  const formatTime = (dateString) => {
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleTimeString('fr-FR', options);
  };
  
  // Déterminer si un entretien est passé
  const isEntretienPassed = (dateString) => {
    return new Date(dateString) < new Date();
  };
  
  // Déterminer si un entretien est aujourd'hui
  const isEntretienToday = (dateString) => {
    const today = new Date();
    const entretienDate = new Date(dateString);
    return (
      entretienDate.getDate() === today.getDate() &&
      entretienDate.getMonth() === today.getMonth() &&
      entretienDate.getFullYear() === today.getFullYear()
    );
  };
  
  // Obtenir les initiales pour l'avatar
  const getInitials = (prenom, nom) => {
    return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();
  };
  
  // Filtrer les entretiens selon l'onglet, la recherche
  const filteredEntretiens = entretiens.filter(entretien => {
    // Filtre par onglet
    if (tabValue === 1 && entretien.statut !== 'planifie') {
      return false;
    }
    if (tabValue === 2 && entretien.statut !== 'realise') {
      return false;
    }
    if (tabValue === 3 && entretien.statut !== 'annule') {
      return false;
    }
    
    // Filtre par recherche
    if (search) {
      const searchLower = search.toLowerCase();
      const fullName = `${entretien.candidat.prenom} ${entretien.candidat.nom}`.toLowerCase();
      const offreTitle = entretien.offre.titre.toLowerCase();
      
      return fullName.includes(searchLower) || offreTitle.includes(searchLower);
    }
    
    return true;
  });
  
  // Trier les entretiens par date
  const sortedEntretiens = [...filteredEntretiens].sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Entretiens
        </Typography>
        
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/recruteur/entretiens/nouveau')}
        >
          Planifier un entretien
        </Button>
      </Box>
      
      <Paper elevation={1} sx={{ mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Tous" />
          <Tab 
            label={
              <Box sx={{ position: 'relative' }}>
                À venir
                {entretiens.filter(e => e.statut === 'planifie').length > 0 && (
                  <Chip
                    label={entretiens.filter(e => e.statut === 'planifie').length}
                    color="primary"
                    size="small"
                    sx={{ position: 'absolute', top: -8, right: -20 }}
                  />
                )}
              </Box>
            }
          />
          <Tab label="Réalisés" />
          <Tab label="Annulés" />
        </Tabs>
        
        <Divider />
        
        <Box p={2}>
          <TextField
            fullWidth
            placeholder="Rechercher un entretien..."
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Paper>
      
      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : sortedEntretiens.length === 0 ? (
        <Paper elevation={1} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary" paragraph>
            {search ? 'Aucun entretien ne correspond à votre recherche.' : 'Aucun entretien pour le moment.'}
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/recruteur/entretiens/nouveau')}
          >
            Planifier un entretien
          </Button>
        </Paper>
      ) : (
        <Paper elevation={1}>
          <List sx={{ width: '100%', bgcolor: 'background.paper', p: 0 }}>
            {sortedEntretiens.map((entretien, index) => (
              <React.Fragment key={entretien.id}>
                <ListItem
                  alignItems="flex-start"
                  sx={{
                    py: 2,
                    bgcolor: isEntretienToday(entretien.date) && entretien.statut === 'planifie'
                      ? 'primary.50'
                      : 'inherit',
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      alt={`${entretien.candidat.prenom} ${entretien.candidat.nom}`}
                      src={entretien.candidat.photo}
                      sx={{
                        bgcolor: entretien.type === 'video' ? 'primary.main' : 'secondary.main',
                      }}
                    >
                      {entretien.type === 'video' ? <VideoCallIcon /> : <EventIcon />}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="subtitle1" fontWeight="medium">
                          {entretien.candidat.prenom} {entretien.candidat.nom}
                        </Typography>
                        {entretien.statut === 'planifie' ? (
                          <Chip
                            label="Planifié"
                            color="primary"
                            size="small"
                          />
                        ) : entretien.statut === 'realise' ? (
                          <Chip
                            label="Réalisé"
                            color="success"
                            size="small"
                          />
                        ) : (
                          <Chip
                            label="Annulé"
                            color="error"
                            size="small"
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" color="text.primary">
                          {entretien.offre.titre}
                        </Typography>
                        <Box display="flex" alignItems="center" mt={1}>
                          {entretien.type === 'video' ? (
                            <VideoCallIcon fontSize="small" color="primary" sx={{ mr: 0.5 }} />
                          ) : (
                            <EventIcon fontSize="small" color="secondary" sx={{ mr: 0.5 }} />
                          )}
                          <Typography variant="body2" color="text.secondary">
                            {entretien.type === 'video' ? 'Entretien visio' : 'Entretien en personne'} • {formatDate(entretien.date)} à {formatTime(entretien.date)} • {entretien.duree} min
                          </Typography>
                        </Box>
                        {entretien.notes && (
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Note: {entretien.notes.substring(0, 60)}{entretien.notes.length > 60 ? '...' : ''}
                          </Typography>
                        )}
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={(event) => handleMenuOpen(event, entretien)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                {index < sortedEntretiens.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}
      
      {/* Menu contextuel */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        {selectedEntretien?.statut === 'planifie' && !isEntretienPassed(selectedEntretien?.date) && (
          <>
            {selectedEntretien?.type === 'video' && (
              <MenuItem onClick={handleOpenLinkDialog}>
                <ListItemIcon>
                  <LinkIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Copier le lien</ListItemText>
              </MenuItem>
            )}
            <MenuItem onClick={() => {
              navigate(`/recruteur/entretiens/${selectedEntretien.id}/edit`);
              handleMenuClose();
            }}>
              <ListItemIcon>
                <EditIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Modifier</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleOpenCancelDialog}>
              <ListItemIcon>
                <CancelIcon fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText>Annuler</ListItemText>
            </MenuItem>
          </>
        )}
        <MenuItem onClick={() => {
          navigate(`/recruteur/candidats/${selectedEntretien.candidat.id}`);
          handleMenuClose();
        }}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Voir le candidat</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => {
          navigate(`/recruteur/messages/nouveau/${selectedEntretien.candidat.id}`);
          handleMenuClose();
        }}>
          <ListItemIcon>
            <SendIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Envoyer un message</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleOpenDeleteDialog}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Supprimer</ListItemText>
        </MenuItem>
      </Menu>
      
      {/* Dialog d'annulation */}
      <Dialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
      >
        <DialogTitle>Annuler l'entretien</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir annuler l'entretien avec {selectedEntretien?.candidat.prenom} {selectedEntretien?.candidat.nom} prévu le {selectedEntretien ? formatDate(selectedEntretien.date) : ''} à {selectedEntretien ? formatTime(selectedEntretien.date) : ''} ?
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Motif d'annulation (optionnel)"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)}>Non</Button>
          <Button onClick={handleCancelEntretien} color="error" variant="contained">
            Oui, annuler
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Dialog de suppression */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Supprimer l'entretien</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer définitivement cet entretien ? Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleDeleteEntretien} color="error" variant="contained">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Dialog de lien */}
      <Dialog
        open={linkDialogOpen}
        onClose={() => setLinkDialogOpen(false)}
      >
        <DialogTitle>Lien d'entretien vidéo</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Vous pouvez copier ce lien pour le partager avec le candidat ou l'utiliser vous-même pour rejoindre l'entretien:
          </DialogContentText>
          <TextField
            margin="dense"
            fullWidth
            value={entretienLink}
            variant="outlined"
            InputProps={{
              readOnly: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            navigator.clipboard.writeText(entretienLink);
            setLinkDialogOpen(false);
          }}>
            Copier et fermer
          </Button>
          <Button onClick={handleShareLink} variant="contained">
            Envoyer par message
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EntretiensPage;