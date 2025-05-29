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
  TextField,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Divider,
  Badge,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Edit as EditIcon,
  ContentCopy as DuplicateIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Check as CheckIcon,
  Cancel as CancelIcon,
  Build as BuildIcon,
  MoreVert as MoreVertIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { 
  fetchOffres, 
  closeOffre, 
  deleteOffre,
  optimizeOffre,
  selectAllOffres, 
  selectOffreLoading, 
  selectOffrePagination
} from '../../redux/slices/offreSlice';
import OffresList from '../../components/offres/OffresList';
import Loader from '../../components/common/Loader';

/**
 * Page de liste des offres d'emploi
 */
const OffresListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [tabValue, setTabValue] = useState(0);
  const [search, setSearch] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [offreToDelete, setOffreToDelete] = useState(null);
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);
  const [offreToClose, setOffreToClose] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedOffre, setSelectedOffre] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' ou 'grid'
  
  const offres = useSelector(selectAllOffres);
  const loading = useSelector(selectOffreLoading);
  const pagination = useSelector(selectOffrePagination);
  
  // Charger les offres
  useEffect(() => {
    dispatch(fetchOffres({ page: 1, limit: 10 }));
  }, [dispatch]);
  
  // Changement d'onglet
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    
    // Filtrer les offres selon l'onglet
    let status = 'all';
    if (newValue === 1) status = 'active';
    if (newValue === 2) status = 'fermee,pourvue';
    
    dispatch(fetchOffres({ page: 1, limit: 10, status }));
  };
  
  // Recherche d'offres
  const handleSearch = () => {
    dispatch(fetchOffres({ page: 1, limit: 10, search }));
  };
  
  // Ouverture du dialog de suppression
  const handleDeleteDialogOpen = (offre) => {
    setOffreToDelete(offre);
    setDeleteDialogOpen(true);
  };
  
  // Suppression d'une offre
  const handleDeleteOffre = () => {
    if (offreToDelete) {
      dispatch(deleteOffre(offreToDelete.id));
      setDeleteDialogOpen(false);
      setOffreToDelete(null);
    }
  };
  
  // Ouverture du dialog de clôture
  const handleCloseDialogOpen = (offre) => {
    setOffreToClose(offre);
    setCloseDialogOpen(true);
  };
  
  // Clôture d'une offre
  const handleCloseOffre = () => {
    if (offreToClose) {
      dispatch(closeOffre(offreToClose.id));
      setCloseDialogOpen(false);
      setOffreToClose(null);
    }
  };
  
  // Ouverture du menu contextuel
  const handleMenuOpen = (event, offre) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedOffre(offre);
  };
  
  // Fermeture du menu contextuel
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };
  
  // Optimisation d'une offre avec l'IA
  const handleOptimizeOffre = () => {
    if (selectedOffre) {
      dispatch(optimizeOffre(selectedOffre.id));
      handleMenuClose();
    }
  };
  
  // Duplication d'une offre
  const handleDuplicateOffre = () => {
    if (selectedOffre) {
      // Dans une application réelle, nous implémenterions la duplication
      navigate(`/recruteur/offres/nouvelle?duplicate=${selectedOffre.id}`);
      handleMenuClose();
    }
  };
  
  // Filtrer les offres selon la recherche locale
  const filteredOffres = offres.filter(offre => 
    offre.titre.toLowerCase().includes(search.toLowerCase()) ||
    offre.localisation?.toLowerCase().includes(search.toLowerCase())
  );
  
  // Rendu en mode grille
  const renderGridView = () => {
    return (
      <Grid container spacing={2}>
        {filteredOffres.map(offre => (
          <Grid item xs={12} sm={6} md={4} key={offre.id}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                cursor: 'pointer',
                '&:hover': { boxShadow: 4 },
              }}
              onClick={() => navigate(`/recruteur/offres/${offre.id}`)}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                  <Typography variant="h6" component="div" fontWeight="medium">
                    {offre.titre}
                  </Typography>
                  <IconButton 
                    size="small" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMenuOpen(e, offre);
                    }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Box>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {offre.type_contrat || 'CDI'} • {offre.localisation || 'Paris'}
                </Typography>
                
                <Box display="flex" gap={0.5} my={1}>
                  {offre.statut === 'active' ? (
                    <Chip size="small" label="Active" color="success" icon={<CheckIcon />} />
                  ) : offre.statut === 'fermee' ? (
                    <Chip size="small" label="Fermée" color="error" icon={<CancelIcon />} />
                  ) : offre.statut === 'pourvue' ? (
                    <Chip size="small" label="Pourvue" color="secondary" icon={<CheckIcon />} />
                  ) : (
                    <Chip size="small" label={offre.statut || 'Active'} color="default" />
                  )}
                  
                  {offre.urgence && (
                    <Chip size="small" label="Urgent" color="error" />
                  )}
                </Box>
                
                <Box display="flex" alignItems="center" gap={1} mt={2}>
                  <Badge badgeContent={offre.nb_candidatures || 0} color="primary">
                    <PersonIcon color="action" />
                  </Badge>
                  <Typography variant="caption" color="text.secondary">
                    {offre.nb_vues || 0} vues
                  </Typography>
                </Box>
              </CardContent>
              
              <CardActions>
                <Button 
                  size="small" 
                  startIcon={<EditIcon />}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/recruteur/offres/${offre.id}/edit`);
                  }}
                >
                  Modifier
                </Button>
                <Button 
                  size="small" 
                  startIcon={<VisibilityIcon />}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/recruteur/offres/${offre.id}/candidatures`);
                  }}
                >
                  Candidatures
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Offres d'emploi
        </Typography>
        
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/recruteur/offres/nouvelle')}
        >
          Nouvelle offre
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
          <Tab label="Toutes les offres" />
          <Tab 
            label={
              <Badge badgeContent={offres.filter(o => o.statut === 'active').length} color="primary">
                Actives
              </Badge>
            }
          />
          <Tab label="Clôturées" />
        </Tabs>
        
        <Divider />
        
        <Box p={2} display="flex" alignItems="center" justifyContent="space-between">
          <TextField
            placeholder="Rechercher une offre..."
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ width: { xs: '100%', sm: '50%', md: '40%' } }}
          />
          
          <Box display="flex" gap={1}>
            <IconButton 
              color={viewMode === 'list' ? 'primary' : 'default'}
              onClick={() => setViewMode('list')}
            >
              <ViewListIcon />
            </IconButton>
            <IconButton 
              color={viewMode === 'grid' ? 'primary' : 'default'}
              onClick={() => setViewMode('grid')}
            >
              <ViewModuleIcon />
            </IconButton>
          </Box>
        </Box>
      </Paper>
      
      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : filteredOffres.length === 0 ? (
        <Paper elevation={1} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary" paragraph>
            Aucune offre ne correspond à vos critères.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/recruteur/offres/nouvelle')}
          >
            Créer une offre
          </Button>
        </Paper>
      ) : (
        <Paper elevation={1}>
          {viewMode === 'list' ? (
            <OffresList 
              offres={filteredOffres} 
              onDelete={handleDeleteDialogOpen}
              onClose={handleCloseDialogOpen}
            />
          ) : (
            renderGridView()
          )}
        </Paper>
      )}
      
      {/* Menu contextuel */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          navigate(`/recruteur/offres/${selectedOffre?.id}`);
          handleMenuClose();
        }}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit">Voir les détails</Typography>
        </MenuItem>
        <MenuItem onClick={() => {
          navigate(`/recruteur/offres/${selectedOffre?.id}/edit`);
          handleMenuClose();
        }}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit">Modifier</Typography>
        </MenuItem>
        <MenuItem onClick={() => {
          navigate(`/recruteur/offres/${selectedOffre?.id}/candidatures`);
          handleMenuClose();
        }}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit">Voir les candidatures</Typography>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleOptimizeOffre}>
          <ListItemIcon>
            <BuildIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit">Optimiser avec l'IA</Typography>
        </MenuItem>
        <MenuItem onClick={handleDuplicateOffre}>
          <ListItemIcon>
            <DuplicateIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit">Dupliquer</Typography>
        </MenuItem>
        <Divider />
        {selectedOffre?.statut === 'active' && (
          <MenuItem onClick={() => {
            handleCloseDialogOpen(selectedOffre);
            handleMenuClose();
          }}>
            <ListItemIcon>
              <CancelIcon fontSize="small" color="warning" />
            </ListItemIcon>
            <Typography variant="inherit">Clôturer</Typography>
          </MenuItem>
        )}
        <MenuItem onClick={() => {
          handleDeleteDialogOpen(selectedOffre);
          handleMenuClose();
        }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <Typography variant="inherit" color="error">Supprimer</Typography>
        </MenuItem>
      </Menu>
      
      {/* Dialog de confirmation de suppression */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer l'offre "{offreToDelete?.titre}" ?
            Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleDeleteOffre} color="error" variant="contained">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Dialog de confirmation de clôture */}
      <Dialog
        open={closeDialogOpen}
        onClose={() => setCloseDialogOpen(false)}
      >
        <DialogTitle>Confirmer la clôture</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir clôturer l'offre "{offreToClose?.titre}" ?
            Elle ne sera plus visible par les candidats.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCloseDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleCloseOffre} color="primary" variant="contained">
            Clôturer
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default OffresListPage;