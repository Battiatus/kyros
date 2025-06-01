import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Divider,
  IconButton,
  CircularProgress,
  Chip,
  LinearProgress,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  ArrowForward as ArrowForwardIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Person as PersonIcon,
  BusinessCenter as BusinessCenterIcon,
  Message as MessageIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import {
  fetchOffres,
  selectAllOffres,
  selectOffreLoading,
  selectOffrePagination,
} from '../../redux/slices/offreSlice';
import { 
  fetchDashboardStats, 
  selectDashboardStats, 
  selectDashboardLoading 
} from '../../redux/slices/statsSlice';
import { fetchCandidatures, selectAllCandidatures, selectCandidatureLoading } from '../../redux/slices/candidatureSlice';
import { selectUser } from '../../redux/slices/authSlice';
import Loader from '../../components/common/Loader';
import StatCard from '../../components/dashboard/StatCard';
import RecentCandidaturesCard from '../../components/dashboard/RecentCandidaturesCard';
import OffresList from '../../components/offres/OffresList';
import { Chart } from 'react-chartjs-2';
import 'chart.js/auto';

/**
 * Tableau de bord du recruteur avec statistiques et accès aux fonctionnalités principales
 */
const DashboardRecruteurPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  
  const user = useSelector(selectUser);
  const offres = useSelector(selectAllOffres);
  const candidatures = useSelector(selectAllCandidatures);
  const offreLoading = useSelector(selectOffreLoading);
  const candidatureLoading = useSelector(selectCandidatureLoading);
  const pagination = useSelector(selectOffrePagination);
  const stats = useSelector(selectDashboardStats);
  const statsLoading = useSelector(selectDashboardLoading);
  
  const loading = offreLoading || candidatureLoading || statsLoading;
  
  // Charger les offres et les statistiques au chargement de la page
  useEffect(() => {
    dispatch(fetchOffres({ page: 1, limit: 5, status: 'active' }));
    dispatch(fetchCandidatures({ page: 1, limit: 5, recent: true }));
    dispatch(fetchDashboardStats());
  }, [dispatch]);
  
  // Données pour le graphique des candidatures
  const chartData = {
    labels: stats?.activityData?.labels || [],
    datasets: [
      {
        label: 'Candidatures',
        data: stats?.activityData?.candidatures || [],
        backgroundColor: theme.palette.primary.main,
        borderColor: theme.palette.primary.main,
        tension: 0.4,
      },
      {
        label: 'Entretiens',
        data: stats?.activityData?.entretiens || [],
        backgroundColor: theme.palette.secondary.main,
        borderColor: theme.palette.secondary.main,
        tension: 0.4,
      },
    ],
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Activité récente',
      },
    },
  };
  
  if (loading && offres.length === 0 && !stats) {
    return <Loader message="Chargement du tableau de bord..." />;
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* En-tête */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Tableau de bord
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/recruteur/offres/nouvelle')}
        >
          Nouvelle offre
        </Button>
      </Box>
      
      {/* Cartes de statistiques */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Offres actives"
            value={stats?.offresActives || 0}
            total={stats?.totalOffres || 0}
            icon={<BusinessCenterIcon />}
            color="#4F46E5"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Candidatures"
            value={stats?.nouvelleCandidatures || 0}
            total={stats?.totalCandidatures || 0}
            icon={<PersonIcon />}
            color="#10B981"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Taux de conversion"
            value={`${stats?.tauxConversion || 0}%`}
            icon={<TrendingUpIcon />}
            color="#F59E0B"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Entretiens prévus"
            value={stats?.entretiensPrevu || 0}
            icon={<MessageIcon />}
            color="#EF4444"
          />
        </Grid>
      </Grid>
      
      {/* Contenu principal */}
      <Grid container spacing={4}>
        {/* Offres actives */}
        <Grid item xs={12} md={7}>
          <Paper elevation={1} sx={{ p: 3, height: '100%' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" fontWeight="bold">
                Offres actives
              </Typography>
              <IconButton size="small" onClick={() => dispatch(fetchOffres({ page: 1, limit: 5 }))}>
                <RefreshIcon />
              </IconButton>
            </Box>
            
            {offreLoading ? (
              <LinearProgress sx={{ my: 4 }} />
            ) : offres.length === 0 ? (
              <Box textAlign="center" py={6}>
                <Typography variant="body1" color="text.secondary" mb={2}>
                  Vous n'avez pas encore d'offres actives.
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/recruteur/offres/nouvelle')}
                >
                  Créer une offre
                </Button>
              </Box>
            ) : (
              <>
                <OffresList offres={offres} compact />
                <Box textAlign="center" mt={2}>
                  <Button
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => navigate('/recruteur/offres')}
                  >
                    Voir toutes les offres
                  </Button>
                </Box>
              </>
            )}
          </Paper>
        </Grid>
        
        {/* Candidatures récentes */}
        <Grid item xs={12} md={5}>
          <Paper elevation={1} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Candidatures récentes
            </Typography>
            <RecentCandidaturesCard candidatures={candidatures} loading={candidatureLoading} />
            <Box textAlign="center" mt={2}>
              <Button
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/recruteur/candidatures')}
              >
                Voir toutes les candidatures
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        {/* Graphique d'activité */}
        <Grid item xs={12}>
          <Paper elevation={1} sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Activité de recrutement
            </Typography>
            <Box height={300}>
              {statsLoading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                  <CircularProgress />
                </Box>
              ) : (
                <Chart type="line" data={chartData} options={chartOptions} />
              )}
            </Box>
          </Paper>
        </Grid>
        
        {/* Actions rapides */}
        <Grid item xs={12}>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Actions rapides
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Profil entreprise
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Complétez et optimisez le profil de votre entreprise.
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    onClick={() => navigate('/recruteur/entreprise/profil')}
                  >
                    Modifier
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Matching candidats
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Découvrez des candidats correspondant à vos critères.
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    onClick={() => navigate('/recruteur/matching')}
                  >
                    Explorer
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Messagerie
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stats?.nouvelleCandidatures > 0 
                      ? `Vous avez ${stats.nouveauxMessages || 0} nouveaux messages.` 
                      : 'Consultez vos conversations avec les candidats.'}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    onClick={() => navigate('/recruteur/messages')}
                  >
                    Ouvrir
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Statistiques
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Analysez les performances de vos offres et recrutements.
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    onClick={() => navigate('/recruteur/statistiques')}
                  >
                    Analyser
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardRecruteurPage;