import React from 'react';
import { Box, Typography, Paper, Button, Divider, Tab, Tabs } from '@mui/material';
import { Event as EventIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

/**
 * Page de gestion des entretiens du candidat
 */
const EntretiensPage = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = React.useState(0);

  // Données fictives pour l'exemple
  const entretiens = [];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        Mes entretiens
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Consultez et préparez vos entretiens avec les recruteurs.
      </Typography>

      <Paper elevation={1} sx={{ mb: 3, borderRadius: 2 }}>
        <Tabs 
          value={tabValue} 
          onChange={(e, newValue) => setTabValue(newValue)}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="À venir" />
          <Tab label="Passés" />
          <Tab label="Annulés" />
        </Tabs>
      </Paper>

      <Paper elevation={1} sx={{ borderRadius: 2 }}>
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <EventIcon sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.3 }} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Vous n'avez pas d'entretien prévu
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Vos entretiens avec les recruteurs apparaîtront ici.
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/candidat/swipe')}
            sx={{ mt: 1 }}
          >
            Découvrir des offres
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default EntretiensPage;