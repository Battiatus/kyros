import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  IconButton, 
  Chip, 
  Avatar, 
  Skeleton,
  Paper,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import { 
  Close as CloseIcon, 
  Favorite as FavoriteIcon, 
  Star as StarIcon,
  LocationOn as LocationIcon,
  Euro as EuroIcon,
  WorkOutline as WorkOutlineIcon,
  AccessTime as AccessTimeIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Send as SendIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion';

// Redux actions
import { fetchOffres } from '../../redux/slices/offreSlice';
import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Créer une action thunk pour le swipe
const swipeAction = createAsyncThunk(
  'matches/swipe',
  async ({ offreId, action, motifRejet }, { rejectWithValue }) => {
    try {
      const response = await api.post('/matches/swipe', { 
        offre_id: offreId, 
        action, 
        motif_rejet: motifRejet 
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors du swipe'
      );
    }
  }
);

/**
 * Page de swipe pour les offres
 */
const SwipePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [offres, setOffres] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [rejectionDialog, setRejectionDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [applicationDialog, setApplicationDialog] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState('');
  
  // Références pour l'animation
  const cardRef = useRef(null);
  const controls = useAnimation();
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  // Chargement des offres
  useEffect(() => {
    const loadOffres = async () => {
      try {
        setLoading(true);
        const response = await dispatch(fetchOffres({ matching: true, limit: 20 }));
        if (response.payload?.data) {
          setOffres(response.payload.data);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des offres:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOffres();
  }, [dispatch]);

  // Gestion du swipe
  const handleSwipe = async (direction) => {
    if (loading || !offres[currentIndex]) return;

    const offreId = offres[currentIndex].id;
    
    if (direction === 'right') {
      setApplicationDialog(true);
    } else if (direction === 'left') {
      setRejectionDialog(true);
    } else {
      // Favorite - no dialog needed
      await dispatch(swipeAction({ offreId, action: 'favori' }));
      
      // Update UI
      const newOffres = [...offres];
      newOffres[currentIndex] = {
        ...newOffres[currentIndex],
        favorited: true
      };
      setOffres(newOffres);
    }
  };

  // Animation du swipe
  const handleDrag = (event, info) => {
    x.set(info.offset.x);
  };

  const handleDragEnd = async (event, info) => {
    const offsetX = info.offset.x;
    
    if (offsetX > 100) {
      // Swipe right - like
      controls.start({ 
        x: 500, 
        opacity: 0,
        transition: { duration: 0.3 }
      });
      handleSwipe('right');
    } else if (offsetX < -100) {
      // Swipe left - dislike
      controls.start({ 
        x: -500, 
        opacity: 0,
        transition: { duration: 0.3 } 
      });
      handleSwipe('left');
    } else {
      // Reset position
      controls.start({ 
        x: 0, 
        opacity: 1,
        transition: { type: 'spring', stiffness: 300, damping: 20 } 
      });
    }
  };

  // Confirmer le rejet
  const confirmRejection = async () => {
    if (!offres[currentIndex]) return;
    
    const offreId = offres[currentIndex].id;
    await dispatch(swipeAction({ 
      offreId, 
      action: 'gauche', 
      motifRejet: rejectionReason 
    }));
    
    setRejectionDialog(false);
    setRejectionReason('');
    
    // Attendre la fin de l'animation avant de passer à l'offre suivante
    setTimeout(() => {
      x.set(0);
      setCurrentIndex(prev => prev + 1);
      controls.start({ x: 0, opacity: 1 });
      setExpanded(false);
    }, 300);
  };

  // Confirmer la candidature
  const confirmApplication = async () => {
    if (!offres[currentIndex]) return;
    
    const offreId = offres[currentIndex].id;
    await dispatch(swipeAction({ 
      offreId, 
      action: 'droite', 
      message: applicationMessage 
    }));
    
    setApplicationDialog(false);
    setApplicationMessage('');
    
    // Attendre la fin de l'animation avant de passer à l'offre suivante
    setTimeout(() => {
      x.set(0);
      setCurrentIndex(prev => prev + 1);
      controls.start({ x: 0, opacity: 1 });
      setExpanded(false);
    }, 300);
  };

  // Rendu d'un squelette lors du chargement
  if (loading) {
    return (
      <Box sx={{ p: 3, height: '80vh', display: 'flex', justifyContent: 'center' }}>
        <Card sx={{ width: '100%', maxWidth: 600, height: '70vh', borderRadius: 4 }}>
          <CardContent>
            <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
            <Skeleton variant="text" height={60} sx={{ mt: 2 }} />
            <Skeleton variant="text" height={30} width="60%" />
            <Box sx={{ mt: 2 }}>
              <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2 }} />
            </Box>
            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
              <Skeleton variant="rectangular" width={80} height={30} sx={{ borderRadius: 16 }} />
              <Skeleton variant="rectangular" width={100} height={30} sx={{ borderRadius: 16 }} />
              <Skeleton variant="rectangular" width={90} height={30} sx={{ borderRadius: 16 }} />
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  }

  // Pas d'offres disponibles
  if (!loading && (!offres || offres.length === 0 || currentIndex >= offres.length)) {
    return (
      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
        <Paper elevation={1} sx={{ p: 4, textAlign: 'center', maxWidth: 500, borderRadius: 4 }}>
          <Typography variant="h5" gutterBottom fontWeight="bold">
            Pas d'offres pour le moment
          </Typography>
          <Typography variant="body1" paragraph color="text.secondary">
            Nous n'avons pas trouvé d'offres correspondant à votre profil pour le moment. 
            Revenez plus tard ou ajustez vos préférences.
          </Typography>
          <Box display="flex" justifyContent="center" gap={2} mt={3}>
            <Button 
              variant="outlined" 
              onClick={() => navigate('/candidat/profil/edit')}
            >
              Compléter mon profil
            </Button>
            <Button 
              variant="contained"
              onClick={() => {
                setCurrentIndex(0);
                dispatch(fetchOffres({ matching: true, limit: 20 }));
              }}
            >
              Rafraîchir
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  }

  const currentOffre = offres[currentIndex];

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>
        Découvrir les offres
      </Typography>
      
      {/* Carte principale */}
      <Box sx={{ position: 'relative', width: '100%', maxWidth: 600, height: 'auto' }}>
        <motion.div
          ref={cardRef}
          style={{ 
            x, 
            rotate,
            opacity,
            position: 'relative',
            zIndex: 10
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          animate={controls}
        >
          <Card 
            elevation={4} 
            sx={{ 
              borderRadius: 4,
              overflow: 'hidden',
              transition: 'height 0.3s ease',
              height: expanded ? 'auto' : '70vh',
              maxHeight: '80vh',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Image de l'entreprise */}
            <Box
              sx={{
                height: 180,
                bgcolor: 'primary.light',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative'
              }}
            >
              <Avatar
                src={currentOffre.entreprise?.logo}
                alt={currentOffre.entreprise?.nom}
                sx={{ width: 100, height: 100, border: '4px solid white' }}
              >
                {currentOffre.entreprise?.nom?.charAt(0) || 'E'}
              </Avatar>
              {currentOffre.matching && (
                <Chip
                  label={`${currentOffre.matching}% compatible`}
                  color="primary"
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    fontWeight: 'bold'
                  }}
                />
              )}
            </Box>
            
            <CardContent sx={{ flex: 1, overflow: 'auto' }}>
              <Box>
                <Typography variant="h5" component="div" fontWeight="bold" gutterBottom>
                  {currentOffre.titre}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  {currentOffre.entreprise?.nom || 'Entreprise'}
                </Typography>
                
                {/* Tags/infos importantes */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  <Chip 
                    icon={<WorkOutlineIcon />} 
                    label={currentOffre.type_contrat || 'CDI'} 
                  />
                  <Chip 
                    icon={<LocationIcon />} 
                    label={currentOffre.localisation || 'Non spécifié'} 
                  />
                  {currentOffre.salaire_min && (
                    <Chip 
                      icon={<EuroIcon />} 
                      label={`${currentOffre.salaire_min}€ - ${currentOffre.salaire_max || '?'}€`} 
                    />
                  )}
                  {currentOffre.horaires && (
                    <Chip 
                      icon={<AccessTimeIcon />} 
                      label={currentOffre.horaires} 
                    />
                  )}
                  {currentOffre.remote && (
                    <Chip 
                      label={currentOffre.remote === 'full_remote' ? 'Télétravail' : 'Hybride'} 
                    />
                  )}
                  {currentOffre.experience_requise && (
                    <Chip 
                      label={`Exp. ${currentOffre.experience_requise} an${currentOffre.experience_requise > 1 ? 's' : ''}`} 
                    />
                  )}
                </Box>
                
                {/* Description */}
                <Typography variant="body2" paragraph>
                  {expanded 
                    ? currentOffre.description 
                    : `${currentOffre.description?.substring(0, 150)}${currentOffre.description?.length > 150 ? '...' : ''}`}
                </Typography>
                
                {/* Bouton pour voir plus/moins */}
                {currentOffre.description?.length > 150 && (
                  <Button 
                    endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    onClick={() => setExpanded(!expanded)}
                    sx={{ mb: 2 }}
                    size="small"
                  >
                    {expanded ? 'Voir moins' : 'Voir plus'}
                  </Button>
                )}
                
                {/* Compétences requises */}
                {currentOffre.tags_competences && currentOffre.tags_competences.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                      Compétences requises
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {currentOffre.tags_competences.map((competence, index) => (
                        <Chip 
                          key={index} 
                          label={competence} 
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>
                )}
                
                {/* Langues requises */}
                {currentOffre.langues_requises && currentOffre.langues_requises.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                      Langues requises
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {currentOffre.langues_requises.map((langue, index) => (
                        <Chip 
                          key={index} 
                          label={`${langue.langue} (${langue.niveau})`} 
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      </Box>
      
      {/* Boutons d'action */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
        <IconButton 
          color="error" 
          sx={{ bgcolor: '#ffebee', p: 2 }}
          onClick={() => handleSwipe('left')}
        >
          <CloseIcon fontSize="large" />
        </IconButton>
        
        <IconButton 
          color="warning" 
          sx={{ bgcolor: '#fff8e1', p: 2 }}
          onClick={() => handleSwipe('favorite')}
        >
          <StarIcon fontSize="large" />
        </IconButton>
        
        <IconButton 
          color="success" 
          sx={{ bgcolor: '#e8f5e9', p: 2 }}
          onClick={() => handleSwipe('right')}
        >
          <FavoriteIcon fontSize="large" />
        </IconButton>
      </Box>
      
      {/* Légende explicative */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Typography variant="caption" color="text.secondary" align="center">
          <InfoIcon fontSize="inherit" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
          Faites glisser à droite pour postuler, à gauche pour passer
        </Typography>
      </Box>
      
      {/* Dialog de rejet */}
      <Dialog 
        open={rejectionDialog} 
        onClose={() => setRejectionDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Pourquoi cette offre ne vous intéresse pas ?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" paragraph>
            Votre feedback nous aide à améliorer nos suggestions futures.
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            placeholder="Ex: Trop loin de chez moi, salaire insuffisant, etc."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectionDialog(false)}>
            Annuler
          </Button>
          <Button 
            variant="contained" 
            onClick={confirmRejection}
          >
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Dialog de candidature */}
      <Dialog 
        open={applicationDialog} 
        onClose={() => setApplicationDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Postuler à "{currentOffre?.titre}"</DialogTitle>
        <DialogContent>
          <Typography variant="body2" paragraph>
            Ajouter un message personnalisé à votre candidature (optionnel) :
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            placeholder="Présentez-vous brièvement et expliquez pourquoi vous êtes intéressé(e) par ce poste..."
            value={applicationMessage}
            onChange={(e) => setApplicationMessage(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApplicationDialog(false)}>
            Annuler
          </Button>
          <Button 
            variant="contained" 
            endIcon={<SendIcon />}
            onClick={confirmApplication}
          >
            Postuler
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SwipePage;