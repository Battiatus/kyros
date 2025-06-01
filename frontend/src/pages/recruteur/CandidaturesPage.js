import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Tabs,
  Tab,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  InputAdornment,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  ListItemIcon,
  CircularProgress,
  useTheme,
} from '@mui/material';
import {
  FilterList as FilterIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Mail as MailIcon,
  Event as EventIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
  Assignment as AssignmentIcon,
  VideoCall as VideoCallIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  Sort as SortIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { 
  fetchCandidatures, 
  updateCandidatureStatus, 
  addNoteToCandidature,
  selectAllCandidatures, 
  selectCandidatureLoading, 
  selectCandidatureError 
} from '../../redux/slices/candidatureSlice';
import { updateFilters, selectFilters } from '../../redux/slices/uiSlice';
import { toast } from 'react-toastify';

/**
 * Page de gestion des candidatures
 */
const CandidaturesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  
  // États pour la gestion de l'interface
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCandidature, setSelectedCandidature] = useState(null);
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [openNoteDialog, setOpenNoteDialog] = useState(false);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [newNote, setNewNote] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [menuCandidatureId, setMenuCandidatureId] = useState(null);
  
  const candidatures = useSelector(selectAllCandidatures);
  const loading = useSelector(selectCandidatureLoading);
  const error = useSelector(selectCandidatureError);
  const filters = useSelector(selectFilters('candidatures'));
  
  // Statuts possibles des candidatures
  const statuses = [
    { value: 'all', label: 'Tous', color: 'default' },
    { value: 'new', label: 'Nouvelles', color: 'primary' },
    { value: 'viewed', label: 'Consultées', color: 'default' },
    { value: 'contacted', label: 'Contactées', color: 'info' },
    { value: 'interview', label: 'Entretien', color: 'secondary' },
    { value: 'offer', label: 'Offre', color: 'success' },
    { value: 'hired', label: 'Embauché', color: 'success' },
    { value: 'rejected', label: 'Refusé', color: 'error' },
  ];
  
  // Charger les candidatures
  useEffect(() => {
    const params = {
      page: 1,
      limit: 50,
      status: getStatusFilterByTab(tabValue),
      search: filters.search || '',
      sortBy: filters.sortField || 'date',
      order: filters.sortOrder || 'desc',
    };
    
    dispatch(fetchCandidatures(params));
  }, [dispatch, tabValue, filters.search, filters.sortField, filters.sortOrder]);
  
  // Fonction pour obtenir le filtre de statut en fonction de l'onglet
  const getStatusFilterByTab = (tab) => {
    switch (tab) {
      case 1:
        return 'new,viewed';
      case 2:
        return 'contacted,interview,offer';
      case 3:
        return 'hired,rejected';
      default:
        return 'all';
    }
  };
  
  // Changement d'onglet
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    
    // Mettre à jour le filtre de statut en fonction de l'onglet
    dispatch(updateFilters({
      category: 'candidatures',
      filters: { status: getStatusFilterByTab(newValue) }
    }));
  };
  
  // Mise à jour de la recherche
  const handleSearchChange = (e) => {
    dispatch(updateFilters({
      category: 'candidatures',
      filters: { search: e.target.value }
    }));
  };
  
  // Mise à jour du filtre de statut
  const handleStatusChange = (e) => {
    dispatch(updateFilters({
      category: 'candidatures',
      filters: { status: e.target.value }
    }));
  };
  
  // Changer le tri
  const handleSortChange = (field) => {
    const currentField = filters.sortField || 'date';
    const currentOrder = filters.sortOrder || 'desc';
    
    if (currentField === field) {
      dispatch(updateFilters({
        category: 'candidatures',
        filters: { 
          sortField: field,
          sortOrder: currentOrder === 'asc' ? 'desc' : 'asc'
        }
      }));
    } else {
      dispatch(updateFilters({
        category: 'candidatures',
        filters: { 
          sortField: field,
          sortOrder: 'desc'
        }
      }));
    }
  };
  
  // Ouvrir le menu contextuel
  const handleMenuOpen = (event, candidatureId) => {
    setAnchorEl(event.currentTarget);
    setMenuCandidatureId(candidatureId);
    setSelectedCandidature(candidatures.find(c => c.id === candidatureId));
  };
  
  // Fermer le menu contextuel
  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuCandidatureId(null);
  };
  
  // Ouvrir le dialog de changement de statut
  const handleOpenStatusDialog = () => {
    const candidature = candidatures.find(c => c.id === menuCandidatureId);
    setSelectedCandidature(candidature);
    setNewStatus(candidature.status);
    setOpenStatusDialog(true);
    handleMenuClose();
  };
  
  // Ouvrir le dialog d'ajout de note
  const handleOpenNoteDialog = () => {
    const candidature = candidatures.find(c => c.id === menuCandidatureId);
    setSelectedCandidature(candidature);
    setNewNote(candidature.notes || '');
    setOpenNoteDialog(true);
    handleMenuClose();
  };
  
  // Ouvrir le dialog de refus
  const handleOpenRejectDialog = () => {
    const candidature = candidatures.find(c => c.id === menuCandidatureId);
    setSelectedCandidature(candidature);
    setRejectReason(candidature.motif_refus || '');
    setOpenRejectDialog(true);
    handleMenuClose();
  };
  
  // Mettre à jour le statut d'une candidature
  const handleUpdateStatus = () => {
    if (!selectedCandidature) return;
    
    dispatch(updateCandidatureStatus({
      candidatureId: selectedCandidature.id, 
      status: newStatus
    })).then(() => {
      setOpenStatusDialog(false);
    });
  };
  
  // Mettre à jour la note d'une candidature
  const handleUpdateNote = () => {
    if (!selectedCandidature) return;
    
    dispatch(addNoteToCandidature({
      candidatureId: selectedCandidature.id, 
      notes: newNote
    })).then(() => {
      setOpenNoteDialog(false);
    });
  };
  
  // Refuser une candidature
  const handleReject = () => {
    if (!selectedCandidature) return;
    
    dispatch(updateCandidatureStatus({
      candidatureId: selectedCandidature.id, 
      status: 'rejected',
      rejectReason
    })).then(() => {
      setOpenRejectDialog(false);
      setRejectReason('');
    });
  };
  
  // Formater la date relative (aujourd'hui, hier, etc.)
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
    const statusObj = statuses.find(s => s.value === status) || statuses[0];
    return (
      <Chip
        size="small"
        label={statusObj.label}
        color={statusObj.color}
      />
    );
  };
  
  // Obtenir les initiales pour l'avatar
  const getInitials = (prenom, nom) => {
    return `${prenom?.charAt(0) || ''}${nom?.charAt(0) || ''}`.toUpperCase();
  };
  
  // Naviguer vers le détail d'une candidature
  const handleViewCandidature = (id) => {
    navigate(`/recruteur/candidatures/${id}`);
  };
  
  // Naviguer vers la messagerie avec un candidat
  const handleContactCandidat = (candidatId) => {
    navigate(`/recruteur/messages/nouveau/${candidatId}`);
  };
  
  // Planifier un entretien
  const handleScheduleInterview = (candidatureId) => {
    navigate(`/recruteur/entretiens/nouveau?candidature=${candidatureId}`);
    handleMenuClose();
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" fontWeight="bold" mb={4}>
        Gestion des candidatures
      </Typography>
      
      <Paper elevation={1} sx={{ mb: 4 }}>
        {/* Onglets */}
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Toutes" />
          <Tab
            label={
              <Badge 
                badgeContent={candidatures.filter(c => ['new', 'viewed'].includes(c.status)).length} 
                color="primary"
              >
                Nouvelles
              </Badge>
            }
          />
          <Tab label="En cours" />
          <Tab label="Terminées" />
        </Tabs>
        
        <Divider />
        
        {/* Filtres et recherche */}
        <Box p={2} display="flex" flexWrap="wrap" gap={2} alignItems="center">
          <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
            <InputLabel id="status-filter-label">Statut</InputLabel>
            <Select
              labelId="status-filter-label"
              value={filters.status || 'all'}
              onChange={handleStatusChange}
              label="Statut"
            >
              {statuses.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl sx={{ flexGrow: 1 }}>
            <OutlinedInput
              placeholder="Rechercher un candidat ou une offre..."
              value={filters.search || ''}
              onChange={handleSearchChange}
              size="small"
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              }
            />
          </FormControl>
          
          <Box display="flex" gap={1} alignItems="center">
            <Typography variant="body2" color="text.secondary">
              Trier par:
            </Typography>
            <Button
              size="small"
              startIcon={<SortIcon />}
              endIcon={(filters.sortField || 'date') === 'date' && ((filters.sortOrder || 'desc') === 'asc' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />)}
              onClick={() => handleSortChange('date')}
              color={(filters.sortField || 'date') === 'date' ? 'primary' : 'inherit'}
              sx={{ minWidth: 'auto' }}
            >
              Date
            </Button>
            <Button
              size="small"
              startIcon={<PersonIcon />}
              endIcon={(filters.sortField || 'date') === 'name' && ((filters.sortOrder || 'desc') === 'asc' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />)}
              onClick={() => handleSortChange('name')}
              color={(filters.sortField || 'date') === 'name' ? 'primary' : 'inherit'}
              sx={{ minWidth: 'auto' }}
            >
              Nom
            </Button>
            <Button
              size="small"
              startIcon={<AssignmentIcon />}
              endIcon={(filters.sortField || 'date') === 'score' && ((filters.sortOrder || 'desc') === 'asc' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />)}
              onClick={() => handleSortChange('score')}
              color={(filters.sortField || 'date') === 'score' ? 'primary' : 'inherit'}
              sx={{ minWidth: 'auto' }}
            >
              Score
            </Button>
          </Box>
        </Box>
      </Paper>
      
      {/* Liste des candidatures */}
      <Paper elevation={1}>
        {loading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : candidatures.length === 0 ? (
          <Box textAlign="center" p={4}>
            <Typography variant="body1" color="text.secondary">
              Aucune candidature ne correspond à vos critères.
            </Typography>
          </Box>
        ) : (
          <List sx={{ width: '100%', bgcolor: 'background.paper', p: 0 }}>
            {candidatures.map((candidature, index) => (
              <React.Fragment key={candidature.id}>
                <ListItem
                  alignItems="flex-start"
                  sx={{ 
                    p: 2,
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                  onClick={() => handleViewCandidature(candidature.id)}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="actions"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMenuOpen(e, candidature.id);
                      }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  }
                >
                  <ListItemAvatar>
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      badgeContent={
                        candidature.candidat?.matchScore ? (
                          <Avatar
                            sx={{
                              width: 20,
                              height: 20,
                              border: `2px solid ${theme.palette.background.paper}`,
                              bgcolor: candidature.candidat.matchScore >= 80 ? 'success.main' : 'warning.main',
                            }}
                          >
                            <Typography variant="caption" sx={{ fontSize: '0.6rem' }}>
                              {candidature.candidat.matchScore}
                            </Typography>
                          </Avatar>
                        ) : null
                      }
                    >
                      <Avatar
                        src={candidature.candidat?.photo}
                        alt={candidature.candidat ? `${candidature.candidat.prenom} ${candidature.candidat.nom}` : ''}
                        sx={{ 
                          width: 56, 
                          height: 56,
                          bgcolor: candidature.status === 'new' ? 'primary.main' : 'grey.400',
                        }}
                      >
                        {getInitials(candidature.candidat?.prenom, candidature.candidat?.nom)}
                      </Avatar>
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="subtitle1" component="span" fontWeight="medium">
                          {candidature.candidat?.prenom} {candidature.candidat?.nom}
                        </Typography>
                        {renderStatus(candidature.status)}
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          {candidature.candidat?.titre}
                        </Typography>
                        <Typography component="div" variant="body2" color="text.secondary" mt={0.5}>
                          Pour: {candidature.offre?.titre}
                        </Typography>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                          <Typography component="span" variant="caption" color="text.secondary">
                            {formatRelativeDate(candidature.date_candidature)}
                          </Typography>
                          <Box>
                            {candidature.entretiens?.length > 0 && (
                              <Chip
                                icon={<EventIcon fontSize="small" />}
                                label={`${candidature.entretiens.length} entretien${candidature.entretiens.length > 1 ? 's' : ''}`}
                                size="small"
                                sx={{ mr: 1 }}
                              />
                            )}
                            {candidature.notes && (
                              <Chip
                                icon={<AssignmentIcon fontSize="small" />}
                                label="Notes"
                                size="small"
                                variant="outlined"
                              />
                            )}
                          </Box>
                        </Box>
                      </>
                    }
                  />
                </ListItem>
                {index < candidatures.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>
      
      {/* Menu contextuel pour les actions sur une candidature */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          if (selectedCandidature) {
            handleContactCandidat(selectedCandidature.candidat?.id);
          }
          handleMenuClose();
        }}>
          <ListItemIcon>
            <MailIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Contacter</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleScheduleInterview(menuCandidatureId)}>
          <ListItemIcon>
            <EventIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Planifier un entretien</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleOpenStatusDialog}>
          <ListItemIcon>
            <CheckCircleIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Changer le statut</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleOpenNoteDialog}>
          <ListItemIcon>
            <AssignmentIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Ajouter une note</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleOpenRejectDialog}>
          <ListItemIcon>
            <CancelIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Refuser la candidature</ListItemText>
        </MenuItem>
      </Menu>
      
      {/* Dialog de changement de statut */}
      <Dialog open={openStatusDialog} onClose={() => setOpenStatusDialog(false)}>
        <DialogTitle>Changer le statut</DialogTitle>
        <DialogContent>
          {selectedCandidature && (
            <>
              <Typography variant="body2" gutterBottom>
                Candidature de {selectedCandidature.candidat?.prenom} {selectedCandidature.candidat?.nom}
              </Typography>
              <FormControl fullWidth margin="normal">
                <InputLabel id="new-status-label">Nouveau statut</InputLabel>
                <Select
                  labelId="new-status-label"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  label="Nouveau statut"
                >
                  {statuses.filter(s => s.value !== 'all').map((status) => (
                    <MenuItem key={status.value} value={status.value}>
                      {status.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenStatusDialog(false)}>Annuler</Button>
          <Button variant="contained" onClick={handleUpdateStatus}>Enregistrer</Button>
        </DialogActions>
      </Dialog>
      
      {/* Dialog d'ajout de note */}
      <Dialog open={openNoteDialog} onClose={() => setOpenNoteDialog(false)} fullWidth>
        <DialogTitle>Ajouter une note</DialogTitle>
        <DialogContent>
          {selectedCandidature && (
            <>
              <Typography variant="body2" gutterBottom>
                Candidature de {selectedCandidature.candidat?.prenom} {selectedCandidature.candidat?.nom}
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                margin="normal"
                label="Note (visible uniquement par votre équipe)"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNoteDialog(false)}>Annuler</Button>
          <Button variant="contained" onClick={handleUpdateNote}>Enregistrer</Button>
        </DialogActions>
      </Dialog>
      
      {/* Dialog de refus */}
      <Dialog open={openRejectDialog} onClose={() => setOpenRejectDialog(false)} fullWidth>
        <DialogTitle>Refuser la candidature</DialogTitle>
        <DialogContent>
          {selectedCandidature && (
            <>
              <Typography variant="body2" gutterBottom>
                Vous êtes sur le point de refuser la candidature de {selectedCandidature.candidat?.prenom} {selectedCandidature.candidat?.nom}.
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                margin="normal"
                label="Motif du refus (optionnel)"
                placeholder="Expliquez pourquoi cette candidature n'a pas été retenue..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
              <Typography variant="caption" color="text.secondary">
                Note: Un email de refus sera automatiquement envoyé au candidat.
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRejectDialog(false)}>Annuler</Button>
          <Button variant="contained" color="error" onClick={handleReject}>Refuser</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CandidaturesPage;