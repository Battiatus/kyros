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

/**
 * Page de gestion des candidatures
 */
const CandidaturesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  
  // États pour la gestion de l'interface
  const [tabValue, setTabValue] = useState(0);
  const [candidatures, setCandidatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCandidature, setSelectedCandidature] = useState(null);
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [openNoteDialog, setOpenNoteDialog] = useState(false);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [newNote, setNewNote] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [menuCandidatureId, setMenuCandidatureId] = useState(null);
  
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
  
  // Charger les candidatures (simulées pour l'exemple)
  useEffect(() => {
    // Dans une version réelle, nous ferions un appel API
    const fetchCandidatures = async () => {
      setLoading(true);
      
      // Simulation de délai réseau
      setTimeout(() => {
        // Données fictives pour l'exemple
        const mockCandidatures = [
          {
            id: 1,
            candidat: {
              id: 101,
              prenom: 'Marie',
              nom: 'Dupont',
              photo: null,
              titre: 'Chef de Rang',
              email: 'marie.dupont@email.com',
              telephone: '06 12 34 56 78',
              matchScore: 92,
            },
            offre: {
              id: 201,
              titre: 'Chef de Rang - Restaurant Le Gourmet',
              localisation: 'Paris',
            },
            status: 'new',
            date: '2025-05-28T10:30:00',
            messagePerso: 'Je suis très intéressée par votre offre et je pense que mon expérience correspondrait parfaitement au poste.',
            notes: '',
            entretiens: [],
          },
          {
            id: 2,
            candidat: {
              id: 102,
              prenom: 'Thomas',
              nom: 'Martin',
              photo: null,
              titre: 'Barman',
              email: 'thomas.martin@email.com',
              telephone: '06 23 45 67 89',
              matchScore: 85,
            },
            offre: {
              id: 202,
              titre: 'Barman expérimenté - Bar Le Cocktail',
              localisation: 'Lyon',
            },
            status: 'viewed',
            date: '2025-05-27T15:45:00',
            messagePerso: 'Passionné de mixologie, je souhaite mettre mes compétences au service de votre établissement.',
            notes: 'Profil intéressant, expérience dans des bars similaires',
            entretiens: [],
          },
          {
            id: 3,
            candidat: {
              id: 103,
              prenom: 'Sophie',
              nom: 'Bernard',
              photo: null,
              titre: 'Serveuse',
              email: 'sophie.bernard@email.com',
              telephone: '06 34 56 78 90',
              matchScore: 78,
            },
            offre: {
              id: 201,
              titre: 'Chef de Rang - Restaurant Le Gourmet',
              localisation: 'Paris',
            },
            status: 'contacted',
            date: '2025-05-26T09:15:00',
            messagePerso: 'Je suis actuellement en poste mais souhaite évoluer dans un établissement comme le vôtre.',
            notes: 'A répondu rapidement au message, entretien à prévoir',
            entretiens: [],
          },
          {
            id: 4,
            candidat: {
              id: 104,
              prenom: 'Lucas',
              nom: 'Petit',
              photo: null,
              titre: 'Second de cuisine',
              email: 'lucas.petit@email.com',
              telephone: '06 45 67 89 01',
              matchScore: 72,
            },
            offre: {
              id: 203,
              titre: 'Second de cuisine - Restaurant Le Gourmet',
              localisation: 'Paris',
            },
            status: 'interview',
            date: '2025-05-25T14:20:00',
            messagePerso: 'Je recherche un nouveau défi culinaire et votre établissement correspond à mes aspirations.',
            notes: 'Entretien prévu le 30/05 à 14h',
            entretiens: [
              {
                id: 301,
                date: '2025-05-30T14:00:00',
                type: 'video',
                status: 'scheduled',
              },
            ],
          },
          {
            id: 5,
            candidat: {
              id: 105,
              prenom: 'Emma',
              nom: 'Leroy',
              photo: null,
              titre: 'Réceptionniste',
              email: 'emma.leroy@email.com',
              telephone: '06 56 78 90 12',
              matchScore: 94,
            },
            offre: {
              id: 204,
              titre: 'Réceptionniste - Hôtel Le Palace',
              localisation: 'Nice',
            },
            status: 'offer',
            date: '2025-05-24T11:10:00',
            messagePerso: 'Trilingue avec expérience en hôtellerie de luxe, je serais ravie de rejoindre votre équipe.',
            notes: 'Très bon entretien, offre envoyée le 27/05',
            entretiens: [
              {
                id: 302,
                date: '2025-05-26T10:00:00',
                type: 'in_person',
                status: 'completed',
              },
            ],
          },
          {
            id: 6,
            candidat: {
              id: 106,
              prenom: 'Antoine',
              nom: 'Dubois',
              photo: null,
              titre: 'Chef de partie',
              email: 'antoine.dubois@email.com',
              telephone: '06 67 89 01 23',
              matchScore: 88,
            },
            offre: {
              id: 203,
              titre: 'Second de cuisine - Restaurant Le Gourmet',
              localisation: 'Paris',
            },
            status: 'hired',
            date: '2025-05-20T09:30:00',
            messagePerso: 'Je souhaite apporter mon savoir-faire et ma créativité à votre brigade.',
            notes: 'Embauché le 28/05, début le 15/06',
            entretiens: [
              {
                id: 303,
                date: '2025-05-22T11:00:00',
                type: 'in_person',
                status: 'completed',
              },
              {
                id: 304,
                date: '2025-05-25T14:30:00',
                type: 'in_person',
                status: 'completed',
              },
            ],
          },
          {
            id: 7,
            candidat: {
              id: 107,
              prenom: 'Julien',
              nom: 'Moreau',
              photo: null,
              titre: 'Sommelier',
              email: 'julien.moreau@email.com',
              telephone: '06 78 90 12 34',
              matchScore: 65,
            },
            offre: {
              id: 205,
              titre: 'Sommelier - Restaurant Le Gourmet',
              localisation: 'Paris',
            },
            status: 'rejected',
            date: '2025-05-18T16:40:00',
            messagePerso: 'Passionné par l\'univers du vin, je souhaite mettre mes connaissances à votre service.',
            notes: 'Refusé car expérience insuffisante',
            entretiens: [],
            rejectReason: 'Profil intéressant mais expérience insuffisante pour le poste',
          },
        ];
        
        setCandidatures(mockCandidatures);
        setLoading(false);
      }, 1000);
    };
    
    fetchCandidatures();
  }, []);
  
  // Changer l'onglet
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Filtrer les candidatures selon l'onglet, la recherche et le filtre de statut
  const filteredCandidatures = candidatures.filter(candidature => {
    // Filtre par onglet
    if (tabValue === 1 && !['new', 'viewed'].includes(candidature.status)) {
      return false;
    }
    if (tabValue === 2 && !['contacted', 'interview', 'offer'].includes(candidature.status)) {
      return false;
    }
    if (tabValue === 3 && !['hired', 'rejected'].includes(candidature.status)) {
      return false;
    }
    
    // Filtre par statut
    if (statusFilter !== 'all' && candidature.status !== statusFilter) {
      return false;
    }
    
    // Filtre par recherche
    if (search) {
      const searchLower = search.toLowerCase();
      return (
        candidature.candidat.prenom.toLowerCase().includes(searchLower) ||
        candidature.candidat.nom.toLowerCase().includes(searchLower) ||
        candidature.candidat.titre.toLowerCase().includes(searchLower) ||
        candidature.offre.titre.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });
  
  // Trier les candidatures
  const sortedCandidatures = [...filteredCandidatures].sort((a, b) => {
    if (sortField === 'date') {
      return sortOrder === 'desc'
        ? new Date(b.date) - new Date(a.date)
        : new Date(a.date) - new Date(b.date);
    }
    if (sortField === 'name') {
      const nameA = `${a.candidat.nom} ${a.candidat.prenom}`.toLowerCase();
      const nameB = `${b.candidat.nom} ${b.candidat.prenom}`.toLowerCase();
      return sortOrder === 'desc'
        ? nameB.localeCompare(nameA)
        : nameA.localeCompare(nameB);
    }
    if (sortField === 'score') {
      return sortOrder === 'desc'
        ? b.candidat.matchScore - a.candidat.matchScore
        : a.candidat.matchScore - b.candidat.matchScore;
    }
    return 0;
  });
  
  // Ouvrir le menu contextuel
  const handleMenuOpen = (event, candidatureId) => {
    setAnchorEl(event.currentTarget);
    setMenuCandidatureId(candidatureId);
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
    setNewNote(candidature.notes);
    setOpenNoteDialog(true);
    handleMenuClose();
  };
  
  // Ouvrir le dialog de refus
  const handleOpenRejectDialog = () => {
    const candidature = candidatures.find(c => c.id === menuCandidatureId);
    setSelectedCandidature(candidature);
    setRejectReason(candidature.rejectReason || '');
    setOpenRejectDialog(true);
    handleMenuClose();
  };
  
  // Mettre à jour le statut d'une candidature
  const handleUpdateStatus = () => {
    // Dans une application réelle, nous enverrions cette action à l'API
    setCandidatures(
      candidatures.map(c =>
        c.id === selectedCandidature.id ? { ...c, status: newStatus } : c
      )
    );
    setOpenStatusDialog(false);
  };
  
  // Mettre à jour la note d'une candidature
  const handleUpdateNote = () => {
    // Dans une application réelle, nous enverrions cette action à l'API
    setCandidatures(
      candidatures.map(c =>
        c.id === selectedCandidature.id ? { ...c, notes: newNote } : c
      )
    );
    setOpenNoteDialog(false);
  };
  
  // Refuser une candidature
  const handleReject = () => {
    // Dans une application réelle, nous enverrions cette action à l'API
    setCandidatures(
      candidatures.map(c =>
        c.id === selectedCandidature.id
          ? { ...c, status: 'rejected', rejectReason }
          : c
      )
    );
    setOpenRejectDialog(false);
  };
  
  // Changer le tri
  const handleSortChange = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };
  
  // Obtenir les initiales pour l'avatar
  const getInitials = (prenom, nom) => {
    return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();
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
      return new Date(dateString).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
      });
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
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
              endIcon={sortField === 'date' && (sortOrder === 'asc' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />)}
              onClick={() => handleSortChange('date')}
              color={sortField === 'date' ? 'primary' : 'inherit'}
              sx={{ minWidth: 'auto' }}
            >
              Date
            </Button>
            <Button
              size="small"
              startIcon={<PersonIcon />}
              endIcon={sortField === 'name' && (sortOrder === 'asc' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />)}
              onClick={() => handleSortChange('name')}
              color={sortField === 'name' ? 'primary' : 'inherit'}
              sx={{ minWidth: 'auto' }}
            >
              Nom
            </Button>
            <Button
              size="small"
              startIcon={<AssignmentIcon />}
              endIcon={sortField === 'score' && (sortOrder === 'asc' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />)}
              onClick={() => handleSortChange('score')}
              color={sortField === 'score' ? 'primary' : 'inherit'}
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
        ) : sortedCandidatures.length === 0 ? (
          <Box textAlign="center" p={4}>
            <Typography variant="body1" color="text.secondary">
              Aucune candidature ne correspond à vos critères.
            </Typography>
          </Box>
        ) : (
          <List sx={{ width: '100%', bgcolor: 'background.paper', p: 0 }}>
            {sortedCandidatures.map((candidature, index) => (
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
                      }
                    >
                      <Avatar
                        src={candidature.candidat.photo}
                        alt={`${candidature.candidat.prenom} ${candidature.candidat.nom}`}
                        sx={{ 
                          width: 56, 
                          height: 56,
                          bgcolor: candidature.status === 'new' ? 'primary.main' : 'grey.400',
                        }}
                      >
                        {getInitials(candidature.candidat.prenom, candidature.candidat.nom)}
                      </Avatar>
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="subtitle1" component="span" fontWeight="medium">
                          {candidature.candidat.prenom} {candidature.candidat.nom}
                        </Typography>
                        {renderStatus(candidature.status)}
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          {candidature.candidat.titre}
                        </Typography>
                        <Typography component="div" variant="body2" color="text.secondary" mt={0.5}>
                          Pour: {candidature.offre.titre}
                        </Typography>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                          <Typography component="span" variant="caption" color="text.secondary">
                            {formatRelativeDate(candidature.date)}
                          </Typography>
                          <Box>
                            {candidature.entretiens.length > 0 && (
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
                {index < sortedCandidatures.length - 1 && <Divider component="li" />}
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
          const candidature = candidatures.find(c => c.id === menuCandidatureId);
          handleContactCandidat(candidature.candidat.id);
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
                Candidature de {selectedCandidature.candidat.prenom} {selectedCandidature.candidat.nom}
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
                Candidature de {selectedCandidature.candidat.prenom} {selectedCandidature.candidat.nom}
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
                Vous êtes sur le point de refuser la candidature de {selectedCandidature.candidat.prenom} {selectedCandidature.candidat.nom}.
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