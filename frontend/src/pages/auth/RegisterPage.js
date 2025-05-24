import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  IconButton,
  InputAdornment,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { Visibility, VisibilityOff, Google, LinkedIn } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { register, selectAuthLoading, selectAuthError, clearError } from '../../redux/slices/authSlice';
import config from '../../config/config';

/**
 * Page d'inscription
 */
const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const initialRole = searchParams.get('role') || '';

  // Nettoyer les erreurs au démontage
  useEffect(() => {
    return () => {
      if (error) {
        dispatch(clearError());
      }
    };
  }, [dispatch, error]);

  // Validation du formulaire
  const validationSchema = Yup.object({
    nom: Yup.string()
      .min(2, 'Le nom doit contenir au moins 2 caractères')
      .max(50, 'Le nom ne peut pas dépasser 50 caractères')
      .required('Nom requis'),
    prenom: Yup.string()
      .min(2, 'Le prénom doit contenir au moins 2 caractères')
      .max(50, 'Le prénom ne peut pas dépasser 50 caractères')
      .required('Prénom requis'),
    email: Yup.string()
      .email('Email invalide')
      .required('Email requis'),
    telephone: Yup.string()
      .matches(/^(\+33|0)[1-9](\d{8})$/, 'Numéro de téléphone invalide'),
    mot_de_passe: Yup.string()
      .min(6, 'Le mot de passe doit contenir au moins 6 caractères')
      .required('Mot de passe requis'),
    confirmation_mot_de_passe: Yup.string()
      .oneOf([Yup.ref('mot_de_passe'), null], 'Les mots de passe ne correspondent pas')
      .required('Confirmation du mot de passe requise'),
    role: Yup.string()
      .oneOf(['candidat', 'recruteur'], 'Rôle invalide')
      .required('Rôle requis')
  });

  // Gestion du formulaire
  const formik = useFormik({
    initialValues: {
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      mot_de_passe: '',
      confirmation_mot_de_passe: '',
      role: initialRole
    },
    validationSchema,
    onSubmit: (values) => {
      dispatch(register(values)).then((result) => {
        if (result.type === 'auth/register/fulfilled') {
          setActiveStep(1);
        }
      });
    }
  });

  const handleTogglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const handleSocialLogin = (provider) => {
    window.location.href = config.oauth[provider];
  };

  const steps = ['Inscription', 'Vérification email'];

  if (activeStep === 1) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          bgcolor: 'background.default'
        }}
      >
        <Container maxWidth="sm">
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom color="primary" sx={{ fontWeight: 600 }}>
              Vérifiez votre email
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Un email de vérification a été envoyé à <strong>{formik.values.email}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Veuillez cliquer sur le lien dans l'email pour activer votre compte.
            </Typography>
            <Button
              variant="outlined"
              onClick={() => navigate('/login')}
              sx={{ mt: 2 }}
            >
              Aller à la connexion
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        bgcolor: 'background.default',
        py: 4
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          {/* Header */}
          <Box textAlign="center" mb={4}>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{ fontWeight: 700, color: 'primary.main' }}
            >
              Hereoz
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              Inscription
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Créez votre compte pour commencer
            </Typography>
          </Box>

          {/* Stepper */}
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Message d'erreur */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Connexions sociales */}
          <Box display="flex" gap={2} mb={3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Google />}
              onClick={() => handleSocialLogin('google')}
              sx={{ py: 1.5 }}
            >
              Google
            </Button>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<LinkedIn />}
              onClick={() => handleSocialLogin('linkedin')}
              sx={{ py: 1.5 }}
            >
              LinkedIn
            </Button>
          </Box>

          {/* Séparateur */}
          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              ou
            </Typography>
          </Divider>

          {/* Formulaire */}
          <form onSubmit={formik.handleSubmit}>
            <Box display="flex" gap={2} mb={2}>
              <TextField
                fullWidth
                id="prenom"
                name="prenom"
                label="Prénom"
                value={formik.values.prenom}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.prenom && Boolean(formik.errors.prenom)}
                helperText={formik.touched.prenom && formik.errors.prenom}
                autoComplete="given-name"
              />
              <TextField
                fullWidth
                id="nom"
                name="nom"
                label="Nom"
                value={formik.values.nom}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.nom && Boolean(formik.errors.nom)}
                helperText={formik.touched.nom && formik.errors.nom}
                autoComplete="family-name"
              />
            </Box>

            <TextField
              fullWidth
              id="email"
              name="email"
              label="Adresse email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              margin="normal"
              autoComplete="email"
            />

            <TextField
              fullWidth
              id="telephone"
              name="telephone"
              label="Téléphone (optionnel)"
              value={formik.values.telephone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.telephone && Boolean(formik.errors.telephone)}
              helperText={formik.touched.telephone && formik.errors.telephone}
              margin="normal"
              autoComplete="tel"
            />

            <FormControl fullWidth margin="normal">
              <InputLabel id="role-label">Je suis</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                name="role"
                value={formik.values.role}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.role && Boolean(formik.errors.role)}
                label="Je suis"
              >
                <MenuItem value="candidat">Un candidat (je cherche du travail)</MenuItem>
                <MenuItem value="recruteur">Un recruteur (je recrute)</MenuItem>
              </Select>
              {formik.touched.role && formik.errors.role && (
                <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                  {formik.errors.role}
                </Typography>
              )}
            </FormControl>

            <TextField
              fullWidth
              id="mot_de_passe"
              name="mot_de_passe"
              label="Mot de passe"
              type={showPassword ? 'text' : 'password'}
              value={formik.values.mot_de_passe}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.mot_de_passe && Boolean(formik.errors.mot_de_passe)}
              helperText={formik.touched.mot_de_passe && formik.errors.mot_de_passe}
              margin="normal"
              autoComplete="new-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => handleTogglePasswordVisibility('password')}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <TextField
              fullWidth
              id="confirmation_mot_de_passe"
              name="confirmation_mot_de_passe"
              label="Confirmer le mot de passe"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formik.values.confirmation_mot_de_passe}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.confirmation_mot_de_passe && Boolean(formik.errors.confirmation_mot_de_passe)}
              helperText={formik.touched.confirmation_mot_de_passe && formik.errors.confirmation_mot_de_passe}
              margin="normal"
              autoComplete="new-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => handleTogglePasswordVisibility('confirm')}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Inscription...
                </>
              ) : (
                'S\'inscrire'
              )}
            </Button>
          </form>

          {/* Lien de connexion */}
          <Box textAlign="center">
            <Typography variant="body2">
              Déjà un compte ?{' '}
              <Link to="/login" style={{ textDecoration: 'none', color: 'inherit' }}>
                <Typography component="span" color="primary" sx={{ fontWeight: 500 }}>
                  Se connecter
                </Typography>
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default RegisterPage;