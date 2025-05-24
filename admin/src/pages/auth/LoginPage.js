import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  IconButton,
  InputAdornment
} from '@mui/material';
import { Visibility, VisibilityOff, AdminPanelSettings } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { login, selectAuth, selectAuthLoading, selectAuthError, clearError } from '../../redux/slices/authSlice';

/**
 * Page de connexion admin
 */
const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { isAuthenticated } = useSelector(selectAuth);
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      if (error) {
        dispatch(clearError());
      }
    };
  }, [dispatch, error]);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Email invalide')
      .required('Email requis'),
    mot_de_passe: Yup.string()
      .required('Mot de passe requis')
  });

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

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        bgcolor: 'background.default',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 2,
            backgroundColor: 'white',
          }}
        >
          {/* Header */}
          <Box textAlign="center" mb={4}>
            <AdminPanelSettings
              sx={{
                fontSize: 60,
                color: 'primary.main',
                mb: 2
              }}
            />
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 700,
                color: 'primary.main'
              }}
            >
              Hereoz Admin
            </Typography>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
              Panneau d'Administration
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Connectez-vous avec vos identifiants administrateur
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
              label="Adresse email administrateur"
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
          <Box textAlign="center">
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
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;