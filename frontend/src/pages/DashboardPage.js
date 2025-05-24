import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout, selectUser } from '../redux/slices/authSlice';

/**
 * Page de tableau de bord temporaire
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
          Tableau de bord
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Bienvenue, {user?.prenom} {user?.nom} !
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Rôle: {user?.role}
        </Typography>
      </Box>

      <Box textAlign="center">
        <Button 
          variant="outlined" 
          color="error" 
          onClick={handleLogout}
          sx={{ mt: 2 }}
        >
          Se déconnecter
        </Button>
      </Box>
    </Container>
  );
};

export default DashboardPage;