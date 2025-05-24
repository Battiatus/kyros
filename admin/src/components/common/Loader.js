import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

/**
 * Composant de chargement pour l'admin
 */
const Loader = ({ message = 'Chargement...', fullScreen = true }) => {
  return (
    <Box
      className={fullScreen ? 'loader-container' : ''}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        ...(fullScreen && {
          minHeight: '100vh',
          backgroundColor: 'background.default'
        })
      }}
    >
      <CircularProgress size={40} thickness={4} />
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
};

export default Loader;