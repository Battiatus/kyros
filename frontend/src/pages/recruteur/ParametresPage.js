import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  TextField,
  Grid,
  Divider,
  Switch,
  FormControlLabel,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tab,
  Tabs,
} from '@mui/material';
import {
  Save as SaveIcon,
  Lock as LockIcon,
  Notifications as NotificationsIcon,
  Upgrade as UpgradeIcon,
} from '@mui/icons-material';
import { selectUser } from '../../redux/slices/authSlice';

/**
 * Page de paramètres du compte
 */
const ParametresPage = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  
  const [tabValue, setTabValue] = useState(0);
  const [profileForm, setProfileForm] = useState({
    prenom: user?.prenom || '',
    nom: user?.nom || '',
    email: user?.email || '',
    telephone: user?.telephone || '',
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [notifications, setNotifications] = useState({
    email: {
      newCandidature: true,
      newMessage: true,
      entretienReminder: true,
      weeklyDigest: true,
    },
    push: {
      newCandidature: true,
      newMessage: true,
      entretienReminder: true,
      matchSuggestions: true,
    },
  });
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [successAlert, setSuccessAlert] = useState(null);
  
  // Changer d'onglet
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Mettre à jour le formulaire de profil
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  // Mettre à jour le formulaire de mot de passe
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  // Mettre à jour les notifications
  const handleNotificationChange = (type, name) => (e) => {
    setNotifications(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [name]: e.target.checked,
      },
    }));
  };
  
  // Enregistrer les modifications du profil
  const handleSaveProfile = () => {
    // Dans une application réelle, nous enverrions cette action à l'API
    console.log('Profil mis à jour:', profileForm);
    setSuccessAlert('Profil mis à jour avec succès !');
    
    // Masquer l'alerte après 3 secondes
    setTimeout(() => {
      setSuccessAlert(null);
    }, 3000);
  };
  
  // Enregistrer les modifications du mot de passe
  const handleSavePassword = () => {
    // Dans une application réelle, nous enverrions cette action à l'API
    console.log('Mot de passe mis à jour:', passwordForm);
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setPasswordDialogOpen(false);
    setSuccessAlert('Mot de passe mis à jour avec succès !');
    
    // Masquer l'alerte après 3 secondes
    setTimeout(() => {
      setSuccessAlert(null);
    }, 3000);
  };
  
  // Enregistrer les modifications des notifications
  const handleSaveNotifications = () => {
    // Dans une application réelle, nous enverrions cette action à l'API
    console.log('Préférences de notification mises à jour:', notifications);
    setSuccessAlert('Préférences de notification mises à jour avec succès !');
    
    // Masquer l'alerte après 3 secondes
    setTimeout(() => {
      setSuccessAlert(null);
    }, 3000);
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" fontWeight="bold" mb={4}>
        Paramètres
      </Typography>
      
      {successAlert && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {successAlert}
        </Alert>
      )}
      
      <Paper elevation={1} sx={{ mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Profil" />
          <Tab label="Sécurité" />
          <Tab label="Notifications" />
          <Tab label="Abonnement" />
        </Tabs>
        
        <Divider />
        
        <Box p={3}>
          {/* Profil */}
          {tabValue === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Informations personnelles
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Prénom"
                  name="prenom"
                  value={profileForm.prenom}
                  onChange={handleProfileChange}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nom"
                  name="nom"
                  value={profileForm.nom}
                  onChange={handleProfileChange}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={profileForm.email}
                  onChange={handleProfileChange}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Téléphone"
                  name="telephone"
                  value={profileForm.telephone}
                  onChange={handleProfileChange}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Box display="flex" justifyContent="flex-end" mt={2}>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSaveProfile}
                  >
                    Enregistrer les modifications
                  </Button>
                </Box>
              </Grid>
            </Grid>
          )}
          
          {/* Sécurité */}
          {tabValue === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Sécurité du compte
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      <LockIcon color="primary" sx={{ mr: 2 }} />
                      <Typography variant="h6">
                        Mot de passe
                      </Typography>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Votre mot de passe doit comporter au moins 8 caractères et inclure des lettres, des chiffres et des caractères spéciaux.
                    </Typography>
                    
                    <Typography variant="body2">
                      Dernière modification : <strong>Il y a plus de 6 mois</strong>
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      variant="outlined"
                      onClick={() => setPasswordDialogOpen(true)}
                    >
                      Modifier le mot de passe
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
              
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Connexions sociales
                    </Typography>
                    
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Box display="flex" alignItems="center">
                        <Box
                          component="img"
                          src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                          alt="Google"
                          sx={{ width: 24, height: 24, mr: 2 }}
                        />
                        <Typography>Google</Typography>
                      </Box>
                      <Typography variant="body2" color="success.main">
                        Connecté
                      </Typography>
                    </Box>
                    
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box display="flex" alignItems="center">
                        <Box
                          component="img"
                          src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png"
                          alt="LinkedIn"
                          sx={{ width: 24, height: 24, mr: 2 }}
                        />
                        <Typography>LinkedIn</Typography>
                      </Box>
                      <Button variant="outlined" size="small">
                        Connecter
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
          
          {/* Notifications */}
          {tabValue === 2 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Préférences de notification
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardHeader
                    title="Notifications par email"
                    titleTypographyProps={{ variant: 'subtitle1' }}
                  />
                  <Divider />
                  <CardContent>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notifications.email.newCandidature}
                          onChange={handleNotificationChange('email', 'newCandidature')}
                        />
                      }
                      label="Nouvelles candidatures"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notifications.email.newMessage}
                          onChange={handleNotificationChange('email', 'newMessage')}
                        />
                      }
                      label="Nouveaux messages"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notifications.email.entretienReminder}
                          onChange={handleNotificationChange('email', 'entretienReminder')}
                        />
                      }
                      label="Rappels d'entretien"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notifications.email.weeklyDigest}
                          onChange={handleNotificationChange('email', 'weeklyDigest')}
                        />
                      }
                      label="Résumé hebdomadaire"
                    />
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardHeader
                    title="Notifications push"
                    titleTypographyProps={{ variant: 'subtitle1' }}
                  />
                  <Divider />
                  <CardContent>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notifications.push.newCandidature}
                          onChange={handleNotificationChange('push', 'newCandidature')}
                        />
                      }
                      label="Nouvelles candidatures"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notifications.push.newMessage}
                          onChange={handleNotificationChange('push', 'newMessage')}
                        />
                      }
                      label="Nouveaux messages"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notifications.push.entretienReminder}
                          onChange={handleNotificationChange('push', 'entretienReminder')}
                        />
                      }
                      label="Rappels d'entretien"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notifications.push.matchSuggestions}
                          onChange={handleNotificationChange('push', 'matchSuggestions')}
                        />
                      }
                      label="Suggestions de matching"
                    />
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12}>
                <Box display="flex" justifyContent="flex-end" mt={2}>
                  <Button
                    variant="contained"
                    startIcon={<NotificationsIcon />}
                    onClick={handleSaveNotifications}
                  >
                    Enregistrer les préférences
                  </Button>
                </Box>
              </Grid>
            </Grid>
          )}
          
          {/* Abonnement */}
          {tabValue === 3 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Votre abonnement
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Alert severity="info">
                  Vous utilisez actuellement la version gratuite de Hereoz. Passez à la version premium pour bénéficier de fonctionnalités avancées.
                </Alert>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardHeader
                    title="Gratuit"
                    titleTypographyProps={{ variant: 'h6' }}
                    sx={{ bgcolor: 'action.hover', pb: 1 }}
                  />
                  <CardContent>
                    <Typography variant="h5" color="text.primary" gutterBottom>
                      0 €
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      par mois
                    </Typography>
                    
                    <Box component="ul" sx={{ pl: 2 }}>
                      <Typography component="li" variant="body2" paragraph>
                        3 offres actives maximum
                      </Typography>
                      <Typography component="li" variant="body2" paragraph>
                        Statistiques de base
                      </Typography>
                      <Typography component="li" variant="body2" paragraph>
                        Entretien IA limité
                      </Typography>
                    </Box>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                    <Button variant="outlined" disabled>
                      Plan actuel
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card variant="outlined" sx={{ height: '100%', border: '2px solid', borderColor: 'primary.main' }}>
                  <CardHeader
                    title="Premium"
                    titleTypographyProps={{ variant: 'h6' }}
                    sx={{ bgcolor: 'primary.main', color: 'white', pb: 1 }}
                  />
                  <CardContent>
                    <Typography variant="h5" color="text.primary" gutterBottom>
                      49,99 €
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      par mois
                    </Typography>
                    
                    <Box component="ul" sx={{ pl: 2 }}>
                      <Typography component="li" variant="body2" paragraph>
                        <strong>Offres illimitées</strong>
                      </Typography>
                      <Typography component="li" variant="body2" paragraph>
                        Statistiques avancées
                      </Typography>
                      <Typography component="li" variant="body2" paragraph>
                        Entretien IA illimité
                      </Typography>
                      <Typography component="li" variant="body2" paragraph>
                        Boost d'annonces
                      </Typography>
                      <Typography component="li" variant="body2" paragraph>
                        Support prioritaire
                      </Typography>
                    </Box>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                    <Button variant="contained" startIcon={<UpgradeIcon />}>
                      Passer à Premium
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardHeader
                    title="Entreprise"
                    titleTypographyProps={{ variant: 'h6' }}
                    sx={{ bgcolor: 'secondary.dark', color: 'white', pb: 1 }}
                  />
                  <CardContent>
                    <Typography variant="h5" color="text.primary" gutterBottom>
                      249,99 €
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      par mois
                    </Typography>
                    
                    <Box component="ul" sx={{ pl: 2 }}>
                      <Typography component="li" variant="body2" paragraph>
                        <strong>Tout Premium +</strong>
                      </Typography>
                      <Typography component="li" variant="body2" paragraph>
                        Utilisateurs multiples
                      </Typography>
                      <Typography component="li" variant="body2" paragraph>
                        Administration centrale
                      </Typography>
                      <Typography component="li" variant="body2" paragraph>
                        Intégration CRM
                      </Typography>
                      <Typography component="li" variant="body2" paragraph>
                        API dédiée
                      </Typography>
                    </Box>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                    <Button variant="outlined">
                      Contacter les ventes
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            </Grid>
          )}
        </Box>
      </Paper>
      
      {/* Dialog de modification du mot de passe */}
      <Dialog
        open={passwordDialogOpen}
        onClose={() => setPasswordDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Modifier le mot de passe</DialogTitle>
        <DialogContent>
          <DialogContentText paragraph>
            Pour modifier votre mot de passe, veuillez saisir votre mot de passe actuel, puis votre nouveau mot de passe.
          </DialogContentText>
          
          <TextField
            margin="dense"
            label="Mot de passe actuel"
            name="currentPassword"
            type="password"
            fullWidth
            variant="outlined"
            value={passwordForm.currentPassword}
            onChange={handlePasswordChange}
            sx={{ mb: 2 }}
          />
          
          <TextField
            margin="dense"
            label="Nouveau mot de passe"
            name="newPassword"
            type="password"
            fullWidth
            variant="outlined"
            value={passwordForm.newPassword}
            onChange={handlePasswordChange}
            sx={{ mb: 2 }}
          />
          
          <TextField
            margin="dense"
            label="Confirmer le nouveau mot de passe"
            name="confirmPassword"
            type="password"
            fullWidth
            variant="outlined"
            value={passwordForm.confirmPassword}
            onChange={handlePasswordChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordDialogOpen(false)}>Annuler</Button>
          <Button
            onClick={handleSavePassword}
            variant="contained"
            disabled={
              !passwordForm.currentPassword ||
              !passwordForm.newPassword ||
              !passwordForm.confirmPassword ||
              passwordForm.newPassword !== passwordForm.confirmPassword
            }
          >
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ParametresPage;