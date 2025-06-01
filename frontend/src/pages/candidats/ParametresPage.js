import React from 'react';
import { Box, Typography, Paper, Divider, Switch, FormControlLabel, Button, List, ListItem, ListItemText } from '@mui/material';

/**
 * Page de paramètres du candidat
 */
const ParametresPage = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        Paramètres
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Configurez vos préférences et gérez votre compte.
      </Typography>

      <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Typography variant="h6" fontWeight="medium" gutterBottom>
          Notifications
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <List>
          <ListItem>
            <ListItemText 
              primary="Notifications par email" 
              secondary="Recevoir des notifications par email" 
            />
            <FormControlLabel 
              control={<Switch defaultChecked />} 
              label="" 
            />
          </ListItem>
          <Divider component="li" />
          
          <ListItem>
            <ListItemText 
              primary="Notifications push" 
              secondary="Recevoir des notifications dans l'application" 
            />
            <FormControlLabel 
              control={<Switch defaultChecked />} 
              label="" 
            />
          </ListItem>
          <Divider component="li" />
          
          <ListItem>
            <ListItemText 
              primary="Alertes nouvelles offres" 
              secondary="Être alerté des nouvelles offres correspondant à votre profil" 
            />
            <FormControlLabel 
              control={<Switch defaultChecked />} 
              label="" 
            />
          </ListItem>
        </List>
      </Paper>

      <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" fontWeight="medium" gutterBottom color="error">
          Danger zone
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Typography variant="body2" paragraph>
          Attention, ces actions sont irréversibles.
        </Typography>
        
        <Button variant="outlined" color="error">
          Supprimer mon compte
        </Button>
      </Paper>
    </Box>
  );
};

export default ParametresPage;