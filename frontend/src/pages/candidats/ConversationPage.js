import React from 'react';
import { Box, Typography, Paper, TextField, Button, IconButton, Avatar } from '@mui/material';
import { ArrowBack as ArrowBackIcon, Send as SendIcon } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';

/**
 * Page de conversation avec un recruteur
 */
const ConversationPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={() => navigate('/candidat/messages')}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" component="h1" fontWeight="bold">
          Conversation
        </Typography>
      </Box>

      <Paper elevation={1} sx={{ p: 3, borderRadius: 2, height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2 }}>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              Commencez la conversation avec le recruteur...
            </Typography>
          </Box>
        </Box>

        <Box display="flex" alignItems="center">
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Votre message..."
            size="small"
            sx={{ mr: 1 }}
          />
          <Button
            variant="contained"
            endIcon={<SendIcon />}
          >
            Envoyer
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ConversationPage;