import React from 'react';
import { Container, Typography, Box, Button, Grid, Paper, Card, CardContent } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout, selectUser } from '../../redux/slices/authSlice';

/**
 * Page de tableau de bord pour les candidats
 */
const DashboardPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box textAlign="center" mb={4}>
        <Typography variant="h3" component="h1" gutterBottom>
          Tableau de bord Candidat
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Bienvenue, {user?.prenom} {user?.nom} !
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              Votre recherche d'emploi
            </Typography>
            <Typography variant="body1" paragraph>
              Vous n'avez pas encore de candidatures actives. Commencez à explorer les offres d'emploi pour trouver votre prochain poste!
            </Typography>
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => navigate('/candidat/offres')}
            >
              Explorer les offres
            </Button>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Améliorer votre profil
            </Typography>
            <Typography variant="body1" paragraph>
              Un profil complet augmente vos chances d'être remarqué par les recruteurs.
            </Typography>
            <Button 
              variant="outlined" 
              color="primary"
              onClick={() => navigate('/candidat/profil')}
            >
              Compléter mon profil
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Statistiques
              </Typography>
              <Box sx={{ my: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Vues de profil
                </Typography>
                <Typography variant="h4">
                  0
                </Typography>
              </Box>
              <Box sx={{ my: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Candidatures
                </Typography>
                <Typography variant="h4">
                  0
                </Typography>
              </Box>
              <Box sx={{ my: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Entretiens
                </Typography>
                <Typography variant="h4">
                  0
                </Typography>
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Actions rapides
              </Typography>
              <Button 
                fullWidth 
                variant="outlined" 
                sx={{ mb: 1 }}
                onClick={() => navigate('/candidat/messages')}
              >
                Messages
              </Button>
              <Button 
                fullWidth 
                variant="outlined" 
                sx={{ mb: 1 }}
                onClick={() => navigate('/candidat/parametres')}
              >
                Paramètres
              </Button>
              <Button 
                fullWidth 
                variant="outlined" 
                color="error"
                onClick={handleLogout}
              >
                Déconnexion
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardPage;