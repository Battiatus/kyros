import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Paper, 
  Button,
  Card,
  CardContent 
} from '@mui/material';
import { 
  Dashboard,
  People,
  Business,
  Work,
  Payment,
  TrendingUp
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout, selectUser } from '../redux/slices/authSlice';

/**
 * Page de tableau de bord admin
 */
const DashboardPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const statsCards = [
    {
      title: 'Utilisateurs',
      value: '1,234',
      icon: <People sx={{ fontSize: 40, color: 'primary.main' }} />,
      color: '#1976D2'
    },
    {
      title: 'Entreprises',
      value: '89',
      icon: <Business sx={{ fontSize: 40, color: 'success.main' }} />,
      color: '#4CAF50'
    },
    {
      title: 'Offres',
      value: '456',
      icon: <Work sx={{ fontSize: 40, color: 'warning.main' }} />,
      color: '#FF9800'
    },
    {
      title: 'Revenus',
      value: '€12,345',
      icon: <Payment sx={{ fontSize: 40, color: 'error.main' }} />,
      color: '#F44336'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
            <Dashboard sx={{ mr: 2, fontSize: 'inherit' }} />
            Tableau de bord
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Bienvenue, {user?.prenom} {user?.nom} !
          </Typography>
        </Box>
        <Button 
          variant="outlined" 
          color="error" 
          onClick={handleLogout}
        >
          Se déconnecter
        </Button>
      </Box>

      {/* Cartes de statistiques */}
      <Grid container spacing={3} mb={4}>
        {statsCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card 
              className="stat-card"
              sx={{
                background: `linear-gradient(135deg, ${card.color}15 0%, ${card.color}25 100%)`,
                border: `1px solid ${card.color}30`
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography className="stat-number" color={card.color}>
                      {card.value}
                    </Typography>
                    <Typography className="stat-label">
                      {card.title}
                    </Typography>
                  </Box>
                  {card.icon}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Actions rapides */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          Actions rapides
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<People />}
              sx={{ py: 2 }}
            >
              Gérer les utilisateurs
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Business />}
              sx={{ py: 2 }}
            >
              Gérer les entreprises
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Work />}
              sx={{ py: 2 }}
            >
              Voir les offres
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<TrendingUp />}
              sx={{ py: 2 }}
            >
              Statistiques
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Activité récente */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          Activité récente
        </Typography>
        <Typography color="text.secondary">
          Les fonctionnalités détaillées seront implémentées progressivement.
        </Typography>
      </Paper>
    </Container>
  );
};

export default DashboardPage;