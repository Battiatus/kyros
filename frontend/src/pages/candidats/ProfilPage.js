import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  Avatar,
  Grid,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  LinearProgress,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  TextField
} from '@mui/material';
import {
  Edit as EditIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  Language as LanguageIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationOnIcon,
  Videocam as VideocamIcon,
  CloudUpload as CloudUploadIcon,
  Share as ShareIcon,
  VerifiedUser as VerifiedUserIcon,
  Help as HelpIcon,
  Add as AddIcon
} from '@mui/icons-material';

// Redux
import { fetchProfile, selectProfile, selectProfileLoading } from '../../redux/slices/profileSlice';
import { selectUser } from '../../redux/slices/authSlice';

/**
 * Page de profil du candidat
 */
const ProfilPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const user = useSelector(selectUser);
  const profile = useSelector(selectProfile);
  const loading = useSelector(selectProfileLoading);
  
  const [infoDialog, setInfoDialog] = useState(false);
  const [shareDialog, setShareDialog] = useState(false);
  
  // Charger le profil
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchProfile(user.id));
    }
  }, [dispatch, user?.id]);
  
  // Calculer le pourcentage de complétion du profil
  const calculateProfileCompletion = () => {
    if (!profile) return 0;
    
    const requiredFields = [
      'nom', 'prenom', 'email', 'telephone', 
      'resume_pro', 'photo_profil', 'experiences', 
      'competences', 'formations', 'langues'
    ];
    
    let filledFields = 0;
    
    requiredFields.forEach(field => {
      if (profile[field] && 
          (typeof profile[field] !== 'object' || 
           (Array.isArray(profile[field]) && profile[field].length > 0) ||
           (Object.keys(profile[field]).length > 0))) {
        filledFields++;
      }
    });
    
    return Math.round((filledFields / requiredFields.length) * 100);
  };

  const profileCompletion = calculateProfileCompletion();
  
  if (loading || !profile) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Mon profil
        </Typography>
        <LinearProgress sx={{ mt: 2 }} />
      </Box>
    );
  }
  
  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Mon profil
        </Typography>
        <Box>
          <Button 
            variant="outlined" 
            startIcon={<ShareIcon />}
            onClick={() => setShareDialog(true)}
            sx={{ mr: 2 }}
          >
            Partager
          </Button>
          <Button 
            variant="contained" 
            startIcon={<EditIcon />}
            onClick={() => navigate('/candidat/profil/edit')}
          >
            Modifier
          </Button>
        </Box>
      </Box>
      
      {/* Alerte si profil incomplet */}
      {profileCompletion < 100 && (
        <Alert 
          severity="warning" 
          sx={{ mb: 3 }}
          action={
            <Button 
              color="inherit" 
              size="small"
              onClick={() => navigate('/candidat/profil/edit')}
            >
              Compléter
            </Button>
          }
        >
          Votre profil est complété à {profileCompletion}%. Un profil complet augmente vos chances de trouver un emploi.
        </Alert>
      )}
      
      {/* Carte principale avec informations de base */}
      <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar
              src={profile.photo_profil}
              alt={`${profile.prenom} ${profile.nom}`}
              sx={{ width: 150, height: 150, mb: 2 }}
            >
              {profile.prenom?.charAt(0)}
            </Avatar>
            
            <Box sx={{ width: '100%', mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom textAlign="center">
                Complétion du profil
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={profileCompletion} 
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  bgcolor: 'background.default',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: profileCompletion < 50 ? 'error.main' : 
                             profileCompletion < 80 ? 'warning.main' : 
                             'success.main'
                  }
                }}
              />
              <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                {profileCompletion}%
              </Typography>
            </Box>
            
            {profile.verified && (
              <Chip 
                icon={<VerifiedUserIcon />} 
                label="Profil vérifié" 
                color="success" 
                sx={{ mb: 1 }}
              />
            )}
            
            {profile.video_presentation && (
              <Button
                variant="outlined"
                startIcon={<VideocamIcon />}
                size="small"
                sx={{ mb: 1, width: '100%' }}
              >
                Voir ma vidéo
              </Button>
            )}
          </Grid>
          
          <Grid item xs={12} md={9}>
            <Box display="flex" alignItems="baseline" mb={1}>
              <Typography variant="h5" component="h2" fontWeight="bold">
                {profile.prenom} {profile.nom}
              </Typography>
              {profile.disponible && (
                <Chip 
                  label="Disponible immédiatement" 
                  color="primary" 
                  size="small" 
                  sx={{ ml: 2 }}
                />
              )}
            </Box>
            
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {profile.titre || 'Professionnel de l\'hôtellerie-restauration'}
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" paragraph>
                {profile.resume_pro || 'Aucun résumé professionnel ajouté.'}
              </Typography>
            </Box>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center" mb={1}>
                  <EmailIcon color="action" sx={{ mr: 1 }} />
                  <Typography variant="body2">{profile.email}</Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center" mb={1}>
                  <PhoneIcon color="action" sx={{ mr: 1 }} />
                  <Typography variant="body2">{profile.telephone || 'Non renseigné'}</Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center" mb={1}>
                  <LocationOnIcon color="action" sx={{ mr: 1 }} />
                  <Typography variant="body2">{profile.localisation || 'Non renseigné'}</Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center" mb={1}>
                  <PersonIcon color="action" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    {profile.nationalite || 'Non renseigné'} 
                    {profile.date_naissance && `, ${new Date().getFullYear() - new Date(profile.date_naissance).getFullYear()} ans`}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
      
      <Grid container spacing={3}>
        {/* Compétences */}
        <Grid item xs={12} md={6}>
          <Paper elevation={1} sx={{ p: 3, height: '100%', borderRadius: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" fontWeight="medium">
                Compétences
              </Typography>
              <Tooltip title="Ajouter des compétences">
                <IconButton size="small" onClick={() => navigate('/candidat/profil/edit')}>
                  <AddIcon />
                </IconButton>
              </Tooltip>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            {!profile.competences || profile.competences.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                Aucune compétence ajoutée.
              </Typography>
            ) : (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {profile.competences.map((comp, index) => (
                  <Chip 
                    key={index} 
                    label={`${comp.competence} (${comp.niveau})`} 
                    variant="outlined"
                  />
                ))}
              </Box>
            )}
          </Paper>
        </Grid>
        
        {/* Langues */}
        <Grid item xs={12} md={6}>
          <Paper elevation={1} sx={{ p: 3, height: '100%', borderRadius: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" fontWeight="medium">
                Langues
              </Typography>
              <Tooltip title="Ajouter des langues">
                <IconButton size="small" onClick={() => navigate('/candidat/profil/edit')}>
                  <AddIcon />
                </IconButton>
              </Tooltip>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            {!profile.langues || profile.langues.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                Aucune langue ajoutée.
              </Typography>
            ) : (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {profile.langues.map((langue, index) => (
                  <Chip 
                    key={index} 
                    icon={<LanguageIcon />}
                    label={`${langue.langue} (${langue.niveau})`} 
                    variant="outlined"
                  />
                ))}
              </Box>
            )}
          </Paper>
        </Grid>
        
        {/* Expériences professionnelles */}
        <Grid item xs={12}>
          <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" fontWeight="medium">
                Expériences professionnelles
              </Typography>
              <Tooltip title="Ajouter une expérience">
                <IconButton size="small" onClick={() => navigate('/candidat/profil/edit')}>
                  <AddIcon />
                </IconButton>
              </Tooltip>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            {!profile.experiences || profile.experiences.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                Aucune expérience professionnelle ajoutée.
              </Typography>
            ) : (
              <List sx={{ p: 0 }}>
                {profile.experiences.map((exp, index) => (
                  <React.Fragment key={index}>
                    <ListItem 
                      alignItems="flex-start"
                      sx={{ px: 0 }}
                    >
                      <ListItemIcon>
                        <WorkIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center">
                            <Typography variant="subtitle1" fontWeight="medium">
                              {exp.poste}
                            </Typography>
                            {exp.validated && (
                              <Tooltip title="Expérience vérifiée">
                                <VerifiedUserIcon color="success" fontSize="small" sx={{ ml: 1 }} />
                              </Tooltip>
                            )}
                          </Box>
                        }
                        secondary={
                          <>
                            <Typography component="span" variant="body2" color="text.primary">
                              {exp.entreprise}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {new Date(exp.date_debut).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })} - 
                              {exp.date_fin ? new Date(exp.date_fin).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' }) : 'Présent'}
                            </Typography>
                            <Typography variant="body2" paragraph sx={{ mt: 1 }}>
                              {exp.description}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    {index < profile.experiences.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
        
        {/* Formations */}
        <Grid item xs={12}>
          <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" fontWeight="medium">
                Formation
              </Typography>
              <Tooltip title="Ajouter une formation">
                <IconButton size="small" onClick={() => navigate('/candidat/profil/edit')}>
                  <AddIcon />
                </IconButton>
              </Tooltip>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            {!profile.formations || profile.formations.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                Aucune formation ajoutée.
              </Typography>
            ) : (
              <List sx={{ p: 0 }}>
                {profile.formations.map((formation, index) => (
                  <React.Fragment key={index}>
                    <ListItem 
                      alignItems="flex-start"
                      sx={{ px: 0 }}
                    >
                      <ListItemIcon>
                        <SchoolIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle1" fontWeight="medium">
                            {formation.diplome}
                          </Typography>
                        }
                        secondary={
                          <>
                            <Typography component="span" variant="body2" color="text.primary">
                              {formation.etablissement}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {new Date(formation.date_debut).getFullYear()} - {formation.date_fin ? new Date(formation.date_fin).getFullYear() : 'Présent'}
                            </Typography>
                            {formation.description && (
                              <Typography variant="body2" paragraph sx={{ mt: 1 }}>
                                {formation.description}
                              </Typography>
                            )}
                          </>
                        }
                      />
                    </ListItem>
                    {index < profile.formations.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>
      
      {/* Dialog d'info sur le profil vérifié */}
      <Dialog open={infoDialog} onClose={() => setInfoDialog(false)}>
        <DialogTitle>Profil vérifié</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Un profil vérifié signifie que les expériences professionnelles ont été confirmées par d'anciens employeurs ou collègues. Cela augmente significativement la confiance des recruteurs.
          </DialogContentText>
          <DialogContentText sx={{ mt: 2 }}>
            Pour faire vérifier votre profil, ajoutez des référents à vos expériences professionnelles. Nous leur enverrons une demande de confirmation.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInfoDialog(false)}>Fermer</Button>
          <Button variant="contained" onClick={() => {
            setInfoDialog(false);
            navigate('/candidat/profil/edit');
          }}>
            Ajouter des référents
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Dialog de partage du profil */}
      <Dialog open={shareDialog} onClose={() => setShareDialog(false)}>
        <DialogTitle>Partager mon profil</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Votre profil est accessible via le lien ci-dessous. Vous pouvez le partager avec des recruteurs ou sur vos réseaux sociaux.
          </DialogContentText>
          <TextField
            fullWidth
            margin="dense"
            value={`https://hereoz.io/profil/${user.id}`}
            InputProps={{
              readOnly: true,
            }}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShareDialog(false)}>Fermer</Button>
          <Button 
            variant="contained" 
            onClick={() => {
              navigator.clipboard.writeText(`https://hereoz.io/profil/${user.id}`);
              // Notification de copie
            }}
          >
            Copier le lien
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProfilPage;