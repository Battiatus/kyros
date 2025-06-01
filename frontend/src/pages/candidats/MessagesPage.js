import React from 'react';
import { Box, Typography, Paper, Divider, List, ListItem, ListItemText, ListItemAvatar, Avatar, Button } from '@mui/material';
import { Chat as ChatIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

/**
 * Page de messagerie du candidat
 */
const MessagesPage = () => {
  const navigate = useNavigate();

  // Données fictives pour l'exemple
  const conversations = [];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        Mes messages
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Consultez et gérez vos conversations avec les recruteurs.
      </Typography>

      <Paper elevation={1} sx={{ borderRadius: 2 }}>
        {conversations.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <ChatIcon sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.3 }} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Vous n'avez pas encore de messages
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Vos conversations avec les recruteurs apparaîtront ici.
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => navigate('/candidat/swipe')}
              sx={{ mt: 1 }}
            >
              Découvrir des offres
            </Button>
          </Box>
        ) : (
          <List>
            {/* Conversations seraient listées ici */}
          </List>
        )}
      </Paper>
    </Box>
  );
};

export default MessagesPage;