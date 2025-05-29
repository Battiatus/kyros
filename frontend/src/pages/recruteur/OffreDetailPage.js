import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Divider,
  Chip,
  IconButton,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tab,
  Tabs,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Person as PersonIcon,
  Delete as DeleteIcon,
  Build as BuildIcon,
  ContentCopy as DuplicateIcon,
  Cancel as CancelIcon,
  Check as CheckIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as MoneyIcon,
  Language as LanguageIcon,
  Work as WorkIcon,
  Schedule as ScheduleIcon,
  AccessTime as TimeIcon,
  BarChart as ChartIcon,
  Share as ShareIcon,
} from '@mui/icons-material';
import { 
  fetchOffreById, 
  closeOffre, 
  deleteOffre, 
  optimizeOffre,
  selectCurrentOffre, 
  selectOffreLoading,
  selectOffreStats
} from '../../redux/slices/offreSlice';
import Loader from '../../components/common/Loader';
// import CandidatsList from '../../components/candidats/CandidatsList';
import { Chart } from 'react-chartjs-2';
import 'chart.js/auto';

/**
 * Page de détail d'une offre d'emploi
 */
const OffreDetailPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [tabValue, setTabValue] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);
  const [optimizeDialogOpen, setOptimizeDialogOpen] = useState(false);
  
  const offre = useSelector(selectCurrentOffre);
  const loading = useSelector(selectOffreLoading);
  const stats = useSelector(selectOffreStats);
  
  // Charger l'offre et ses statistiques
  useEffect(() => {
    if (id) {
      dispatch(fetchOffreById(id));
      // Dans une application réelle, nous chargerions également les statistiques
      // dispatch(fetchOffreStats(id));
    }
  }, [dispatch, id]);
  
  // Changement d'onglet
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Supprimer l'offre
  const handleDeleteOffre = () => {
    dispatch(deleteOffre(id)).then((resultAction) => {
      if (resultAction.type === 'offre/deleteOffre/fulfilled') {
        navigate('/recruteur/offres');
      }
    });
    setDeleteDialogOpen(false);
  };
  
  // Clôturer l'offre
  const handleCloseOffre = () => {
    dispatch(closeOffre(id));
    setCloseDialogOpen(false);
  };
  
  // Optimiser l'offre avec l'IA
  const handleOptimizeOffre = () => {
    dispatch(optimizeOffre(id));
    setOptimizeDialogOpen(false);
  };
  
  // Dupliquer l'offre
  const handleDuplicateOffre = () => {
    navigate(`/recruteur/offres/nouvelle?duplicate=${id}`);
  };
  
  // Formater la date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };
  
  // Vérifier si l'offre est active
  const isActive = offre?.statut === 'active';
  
  // Générer les données du graphique pour les vues/candidatures
  const chartData = {
    labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    datasets: [
      {
        label: 'Vues',
        data: [15, 20, 18, 25, 22, 10, 12],
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 2,
        tension: 0.4,
      },
      {
        label: 'Candidatures',
        data: [2, 3, 1, 4, 3, 1, 0],
        backgroundColor: 'rgba(245, 158, 11, 0.2)',
        borderColor: 'rgba(245, 158, 11, 1)',
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };
  
  if (loading && !offre) {
    return <Loader message="Chargement des détails de l'offre..." />;
  }
  
  if (!offre) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={1} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="error" gutterBottom>
            Offre non trouvée
          </Typography>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/recruteur/offres')}
            sx={{ mt: 2 }}
          >
            Retour aux offres
          </Button>
        </Paper>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* En-tête */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/recruteur/offres')}
        >
          Retour aux offres
        </Button>
        
        <Box>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/recruteur/offres/${id}/edit`)}
            sx={{ mr: 1 }}
          >
            Modifier
          </Button>
          <Button
            variant="contained"
            startIcon={<PersonIcon />}
            onClick={() => navigate(`/recruteur/offres/${id}/candidatures`)}
          >
            Candidatures
          </Button>
        </Box>
      </Box>
      
      {/* Contenu principal */}
      <Grid container spacing={3}>
        {/* Détails de l'offre */}
        <Grid item xs={12} md={8}>
          <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="h5" component="h1" fontWeight="bold">
                  {offre.titre}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  {offre.localisation}
                </Typography>
              </Box>
              
              <Box>
                {offre.statut === 'active' ? (
                  <Chip label="Active" color="success" icon={<CheckIcon />} />
                ) : offre.statut === 'fermee' ? (
                  <Chip label="Fermée" color="error" icon={<CancelIcon />} />
                ) : offre.statut === 'pourvue' ? (
                  <Chip label="Pourvue" color="secondary" icon={<CheckIcon />} />
                ) : (
                  <Chip label={offre.statut || 'Active'} color="default" />
                )}
              </Box>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <Box display="flex" alignItems="center">
                  <WorkIcon color="primary" sx={{ mr: 1 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Type de contrat
                    </Typography>
                    <Typography variant="body2">
                      {offre.type_contrat || 'CDI'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Box display="flex" alignItems="center">
                  <MoneyIcon color="primary" sx={{ mr: 1 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Salaire
                    </Typography>
                    <Typography variant="body2">
                      {offre.salaire_min && offre.salaire_max
                        ? `${offre.salaire_min} - ${offre.salaire_max} €`
                        : offre.salaire_min
                        ? `${offre.salaire_min} € minimum`
                        : offre.salaire_max
                        ? `Jusqu'à ${offre.salaire_max} €`
                        : 'Non précisé'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Box display="flex" alignItems="center">
                  <CalendarIcon color="primary" sx={{ mr: 1 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Date de publication
                    </Typography>
                    <Typography variant="body2">
                      {formatDate(offre.date_creation)}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Box display="flex" alignItems="center">
                  <TimeIcon color="primary" sx={{ mr: 1 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Expérience requise
                    </Typography>
                    <Typography variant="body2">
                      {offre.experience_requise || 'Débutant accepté'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Box display="flex" alignItems="center">
                  <ScheduleIcon color="primary" sx={{ mr: 1 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Horaires
                    </Typography>
                    <Typography variant="body2">
                      {offre.horaires || 'Temps plein'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Box display="flex" alignItems="center">
                  <CalendarIcon color="primary" sx={{ mr: 1 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Date d'embauche
                    </Typography>
                    <Typography variant="body2">
                      {formatDate(offre.date_embauche_souhaitee) || 'Dès que possible'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" gutterBottom>
              Description du poste
            </Typography>
            <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-wrap' }}>
              {offre.description}
            </Typography>
            
            {/* Compétences requises */}
            {offre.tags_competences && offre.tags_competences.length > 0 && (
              <>
                <Typography variant="h6" gutterBottom>
                  Compétences requises
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                  {offre.tags_competences.map((competence, index) => (
                    <Chip key={index} label={competence} />
                  ))}
                </Box>
              </>
            )}
            
            {/* Langues requises */}
            {offre.langues_requises && offre.langues_requises.length > 0 && (
              <>
                <Typography variant="h6" gutterBottom>
                  Langues requises
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                  {offre.langues_requises.map((langue, index) => (
                    <Chip
                      key={index}
                      label={langue}
                      icon={<LanguageIcon />}
                      variant="outlined"
                    />
                  ))}
                </Box>
              </>
            )}
          </Paper>
          
          {/* Onglets */}
          <Paper elevation={1} sx={{ mb: 3 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <Tab label="Statistiques" />
              <Tab label="Candidats suggérés" />
            </Tabs>
            
            <Divider />
            
            <Box p={3}>
              {tabValue === 0 ? (
                <>
                  <Typography variant="h6" gutterBottom>
                    Performance de l'offre
                  </Typography>
                  
                  <Grid container spacing={2} mb={3}>
                    <Grid item xs={12} sm={4}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="h5" color="primary">
                            {offre.nb_vues || 0}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Vues totales
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    
                    <Grid item xs={12} sm={4}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="h5" color="secondary">
                            {offre.nb_candidatures || 0}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Candidatures
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    
                    <Grid item xs={12} sm={4}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="h5" color="success.main">
                            {offre.nb_vues && offre.nb_candidatures
                              ? `${Math.round((offre.nb_candidatures / offre.nb_vues) * 100)}%`
                              : '0%'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Taux de conversion
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                  
                  <Typography variant="subtitle1" gutterBottom>
                    Activité des 7 derniers jours
                  </Typography>
                  <Box height={300} mb={3}>
                    <Chart type="line" data={chartData} options={chartOptions} />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" align="center">
                    Passez à la version premium pour accéder à des statistiques avancées
                  </Typography>
                </>
              ) : (
                <>
                  <Typography variant="h6" gutterBottom>
                    Candidats suggérés pour cette offre
                  </Typography>
                  
                  <Typography variant="body2" paragraph>
                    Ces candidats correspondent au profil recherché pour cette offre.
                  </Typography>
                  
                  {/* <CandidatsList /> */}
                </>
              )}
            </Box>
          </Paper>
        </Grid>
        
        {/* Panneau latéral */}
        <Grid item xs={12} md={4}>
          {/* Actions */}
          <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Actions
            </Typography>
            
            <List>
              {isActive && (
                <ListItem disablePadding>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    onClick={() => setCloseDialogOpen(true)}
                    sx={{ justifyContent: 'flex-start', py: 1, mb: 1 }}
                  >
                    Clôturer cette offre
                  </Button>
                </ListItem>
              )}
              
              <ListItem disablePadding>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<BuildIcon />}
                  onClick={() => setOptimizeDialogOpen(true)}
                  sx={{ justifyContent: 'flex-start', py: 1, mb: 1 }}
                >
                  Optimiser avec l'IA
                </Button>
              </ListItem>
              
              <ListItem disablePadding>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<DuplicateIcon />}
                  onClick={handleDuplicateOffre}
                  sx={{ justifyContent: 'flex-start', py: 1, mb: 1 }}
                >
                  Dupliquer cette offre
                </Button>
              </ListItem>
              
              <ListItem disablePadding>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<ShareIcon />}
                  sx={{ justifyContent: 'flex-start', py: 1, mb: 1 }}
                >
                  Partager cette offre
                </Button>
              </ListItem>
              
              <ListItem disablePadding>
                <Button
                  fullWidth
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => setDeleteDialogOpen(true)}
                  sx={{ justifyContent: 'flex-start', py: 1 }}
                >
                  Supprimer cette offre
                </Button>
              </ListItem>
            </List>
          </Paper>
          
          {/* Infos sur l'entreprise */}
          <Paper elevation={1} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Votre entreprise
            </Typography>
            
            <Box display="flex" alignItems="center" mb={2}>
              <Avatar sx={{ width: 50, height: 50, mr: 2, bgcolor: 'primary.main' }}>
                H
              </Avatar>
              <Typography variant="subtitle1">
                {offre.entreprise?.nom || 'Hereoz'}
              </Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="body2" paragraph>
              Cette offre est publiée au nom de votre entreprise. Assurez-vous que votre profil entreprise est complet et attractif.
            </Typography>
            
            <Button
              variant="outlined"
              fullWidth
              onClick={() => navigate('/recruteur/entreprise/profil')}
            >
              Voir le profil entreprise
            </Button>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Dialog de confirmation de suppression */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer l'offre "{offre.titre}" ?
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
            Êtes-vous sûr de vouloir clôturer l'offre "{offre.titre}" ?
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
      
      {/* Dialog d'optimisation IA */}
      <Dialog
        open={optimizeDialogOpen}
        onClose={() => setOptimizeDialogOpen(false)}
      >
        <DialogTitle>Optimisation avec l'IA</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Notre IA va analyser et optimiser votre offre pour la rendre plus attractive et pertinente pour les candidats. Cette action améliorera automatiquement :
          </DialogContentText>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <CheckIcon color="success" />
              </ListItemIcon>
              <ListItemText primary="Le titre et la description du poste" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckIcon color="success" />
              </ListItemIcon>
              <ListItemText primary="Les compétences requises" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckIcon color="success" />
              </ListItemIcon>
              <ListItemText primary="La mise en avant des avantages" />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOptimizeDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleOptimizeOffre} color="primary" variant="contained">
            Optimiser
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default OffreDetailPage;