import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Tab,
  Tabs,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
} from '@mui/material';
import {
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  TrendingUp as TrendingUpIcon,
  GetApp as DownloadIcon,
} from '@mui/icons-material';
import { Chart } from 'react-chartjs-2';
import 'chart.js/auto';

/**
 * Page de statistiques et analyses
 */
const StatistiquesPage = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [period, setPeriod] = useState('month');
  const [statData, setStatData] = useState(null);
  
  // Charger les données de statistiques
  useEffect(() => {
    // Dans une application réelle, nous ferions un appel API
    setLoading(true);
    
    // Simulation de délai réseau avec données fictives
    setTimeout(() => {
      const mockStatData = {
        overview: {
          totalOffres: 12,
          activeOffres: 8,
          totalCandidatures: 47,
          tauxConversion: 68,
          moyenneMatchScore: 72,
        },
        views: {
          labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai'],
          datasets: [200, 320, 280, 390, 420],
        },
        applications: {
          labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai'],
          datasets: [12, 24, 18, 32, 47],
        },
        offreStats: [
          {
            id: 1,
            titre: 'Chef de Rang - Restaurant Le Gourmet',
            vues: 180,
            candidatures: 15,
            tauxConversion: 8.3,
            matchScoreMoyen: 76,
          },
          {
            id: 2,
            titre: 'Barman expérimenté - Bar Le Cocktail',
            vues: 120,
            candidatures: 8,
            tauxConversion: 6.7,
            matchScoreMoyen: 68,
          },
          {
            id: 3,
            titre: 'Second de cuisine - Restaurant Le Gourmet',
            vues: 150,
            candidatures: 12,
            tauxConversion: 8.0,
            matchScoreMoyen: 72,
          },
          {
            id: 4,
            titre: 'Réceptionniste - Hôtel Le Palace',
            vues: 200,
            candidatures: 18,
            tauxConversion: 9.0,
            matchScoreMoyen: 82,
          },
        ],
        sourcesRecruitment: {
          labels: ['Recherche', 'Matching IA', 'Invitations', 'Partage'],
          data: [40, 30, 20, 10],
        },
        interviewStats: {
          scheduled: 12,
          completed: 8,
          cancelled: 2,
          pending: 2,
        },
        candidateStatus: {
          labels: ['Nouveau', 'Vu', 'Contacté', 'Entretien', 'Offre', 'Embauché', 'Refusé'],
          data: [12, 8, 6, 4, 2, 1, 3],
        },
      };
      
      setStatData(mockStatData);
      setLoading(false);
    }, 1500);
  }, [period]);
  
  // Changer d'onglet
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Changer la période
  const handlePeriodChange = (event) => {
    setPeriod(event.target.value);
  };
  
  // Données pour le graphique des vues
  const viewsChartData = {
    labels: statData?.views.labels || [],
    datasets: [
      {
        label: 'Vues des offres',
        data: statData?.views.datasets || [],
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };
  
  // Données pour le graphique des candidatures
  const applicationsChartData = {
    labels: statData?.applications.labels || [],
    datasets: [
      {
        label: 'Candidatures reçues',
        data: statData?.applications.datasets || [],
        backgroundColor: 'rgba(245, 158, 11, 0.2)',
        borderColor: 'rgba(245, 158, 11, 1)',
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };
  
  // Données pour le graphique des sources de recrutement
  const sourcesChartData = {
    labels: statData?.sourcesRecruitment.labels || [],
    datasets: [
      {
        data: statData?.sourcesRecruitment.data || [],
        backgroundColor: [
          'rgba(99, 102, 241, 0.7)',
          'rgba(245, 158, 11, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(239, 68, 68, 0.7)',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  // Données pour le graphique des statuts de candidats
  const statusChartData = {
    labels: statData?.candidateStatus.labels || [],
    datasets: [
      {
        label: 'Candidats par statut',
        data: statData?.candidateStatus.data || [],
        backgroundColor: [
          'rgba(99, 102, 241, 0.7)',
          'rgba(107, 114, 128, 0.7)',
          'rgba(59, 130, 246, 0.7)',
          'rgba(139, 92, 246, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(5, 150, 105, 0.7)',
          'rgba(239, 68, 68, 0.7)',
        ],
      },
    ],
  };
  
  // Options de graphique
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };
  
  // Options de graphique pour les camemberts
  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
    },
  };
  
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Statistiques et Analyses
        </Typography>
        
        <Box display="flex" gap={2}>
          <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Période</InputLabel>
            <Select
              value={period}
              onChange={handlePeriodChange}
              label="Période"
            >
              <MenuItem value="week">Semaine</MenuItem>
              <MenuItem value="month">Mois</MenuItem>
              <MenuItem value="quarter">Trimestre</MenuItem>
              <MenuItem value="year">Année</MenuItem>
            </Select>
          </FormControl>
          
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
          >
            Exporter
          </Button>
        </Box>
      </Box>
      
      {/* Vue d'ensemble */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <BarChartIcon sx={{ mr: 1 }} />
                Activité
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Offres actives
                    </Typography>
                    <Typography variant="h4">
                      {statData.overview.activeOffres}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      sur {statData.overview.totalOffres} au total
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Candidatures
                    </Typography>
                    <Typography variant="h4">
                      {statData.overview.totalCandidatures}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUpIcon sx={{ mr: 1 }} />
                Conversion
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Taux moyen
                    </Typography>
                    <Typography variant="h4">
                      {statData.overview.tauxConversion}%
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      vues / candidatures
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Score de match
                    </Typography>
                    <Typography variant="h4">
                      {statData.overview.moyenneMatchScore}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      moyenne
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <PieChartIcon sx={{ mr: 1 }} />
                Entretiens
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Planifiés
                    </Typography>
                    <Typography variant="h4">
                      {statData.interviewStats.scheduled}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Réalisés
                    </Typography>
                    <Typography variant="h4">
                      {statData.interviewStats.completed}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {Math.round(statData.interviewStats.completed / statData.interviewStats.scheduled * 100)}% de complétion
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Onglets de statistiques */}
      <Paper elevation={1} sx={{ mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Aperçu" />
          <Tab label="Offres" />
          <Tab label="Candidatures" />
        </Tabs>
        
        <Divider />
        
        <Box p={3}>
          {/* Aperçu */}
          {tabValue === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Vues des offres
                </Typography>
                <Box height={300} mb={4}>
                  <Chart type="line" data={viewsChartData} options={chartOptions} />
                </Box>
                
                <Typography variant="h6" gutterBottom>
                  Candidatures reçues
                </Typography>
                <Box height={300}>
                  <Chart type="line" data={applicationsChartData} options={chartOptions} />
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Sources des candidatures
                </Typography>
                <Box height={300} mb={4}>
                  <Chart type="pie" data={sourcesChartData} options={pieChartOptions} />
                </Box>
                
                <Typography variant="h6" gutterBottom>
                  Statuts des candidats
                </Typography>
                <Box height={300}>
                  <Chart type="pie" data={statusChartData} options={pieChartOptions} />
                </Box>
              </Grid>
            </Grid>
          )}
          
          {/* Statistiques des offres */}
          {tabValue === 1 && (
            <>
              <Typography variant="h6" gutterBottom>
                Performance par offre
              </Typography>
              
              <Card variant="outlined">
                <CardHeader
                  title={
                    <Grid container>
                      <Grid item xs={4} md={5}>
                        <Typography variant="subtitle2">Titre de l'offre</Typography>
                      </Grid>
                      <Grid item xs={2} md={2} sx={{ textAlign: 'center' }}>
                        <Typography variant="subtitle2">Vues</Typography>
                      </Grid>
                      <Grid item xs={2} md={2} sx={{ textAlign: 'center' }}>
                        <Typography variant="subtitle2">Candidatures</Typography>
                      </Grid>
                      <Grid item xs={2} md={1.5} sx={{ textAlign: 'center' }}>
                        <Typography variant="subtitle2">Conversion</Typography>
                      </Grid>
                      <Grid item xs={2} md={1.5} sx={{ textAlign: 'center' }}>
                        <Typography variant="subtitle2">Score moyen</Typography>
                      </Grid>
                    </Grid>
                  }
                />
                <Divider />
                <Box>
                  {statData.offreStats.map((offre, index) => (
                    <React.Fragment key={offre.id}>
                      <Box p={2}>
                        <Grid container alignItems="center">
                          <Grid item xs={4} md={5}>
                            <Typography variant="body2" noWrap>{offre.titre}</Typography>
                          </Grid>
                          <Grid item xs={2} md={2} sx={{ textAlign: 'center' }}>
                            <Typography variant="body2">{offre.vues}</Typography>
                          </Grid>
                          <Grid item xs={2} md={2} sx={{ textAlign: 'center' }}>
                            <Typography variant="body2">{offre.candidatures}</Typography>
                          </Grid>
                          <Grid item xs={2} md={1.5} sx={{ textAlign: 'center' }}>
                            <Typography variant="body2">{offre.tauxConversion}%</Typography>
                          </Grid>
                          <Grid item xs={2} md={1.5} sx={{ textAlign: 'center' }}>
                            <Typography variant="body2">{offre.matchScoreMoyen}</Typography>
                          </Grid>
                        </Grid>
                      </Box>
                      {index < statData.offreStats.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </Box>
              </Card>
              
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/recruteur/offres')}
                >
                  Voir toutes les offres
                </Button>
              </Box>
            </>
          )}
          
          {/* Statistiques des candidatures */}
          {tabValue === 2 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Statuts des candidatures
                </Typography>
                <Box height={300}>
                  <Chart type="bar" data={statusChartData} options={chartOptions} />
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Sources des candidatures
                </Typography>
                <Box height={300}>
                  <Chart type="doughnut" data={sourcesChartData} options={pieChartOptions} />
                </Box>
              </Grid>
              
              <Grid item xs={12}>
                <Card sx={{ mt: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Insights sur les candidatures
                    </Typography>
                    <Typography variant="body2" paragraph>
                      Les candidatures proviennent principalement de la fonctionnalité de recherche (40%) et du matching IA (30%). Le score moyen de matching est de {statData.overview.moyenneMatchScore}, ce qui indique une bonne adéquation entre vos offres et les candidats.
                    </Typography>
                    <Typography variant="body2" paragraph>
                      Pour améliorer vos résultats, vous pourriez:
                    </Typography>
                    <Box component="ul" sx={{ pl: 2 }}>
                      <Typography component="li" variant="body2">
                        Optimiser vos offres avec l'IA pour augmenter leur attractivité
                      </Typography>
                      <Typography component="li" variant="body2">
                        Compléter votre profil entreprise pour attirer plus de candidats qualifiés
                      </Typography>
                      <Typography component="li" variant="body2">
                        Répondre plus rapidement aux candidatures (délai moyen actuel: 2.3 jours)
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </Box>
      </Paper>
      
      <Typography variant="body2" color="text.secondary" align="center">
        Pour accéder à des analyses plus détaillées et des statistiques avancées, passez à la version premium.
      </Typography>
    </Container>
  );
};

export default StatistiquesPage;