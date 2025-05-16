import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, CssBaseline, Drawer } from '@mui/material';
import { styled } from '@mui/system';

import Header from './Header';
import Sidebar from './Sidebar';

// Largeur du sidebar
const drawerWidth = 240;

// Composant Box stylisé pour le contenu principal
const Main = styled(Box)(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
  [theme.breakpoints.up('sm')]: {
    marginLeft: 0,
  },
}));

/**
 * Layout principal de l'application
 * 
 * @param {Object} props - Propriétés du composant
 * @param {string} props.userRole - Rôle de l'utilisateur (candidat ou recruteur)
 * @returns {JSX.Element} Le composant Layout
 */
const Layout = ({ userRole }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Gérer l'ouverture/fermeture du drawer sur mobile
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      
      {/* Header */}
      <Header 
        drawerWidth={drawerWidth} 
        onDrawerToggle={handleDrawerToggle} 
        userRole={userRole}
      />
      
      {/* Sidebar Mobile */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          <Sidebar userRole={userRole} onDrawerToggle={handleDrawerToggle} />
        </Drawer>
        
        {/* Sidebar Desktop */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          <Sidebar userRole={userRole} />
        </Drawer>
      </Box>
      
      {/* Contenu principal */}
      <Main open={!mobileOpen} sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
        <Box component="div" sx={{ mt: 8 }}>
          <Outlet />
        </Box>
      </Main>
    </Box>
  );
};

export default Layout;