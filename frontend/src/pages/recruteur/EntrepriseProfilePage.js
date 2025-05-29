import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Divider,
  IconButton,
  Avatar,
  LinearProgress,
  Card,
  CardMedia,
  CardContent,
  Alert,
  Chip,
  Autocomplete,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Save as SaveIcon,
  PlayArrow as PlayIcon,
  Edit as EditIcon,
  Check as CheckIcon,
  Build as BuildIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/common/Loader';

/**
 * Page de création/édition du profil entreprise
 */
const EntrepriseProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [activeStep, setActiveStep] = useState(0);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [optimizing, setOptimizing] = useState(false);
  
  // Liste des secteurs d'activité
  const secteurs = [
    'Restauration rapide',
    'Restaurant traditionnel',
    'Gastronomie',
    'Hôtellerie',
    'Bar / Café',
    'Traiteur',
    'Collectivité',
    'Autre',
  ];
  
  // Liste des tailles d'entreprise
  const tailles = [
    'Auto-entrepreneur',
    'TPE (1-9 employés)',
    'PME (10-249 employés)',
    'ETI (250-4999 employés)',
    'Grande entreprise (5000+ employés)',
  ];
  
  // Liste de valeurs d'entreprise suggérées
  const suggestedValues = [
    'Innovation',
    'Qualité',
    'Excellence',
    'Tradition',
    'Passion',
    'Créativité',
    'Développement durable',
    'Inclusivité',
    'Bien-être',
    'Esprit d\'équipe',
  ];
  
  // Étapes du formulaire
  const steps = [
    'Informations de base',
    'Description et valeurs',
    'Médias et présentation',
    'Validation',
  ];
  
  // Validation du formulaire
  const validationSchema = Yup.object({
    nom: Yup.string()
      .min(2, 'Le nom doit contenir au moins 2 caractères')
      .max(100, 'Le nom ne peut pas dépasser 100 caractères')
      .required('Nom requis'),
    secteur: Yup.string().required('Secteur requis'),
    taille: Yup.string().required('Taille requise'),
    localisation: Yup.string().required('Localisation requise'),
    siteWeb: Yup.string().url('URL invalide'),
    description: Yup.string()
      .min(50, 'La description doit contenir au moins 50 caractères')
      .max(2000, 'La description ne peut pas dépasser 2000 caractères')
      .required('Description requise'),
    valeurs: Yup.array().min(1, 'Sélectionnez au moins une valeur'),
  });
  
  // Gestion du formulaire
  const formik = useFormik({
    initialValues: {
      nom: '',
      logo: null,
      secteur: '',
      taille: '',
      localisation: '',
      langues: ['Français'],
      siteWeb: '',
      reseauxSociaux: {
        linkedin: '',
        facebook: '',
        instagram: '',
      },
      description: '',
      ambiance: '',
      valeurs: [],
      avantages: '',
      videoPresentation: null,
      useAvatarGeneration: false,
    },
    validationSchema,
    onSubmit: (values) => {
      setIsSubmitting(true);
      
      // Simulation d'envoi des données à l'API
      setTimeout(() => {
        console.log('Données soumises:', values);
        setIsSubmitting(false);
        // Redirection vers le tableau de bord
        navigate('/recruteur/dashboard');
      }, 2000);
    },
  });
  
  // Calculer le pourcentage de complétion du profil
  useEffect(() => {
    const requiredFields = [
      'nom',
      'secteur',
      'taille',
      'localisation',
      'description',
    ];
    
    const optionalFields = [
      'logo',
      'langues',
      'siteWeb',
      'reseauxSociaux.linkedin',
      'reseauxSociaux.facebook',
      'reseauxSociaux.instagram',
      'ambiance',
      'valeurs',
      'avantages',
      'videoPresentation',
    ];
    
    let completed = 0;
    let total = requiredFields.length + optionalFields.length;
    
    // Vérifier les champs requis (poids double)
    requiredFields.forEach(field => {
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        if (formik.values[parent] && formik.values[parent][child]) {
          completed += 2;
        }
      } else if (formik.values[field]) {
        completed += 2;
      }
    });
    
    // Vérifier les champs optionnels
    optionalFields.forEach(field => {
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        if (formik.values[parent] && formik.values[parent][child]) {
          completed += 1;
        }
      } else if (
        (Array.isArray(formik.values[field]) && formik.values[field].length > 0) ||
        (field === 'logo' && logoPreview) ||
        (field === 'videoPresentation' && (videoPreview || formik.values.useAvatarGeneration)) ||
        formik.values[field]
      ) {
        completed += 1;
      }
    });
    
    // Calculer le pourcentage (max 100)
    const percentage = Math.min(
      100,
      Math.round((completed / (requiredFields.length * 2 + optionalFields.length)) * 100)
    );
    
    setProfileCompletion(percentage);
  }, [formik.values, logoPreview, videoPreview]);
  
  // Gérer le changement d'étape
  const handleNext = () => {
    setActiveStep(prevStep => prevStep + 1);
  };
  
  const handleBack = () => {
    setActiveStep(prevStep => prevStep - 1);
  };
  
  // Gérer l'upload du logo
  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      formik.setFieldValue('logo', file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Gérer l'upload de la vidéo
  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      formik.setFieldValue('videoPresentation', file);
      setVideoPreview(URL.createObjectURL(file));
      formik.setFieldValue('useAvatarGeneration', false);
    }
  };
  
  // Optimiser la description avec l'IA
  const handleOptimizeDescription = () => {
    if (!formik.values.description) {
      return;
    }
    
    setOptimizing(true);
    
    // Simulation d'une optimisation IA
    setTimeout(() => {
      const optimizedDescription = `${formik.values.description} 
      
Entreprise dynamique et innovante, nous valorisons la qualité du service et l'épanouissement de nos collaborateurs. Notre environnement de travail favorise la créativité et l'esprit d'équipe, tout en offrant des opportunités d'évolution professionnelle.`;
      
      formik.setFieldValue('description', optimizedDescription);
      setOptimizing(false);
    }, 2000);
  };
  
  // Générer un avatar avec l'IA
  const handleGenerateAvatar = () => {
    formik.setFieldValue('useAvatarGeneration', true);
    formik.setFieldValue('videoPresentation', null);
    setVideoPreview(null);
    
    // En réalité, nous appellerions une API pour générer l'avatar
    // Pour cet exemple, nous simulons juste l'activation de l'option
  };
  
  // Rendu des étapes du formulaire
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Informations de base
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Ces informations seront visibles par les candidats et aideront à identifier votre entreprise.
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                id="nom"
                name="nom"
                label="Nom de l'entreprise"
                value={formik.values.nom}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.nom && Boolean(formik.errors.nom)}
                helperText={formik.touched.nom && formik.errors.nom}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="logo-upload"
                  type="file"
                  onChange={handleLogoUpload}
                />
                <label htmlFor="logo-upload">
                  <Box 
                    border={1} 
                    borderColor="divider" 
                    borderRadius={1} 
                    p={2} 
                    display="flex" 
                    flexDirection="column" 
                    alignItems="center"
                    sx={{ cursor: 'pointer' }}
                  >
                    {logoPreview ? (
                      <Avatar
                        src={logoPreview}
                        alt="Logo"
                        sx={{ width: 80, height: 80, mb: 1 }}
                      />
                    ) : (
                      <Avatar sx={{ width: 80, height: 80, mb: 1 }}>
                        <UploadIcon />
                      </Avatar>
                    )}
                    <Typography variant="body2" color="text.secondary">
                      {logoPreview ? 'Changer le logo' : 'Ajouter un logo'}
                    </Typography>
                  </Box>
                </label>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required error={formik.touched.secteur && Boolean(formik.errors.secteur)}>
                <InputLabel id="secteur-label">Secteur d'activité</InputLabel>
                <Select
                  labelId="secteur-label"
                  id="secteur"
                  name="secteur"
                  value={formik.values.secteur}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  label="Secteur d'activité"
                >
                  {secteurs.map((secteur) => (
                    <MenuItem key={secteur} value={secteur}>
                      {secteur}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.secteur && formik.errors.secteur && (
                  <FormHelperText>{formik.errors.secteur}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required error={formik.touched.taille && Boolean(formik.errors.taille)}>
                <InputLabel id="taille-label">Taille de l'entreprise</InputLabel>
                <Select
                  labelId="taille-label"
                  id="taille"
                  name="taille"
                  value={formik.values.taille}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  label="Taille de l'entreprise"
                >
                  {tailles.map((taille) => (
                    <MenuItem key={taille} value={taille}>
                      {taille}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.taille && formik.errors.taille && (
                  <FormHelperText>{formik.errors.taille}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="localisation"
                name="localisation"
                label="Adresse principale"
                value={formik.values.localisation}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.localisation && Boolean(formik.errors.localisation)}
                helperText={formik.touched.localisation && formik.errors.localisation}
                placeholder="123 rue de Paris, 75001 Paris"
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Site web et réseaux sociaux
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="siteWeb"
                name="siteWeb"
                label="Site web"
                value={formik.values.siteWeb}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.siteWeb && Boolean(formik.errors.siteWeb)}
                helperText={formik.touched.siteWeb && formik.errors.siteWeb}
                placeholder="https://www.votreentreprise.com"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="reseauxSociaux.linkedin"
                name="reseauxSociaux.linkedin"
                label="LinkedIn"
                value={formik.values.reseauxSociaux.linkedin}
                onChange={formik.handleChange}
                placeholder="https://www.linkedin.com/company/votreentreprise"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="reseauxSociaux.facebook"
                name="reseauxSociaux.facebook"
                label="Facebook"
                value={formik.values.reseauxSociaux.facebook}
                onChange={formik.handleChange}
                placeholder="https://www.facebook.com/votreentreprise"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="reseauxSociaux.instagram"
                name="reseauxSociaux.instagram"
                label="Instagram"
                value={formik.values.reseauxSociaux.instagram}
                onChange={formik.handleChange}
                placeholder="https://www.instagram.com/votreentreprise"
              />
            </Grid>
          </Grid>
        );
        
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Description et culture d'entreprise
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Présentez votre entreprise, sa mission, ses valeurs et l'ambiance de travail.
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <Box position="relative">
                <TextField
                  fullWidth
                  id="description"
                  name="description"
                  label="Description de l'entreprise"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.description && Boolean(formik.errors.description)}
                  helperText={
                    (formik.touched.description && formik.errors.description) ||
                    `${formik.values.description.length}/2000 caractères`
                  }
                  multiline
                  rows={6}
                  placeholder="Décrivez votre entreprise, son histoire, sa mission et ses objectifs..."
                  required
                />
                {optimizing && (
                  <LinearProgress 
                    sx={{ 
                      position: 'absolute', 
                      bottom: formik.touched.description && formik.errors.description ? '24px' : '0', 
                      left: 0, 
                      right: 0 
                    }} 
                  />
                )}
              </Box>
              <Button
                variant="outlined"
                startIcon={<BuildIcon />}
                onClick={handleOptimizeDescription}
                disabled={!formik.values.description || optimizing}
                sx={{ mt: 1 }}
              >
                {optimizing ? 'Optimisation en cours...' : 'Optimiser avec l\'IA'}
              </Button>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="ambiance"
                name="ambiance"
                label="Ambiance de travail"
                value={formik.values.ambiance}
                onChange={formik.handleChange}
                multiline
                rows={3}
                placeholder="Décrivez l'ambiance de travail dans votre entreprise, la culture interne, les relations entre collègues..."
              />
            </Grid>
            
            <Grid item xs={12}>
              <Autocomplete
                multiple
                id="valeurs"
                options={suggestedValues}
                freeSolo
                value={formik.values.valeurs}
                onChange={(event, newValue) => {
                  formik.setFieldValue('valeurs', newValue);
                }}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip label={option} {...getTagProps({ index })} />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Valeurs de l'entreprise"
                    placeholder="Ajouter une valeur"
                    error={formik.touched.valeurs && Boolean(formik.errors.valeurs)}
                    helperText={formik.touched.valeurs && formik.errors.valeurs}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="avantages"
                name="avantages"
                label="Avantages et bénéfices"
                value={formik.values.avantages}
                onChange={formik.handleChange}
                multiline
                rows={3}
                placeholder="Détaillez les avantages offerts aux employés (tickets restaurant, mutuelle, formation, RTT...)"
              />
            </Grid>
          </Grid>
        );
        
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Médias et présentation
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Ajoutez des médias pour rendre votre profil plus attractif.
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Vidéo de présentation
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Téléchargez une vidéo ou générez un avatar qui présentera votre entreprise.
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Card sx={{ height: '100%' }}>
                    <Box sx={{ p: 2, bgcolor: 'action.hover' }}>
                      <Typography variant="subtitle2" align="center">
                        Télécharger une vidéo
                      </Typography>
                    </Box>
                    <CardContent>
                      <Box 
                        display="flex" 
                        flexDirection="column" 
                        alignItems="center" 
                        justifyContent="center"
                        minHeight={180}
                      >
                        {videoPreview ? (
                          <Box width="100%">
                            <video
                              src={videoPreview}
                              controls
                              style={{ width: '100%', maxHeight: 180, borderRadius: 4 }}
                            />
                            <Button
                              variant="outlined"
                              color="secondary"
                              size="small"
                              onClick={() => {
                                setVideoPreview(null);
                                formik.setFieldValue('videoPresentation', null);
                              }}
                              sx={{ mt: 1 }}
                            >
                              Supprimer
                            </Button>
                          </Box>
                        ) : (
                          <Box textAlign="center">
                            <input
                              accept="video/*"
                              style={{ display: 'none' }}
                              id="video-upload"
                              type="file"
                              onChange={handleVideoUpload}
                            />
                            <label htmlFor="video-upload">
                              <Button
                                variant="outlined"
                                component="span"
                                startIcon={<UploadIcon />}
                                disabled={formik.values.useAvatarGeneration}
                              >
                                Télécharger
                              </Button>
                            </label>
                            <Typography variant="caption" display="block" color="text.secondary" mt={1}>
                              Format MP4, max 50 Mo, 30-90 secondes
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Card sx={{ height: '100%' }}>
                    <Box sx={{ p: 2, bgcolor: 'action.hover' }}>
                      <Typography variant="subtitle2" align="center">
                        Générer un avatar IA
                      </Typography>
                    </Box>
                    <CardContent>
                      <Box 
                        display="flex" 
                        flexDirection="column" 
                        alignItems="center" 
                        justifyContent="center"
                        minHeight={180}
                      >
                        {formik.values.useAvatarGeneration ? (
                          <Box textAlign="center">
                            <Box
                              sx={{
                                width: 120,
                                height: 120,
                                borderRadius: '50%',
                                bgcolor: 'primary.light',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mb: 2,
                              }}
                            >
                              <Typography variant="h4" color="white">
                                {formik.values.nom ? formik.values.nom.charAt(0) : 'A'}
                              </Typography>
                            </Box>
                            <Typography variant="body2" gutterBottom>
                              Avatar généré avec succès !
                            </Typography>
                            <Button
                              variant="outlined"
                              color="secondary"
                              size="small"
                              onClick={() => {
                                formik.setFieldValue('useAvatarGeneration', false);
                              }}
                            >
                              Supprimer
                            </Button>
                          </Box>
                        ) : (
                          <Box textAlign="center">
                            <Button
                              variant="contained"
                              onClick={handleGenerateAvatar}
                              startIcon={<PlayIcon />}
                              disabled={Boolean(videoPreview)}
                            >
                              Générer un avatar
                            </Button>
                            <Typography variant="caption" display="block" color="text.secondary" mt={1}>
                              Crée un avatar animé qui présentera votre entreprise
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        );
        
      case 3:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Récapitulatif du profil
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Vérifiez les informations avant de finaliser votre profil.
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Progression du profil
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={profileCompletion} 
                  sx={{ height: 10, borderRadius: 5 }}
                />
                <Typography variant="body2" color="text.secondary" align="right" mt={1}>
                  {profileCompletion}% complété
                </Typography>
              </Box>
              
              {profileCompletion < 70 && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  Votre profil est incomplet. Un profil complet augmente vos chances d'attirer des candidats.
                </Alert>
              )}
              
              {profileCompletion >= 70 && profileCompletion < 100 && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  Votre profil est presque complet ! Ajoutez les derniers éléments pour maximiser son impact.
                </Alert>
              )}
              
              {profileCompletion === 100 && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  Félicitations ! Votre profil est complet à 100%.
                </Alert>
              )}
            </Grid>
            
            <Grid item xs={12}>
              <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar
                    src={logoPreview}
                    alt={formik.values.nom}
                    sx={{ width: 60, height: 60, mr: 2 }}
                  >
                    {formik.values.nom ? formik.values.nom.charAt(0) : 'E'}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{formik.values.nom || 'Nom de l\'entreprise'}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formik.values.secteur || 'Secteur'} • {formik.values.taille || 'Taille'} • {formik.values.localisation || 'Localisation'}
                    </Typography>
                  </Box>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="subtitle1" gutterBottom>
                  Description
                </Typography>
                <Typography variant="body2" paragraph>
                  {formik.values.description || 'Aucune description fournie.'}
                </Typography>
                
                <Typography variant="subtitle1" gutterBottom>
                  Valeurs
                </Typography>
                <Box mb={2}>
                  {formik.values.valeurs && formik.values.valeurs.length > 0 ? (
                    formik.values.valeurs.map((valeur) => (
                      <Chip key={valeur} label={valeur} sx={{ mr: 1, mb: 1 }} />
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Aucune valeur spécifiée.
                    </Typography>
                  )}
                </Box>
                
                <Typography variant="subtitle1" gutterBottom>
                  Ambiance de travail
                </Typography>
                <Typography variant="body2" paragraph>
                  {formik.values.ambiance || 'Aucune information sur l\'ambiance de travail.'}
                </Typography>
                
                <Typography variant="subtitle1" gutterBottom>
                  Avantages
                </Typography>
                <Typography variant="body2" paragraph>
                  {formik.values.avantages || 'Aucun avantage spécifié.'}
                </Typography>
                
                <Typography variant="subtitle1" gutterBottom>
                  Présentation
                </Typography>
                <Typography variant="body2">
                  {videoPreview
                    ? 'Vidéo personnalisée téléchargée.'
                    : formik.values.useAvatarGeneration
                    ? 'Avatar IA généré.'
                    : 'Aucune présentation vidéo.'}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={1} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Profil Entreprise
        </Typography>
        
        <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        <form onSubmit={formik.handleSubmit}>
          {renderStepContent(activeStep)}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              variant="outlined"
              onClick={handleBack}
              startIcon={<ArrowBackIcon />}
              disabled={activeStep === 0}
            >
              Précédent
            </Button>
            
            <Box>
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  type="submit"
                  startIcon={<SaveIcon />}
                  disabled={isSubmitting || !formik.isValid}
                >
                  {isSubmitting ? 'Enregistrement...' : 'Enregistrer le profil'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  endIcon={<ArrowForwardIcon />}
                >
                  Suivant
                </Button>
              )}
            </Box>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default EntrepriseProfilePage;