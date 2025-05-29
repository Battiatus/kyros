import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  useMediaQuery,
  Tooltip,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Work as WorkIcon,
  Person as PersonIcon,
  Chat as ChatIcon,
  BarChart as ChartIcon,
  Business as BusinessIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  ExitToApp as LogoutIcon,
  ChevronLeft as ChevronLeftIcon,
} from '@mui/icons-material';
import { logout, selectUser } from '../../redux/slices/authSlice';

// Largeur du drawer
const drawerWidth = 240;

/**
 * Layout pour le module recruteur
 */
const RecruteurLayout = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const user = useSelector(selectUser);
  
  const [open, setOpen] = useState(!isMobile);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
  
  // Menu items
  const menuItems = [
    {
      text: 'Tableau de bord',
      icon: <DashboardIcon />,
      path: '/recruteur/dashboard',
    },
    {
      text: 'Offres d\'emploi',
      icon: <WorkIcon />,
      path: '/recruteur/offres',
    },
    {
      text: 'Candidats',
      icon: <PersonIcon />,
      path: '/recruteur/matching',
    },
    {
      text: 'Candidatures',
      icon: <PersonIcon />,
      path: '/recruteur/candidatures',
      badge: 12, // Dans une application réelle, nous récupérerions ce nombre depuis l'API
    },
    {
      text: 'Messages',
      icon: <ChatIcon />,
      path: '/recruteur/messages',
      badge: 3, // Dans une application réelle, nous récupérerions ce nombre depuis l'API
    },
    {
      text: 'Statistiques',
      icon: <ChartIcon />,
      path: '/recruteur/statistiques',
    },
    {
      text: 'Entreprise',
      icon: <BusinessIcon />,
      path: '/recruteur/entreprise/profil',
    },
  ];
  
  // Toggle du drawer
  const toggleDrawer = () => {
    setOpen(!open);
  };
  
  // Ouvrir le menu utilisateur
  const handleUserMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  // Fermer le menu utilisateur
  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };
  
  // Ouvrir le menu de notifications
  const handleNotificationsOpen = (event) => {
    setNotificationsAnchorEl(event.currentTarget);
  };
  
  // Fermer le menu de notifications
  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null);
  };
  
  // Déconnexion
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };
  
  // Vérifier si un item est actif
  const isActive = (path) => {
    // Pour les sous-chemins comme /recruteur/offres/nouvelle, on considère /recruteur/offres comme actif
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  return (
    <Box sx={{ display: 'flex' }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          backgroundColor: 'white',
          color: 'text.primary',
          boxShadow: 1,
          ...(open && !isMobile && {
            width: `calc(100% - ${drawerWidth}px)`,
            ml: `${drawerWidth}px`,
          }),
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleDrawer}
            sx={{ mr: 2 }}
          >
            {open && !isMobile ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
          
          <Typography
            variant="h6"
            component="div"
            fontWeight="bold"
            color="primary"
            sx={{ flexGrow: 1 }}
          >
            Hereoz
          </Typography>
          
          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton
              color="inherit"
              onClick={handleNotificationsOpen}
            >
              <Badge badgeContent={5} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          
          {/* Menu utilisateur */}
          <Box sx={{ ml: 2, display: 'flex', alignItems: 'center' }}>
            <IconButton
              onClick={handleUserMenuOpen}
              size="small"
              edge="end"
              aria-label="compte utilisateur"
              aria-haspopup="true"
            >
              <Avatar
                alt={user?.prenom}
                src="/static/images/avatar/1.jpg"
                sx={{ width: 32, height: 32 }}
              >
                {user?.prenom?.charAt(0)}
              </Avatar>
            </IconButton>
            {!isMobile && (
              <Typography variant="body2" sx={{ ml: 1 }}>
                {user?.prenom} {user?.nom}
              </Typography>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Menu utilisateur */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleUserMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => {
          navigate('/recruteur/profil');
          handleUserMenuClose();
        }}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Mon profil</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => {
          navigate('/recruteur/parametres');
          handleUserMenuClose();
        }}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Paramètres</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Déconnexion</ListItemText>
        </MenuItem>
      </Menu>
      
      {/* Menu notifications */}
      <Menu
        anchorEl={notificationsAnchorEl}
        open={Boolean(notificationsAnchorEl)}
        onClose={handleNotificationsClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: { width: 320, maxHeight: 400 },
        }}
      >
        <MenuItem>
          <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 'bold', width: '100%' }}>
            Notifications
          </Typography>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleNotificationsClose}>
          <Box>
            <Typography variant="body2" fontWeight="bold">
              Nouvelle candidature
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Marie Dupont a postulé à votre offre "Chef de Rang"
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem onClick={handleNotificationsClose}>
          <Box>
            <Typography variant="body2" fontWeight="bold">
              Message reçu
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Thomas Martin vous a envoyé un message
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem onClick={handleNotificationsClose}>
          <Box>
            <Typography variant="body2" fontWeight="bold">
              Entretien à venir
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Entretien avec Lucas Petit demain à 14h
            </Typography>
          </Box>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => {
          navigate('/recruteur/notifications');
          handleNotificationsClose();
        }}>
          <Typography variant="body2" color="primary" align="center" sx={{ width: '100%' }}>
            Voir toutes les notifications
          </Typography>
        </MenuItem>
      </Menu>
      
      {/* Drawer */}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? open : true}
        onClose={isMobile ? toggleDrawer : undefined}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', mt: 2 }}>
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  selected={isActive(item.path)}
                  onClick={() => navigate(item.path)}
                  sx={{
                    borderRadius: '0 20px 20px 0',
                    mr: 2,
                    ml: 1,
                    mb: 0.5,
                    ...(isActive(item.path) && {
                      bgcolor: 'primary.light',
                      color: 'primary.contrastText',
                      '&:hover': {
                        bgcolor: 'primary.main',
                      },
                    }),
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive(item.path) ? 'primary.contrastText' : 'inherit',
                    }}
                  >
                    {item.badge ? (
                      <Badge badgeContent={item.badge} color="error">
                        {item.icon}
                      </Badge>
                    ) : (
                      item.icon
                    )}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => navigate('/recruteur/parametres')}
                sx={{
                  borderRadius: '0 20px 20px 0',
                  mr: 2,
                  ml: 1,
                }}
              >
                <ListItemIcon>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText primary="Paramètres" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={handleLogout}
                sx={{
                  borderRadius: '0 20px 20px 0',
                  mr: 2,
                  ml: 1,
                }}
              >
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Déconnexion" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
      
      {/* Contenu principal */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default RecruteurLayout;