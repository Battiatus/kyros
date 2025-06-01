import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  FormControlLabel,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Divider,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  IconButton
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Save as SaveIcon,
  AccessTime as AccessTimeIcon,
  Event as EventIcon,
  Public as PublicIcon
} from '@mui/icons-material';
import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Thunk pour récupérer les disponibilités
const fetchDisponibilites = createAsyncThunk(
  'availability/fetchDisponibilites',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/availability/${userId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la récupération des disponibilités'
      );
    }
  }
);

// Thunk pour mettre à jour les disponibilités
const updateDisponibilites = createAsyncThunk(
  'availability/updateDisponibilites',
  async ({ userId, disponibilites }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/availability/${userId}`, { disponibilites });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la mise à jour des disponibilités'
      );
    }
  }
);

// Thunk pour ajouter une exception
const addException = createAsyncThunk(
  'availability/addException',
  async ({ userId, exception }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/availability/exceptions`, { 
        utilisateur_id: userId,
        ...exception 
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de l\'ajout de l\'exception'
      );
    }
  }
);

/**
 * Page de gestion des disponibilités pour le candidat
 */
const DisponibilitesPage = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  
  const [disponibilites, setDisponibilites] = useState([]);
  const [exceptions, setExceptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availableImmediately, setAvailableImmediately] = useState(true);
  const [fuzeauHoraire, setFuzeauHoraire] = useState('Europe/Paris');
  const [modeDialog, setModeDialog] = useState(null); // 'add' ou 'edit'
  const [dialogOpen, setDialogOpen] = useState(false);
  const [exceptionDialogOpen, setExceptionDialogOpen] = useState(false);
  const [currentDisponibilite, setCurrentDisponibilite] = useState({
    jour: 1,
    heure_debut: '09:00',
    heure_fin: '18:00',
    recurrence: 'hebdomadaire'
  });
  const [currentException, setCurrentException] = useState({
    date_debut: new Date().toISOString().split('T')[0],
    date_fin: new Date().toISOString().split('T')[0],
    motif: ''
  });
  const [editIndex, setEditIndex] = useState(-1);
  
  // Charger les disponibilités
  useEffect(() => {
    const loadDisponibilites = async () => {
      if (user?.id) {
        try {
          setLoading(true);
          const result = await dispatch(fetchDisponibilites(user.id));
          if (result.payload) {
            setDisponibilites(result.payload.disponibilites || []);
            setExceptions(result.payload.exceptions || []);
            setAvailableImmediately(result.payload.available_immediately || true);
            setFuzeauHoraire(result.payload.fuseau_horaire || 'Europe/Paris');
          }
        } catch (error) {
          console.error('Erreur lors du chargement des disponibilités:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadDisponibilites();
  }, [dispatch, user?.id]);
  
  // Sauvegarder les disponibilités
  const handleSaveDisponibilites = async () => {
    if (user?.id) {
      try {
        setLoading(true);
        await dispatch(updateDisponibilites({
          userId: user.id,
          disponibilites: {
            disponibilites,
            available_immediately: availableImmediately,
            fuseau_horaire: fuzeauHoraire
          }
        }));
      } catch (error) {
        console.error('Erreur lors de la sauvegarde des disponibilités:', error);
      } finally {
        setLoading(false);
      }
    }
  };
  
  // Ajouter/modifier une disponibilité
  const handleOpenDialog = (mode, index = -1) => {
    setModeDialog(mode);
    if (mode === 'edit' && index !== -1) {
      const dispo = disponibilites[index];
      setCurrentDisponibilite({
        ...dispo,
        heure_debut: dispo.heure_debut,
        heure_fin: dispo.heure_fin
      });
      setEditIndex(index);
    } else {
      setCurrentDisponibilite({
        jour: 1,
        heure_debut: '09:00',
        heure_fin: '18:00',
        recurrence: 'hebdomadaire'
      });
      setEditIndex(-1);
    }
    setDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };
  
  const handleSaveDisponibilite = () => {
    const formattedDispo = {
      ...currentDisponibilite,
      heure_debut: currentDisponibilite.heure_debut,
      heure_fin: currentDisponibilite.heure_fin
    };
    
    if (modeDialog === 'edit' && editIndex !== -1) {
      // Modifier une disponibilité existante
      const newDisponibilites = [...disponibilites];
      newDisponibilites[editIndex] = formattedDispo;
      setDisponibilites(newDisponibilites);
    } else {
      // Ajouter une nouvelle disponibilité
      setDisponibilites([...disponibilites, formattedDispo]);
    }
    
    setDialogOpen(false);
    handleSaveDisponibilites();
  };
  
  const handleDeleteDisponibilite = (index) => {
    const newDisponibilites = [...disponibilites];
    newDisponibilites.splice(index, 1);
    setDisponibilites(newDisponibilites);
    handleSaveDisponibilites();
  };
  
  // Gérer les exceptions
  const handleOpenExceptionDialog = () => {
    setCurrentException({
      date_debut: new Date().toISOString().split('T')[0],
      date_fin: new Date().toISOString().split('T')[0],
      motif: ''
    });
    setExceptionDialogOpen(true);
  };
  
  const handleCloseExceptionDialog = () => {
    setExceptionDialogOpen(false);
  };
  
  const handleSaveException = async () => {
    if (user?.id) {
      try {
        setLoading(true);
        const result = await dispatch(addException({
          userId: user.id,
          exception: {
            date_debut: currentException.date_debut,
            date_fin: currentException.date_fin,
            motif: currentException.motif
          }
        }));
        
        if (result.payload) {
          setExceptions([...exceptions, result.payload]);
        }
      } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'exception:', error);
      } finally {
        setLoading(false);
        setExceptionDialogOpen(false);
      }
    }
  };
  
  const handleDeleteException = async (id) => {
    // Implémenter la suppression d'exception
    const newExceptions = exceptions.filter(e => e.id !== id);
    setExceptions(newExceptions);
  };
  
  // Formater le jour de la semaine
  const formatJour = (jour) => {
    const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
    return jours[jour - 1];
  };
  
  // Formater la récurrence
  const formatRecurrence = (recurrence) => {
    switch (recurrence) {
      case 'unique':
        return 'Une seule fois';
      case 'hebdomadaire':
        return 'Chaque semaine';
      case 'mensuelle':
        return 'Chaque mois';
      default:
        return recurrence;
    }
  };
  
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        Mes disponibilités
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Gérez vos disponibilités pour permettre aux recruteurs de planifier des entretiens.
      </Typography>
      
      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Disponibilité immédiate */}
          <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="h6" fontWeight="medium" gutterBottom>
                  Disponibilité générale
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Indiquez si vous êtes disponible immédiatement pour un nouveau poste.
                </Typography>
              </Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={availableImmediately}
                    onChange={(e) => {
                      setAvailableImmediately(e.target.checked);
                      handleSaveDisponibilites();
                    }}
                    color="primary"
                  />
                }
                label={availableImmediately ? "Disponible immédiatement" : "Non disponible immédiatement"}
              />
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box display="flex" alignItems="center" mb={2}>
              <PublicIcon sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary" mr={2}>
                Fuseau horaire :
              </Typography>
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <Select
                  value={fuzeauHoraire}
                  onChange={(e) => {
                    setFuzeauHoraire(e.target.value);
                    handleSaveDisponibilites();
                  }}
                >
                  <MenuItem value="Europe/Paris">Europe/Paris (GMT+1)</MenuItem>
                  <MenuItem value="Europe/London">Europe/London (GMT)</MenuItem>
                  <MenuItem value="America/New_York">America/New_York (GMT-5)</MenuItem>
                  <MenuItem value="Asia/Tokyo">Asia/Tokyo (GMT+9)</MenuItem>
                  <MenuItem value="Australia/Sydney">Australia/Sydney (GMT+11)</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Paper>
          
          {/* Plages horaires */}
          <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" fontWeight="medium">
                Plages horaires disponibles
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog('add')}
              >
                Ajouter
              </Button>
            </Box>
            
            {disponibilites.length === 0 ? (
              <Alert severity="info" sx={{ mb: 2 }}>
                Vous n'avez pas encore défini de plages horaires. Ajoutez-en pour indiquer vos disponibilités.
              </Alert>
            ) : (
              <Grid container spacing={2}>
                {disponibilites.map((dispo, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                        <Box>
                          <Typography variant="subtitle1" fontWeight="medium">
                            {formatJour(dispo.jour)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {dispo.heure_debut} - {dispo.heure_fin}
                          </Typography>
                          <Chip 
                            size="small" 
                            label={formatRecurrence(dispo.recurrence)} 
                            sx={{ mt: 1 }} 
                          />
                        </Box>
                        <Box>
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDialog('edit', index)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteDisponibilite(index)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            )}
          </Paper>
          
          {/* Exceptions (congés, indisponibilités) */}
          <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" fontWeight="medium">
                Périodes d'indisponibilité
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleOpenExceptionDialog}
              >
                Ajouter
              </Button>
            </Box>
            
            {exceptions.length === 0 ? (
              <Alert severity="info">
                Vous n'avez pas encore défini de périodes d'indisponibilité (vacances, congés, etc.).
              </Alert>
            ) : (
              <Grid container spacing={2}>
                {exceptions.map((exception, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                        <Box>
                          <Typography variant="subtitle1" fontWeight="medium">
                            {new Date(exception.date_debut).toLocaleDateString('fr-FR')} - {new Date(exception.date_fin).toLocaleDateString('fr-FR')}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {exception.motif}
                          </Typography>
                        </Box>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteException(exception.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            )}
          </Paper>
        </>
      )}
      
      {/* Dialog d'ajout/modification de disponibilité */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {modeDialog === 'add' ? 'Ajouter une disponibilité' : 'Modifier la disponibilité'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Jour</InputLabel>
                <Select
                  value={currentDisponibilite.jour}
                  onChange={(e) => setCurrentDisponibilite({
                    ...currentDisponibilite,
                    jour: e.target.value
                  })}
                  label="Jour"
                >
                  <MenuItem value={1}>Lundi</MenuItem>
                  <MenuItem value={2}>Mardi</MenuItem>
                  <MenuItem value={3}>Mercredi</MenuItem>
                  <MenuItem value={4}>Jeudi</MenuItem>
                  <MenuItem value={5}>Vendredi</MenuItem>
                  <MenuItem value={6}>Samedi</MenuItem>
                  <MenuItem value={7}>Dimanche</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Heure de début"
                type="time"
                value={currentDisponibilite.heure_debut}
                onChange={(e) => setCurrentDisponibilite({
                  ...currentDisponibilite,
                  heure_debut: e.target.value
                })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Heure de fin"
                type="time"
                value={currentDisponibilite.heure_fin}
                onChange={(e) => setCurrentDisponibilite({
                  ...currentDisponibilite,
                  heure_fin: e.target.value
                })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Récurrence</InputLabel>
                <Select
                  value={currentDisponibilite.recurrence}
                  onChange={(e) => setCurrentDisponibilite({
                    ...currentDisponibilite,
                    recurrence: e.target.value
                  })}
                  label="Récurrence"
                >
                  <MenuItem value="unique">Une seule fois</MenuItem>
                  <MenuItem value="hebdomadaire">Chaque semaine</MenuItem>
                  <MenuItem value="mensuelle">Chaque mois</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button 
            variant="contained" 
            onClick={handleSaveDisponibilite}
            startIcon={<SaveIcon />}
          >
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Dialog d'ajout d'exception */}
      <Dialog open={exceptionDialogOpen} onClose={handleCloseExceptionDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Ajouter une période d'indisponibilité</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date de début"
                type="date"
                value={currentException.date_debut}
                onChange={(e) => setCurrentException({
                  ...currentException,
                  date_debut: e.target.value
                })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date de fin"
                type="date"
                value={currentException.date_fin}
                onChange={(e) => setCurrentException({
                  ...currentException,
                  date_fin: e.target.value
                })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Motif"
                placeholder="Ex: Vacances, Formation, etc."
                value={currentException.motif}
                onChange={(e) => setCurrentException({
                  ...currentException,
                  motif: e.target.value
                })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseExceptionDialog}>Annuler</Button>
          <Button 
            variant="contained" 
            onClick={handleSaveException}
            startIcon={<SaveIcon />}
          >
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DisponibilitesPage;