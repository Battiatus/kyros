import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { forgotPassword, selectAuthLoading, selectAuthError, clearError } from '../../redux/slices/authSlice';

/**
 * Page de mot de passe oublié
 */
const ForgotPasswordPage = () => {
  const dispatch = useDispatch();
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const [emailSent, setEmailSent] = useState(false);

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
      .required('Email requis')
  });

  // Gestion du formulaire
  const formik = useFormik({
    initialValues: {
      email: ''
    },
    validationSchema,
    onSubmit: (values) => {
      dispatch(forgotPassword(values.email)).then((result) => {
        if (result.type === 'auth/forgotPassword/fulfilled') {
          setEmailSent(true);
        }
      });
    }
  });

  if (emailSent) {
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
              Email envoyé !
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Si un compte est associé à l'adresse <strong>{formik.values.email}</strong>, 
              vous recevrez un email avec les instructions pour réinitialiser votre mot de passe.
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Vérifiez aussi votre dossier spam.
            </Typography>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <Button
                variant="outlined"
                startIcon={<ArrowBack />}
                sx={{ mt: 2 }}
              >
                Retour à la connexion
              </Button>
            </Link>
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
        bgcolor: 'background.default'
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
              Mot de passe oublié
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Entrez votre adresse email pour recevoir un lien de réinitialisation
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
                  Envoi en cours...
                </>
              ) : (
                'Envoyer le lien de réinitialisation'
              )}
            </Button>
          </form>

          {/* Lien de retour */}
          <Box textAlign="center">
            <Link to="/login" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Button
                startIcon={<ArrowBack />}
                sx={{ color: 'text.secondary' }}
              >
                Retour à la connexion
              </Button>
            </Link>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ForgotPasswordPage;