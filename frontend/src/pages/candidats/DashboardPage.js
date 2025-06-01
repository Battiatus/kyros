import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Typography, Box, Card, CardContent, Button, Paper, Divider, Chip } from '@mui/material';
import { 
  Work as WorkIcon, 
  Visibility as VisibilityIcon, 
  CheckCircle as CheckCircleIcon,
  Send as SendIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Components
import StatCard from '../../components/dashboard/StatCard';
import RecentCandidaturesCard from '../../components/dashboard/RecentCandidaturesCard';
import Loader from '../../components/common/Loader';

// Redux actions
import { fetchOffreById, fetchOffres } from '../../redux/slices/offreSlice';
import { selectAllCandidatures, fetchCandidatures } from '../../redux/slices/candidatureSlice';
import { selectDashboardStats, fetchDashboardStats } from '../../redux/slices/statsSlice';
import { selectProfileLoading, selectProfile, fetchProfile } from '../../redux/slices/profileSlice';
import { selectUser } from '../../redux/slices/authSlice';

/**
 * Page du tableau de bord candidat
 */
const DashboardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const user = useSelector(selectUser);
  const profile = useSelector(selectProfile);
  const profileLoading = useSelector(selectProfileLoading);
  const stats = useSelector(selectDashboardStats);
  const candidatures = useSelector(selectAllCandidatures);
  
  const [matchedOffres, setMatchedOffres] = useState([]);
  const [loading, setLoading] = useState(true);

  // Charger les données du dashboard
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        if (user?.id) {
          await Promise.all([
            dispatch(fetchProfile(user.id)),
            dispatch(fetchDashboardStats()),
            dispatch(fetchCandidatures({ user_id: user.id, limit: 5 })),
            dispatch(fetchOffres({ recommended: true, limit: 3 })).then(res => {
              if (res.payload?.data) {
                setMatchedOffres(res.payload.data);
              }
            })
          ]);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [dispatch, user?.id]);

  if (loading || profileLoading) {
    return <Loader />;
  }

  // Calculer le pourcentage de complétion du profil
  const calculateProfileCompletion = () => {
    if (!profile) return 0;
    
    const requiredFields = [
      'nom', 'prenom', 'email', 'telephone', 
      'resume_pro', 'photo_profil', 'experiences', 
      'competences', 'formations', 'langues'
    ];
    
    let filledFields = 0;
    
    requiredFields.forEach(field => {
      if (profile[field] && 
          (typeof profile[field] !== 'object' || 
           (Array.isArray(profile[field]) && profile[field].length > 0) ||
           (Object.keys(profile[field]).length > 0))) {
        filledFields++;
      }
    });
    
    return Math.round((filledFields / requiredFields.length) * 100);
  };

  const profileCompletion = calculateProfileCompletion();

  // Formater les statistiques pour l'affichage
  const formatStatValue = (value) => {
    return value !== undefined ? value : '0';
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        Bonjour, {user?.prenom || 'Candidat'}
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Voici un aperçu de votre activité et des offres qui pourraient vous intéresser.
      </Typography>

      {/* Carte profil - si profil incomplet */}
      {profileCompletion < 100 && (
        <Paper elevation={1} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h6" fontWeight="medium" gutterBottom>
                Complétez votre profil pour augmenter vos chances
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Un profil complet attire 3x plus l'attention des recruteurs
              </Typography>
            </Box>
            <Box textAlign="right">
              <Typography variant="h4" color="primary" fontWeight="bold">
                {profileCompletion}%
              </Typography>
              <Button 
                variant="contained" 
                onClick={() => navigate('/candidat/profil/edit')}
                sx={{ mt: 1 }}
              >
                Compléter
              </Button>
            </Box>
          </Box>
        </Paper>
      )}

      {/* Statistiques */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Vues de profil" 
            value={formatStatValue(stats?.profileViews)} 
            icon={<VisibilityIcon />} 
            color="#3B82F6"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Candidatures" 
            value={formatStatValue(stats?.applications)} 
            icon={<SendIcon />} 
            color="#10B981"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Entretiens" 
            value={formatStatValue(stats?.interviews)} 
            icon={<CalendarIcon />} 
            color="#F59E0B"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Matchs" 
            value={formatStatValue(stats?.matches)} 
            icon={<CheckCircleIcon />} 
            color="#8B5CF6"
          />
        </Grid>
      </Grid>

      {/* Offres recommandées et candidatures récentes */}
      <Grid container spacing={3}>
        {/* Offres recommandées */}
        <Grid item xs={12} md={7}>
          <Card elevation={1} sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight="medium">
                  Offres recommandées
                </Typography>
                <Button 
                  size="small" 
                  onClick={() => navigate('/candidat/offres')}
                >
                  Voir toutes
                </Button>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              {matchedOffres.length === 0 ? (
                <Box textAlign="center" py={4}>
                  <Typography variant="body2" color="text.secondary">
                    Aucune offre recommandée pour le moment.
                  </Typography>
                  <Button 
                    variant="contained" 
                    onClick={() => navigate('/candidat/swipe')}
                    sx={{ mt: 2 }}
                  >
                    Découvrir les offres
                  </Button>
                </Box>
              ) : (
                <>
                  {matchedOffres.map((offre) => (
                    <Paper 
                      key={offre.id} 
                      elevation={0} 
                      sx={{ 
                        p: 2, 
                        mb: 2, 
                        borderRadius: 2,
                        cursor: 'pointer',
                        '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.03)' },
                      }}
                      onClick={() => navigate(`/candidat/offres/${offre.id}`)}
                    >
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                        <Box>
                          <Typography variant="subtitle1" fontWeight="medium">
                            {offre.titre}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {offre.entreprise?.nom || 'Entreprise'} • {offre.localisation || 'Non spécifié'}
                          </Typography>
                          <Box mt={1}>
                            <Chip 
                              size="small" 
                              label={offre.type_contrat || 'CDI'} 
                              sx={{ mr: 1, mb: 1 }} 
                            />
                            {offre.remote && (
                              <Chip 
                                size="small" 
                                label={offre.remote === 'full_remote' ? 'Télétravail' : 'Hybride'} 
                                sx={{ mr: 1, mb: 1 }} 
                              />
                            )}
                            {offre.salaire_min && (
                              <Chip 
                                size="small" 
                                label={`${offre.salaire_min}€ - ${offre.salaire_max || '?'}€`} 
                                sx={{ mr: 1, mb: 1 }} 
                              />
                            )}
                          </Box>
                        </Box>
                        <Chip 
                          label={`${offre.matching || 80}%`} 
                          color="primary" 
                          sx={{ fontWeight: 'bold' }} 
                        />
                      </Box>
                    </Paper>
                  ))}
                  <Box textAlign="center">
                    <Button 
                      variant="contained" 
                      onClick={() => navigate('/candidat/swipe')}
                      endIcon={<WorkIcon />}
                      sx={{ mt: 1 }}
                    >
                      Découvrir plus d'offres
                    </Button>
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        {/* Candidatures récentes */}
        <Grid item xs={12} md={5}>
          <Card elevation={1} sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight="medium">
                  Mes candidatures récentes
                </Typography>
                <Button 
                  size="small" 
                  onClick={() => navigate('/candidat/candidatures')}
                >
                  Voir toutes
                </Button>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <RecentCandidaturesCard candidatures={candidatures} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Prochains entretiens */}
      <Box mt={4}>
        <Card elevation={1}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" fontWeight="medium">
                Mes prochains entretiens
              </Typography>
              <Button 
                size="small" 
                onClick={() => navigate('/candidat/entretiens')}
              >
                Voir tous
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            <Box textAlign="center" py={4}>
              <Typography variant="body2" color="text.secondary">
                Vous n'avez pas d'entretien programmé pour le moment.
              </Typography>
              <Button 
                variant="outlined" 
                onClick={() => navigate('/candidat/swipe')}
                sx={{ mt: 2 }}
              >
                Trouver des offres
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default DashboardPage;