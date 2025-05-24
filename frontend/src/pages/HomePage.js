import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { 
  RestaurantMenu, 
  Hotel, 
  Work, 
  TrendingUp,
  Security,
  Speed
} from '@mui/icons-material';

/**
 * Page d'accueil de l'application
 */
const HomePage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const features = [
    {
      icon: <Work color="primary" sx={{ fontSize: 40 }} />,
      title: 'Matching Intelligent',
      description: 'Notre IA analyse vos compétences et vous propose les offres les plus adaptées à votre profil.'
    },
    {
      icon: <Speed color="primary" sx={{ fontSize: 40 }} />,
      title: 'Recrutement Rapide',
      description: 'Trouvez le candidat idéal en quelques swipes grâce à notre interface intuitive.'
    },
    {
      icon: <Security color="primary" sx={{ fontSize: 40 }} />,
      title: 'Profils Vérifiés',
      description: 'Tous les profils sont vérifiés par des références professionnelles.'
    }
  ];

  const sectors = [
    {
      icon: <RestaurantMenu sx={{ fontSize: 30 }} />,
      title: 'Restauration',
      description: 'Chefs, serveurs, commis...'
    },
    {
      icon: <Hotel sx={{ fontSize: 30 }} />,
      title: 'Hôtellerie',
      description: 'Réception, housekeeping, concierge...'
    },
    {
      icon: <TrendingUp sx={{ fontSize: 30 }} />,
      title: 'Management',
      description: 'Direction, supervision, gestion...'
    }
  ];

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
          py: 2
        }}
      >
        <Container maxWidth="lg">
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography
              variant="h4"
              component="div"
              sx={{
                fontWeight: 700,
                color: 'primary.main'
              }}
            >
              Hereoz
            </Typography>
            <Box display="flex" gap={1}>
              <Button variant="outlined" onClick={() => navigate('/login')}>
                Connexion
              </Button>
              <Button variant="contained" onClick={() => navigate('/register')}>
                Inscription
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant={isMobile ? 'h3' : 'h2'}
            component="h1"
            gutterBottom
            sx={{ fontWeight: 700 }}
          >
            Révolutionnez votre recrutement en hôtellerie-restauration
          </Typography>
          <Typography
            variant="h6"
            sx={{ mb: 4, opacity: 0.9 }}
          >
            La première plateforme de matching intelligent pour connecter les talents 
            et les entreprises du secteur hôtellerie-restauration
          </Typography>
          <Box display="flex" gap={2} justifyContent="center" flexDirection={isMobile ? 'column' : 'row'}>
            <Button
              variant="contained"
              size="large"
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                '&:hover': {
                  bgcolor: 'grey.100'
                }
              }}
              onClick={() => navigate('/register?role=candidat')}
            >
              Je cherche un emploi
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                borderColor: 'white',
                color: 'white',
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)'
                }
              }}
              onClick={() => navigate('/register?role=recruteur')}
            >
              Je recrute
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h3"
          component="h2"
          textAlign="center"
          gutterBottom
          sx={{ fontWeight: 600, mb: 6 }}
        >
          Pourquoi choisir Hereoz ?
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  p: 2,
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)'
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Sectors Section */}
      <Box sx={{ bgcolor: 'background.default', py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            textAlign="center"
            gutterBottom
            sx={{ fontWeight: 600, mb: 6 }}
          >
            Nos secteurs d'expertise
          </Typography>
          <Grid container spacing={4}>
            {sectors.map((sector, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    textAlign: 'center',
                    p: 3,
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  <Box sx={{ mb: 2, color: 'primary.main' }}>
                    {sector.icon}
                  </Box>
                  <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                    {sector.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {sector.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            sx={{ fontWeight: 600 }}
          >
            Prêt à commencer ?
          </Typography>
          <Typography
            variant="h6"
            sx={{ mb: 4, opacity: 0.9 }}
          >
            Rejoignez dès maintenant la communauté Hereoz et donnez un nouveau souffle à votre carrière
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              '&:hover': {
                bgcolor: 'grey.100'
              }
            }}
            onClick={() => navigate('/register')}
          >
            Commencer maintenant
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          bgcolor: 'grey.900',
          color: 'white',
          py: 4,
          textAlign: 'center'
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            © 2025 Hereoz. Tous droits réservés.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;