import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormLabel,
  Autocomplete,
  CircularProgress,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Avatar,
  Card,
  CardContent,
  Alert,
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  VideoCall as VideoCallIcon,
  Event as EventIcon,
  PersonSearch as PersonSearchIcon,
  WorkOutline as WorkOutlineIcon,
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

/**
 * Page de création d'un entretien
 */
const EntretienCreationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [candidats, setCandidats] = useState([]);
  const [offres, setOffres] = useState([]);
  const [selectedCandidat, setSelectedCandidat] = useState(null);
  const [selectedOffre, setSelectedOffre] = useState(null);
  const [searchCandidatDialogOpen, setSearchCandidatDialogOpen] = useState(false);
  const [searchOffreDialogOpen, setSearchOffreDialogOpen] = useState(false);
  const [candidatSearch, setCandidatSearch] = useState('');
  const [offreSearch, setOffreSearch] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  
  // Extraire les paramètres de l'URL
  const queryParams = new URLSearchParams(location.search);
  const candidatureId = queryParams.get('candidature');
  const candidatId = queryParams.get('candidat');
  const offreId = queryParams.get('offre');
  
  // Charger les données
  useEffect(() => {
    // Dans une application réelle, nous ferions des appels API
    setLoading(true);
    
    // Simulation de délai réseau avec données fictives
    setTimeout(() => {
      // Liste de candidats
      const mockCandidats = [
        {
          id: 101,
          prenom: 'Marie',
          nom: 'Dupont',
          photo: null,
          titre: 'Chef de Rang',
          email: 'marie.dupont@email.com',
        },
        {
          id: 102,
          prenom: 'Thomas',
          nom: 'Martin',
          photo: null,
          titre: 'Barman',
          email: 'thomas.martin@email.com',
        },
        {
          id: 103,
          prenom: 'Sophie',
          nom: 'Bernard',
          photo: null,
          titre: 'Serveuse',
          email: 'sophie.bernard@email.com',
        },
        {
          id: 104,
          prenom: 'Lucas',
          nom: 'Petit',
          photo: null,
          titre: 'Second de cuisine',
          email: 'lucas.petit@email.com',
        },
        {
          id: 105,
          prenom: 'Emma',
          nom: 'Leroy',
          photo: null,
          titre: 'Réceptionniste',
          email: 'emma.leroy@email.com',
        },
      ];
      
      // Liste d'offres
      const mockOffres = [
        {
          id: 201,
          titre: 'Chef de Rang - Restaurant Le Gourmet',
          type_contrat: 'CDI',
          localisation: 'Paris',
        },
        {
          id: 202,
          titre: 'Barman expérimenté - Bar Le Cocktail',
          type_contrat: 'CDI',
          localisation: 'Lyon',
        },
        {
          id: 203,
          titre: 'Second de cuisine - Restaurant Le Gourmet',
          type_contrat: 'CDI',
          localisation: 'Paris',
        },
        {
          id: 204,
          titre: 'Réceptionniste - Hôtel Le Palace',
          type_contrat: 'CDD',
          localisation: 'Nice',
        },
        {
          id: 205,
          titre: 'Sommelier - Restaurant Le Gourmet',
          type_contrat: 'CDI',
          localisation: 'Paris',
        },
      ];
      
      setCandidats(mockCandidats);
      setOffres(mockOffres);
      
      // Pré-sélectionner le candidat si l'ID est fourni
      if (candidatId) {
        const candidat = mockCandidats.find(c => c.id === parseInt(candidatId));
        if (candidat) {
          setSelectedCandidat(candidat);
        }
      }
      
      // Pré-sélectionner l'offre si l'ID est fourni
      if (offreId) {
        const offre = mockOffres.find(o => o.id === parseInt(offreId));
        if (offre) {
          setSelectedOffre(offre);
        }
      }
      
      // Si une candidature est fournie, charger le candidat et l'offre associés
      if (candidatureId) {
        // Dans une application réelle, nous chargerions les données de la candidature
        // Pour cet exemple, nous simulons une candidature
        setSelectedCandidat(mockCandidats[0]);
        setSelectedOffre(mockOffres[0]);
      }
      
      setLoading(false);
    }, 1000);
  }, [candidatureId, candidatId, offreId]);
  
  // Validation du formulaire
  const validationSchema = Yup.object({
    type: Yup.string().required('Type d\'entretien requis'),
    date: Yup.date()
      .required('Date requise')
      .min(new Date(), 'La date doit être future'),
    heure: Yup.string().required('Heure requise'),
    duree: Yup.number()
      .required('Durée requise')
      .min(15, 'La durée minimum est de 15 minutes')
      .max(180, 'La durée maximum est de 3 heures'),
    notes: Yup.string(),
  });
  
  // Gestion du formulaire
  const formik = useFormik({
    initialValues: {
      type: 'video',
      date: '',
      heure: '',
      duree: 45,
      lieu: '',
      notes: '',
    },
    validationSchema,
    onSubmit: (values) => {
      // Vérifier que le candidat et l'offre sont sélectionnés
      if (!selectedCandidat || !selectedOffre) {
        return;
      }
      
      // Dans une application réelle, nous enverrions cette action à l'API
      console.log('Entretien créé:', {
        ...values,
        candidat: selectedCandidat,
        offre: selectedOffre,
      });
      
      // Redirection vers la liste des entretiens
      navigate('/recruteur/entretiens');
    },
  });
  
  // Générer un lien d'entretien visio
  const generateVideoLink = () => {
    return `https://meet.hereoz.com/entretien/${Math.random().toString(36).substring(2, 8)}`;
  };
  
  // Obtenir les initiales pour l'avatar
  const getInitials = (prenom, nom) => {
    return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();
  };
  
  // Gérer le changement de type d'entretien
  const handleTypeChange = (e) => {
    const newType = e.target.value;
    formik.setFieldValue('type', newType);
    
    // Si le type est changé en visio, effacer le lieu
    if (newType === 'video') {
      formik.setFieldValue('lieu', '');
    }
  };
  
  // Sélectionner un candidat
  const handleCandidatSelect = (candidat) => {
    setSelectedCandidat(candidat);
    setSearchCandidatDialogOpen(false);
  };
  
  // Sélectionner une offre
  const handleOffreSelect = (offre) => {
    setSelectedOffre(offre);
    setSearchOffreDialogOpen(false);
  };
  
  // Filtrer les candidats selon la recherche
  const filteredCandidats = candidats.filter(candidat => {
    if (!candidatSearch) return true;
    
    const searchLower = candidatSearch.toLowerCase();
    const fullName = `${candidat.prenom} ${candidat.nom}`.toLowerCase();
    
    return fullName.includes(searchLower) || candidat.titre.toLowerCase().includes(searchLower);
  });
  
  // Filtrer les offres selon la recherche
  const filteredOffres = offres.filter(offre => {
    if (!offreSearch) return true;
    
    const searchLower = offreSearch.toLowerCase();
    
    return offre.titre.toLowerCase().includes(searchLower) || offre.localisation.toLowerCase().includes(searchLower);
  });
  
  // Annuler la création
  const handleCancel = () => {
    if (formik.dirty || selectedCandidat || selectedOffre) {
      setConfirmDialogOpen(true);
    } else {
      navigate('/recruteur/entretiens');
    }
  };
  
  // Confirmer l'annulation
  const confirmCancel = () => {
    setConfirmDialogOpen(false);
    navigate('/recruteur/entretiens');
  };
  
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={1} sx={{ p: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Planifier un entretien
          </Typography>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handleCancel}
          >
            Retour
          </Button>
        </Box>
        
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={4}>
            {/* Sélection du candidat et de l'offre */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Sélection du candidat
              </Typography>
              
              {selectedCandidat ? (
                <Card variant="outlined" sx={{ mb: 2 }}>
                  <CardContent>
                    <Box display="flex" alignItems="center">
                      <Avatar
                        alt={`${selectedCandidat.prenom} ${selectedCandidat.nom}`}
                        src={selectedCandidat.photo}
                        sx={{ width: 50, height: 50, mr: 2 }}
                      >
                        {getInitials(selectedCandidat.prenom, selectedCandidat.nom)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1">
                          {selectedCandidat.prenom} {selectedCandidat.nom}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {selectedCandidat.titre}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {selectedCandidat.email}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ) : (
                <Alert severity="info" sx={{ mb: 2 }}>
                  Aucun candidat sélectionné
                </Alert>
              )}
              
              <Button
                variant={selectedCandidat ? "outlined" : "contained"}
                startIcon={<PersonSearchIcon />}
                onClick={() => setSearchCandidatDialogOpen(true)}
                fullWidth
              >
                {selectedCandidat ? "Changer de candidat" : "Sélectionner un candidat"}
              </Button>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Sélection de l'offre
              </Typography>
              
              {selectedOffre ? (
                <Card variant="outlined" sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="subtitle1">
                      {selectedOffre.titre}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedOffre.type_contrat} • {selectedOffre.localisation}
                    </Typography>
                  </CardContent>
                </Card>
              ) : (
                <Alert severity="info" sx={{ mb: 2 }}>
                  Aucune offre sélectionnée
                </Alert>
              )}
              
              <Button
                variant={selectedOffre ? "outlined" : "contained"}
                startIcon={<WorkOutlineIcon />}
                onClick={() => setSearchOffreDialogOpen(true)}
                fullWidth
              >
                {selectedOffre ? "Changer d'offre" : "Sélectionner une offre"}
              </Button>
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
            </Grid>
            
            {/* Informations sur l'entretien */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Informations sur l'entretien
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Type d'entretien</FormLabel>
                <RadioGroup
                  name="type"
                  value={formik.values.type}
                  onChange={handleTypeChange}
                  row
                >
                  <FormControlLabel
                    value="video"
                    control={<Radio />}
                    label={
                      <Box display="flex" alignItems="center">
                        <VideoCallIcon color="primary" sx={{ mr: 0.5 }} />
                        <Typography>Entretien visio</Typography>
                      </Box>
                    }
                  />
                  <FormControlLabel
                    value="physique"
                    control={<Radio />}
                    label={
                      <Box display="flex" alignItems="center">
                        <EventIcon color="secondary" sx={{ mr: 0.5 }} />
                        <Typography>Entretien en personne</Typography>
                      </Box>
                    }
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                id="date"
                name="date"
                label="Date"
                type="date"
                value={formik.values.date}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.date && Boolean(formik.errors.date)}
                helperText={formik.touched.date && formik.errors.date}
                InputLabelProps={{
                  shrink: true,
                }}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                id="heure"
                name="heure"
                label="Heure"
                type="time"
                value={formik.values.heure}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.heure && Boolean(formik.errors.heure)}
                helperText={formik.touched.heure && formik.errors.heure}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  step: 300, // 5 minutes
                }}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                id="duree"
                name="duree"
                label="Durée (minutes)"
                type="number"
                value={formik.values.duree}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.duree && Boolean(formik.errors.duree)}
                helperText={formik.touched.duree && formik.errors.duree}
                InputProps={{
                  inputProps: { min: 15, max: 180 },
                }}
                required
              />
            </Grid>
            
            {formik.values.type === 'physique' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="lieu"
                  name="lieu"
                  label="Lieu de l'entretien"
                  value={formik.values.lieu}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.lieu && Boolean(formik.errors.lieu)}
                  helperText={formik.touched.lieu && formik.errors.lieu}
                  placeholder="Ex: Restaurant Le Gourmet, 25 avenue Victor Hugo, Paris"
                  required={formik.values.type === 'physique'}
                />
              </Grid>
            )}
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="notes"
                name="notes"
                label="Notes supplémentaires"
                multiline
                rows={3}
                value={formik.values.notes}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.notes && Boolean(formik.errors.notes)}
                helperText={formik.touched.notes && formik.errors.notes}
                placeholder="Informations complémentaires pour le candidat..."
              />
            </Grid>
            
            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end" mt={2}>
                <Button
                  variant="outlined"
                  onClick={handleCancel}
                  sx={{ mr: 2 }}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  disabled={!selectedCandidat || !selectedOffre || !formik.isValid}
                >
                  Planifier l'entretien
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
      
      {/* Dialog de recherche de candidat */}
      <Dialog
        open={searchCandidatDialogOpen}
        onClose={() => setSearchCandidatDialogOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Sélectionner un candidat</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Rechercher un candidat"
            fullWidth
            variant="outlined"
            value={candidatSearch}
            onChange={(e) => setCandidatSearch(e.target.value)}
            sx={{ mb: 2 }}
          />
          
          <Grid container spacing={2}>
            {filteredCandidats.map((candidat) => (
              <Grid item xs={12} sm={6} key={candidat.id}>
                <Card
                  variant="outlined"
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { boxShadow: 2 },
                  }}
                  onClick={() => handleCandidatSelect(candidat)}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center">
                      <Avatar
                        alt={`${candidat.prenom} ${candidat.nom}`}
                        src={candidat.photo}
                        sx={{ width: 40, height: 40, mr: 2 }}
                      >
                        {getInitials(candidat.prenom, candidat.nom)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1">
                          {candidat.prenom} {candidat.nom}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {candidat.titre}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
            
            {filteredCandidats.length === 0 && (
              <Grid item xs={12}>
                <Box textAlign="center" p={3}>
                  <Typography variant="body1" color="text.secondary">
                    Aucun candidat trouvé.
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSearchCandidatDialogOpen(false)}>Fermer</Button>
        </DialogActions>
      </Dialog>
      
      {/* Dialog de recherche d'offre */}
      <Dialog
        open={searchOffreDialogOpen}
        onClose={() => setSearchOffreDialogOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Sélectionner une offre</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Rechercher une offre"
            fullWidth
            variant="outlined"
            value={offreSearch}
            onChange={(e) => setOffreSearch(e.target.value)}
            sx={{ mb: 2 }}
          />
          
          <Grid container spacing={2}>
            {filteredOffres.map((offre) => (
              <Grid item xs={12} key={offre.id}>
                <Card
                  variant="outlined"
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { boxShadow: 2 },
                  }}
                  onClick={() => handleOffreSelect(offre)}
                >
                  <CardContent>
                    <Typography variant="subtitle1">
                      {offre.titre}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {offre.type_contrat} • {offre.localisation}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
            
            {filteredOffres.length === 0 && (
              <Grid item xs={12}>
                <Box textAlign="center" p={3}>
                  <Typography variant="body1" color="text.secondary">
                    Aucune offre trouvée.
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSearchOffreDialogOpen(false)}>Fermer</Button>
        </DialogActions>
      </Dialog>
      
      {/* Dialog de confirmation d'annulation */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <DialogTitle>Confirmer l'annulation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir annuler ? Toutes les informations saisies seront perdues.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Non</Button>
          <Button onClick={confirmCancel} color="error">
            Oui, annuler
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EntretienCreationPage;