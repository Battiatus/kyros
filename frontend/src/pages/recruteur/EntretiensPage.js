import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
import { 
  fetchEntretiens, 
  cancelEntretien, 
  selectAllEntretiens, 
  selectEntretienLoading, 
  selectEntretienError 
} from '../../redux/slices/entretienSlice';
import { updateFilters, selectFilters } from '../../redux/slices/uiSlice';

/**
 * Page de gestion des entretiens
 */
const EntretiensPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [tabValue, setTabValue] = useState(0);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedEntretien, setSelectedEntretien] = useState(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [entretienLink, setEntretienLink] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  
  const entretiens = useSelector(selectAllEntretiens);
  const loading = useSelector(selectEntretienLoading);
  const error = useSelector(selectEntretienError);
  const filters = useSelector(selectFilters('entretiens'));
  
  // Charger les entretiens
  useEffect(() => {
    const params = {
      page: 1,
      limit: 50,
      status: getStatusFilterByTab(tabValue),
      search: filters.search || '',
      sortBy: filters.sortField || 'date',
      order: filters.sortOrder || 'desc',
    };
    
    dispatch(fetchEntretiens(params));
  }, [dispatch, tabValue, filters.search, filters.sortField, filters.sortOrder]);
  
  // Fonction pour obtenir le filtre de statut en fonction de l'onglet
  const getStatusFilterByTab = (tab) => {
    switch (tab) {
      case 1:
        return 'planifie,confirme';
      case 2:
        return 'realise';
      case 3:
        return 'annule';
      default:
        return 'all';
    }
  };
  
  // Changement d'onglet
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    
    // Mettre à jour le filtre de statut en fonction de l'onglet
    dispatch(updateFilters({
      category: 'entretiens',
      filters: { status: getStatusFilterByTab(newValue) }
    }));
  };
  
  // Recherche d'entretiens
  const handleSearchChange = (e) => {
    dispatch(updateFilters({
      category: 'entretiens',
      filters: { search: e.target.value }
    }));
  };
  
  // Ouvrir le menu contextuel
  const handleMenuOpen = (event, entretien) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedEntretien(entretien);
  };
  
  // Fermer le menu contextuel
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
    setEntretienLink(selectedEntretien?.lien_visio || '');
    setLinkDialogOpen(true);
    handleMenuClose();
  };
  
  // Annuler un entretien
  const handleCancelEntretien = () => {
    if (selectedEntretien) {
      dispatch(cancelEntretien({ 
        entretienId: selectedEntretien.id,
        reason: cancelReason
      }));
      setCancelDialogOpen(false);
      setCancelReason('');
    }
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
    return `${prenom?.charAt(0) || ''}${nom?.charAt(0) || ''}`.toUpperCase();
  };
  
  // Partager le lien d'entretien
  const handleShareLink = () => {
    // Dans une application réelle, nous enverrions le lien par email ou message
    navigator.clipboard.writeText(entretienLink);
    toast.success('Lien copié dans le presse-papier');
    setLinkDialogOpen(false);
  };
  
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
                {entretiens.filter(e => ['planifie', 'confirme'].includes(e.statut)).length > 0 && (
                  <Chip
                    label={entretiens.filter(e => ['planifie', 'confirme'].includes(e.statut)).length}
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
            value={filters.search || ''}
            onChange={handleSearchChange}
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
      ) : entretiens.length === 0 ? (
        <Paper elevation={1} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary" paragraph>
            {filters.search ? 'Aucun entretien ne correspond à votre recherche.' : 'Aucun entretien pour le moment.'}
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
            {entretiens.map((entretien, index) => (
              <React.Fragment key={entretien.id}>
                <ListItem
                  alignItems="flex-start"
                  sx={{
                    py: 2,
                    bgcolor: isEntretienToday(entretien.date_entretien) && entretien.statut === 'planifie'
                      ? 'primary.50'
                      : 'inherit',
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      alt={entretien.candidat ? `${entretien.candidat.prenom} ${entretien.candidat.nom}` : ''}
                      src={entretien.candidat?.photo}
                      sx={{
                        bgcolor: entretien.mode === 'visio' ? 'primary.main' : 'secondary.main',
                      }}
                    >
                      {entretien.mode === 'visio' ? <VideoCallIcon /> : <EventIcon />}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="subtitle1" fontWeight="medium">
                          {entretien.candidat?.prenom} {entretien.candidat?.nom}
                        </Typography>
                        {entretien.statut === 'planifie' ? (
                          <Chip
                            label="Planifié"
                            color="primary"
                            size="small"
                          />
                        ) : entretien.statut === 'confirme' ? (
                          <Chip
                            label="Confirmé"
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
                          {entretien.offre?.titre}
                        </Typography>
                        <Box display="flex" alignItems="center" mt={1}>
                          {entretien.mode === 'visio' ? (
                            <VideoCallIcon fontSize="small" color="primary" sx={{ mr: 0.5 }} />
                          ) : (
                            <EventIcon fontSize="small" color="secondary" sx={{ mr: 0.5 }} />
                          )}
                          <Typography variant="body2" color="text.secondary">
                            {entretien.mode === 'visio' ? 'Entretien visio' : 'Entretien en personne'} • {formatDate(entretien.date_entretien)} à {formatTime(entretien.date_entretien)} • {entretien.duree} min
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
                {index < entretiens.length - 1 && <Divider component="li" />}
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
        {selectedEntretien?.statut === 'planifie' && !isEntretienPassed(selectedEntretien?.date_entretien) && (
          <>
            {selectedEntretien?.mode === 'visio' && (
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
          navigate(`/recruteur/candidats/${selectedEntretien?.candidat?.id}`);
          handleMenuClose();
        }}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Voir le candidat</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => {
          navigate(`/recruteur/messages/nouveau/${selectedEntretien?.candidat?.id}`);
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
            Êtes-vous sûr de vouloir annuler l'entretien avec {selectedEntretien?.candidat?.prenom} {selectedEntretien?.candidat?.nom} prévu le {selectedEntretien ? formatDate(selectedEntretien.date_entretien) : ''} à {selectedEntretien ? formatTime(selectedEntretien.date_entretien) : ''} ?
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Motif d'annulation (optionnel)"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
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
          <Button onClick={() => {
            // Dans une application réelle, nous enverrions cette action à l'API
            setDeleteDialogOpen(false);
            handleMenuClose();
          }} color="error" variant="contained">
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