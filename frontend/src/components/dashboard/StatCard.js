import React from 'react';
import { Box, Card, CardContent, Typography, Avatar } from '@mui/material';

/**
 * Carte de statistique avec icône et valeur
 * 
 * @param {Object} props - Propriétés du composant
 * @param {string} props.title - Titre de la statistique
 * @param {string|number} props.value - Valeur principale
 * @param {string|number} props.total - Valeur totale (optionnelle)
 * @param {React.ReactNode} props.icon - Icône à afficher
 * @param {string} props.color - Couleur de l'icône et de la barre de progression
 * @returns {JSX.Element} Composant StatCard
 */
const StatCard = ({ title, value, total, icon, color }) => {
  return (
    <Card elevation={1} sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
          <Avatar
            sx={{
              bgcolor: `${color}20`,
              color: color,
              width: 36,
              height: 36,
            }}
          >
            {icon}
          </Avatar>
        </Box>
        <Typography variant="h4" component="div" fontWeight="bold">
          {value}
        </Typography>
        {total && (
          <Typography variant="body2" color="text.secondary">
            sur {total} au total
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;