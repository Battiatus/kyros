import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  Avatar,
  Grid,
  TextField,
  Divider,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormHelperText,
  CircularProgress,
  Alert,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  List,
  Chip
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  AddAPhoto as AddAPhotoIcon,
  VideoCall as VideoCallIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Help as HelpIcon
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import frLocale from 'date-fns/locale/fr';
import { useFormik } from 'formik';
import * as Yup from 'yup';

// Redux
import { fetchProfile, updateProfile, selectProfile, selectProfileLoading } from '../../redux/slices/profileSlice';
import { selectUser } from '../../redux/slices/authSlice';

/**
 * Page d'édition du profil candidat
 */
const EditProfilPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const user = useSelector(selectUser);
  const profile = useSelector(selectProfile);
  const loading = useSelector(selectProfileLoading);
  
  const [activeStep, setActiveStep] = useState(0);
  const [competenceDialog, setCompetenceDialog] = useState(false);
  const [langueDialog, setLangueDialog] = useState(false);
  const [experienceDialog, setExperienceDialog] = useState(false);
  const [formationDialog, setFormationDialog] = useState(false);
  const [referentDialog, setReferentDialog] = useState(false);
  const [currentExperienceIndex, setCurrentExperienceIndex] = useState(-1);
  const [currentFormationIndex, setCurrentFormationIndex] = useState(-1);
  const [imagePreview, setImagePreview] = useState(null);
  
  // Définir les états locaux pour les différentes sections du profil
  const [competences, setCompetences] = useState([]);
  const [langues, setLangues] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [formations, setFormations] = useState([]);
  
  // États pour les dialogs
  const [newCompetence, setNewCompetence] = useState({ competence: '', niveau: 'intermediaire' });
  const [newLangue, setNewLangue] = useState({ langue: '', niveau: 'intermediaire' });
  const [newExperience, setNewExperience] = useState({
    poste: '',
    entreprise: '',
    date_debut: new Date(),
    date_fin: null,
    description: '',
    en_cours: false
  });
  const [newFormation, setNewFormation] = useState({
    diplome: '',
    etablissement: '',
    date_debut: new Date(),
    date_fin: null,
    description: '',
    en_cours: false
  });
  const [newReferent, setNewReferent] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    poste: '',
    entreprise: ''
  });
  
  // Charger le profil
  useEffect(() => {
    if (user?.id && !profile) {
      dispatch(fetchProfile(user.id));
    }
    
    if (profile) {
      setCompetences(profile.competences || []);
      setLangues(profile.langues || []);
      setExperiences(profile.experiences || []);
      setFormations(profile.formations || []);
      setImagePreview(profile.photo_profil);
      
      // Pré-remplir le formulaire
      formik.setValues({
        nom: profile.nom || '',
        prenom: profile.prenom || '',
        email: profile.email || '',
        telephone: profile.telephone || '',
        date_naissance: profile.date_naissance ? new Date(profile.date_naissance) : null,
        nationalite: profile.nationalite || '',
        titre: profile.titre || '',
        resume_pro: profile.resume_pro || '',
        localisation: profile.localisation || ''
      });
    }
  }, [dispatch, user?.id, profile]);
  
  // Schema de validation pour les informations de base
  const validationSchema = Yup.object({
    nom: Yup.string().required('Le nom est requis'),
    prenom: Yup.string().required('Le prénom est requis'),
    email: Yup.string().email('Email invalide').required('L\'email est requis'),
    telephone: Yup.string().matches(/^(\+33|0)[1-9](\d{8})$/, 'Numéro de téléphone invalide'),
    titre: Yup.string().required('Le titre professionnel est requis')
  });
  
  // Formik pour gérer le formulaire principal
  const formik = useFormik({
    initialValues: {
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      date_naissance: null,
      nationalite: '',
      titre: '',
      resume_pro: '',
      localisation: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      if (user?.id) {
        try {
          // Préparer les données à envoyer
          const profileData = {
            ...values,
            competences,
            langues,
            experiences,
            formations,
            date_naissance: values.date_naissance ? values.date_naissance.toISOString().split('T')[0] : null
          };
          
          await dispatch(updateProfile({ userId: user.id, profileData }));
          navigate('/candidat/profil');
        } catch (error) {
          console.error('Erreur lors de la mise à jour du profil:', error);
        }
      }
    }
  });
  
  // Changer d'étape dans le stepper
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  
  // Gestion des compétences
  const handleAddCompetence = () => {
    if (newCompetence.competence.trim() === '') return;
    
    setCompetences([...competences, { ...newCompetence }]);
    setNewCompetence({ competence: '', niveau: 'intermediaire' });
    setCompetenceDialog(false);
  };
  
  const handleDeleteCompetence = (index) => {
    const newCompetences = [...competences];
    newCompetences.splice(index, 1);
    setCompetences(newCompetences);
  };
  
  // Gestion des langues
  const handleAddLangue = () => {
    if (newLangue.langue.trim() === '') return;
    
    setLangues([...langues, { ...newLangue }]);
    setNewLangue({ langue: '', niveau: 'intermediaire' });
    setLangueDialog(false);
  };
  
  const handleDeleteLangue = (index) => {
    const newLangues = [...langues];
    newLangues.splice(index, 1);
    setLangues(newLangues);
  };
  
  // Gestion des expériences
  const handleAddExperience = () => {
    if (newExperience.poste.trim() === '' || newExperience.entreprise.trim() === '') return;
    
    // Formater l'expérience pour l'ajout/modification
    const formattedExperience = {
      ...newExperience,
      date_debut: newExperience.date_debut.toISOString(),
      date_fin: newExperience.en_cours ? null : (newExperience.date_fin ? newExperience.date_fin.toISOString() : null)
    };
    
    if (currentExperienceIndex === -1) {
      // Ajout d'une nouvelle expérience
      setExperiences([...experiences, formattedExperience]);
    } else {
      // Modification d'une expérience existante
      const newExperiences = [...experiences];
      newExperiences[currentExperienceIndex] = formattedExperience;
      setExperiences(newExperiences);
    }
    
    setNewExperience({
      poste: '',
      entreprise: '',
      date_debut: new Date(),
      date_fin: null,
      description: '',
      en_cours: false
    });
    setCurrentExperienceIndex(-1);
    setExperienceDialog(false);
  };
  
  const handleEditExperience = (index) => {
    const experience = experiences[index];
    setNewExperience({
      ...experience,
      date_debut: new Date(experience.date_debut),
      date_fin: experience.date_fin ? new Date(experience.date_fin) : null,
      en_cours: !experience.date_fin
    });
    setCurrentExperienceIndex(index);
    setExperienceDialog(true);
  };
  
  const handleDeleteExperience = (index) => {
    const newExperiences = [...experiences];
    newExperiences.splice(index, 1);
    setExperiences(newExperiences);
  };
  
  // Gestion des formations
  const handleAddFormation = () => {
    if (newFormation.diplome.trim() === '' || newFormation.etablissement.trim() === '') return;
    
    // Formater la formation pour l'ajout/modification
    const formattedFormation = {
      ...newFormation,
      date_debut: newFormation.date_debut.toISOString(),
      date_fin: newFormation.en_cours ? null : (newFormation.date_fin ? newFormation.date_fin.toISOString() : null)
    };
    
    if (currentFormationIndex === -1) {
      // Ajout d'une nouvelle formation
      setFormations([...formations, formattedFormation]);
    } else {
      // Modification d'une formation existante
      const newFormations = [...formations];
      newFormations[currentFormationIndex] = formattedFormation;
      setFormations(newFormations);
    }
    
    setNewFormation({
      diplome: '',
      etablissement: '',
      date_debut: new Date(),
      date_fin: null,
      description: '',
      en_cours: false
    });
    setCurrentFormationIndex(-1);
    setFormationDialog(false);
  };
  
  const handleEditFormation = (index) => {
    const formation = formations[index];
    setNewFormation({
      ...formation,
      date_debut: new Date(formation.date_debut),
      date_fin: formation.date_fin ? new Date(formation.date_fin) : null,
      en_cours: !formation.date_fin
    });
    setCurrentFormationIndex(index);
    setFormationDialog(true);
  };
  
  const handleDeleteFormation = (index) => {
    const newFormations = [...formations];
    newFormations.splice(index, 1);
    setFormations(newFormations);
  };
  
  // Gestion des référents
  const handleAddReferent = () => {
    if (currentExperienceIndex === -1 || !newReferent.email.trim()) return;
    
    // Ajouter le référent à l'expérience correspondante
    const newExperiences = [...experiences];
    if (!newExperiences[currentExperienceIndex].referents) {
      newExperiences[currentExperienceIndex].referents = [];
    }
    
    newExperiences[currentExperienceIndex].referents.push(newReferent);
    setExperiences(newExperiences);
    
    setNewReferent({
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      poste: '',
      entreprise: ''
    });
    setReferentDialog(false);
  };
  
  // Gestion de l'upload de photo
  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Formatage du niveau de compétence
  const formatNiveau = (niveau) => {
    switch (niveau) {
      case 'debutant':
        return 'Débutant';
      case 'intermediaire':
        return 'Intermédiaire';
      case 'expert':
        return 'Expert';
      case 'courant':
        return 'Courant';
      case 'bilingue':
        return 'Bilingue';
      case 'natif':
        return 'Natif';
      default:
        return niveau;
    }
  };
  
  if (loading && !profile) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={frLocale}>
      <Box sx={{ p: 3 }}>
        {/* En-tête */}
        <Box display="flex" alignItems="center" mb={3}>
          <IconButton onClick={() => navigate('/candidat/profil')}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Modifier mon profil
          </Typography>
        </Box>
        
        <Paper elevation={1} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
          <Stepper activeStep={activeStep} orientation="vertical">
            {/* Étape 1: Informations personnelles */}
            <Step>
              <StepLabel>Informations personnelles</StepLabel>
              <StepContent>
                <form>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={3} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Box position="relative">
                        <Avatar
                          src={imagePreview}
                          alt={`${formik.values.prenom} ${formik.values.nom}`}
                          sx={{ width: 150, height: 150, mb: 2 }}
                        >
                          {formik.values.prenom?.charAt(0)}
                        </Avatar>
                        <IconButton 
                          color="primary" 
                          component="label"
                          sx={{ 
                            position: 'absolute',
                            bottom: 10,
                            right: 0,
                            bgcolor: 'background.paper',
                            '&:hover': { bgcolor: 'background.default' }
                          }}
                        >
                          <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={handlePhotoUpload}
                          />
                          <AddAPhotoIcon />
                        </IconButton>
                      </Box>
                      
                      <Button
                        variant="outlined"
                        startIcon={<VideoCallIcon />}
                        sx={{ mt: 2 }}
                      >
                        Ajouter une vidéo
                      </Button>
                      
                      <Typography variant="caption" color="text.secondary" align="center" sx={{ mt: 1 }}>
                        Une vidéo de présentation augmente vos chances d'être remarqué
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} md={9}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Prénom"
                            name="prenom"
                            value={formik.values.prenom}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.prenom && Boolean(formik.errors.prenom)}
                            helperText={formik.touched.prenom && formik.errors.prenom}
                          />
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Nom"
                            name="nom"
                            value={formik.values.nom}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.nom && Boolean(formik.errors.nom)}
                            helperText={formik.touched.nom && formik.errors.nom}
                          />
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                          />
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Téléphone"
                            name="telephone"
                            value={formik.values.telephone}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.telephone && Boolean(formik.errors.telephone)}
                            helperText={formik.touched.telephone && formik.errors.telephone}
                          />
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                          <DatePicker
                            label="Date de naissance"
                            value={formik.values.date_naissance}
                            onChange={(value) => formik.setFieldValue('date_naissance', value)}
                            renderInput={(params) => <TextField {...params} fullWidth />}
                          />
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Nationalité"
                            name="nationalite"
                            value={formik.values.nationalite}
                            onChange={formik.handleChange}
                          />
                        </Grid>
                        
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Localisation"
                            name="localisation"
                            placeholder="Ex: Paris, France"
                            value={formik.values.localisation}
                            onChange={formik.handleChange}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  
                  <Box sx={{ mt: 3 }}>
                    <Button
                      variant="contained"
                      onClick={handleNext}
                    >
                      Suivant
                    </Button>
                  </Box>
                </form>
              </StepContent>
            </Step>
            
            {/* Étape 2: Profil professionnel */}
            <Step>
              <StepLabel>Profil professionnel</StepLabel>
              <StepContent>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Titre professionnel"
                      name="titre"
                      placeholder="Ex: Chef de Cuisine Expérimenté"
                      value={formik.values.titre}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.titre && Boolean(formik.errors.titre)}
                      helperText={formik.touched.titre && formik.errors.titre}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Résumé professionnel"
                      name="resume_pro"
                      placeholder="Décrivez brièvement votre parcours, vos compétences clés et vos objectifs professionnels..."
                      multiline
                      rows={4}
                      value={formik.values.resume_pro}
                      onChange={formik.handleChange}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Card variant="outlined" sx={{ mb: 2 }}>
                      <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                          <Typography variant="h6" fontWeight="medium">
                            Compétences
                          </Typography>
                          <Button
                            startIcon={<AddIcon />}
                            onClick={() => setCompetenceDialog(true)}
                          >
                            Ajouter
                          </Button>
                        </Box>
                        
                        {competences.length === 0 ? (
                          <Typography variant="body2" color="text.secondary">
                            Aucune compétence ajoutée. Cliquez sur "Ajouter" pour en ajouter une.
                          </Typography>
                        ) : (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {competences.map((comp, index) => (
                              <Chip 
                                key={index} 
                                label={`${comp.competence} (${formatNiveau(comp.niveau)})`} 
                                onDelete={() => handleDeleteCompetence(index)}
                              />
                            ))}
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                    
                    <Card variant="outlined">
                      <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                          <Typography variant="h6" fontWeight="medium">
                            Langues
                          </Typography>
                          <Button
                            startIcon={<AddIcon />}
                            onClick={() => setLangueDialog(true)}
                          >
                            Ajouter
                          </Button>
                        </Box>
                        
                        {langues.length === 0 ? (
                          <Typography variant="body2" color="text.secondary">
                            Aucune langue ajoutée. Cliquez sur "Ajouter" pour en ajouter une.
                          </Typography>
                        ) : (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {langues.map((langue, index) => (
                              <Chip 
                                key={index} 
                                label={`${langue.langue} (${formatNiveau(langue.niveau)})`} 
                                onDelete={() => handleDeleteLangue(index)}
                              />
                            ))}
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
                
                <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                  <Button
                    onClick={handleBack}
                  >
                    Retour
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                  >
                    Suivant
                  </Button>
                </Box>
              </StepContent>
            </Step>
            
            {/* Étape 3: Expériences et formations */}
            <Step>
              <StepLabel>Expériences et formations</StepLabel>
              <StepContent>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Card variant="outlined" sx={{ mb: 3 }}>
                      <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                          <Typography variant="h6" fontWeight="medium">
                            Expériences professionnelles
                          </Typography>
                          <Button
                            startIcon={<AddIcon />}
                            onClick={() => {
                              setCurrentExperienceIndex(-1);
                              setNewExperience({
                                poste: '',
                                entreprise: '',
                                date_debut: new Date(),
                                date_fin: null,
                                description: '',
                                en_cours: false
                              });
                              setExperienceDialog(true);
                            }}
                          >
                            Ajouter
                          </Button>
                        </Box>
                        
                        {experiences.length === 0 ? (
                          <Alert severity="info">
                            Aucune expérience professionnelle ajoutée. Ajoutez au moins une expérience pour améliorer votre profil.
                          </Alert>
                        ) : (
                          <List>
                            {experiences.map((exp, index) => (
                              <React.Fragment key={index}>
                                <ListItem>
                                  <ListItemText
                                    primary={
                                      <Typography variant="subtitle1" fontWeight="medium">
                                        {exp.poste} - {exp.entreprise}
                                      </Typography>
                                    }
                                    secondary={
                                      <>
                                        <Typography variant="body2" color="text.secondary">
                                          {new Date(exp.date_debut).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })} - 
                                          {exp.date_fin ? new Date(exp.date_fin).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' }) : 'Présent'}
                                        </Typography>
                                        <Typography variant="body2">
                                          {exp.description}
                                        </Typography>
                                        {exp.referents && exp.referents.length > 0 && (
                                          <Chip 
                                            size="small" 
                                            label={`${exp.referents.length} référent(s)`} 
                                            color="success"
                                            sx={{ mt: 1 }}
                                          />
                                        )}
                                      </>
                                    }
                                  />
                                  <ListItemSecondaryAction>
                                    <IconButton edge="end" onClick={() => handleEditExperience(index)}>
                                      <EditIcon />
                                    </IconButton>
                                    <IconButton edge="end" onClick={() => handleDeleteExperience(index)}>
                                      <DeleteIcon />
                                    </IconButton>
                                  </ListItemSecondaryAction>
                                </ListItem>
                                <Divider component="li" />
                              </React.Fragment>
                            ))}
                          </List>
                        )}
                      </CardContent>
                    </Card>
                    
                    <Card variant="outlined">
                      <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                          <Typography variant="h6" fontWeight="medium">
                            Formations
                          </Typography>
                          <Button
                            startIcon={<AddIcon />}
                            onClick={() => {
                              setCurrentFormationIndex(-1);
                              setNewFormation({
                                diplome: '',
                                etablissement: '',
                                date_debut: new Date(),
                                date_fin: null,
                                description: '',
                                en_cours: false
                              });
                              setFormationDialog(true);
                            }}
                          >
                            Ajouter
                          </Button>
                        </Box>
                        
                        {formations.length === 0 ? (
                          <Typography variant="body2" color="text.secondary">
                            Aucune formation ajoutée. Cliquez sur "Ajouter" pour en ajouter une.
                          </Typography>
                        ) : (
                          <List>
                            {formations.map((formation, index) => (
                              <React.Fragment key={index}>
                                <ListItem>
                                  <ListItemText
                                    primary={
                                      <Typography variant="subtitle1" fontWeight="medium">
                                        {formation.diplome} - {formation.etablissement}
                                      </Typography>
                                    }
                                    secondary={
                                      <>
                                        <Typography variant="body2" color="text.secondary">
                                          {new Date(formation.date_debut).getFullYear()} - {formation.date_fin ? new Date(formation.date_fin).getFullYear() : 'Présent'}
                                        </Typography>
                                        {formation.description && (
                                          <Typography variant="body2">
                                            {formation.description}
                                          </Typography>
                                        )}
                                      </>
                                    }
                                  />
                                  <ListItemSecondaryAction>
                                    <IconButton edge="end" onClick={() => handleEditFormation(index)}>
                                      <EditIcon />
                                    </IconButton>
                                    <IconButton edge="end" onClick={() => handleDeleteFormation(index)}>
                                      <DeleteIcon />
                                    </IconButton>
                                  </ListItemSecondaryAction>
                                </ListItem>
                                <Divider component="li" />
                              </React.Fragment>
                            ))}
                          </List>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
                
                <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                  <Button
                    onClick={handleBack}
                  >
                    Retour
                  </Button>
                  <Button
                    variant="contained"
                    onClick={formik.handleSubmit}
                    startIcon={<SaveIcon />}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <CircularProgress size={20} sx={{ mr: 1 }} />
                        Enregistrement...
                      </>
                    ) : (
                      'Enregistrer'
                    )}
                  </Button>
                </Box>
              </StepContent>
            </Step>
          </Stepper>
        </Paper>
        
        {/* Dialog d'ajout de compétence */}
        <Dialog open={competenceDialog} onClose={() => setCompetenceDialog(false)}>
          <DialogTitle>Ajouter une compétence</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Compétence"
              fullWidth
              value={newCompetence.competence}
              onChange={(e) => setNewCompetence({ ...newCompetence, competence: e.target.value })}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Niveau</InputLabel>
              <Select
                value={newCompetence.niveau}
                onChange={(e) => setNewCompetence({ ...newCompetence, niveau: e.target.value })}
                label="Niveau"
              >
                <MenuItem value="debutant">Débutant</MenuItem>
                <MenuItem value="intermediaire">Intermédiaire</MenuItem>
                <MenuItem value="expert">Expert</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCompetenceDialog(false)}>Annuler</Button>
            <Button 
              variant="contained" 
              onClick={handleAddCompetence}
              disabled={!newCompetence.competence.trim()}
            >
              Ajouter
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* Dialog d'ajout de langue */}
        <Dialog open={langueDialog} onClose={() => setLangueDialog(false)}>
          <DialogTitle>Ajouter une langue</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Langue"
              fullWidth
              value={newLangue.langue}
              onChange={(e) => setNewLangue({ ...newLangue, langue: e.target.value })}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Niveau</InputLabel>
              <Select
                value={newLangue.niveau}
                onChange={(e) => setNewLangue({ ...newLangue, niveau: e.target.value })}
                label="Niveau"
              >
                <MenuItem value="debutant">Débutant</MenuItem>
                <MenuItem value="intermediaire">Intermédiaire</MenuItem>
                <MenuItem value="courant">Courant</MenuItem>
                <MenuItem value="bilingue">Bilingue</MenuItem>
                <MenuItem value="natif">Natif</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setLangueDialog(false)}>Annuler</Button>
            <Button 
              variant="contained" 
              onClick={handleAddLangue}
              disabled={!newLangue.langue.trim()}
            >
              Ajouter
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* Dialog d'ajout/édition d'expérience */}
        <Dialog open={experienceDialog} onClose={() => setExperienceDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            {currentExperienceIndex === -1 ? 'Ajouter une expérience professionnelle' : 'Modifier l\'expérience professionnelle'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoFocus
                  label="Poste"
                  fullWidth
                  value={newExperience.poste}
                  onChange={(e) => setNewExperience({ ...newExperience, poste: e.target.value })}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Entreprise"
                  fullWidth
                  value={newExperience.entreprise}
                  onChange={(e) => setNewExperience({ ...newExperience, entreprise: e.target.value })}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Date de début"
                  value={newExperience.date_debut}
                  onChange={(value) => setNewExperience({ ...newExperience, date_debut: value })}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center" height="100%">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={newExperience.en_cours}
                        onChange={(e) => setNewExperience({ ...newExperience, en_cours: e.target.checked })}
                      />
                    }
                    label="En cours"
                  />
                  
                  {!newExperience.en_cours && (
                    <DatePicker
                      label="Date de fin"
                      value={newExperience.date_fin}
                      onChange={(value) => setNewExperience({ ...newExperience, date_fin: value })}
                      renderInput={(params) => <TextField {...params} fullWidth sx={{ ml: 2 }} />}
                    />
                  )}
                </Box>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  fullWidth
                  multiline
                  rows={4}
                  value={newExperience.description}
                  onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
                  placeholder="Décrivez vos responsabilités et réalisations dans ce poste..."
                />
              </Grid>
              
              {currentExperienceIndex !== -1 && (
                <Grid item xs={12}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                    <Typography variant="subtitle1" fontWeight="medium">
                      Référents
                    </Typography>
                    <Button
                      startIcon={<AddIcon />}
                      onClick={() => {
                        setNewReferent({
                          nom: '',
                          prenom: '',
                          email: '',
                          telephone: '',
                          poste: '',
                          entreprise: ''
                        });
                        setReferentDialog(true);
                      }}
                    >
                      Ajouter un référent
                    </Button>
                  </Box>
                  
                  {experiences[currentExperienceIndex]?.referents?.length > 0 ? (
                    <List>
                      {experiences[currentExperienceIndex].referents.map((referent, refIndex) => (
                        <ListItem key={refIndex}>
                          <ListItemText
                            primary={`${referent.prenom} ${referent.nom}`}
                            secondary={`${referent.poste} chez ${referent.entreprise} - ${referent.email}`}
                          />
                          <ListItemSecondaryAction>
                            <IconButton edge="end" onClick={() => {
                              // Supprimer le référent
                              const newExperiences = [...experiences];
                              newExperiences[currentExperienceIndex].referents.splice(refIndex, 1);
                              setExperiences(newExperiences);
                            }}>
                              <DeleteIcon />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Ajoutez des référents pour valider cette expérience et renforcer votre profil.
                    </Typography>
                  )}
                </Grid>
              )}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setExperienceDialog(false)}>Annuler</Button>
            <Button 
              variant="contained" 
              onClick={handleAddExperience}
              disabled={!newExperience.poste.trim() || !newExperience.entreprise.trim()}
            >
              {currentExperienceIndex === -1 ? 'Ajouter' : 'Modifier'}
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* Dialog d'ajout/édition de formation */}
        <Dialog open={formationDialog} onClose={() => setFormationDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            {currentFormationIndex === -1 ? 'Ajouter une formation' : 'Modifier la formation'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoFocus
                  label="Diplôme / Formation"
                  fullWidth
                  value={newFormation.diplome}
                  onChange={(e) => setNewFormation({ ...newFormation, diplome: e.target.value })}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Établissement"
                  fullWidth
                  value={newFormation.etablissement}
                  onChange={(e) => setNewFormation({ ...newFormation, etablissement: e.target.value })}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Date de début"
                  views={['year']}
                  value={newFormation.date_debut}
                  onChange={(value) => setNewFormation({ ...newFormation, date_debut: value })}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center" height="100%">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={newFormation.en_cours}
                        onChange={(e) => setNewFormation({ ...newFormation, en_cours: e.target.checked })}
                      />
                    }
                    label="En cours"
                  />
                  
                  {!newFormation.en_cours && (
                    <DatePicker
                      label="Date de fin"
                      views={['year']}
                      value={newFormation.date_fin}
                      onChange={(value) => setNewFormation({ ...newFormation, date_fin: value })}
                      renderInput={(params) => <TextField {...params} fullWidth sx={{ ml: 2 }} />}
                    />
                  )}
                </Box>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  fullWidth
                  multiline
                  rows={3}
                  value={newFormation.description}
                  onChange={(e) => setNewFormation({ ...newFormation, description: e.target.value })}
                  placeholder="Décrivez les points clés de cette formation..."
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setFormationDialog(false)}>Annuler</Button>
            <Button 
              variant="contained" 
              onClick={handleAddFormation}
              disabled={!newFormation.diplome.trim() || !newFormation.etablissement.trim()}
            >
              {currentFormationIndex === -1 ? 'Ajouter' : 'Modifier'}
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* Dialog d'ajout de référent */}
        <Dialog open={referentDialog} onClose={() => setReferentDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Ajouter un référent</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" paragraph sx={{ mt: 1 }}>
              Un email sera envoyé à ce référent pour qu'il confirme votre expérience professionnelle.
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoFocus
                  label="Prénom"
                  fullWidth
                  value={newReferent.prenom}
                  onChange={(e) => setNewReferent({ ...newReferent, prenom: e.target.value })}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Nom"
                  fullWidth
                  value={newReferent.nom}
                  onChange={(e) => setNewReferent({ ...newReferent, nom: e.target.value })}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  value={newReferent.email}
                  onChange={(e) => setNewReferent({ ...newReferent, email: e.target.value })}
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  label="Téléphone (optionnel)"
                  fullWidth
                  value={newReferent.telephone}
                  onChange={(e) => setNewReferent({ ...newReferent, telephone: e.target.value })}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Poste"
                  fullWidth
                  value={newReferent.poste}
                  onChange={(e) => setNewReferent({ ...newReferent, poste: e.target.value })}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Entreprise"
                  fullWidth
                  value={newReferent.entreprise}
                  onChange={(e) => setNewReferent({ ...newReferent, entreprise: e.target.value })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setReferentDialog(false)}>Annuler</Button>
            <Button 
              variant="contained" 
              onClick={handleAddReferent}
              disabled={!newReferent.email.trim()}
            >
              Ajouter
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default EditProfilPage;