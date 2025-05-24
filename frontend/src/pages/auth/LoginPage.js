import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
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
  Divider,
  IconButton,
  InputAdornment
} from '@mui/material';
import { Visibility, VisibilityOff, Google, LinkedIn } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { login, selectAuth, selectAuthLoading, selectAuthError, clearError } from '../../redux/slices/authSlice';
import config from '../../config/config';

/**
 * Page de connexion
 */
const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const { isAuthenticated, user } = useSelector(selectAuth);
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  
  const [showPassword, setShowPassword] = useState(false);

  // Redirection après connexion réussie
  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectTo = location.state?.from?.pathname || 
        (user.role === 'candidat' ? '/candidat/dashboard' : '/recruteur/dashboard');
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, user, navigate, location]);

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
    email: Yup.string()
      .email('Email invalide')
      .required('Email requis'),
    mot_de_passe: Yup.string()
      .required('Mot de passe requis')
  });

  // Gestion du formulaire
  const formik = useFormik({
    initialValues: {
      email: '',
      mot_de_passe: ''
    },
    validationSchema,
    onSubmit: (values) => {
      dispatch(login(values));
    }
  });

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSocialLogin = (provider) => {
    window.location.href = config.oauth[provider];
  };

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
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 2
          }}
        >
          {/* Header */}
          <Box textAlign="center" mb={4}>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 700,
                color: 'primary.main'
              }}
            >
              Hereoz
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              Connexion
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Connectez-vous à votre compte pour continuer
            </Typography>
          </Box>

          {/* Message d'erreur */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Formulaire */}
          <form onSubmit={formik.handleSubmit}>
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
              autoFocus
            />

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
              autoComplete="current-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
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
                  Connexion...
                </>
              ) : (
                'Se connecter'
              )}
            </Button>
          </form>

          {/* Mot de passe oublié */}
          <Box textAlign="center" mb={3}>
            <Link
              to="/forgot-password"
              style={{
                textDecoration: 'none',
                color: 'inherit'
              }}
            >
              <Typography variant="body2" color="primary">
                Mot de passe oublié ?
              </Typography>
            </Link>
          </Box>

          {/* Séparateur */}
          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              ou
            </Typography>
          </Divider>

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

          {/* Lien d'inscription */}
          <Box textAlign="center">
            <Typography variant="body2">
              Pas encore de compte ?{' '}
              <Link
                to="/register"
                style={{
                  textDecoration: 'none',
                  color: 'inherit'
                }}
              >
                <Typography component="span" color="primary" sx={{ fontWeight: 500 }}>
                  S'inscrire
                </Typography>
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;