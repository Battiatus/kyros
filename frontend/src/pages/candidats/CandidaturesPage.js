import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, 
  Typography, 
  Paper, 
  Tabs, 
  Tab, 
  Divider, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar, 
  Avatar, 
  Chip, 
  Button, 
  IconButton,
  Badge,
  InputBase,
  Skeleton,
  CircularProgress
} from '@mui/material';
import { 
  Search as SearchIcon, 
  FilterList as FilterListIcon,
  ArrowForward as ArrowForwardIcon,
  BusinessCenter as BusinessCenterIcon,
  ChatBubbleOutline as ChatBubbleOutlineIcon,
  Event as EventIcon,
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Description as DescriptionIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Redux
import { fetchCandidatures, selectAllCandidatures, selectCandidatureLoading } from '../../redux/slices/candidatureSlice';
import { selectUser } from '../../redux/slices/authSlice';

/**
 * Page de gestion des candidatures pour le candidat
 */
const CandidaturesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const user = useSelector(selectUser);
  const candidatures = useSelector(selectAllCandidatures);
  const loading = useSelector(selectCandidatureLoading);
  
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCandidatures, setFilteredCandidatures] = useState([]);
  
  // Charger les candidatures
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCandidatures({ user_id: user.id }));
    }
  }, [dispatch, user?.id]);
  
  // Filtrer les candidatures selon l'onglet et la recherche
  useEffect(() => {
    if (!candidatures) return;
    
    let filtered = [...candidatures];
    
    // Filtrer par statut selon l'onglet actif
    if (tabValue === 1) {
      filtered = filtered.filter(c => ['new', 'viewed', 'interview'].includes(c.statut));
    } else if (tabValue === 2) {
      filtered = filtered.filter(c => c.statut === 'accepted');
    } else if (tabValue === 3) {
      filtered = filtered.filter(c => c.statut === 'rejected');
    }
    
    // Filtrer par recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(c => 
        c.offre?.titre?.toLowerCase().includes(query) ||
        c.offre?.entreprise?.nom?.toLowerCase().includes(query) ||
        c.offre?.localisation?.toLowerCase().includes(query)
      );
    }
    
    // Trier par date (plus récent d'abord)
    filtered.sort((a, b) => new Date(b.date_candidature) - new Date(a.date_candidature));
    
    setFilteredCandidatures(filtered);
  }, [candidatures, tabValue, searchQuery]);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Formatter la date en format relatif
  const formatRelativeDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return "Aujourd'hui";
    } else if (diffDays === 1) {
      return 'Hier';
    } else if (diffDays < 7) {
      return `Il y a ${diffDays} jours`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `Il y a ${weeks} semaine${weeks > 1 ? 's' : ''}`;
    } else {
      const months = Math.floor(diffDays / 30);
      return `Il y a ${months} mois`;
    }
  };
  
  // Rendu du statut avec chip
  const renderStatus = (status) => {
    switch (status) {
      case 'new':
        return <Chip size="small" label="Envoyée" color="primary" />;
      case 'viewed':
        return <Chip size="small" label="Vue" color="info" icon={<VisibilityIcon />} />;
      case 'interview':
        return <Chip size="small" label="Entretien" color="warning" icon={<EventIcon />} />;
      case 'accepted':
        return <Chip size="small" label="Acceptée" color="success" icon={<CheckCircleIcon />} />;
      case 'rejected':
        return <Chip size="small" label="Refusée" color="error" icon={<CancelIcon />} />;
      case 'pending':
        return <Chip size="small" label="En attente" color="default" icon={<ScheduleIcon />} />;
      default:
        return <Chip size="small" label={status} color="default" />;
    }
  };
  
  // Rendu du squelette de chargement
  const renderSkeletons = () => {
    return Array(5).fill(0).map((_, index) => (
      <ListItem key={index} divider>
        <ListItemAvatar>
          <Skeleton variant="circular" width={40} height={40} />
        </ListItemAvatar>
        <ListItemText
          primary={<Skeleton variant="text" width="70%" />}
          secondary={<Skeleton variant="text" width="40%" />}
        />
        <Skeleton variant="rectangular" width={80} height={32} sx={{ borderRadius: 16 }} />
      </ListItem>
    ));
  };
  
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        Mes candidatures
      </Typography>
      
      {/* Barre de recherche et filtres */}
      <Paper 
        elevation={1} 
        sx={{ 
          p: 1, 
          display: 'flex', 
          alignItems: 'center', 
          mb: 3, 
          borderRadius: 2 
        }}
      >
        <IconButton sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton>
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Rechercher une candidature..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
        <IconButton sx={{ p: 1 }}>
          <FilterListIcon />
        </IconButton>
      </Paper>
      
      {/* Onglets */}
      <Paper elevation={1} sx={{ mb: 3, borderRadius: 2 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Toutes" />
          <Tab label="En cours" />
          <Tab label="Acceptées" />
          <Tab label="Refusées" />
        </Tabs>
      </Paper>
      
      {/* Liste des candidatures */}
      <Paper elevation={1} sx={{ borderRadius: 2 }}>
        {loading ? (
          <List>{renderSkeletons()}</List>
        ) : filteredCandidatures.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <BusinessCenterIcon sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.3 }} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Aucune candidature trouvée
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {searchQuery 
                ? "Aucune candidature ne correspond à votre recherche." 
                : "Vous n'avez pas encore postulé à des offres d'emploi."}
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => navigate('/candidat/swipe')}
              sx={{ mt: 1 }}
            >
              Découvrir des offres
            </Button>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {filteredCandidatures.map((candidature) => (
              <ListItem 
                key={candidature.id} 
                divider
                sx={{ 
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.03)' },
                }}
                onClick={() => navigate(`/candidat/candidatures/${candidature.id}`)}
              >
                <ListItemAvatar>
                  <Avatar
                    src={candidature.offre?.entreprise?.logo}
                    alt={candidature.offre?.entreprise?.nom}
                  >
                    {candidature.offre?.entreprise?.nom?.charAt(0) || 'E'}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center">
                      <Typography variant="subtitle1" fontWeight="medium">
                        {candidature.offre?.titre || 'Offre d\'emploi'}
                      </Typography>
                      {candidature.unread_messages > 0 && (
                        <Badge 
                          badgeContent={candidature.unread_messages} 
                          color="primary" 
                          sx={{ ml: 2 }}
                        >
                          <ChatBubbleOutlineIcon color="action" fontSize="small" />
                        </Badge>
                      )}
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography component="span" variant="body2" color="text.primary">
                        {candidature.offre?.entreprise?.nom || 'Entreprise'} • {candidature.offre?.localisation || 'Non spécifié'}
                      </Typography>
                      <Typography component="div" variant="caption" color="text.secondary">
                        Postuléé {formatRelativeDate(candidature.date_candidature)}
                      </Typography>
                    </>
                  }
                />
                <Box display="flex" alignItems="center">
                  {renderStatus(candidature.statut)}
                  <IconButton
                    size="small"
                    sx={{ ml: 1 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/candidat/candidatures/${candidature.id}`);
                    }}
                  >
                    <ArrowForwardIcon fontSize="small" />
                  </IconButton>
                </Box>
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
};

export default CandidaturesPage;