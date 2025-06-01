import React from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent } from '@mui/material';
import { BarChart as BarChartIcon } from '@mui/icons-material';

/**
 * Page de statistiques du candidat
 */
const StatistiquesPage = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        Mes statistiques
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Suivez l'évolution de votre activité et de vos performances.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={1} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Typography variant="h6" fontWeight="medium" gutterBottom>
              Activité de profil
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
              <BarChartIcon sx={{ fontSize: 80, color: 'text.secondary', opacity: 0.3 }} />
            </Box>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              Les statistiques de visualisation de votre profil seront disponibles ici.
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper elevation={1} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Typography variant="h6" fontWeight="medium" gutterBottom>
              Candidatures
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
              <BarChartIcon sx={{ fontSize: 80, color: 'text.secondary', opacity: 0.3 }} />
            </Box>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              Les statistiques de vos candidatures seront disponibles ici.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StatistiquesPage;