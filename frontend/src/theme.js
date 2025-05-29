import { createTheme, responsiveFontSizes } from '@mui/material/styles';

// Définition des couleurs de la marque
const primaryColor = '#6366F1'; // Indigo
const secondaryColor = '#F59E0B'; // Ambre

let theme = createTheme({
  palette: {
    primary: {
      main: primaryColor,
      light: '#818CF8',
      dark: '#4F46E5',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: secondaryColor,
      light: '#FCD34D',
      dark: '#D97706',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#10B981',
      light: '#A7F3D0',
      dark: '#065F46',
    },
    error: {
      main: '#EF4444',
      light: '#FEE2E2',
      dark: '#991B1B',
    },
    warning: {
      main: '#F59E0B',
      light: '#FEF3C7',
      dark: '#92400E',
    },
    info: {
      main: '#3B82F6',
      light: '#DBEAFE',
      dark: '#1E40AF',
    },
    grey: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    },
    background: {
      default: '#F8FAFC',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#111827',
      secondary: '#6B7280',
      disabled: '#9CA3AF',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
    },
    subtitle1: {
      fontWeight: 500,
      fontSize: '1rem',
    },
    subtitle2: {
      fontWeight: 500,
      fontSize: '0.875rem',
    },
    body1: {
      fontSize: '1rem',
    },
    body2: {
      fontSize: '0.875rem',
    },
    button: {
      fontWeight: 500,
      textTransform: 'none',
    },
    caption: {
      fontSize: '0.75rem',
    },
    overline: {
      fontSize: '0.75rem',
      textTransform: 'uppercase',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0px 1px 2px rgba(0, 0, 0, 0.06), 0px 1px 3px rgba(0, 0, 0, 0.1)',
    '0px 1px 2px rgba(0, 0, 0, 0.06), 0px 2px 4px rgba(0, 0, 0, 0.1)',
    '0px 1px 3px rgba(0, 0, 0, 0.06), 0px 4px 6px rgba(0, 0, 0, 0.1)',
    '0px 2px 4px rgba(0, 0, 0, 0.06), 0px 6px 10px rgba(0, 0, 0, 0.1)',
    '0px 3px 5px rgba(0, 0, 0, 0.06), 0px 8px 15px rgba(0, 0, 0, 0.1)',
    '0px 3px 6px rgba(0, 0, 0, 0.06), 0px 10px 20px rgba(0, 0, 0, 0.1)',
    '0px 4px 8px rgba(0, 0, 0, 0.06), 0px 12px 25px rgba(0, 0, 0, 0.1)',
    '0px 5px 10px rgba(0, 0, 0, 0.06), 0px 15px 30px rgba(0, 0, 0, 0.1)',
    '0px 6px 12px rgba(0, 0, 0, 0.06), 0px 18px 35px rgba(0, 0, 0, 0.1)',
    '0px 7px 14px rgba(0, 0, 0, 0.06), 0px 20px 40px rgba(0, 0, 0, 0.1)',
    '0px 8px 16px rgba(0, 0, 0, 0.06), 0px 22px 45px rgba(0, 0, 0, 0.1)',
    '0px 9px 18px rgba(0, 0, 0, 0.06), 0px 25px 50px rgba(0, 0, 0, 0.1)',
    '0px 10px 20px rgba(0, 0, 0, 0.06), 0px 28px 55px rgba(0, 0, 0, 0.1)',
    '0px 11px 22px rgba(0, 0, 0, 0.06), 0px 30px 60px rgba(0, 0, 0, 0.1)',
    '0px 12px 24px rgba(0, 0, 0, 0.06), 0px 32px 65px rgba(0, 0, 0, 0.1)',
    '0px 13px 26px rgba(0, 0, 0, 0.06), 0px 35px 70px rgba(0, 0, 0, 0.1)',
    '0px 14px 28px rgba(0, 0, 0, 0.06), 0px 38px 75px rgba(0, 0, 0, 0.1)',
    '0px 15px 30px rgba(0, 0, 0, 0.06), 0px 40px 80px rgba(0, 0, 0, 0.1)',
    '0px 16px 32px rgba(0, 0, 0, 0.06), 0px 42px 85px rgba(0, 0, 0, 0.1)',
    '0px 17px 34px rgba(0, 0, 0, 0.06), 0px 45px 90px rgba(0, 0, 0, 0.1)',
    '0px 18px 36px rgba(0, 0, 0, 0.06), 0px 48px 95px rgba(0, 0, 0, 0.1)',
    '0px 19px 38px rgba(0, 0, 0, 0.06), 0px 50px 100px rgba(0, 0, 0, 0.1)',
    '0px 20px 40px rgba(0, 0, 0, 0.06), 0px 52px 105px rgba(0, 0, 0, 0.1)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          fontWeight: 500,
        },
        contained: {
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.06), 0px 4px 6px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.06), 0px 8px 16px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.06), 0px 4px 6px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 12,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          textTransform: 'none',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline',
          },
        },
      },
    },
  },
});

// Activer les tailles de police responsive
theme = responsiveFontSizes(theme);

export default theme;