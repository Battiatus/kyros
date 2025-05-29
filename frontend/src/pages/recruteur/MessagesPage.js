import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
  TextField,
  InputAdornment,
  Badge,
  Chip,
  IconButton,
  CircularProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Circle as CircleIcon,
} from '@mui/icons-material';

/**
 * Page de liste des messages
 */
const MessagesPage = () => {
  const navigate = useNavigate();
  
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Charger les conversations
  useEffect(() => {
    // Dans une application réelle, nous ferions un appel API
    setLoading(true);
    
    // Simulation de délai réseau avec données fictives
    setTimeout(() => {
      const mockConversations = [
        {
          id: 1,
          otherUser: {
            id: 101,
            prenom: 'Marie',
            nom: 'Dupont',
            photo: null,
            titre: 'Chef de Rang',
          },
          offre: {
            id: 201,
            titre: 'Chef de Rang - Restaurant Le Gourmet',
          },
          lastMessage: {
            text: 'Bonjour, je suis disponible pour un entretien mercredi prochain si cela vous convient.',
            sender: 'other',
            date: '2025-05-28T10:30:00',
            read: false,
          },
          unreadCount: 1,
        },
        {
          id: 2,
          otherUser: {
            id: 102,
            prenom: 'Thomas',
            nom: 'Martin',
            photo: null,
            titre: 'Barman',
          },
          offre: {
            id: 202,
            titre: 'Barman expérimenté - Bar Le Cocktail',
          },
          lastMessage: {
            text: 'Merci pour votre réponse. Je vous confirme ma disponibilité pour l\'entretien.',
            sender: 'me',
            date: '2025-05-27T15:45:00',
            read: true,
          },
          unreadCount: 0,
        },
        {
          id: 3,
          otherUser: {
            id: 103,
            prenom: 'Sophie',
            nom: 'Bernard',
            photo: null,
            titre: 'Serveuse',
          },
          offre: {
            id: 201,
            titre: 'Chef de Rang - Restaurant Le Gourmet',
          },
          lastMessage: {
            text: 'Je vous remercie pour cette opportunité. Pourriez-vous me donner plus d\'informations sur les horaires de travail ?',
            sender: 'other',
            date: '2025-05-26T09:15:00',
            read: false,
          },
          unreadCount: 2,
        },
      ];
      
      setConversations(mockConversations);
      setLoading(false);
    }, 1000);
  }, []);
  
  // Formater la date relative (aujourd'hui, hier, etc.)
  const formatRelativeDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return formatTime(dateString);
    } else if (diffDays === 1) {
      return 'Hier';
    } else if (diffDays < 7) {
      const options = { weekday: 'long' };
      return date.toLocaleDateString('fr-FR', options);
    } else {
      const options = { day: 'numeric', month: 'short' };
      return date.toLocaleDateString('fr-FR', options);
    }
  };
  
  // Formater l'heure
  const formatTime = (dateString) => {
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleTimeString('fr-FR', options);
  };
  
  // Tronquer le texte s'il est trop long
  const truncateText = (text, maxLength = 60) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };
  
  // Obtenir les initiales pour l'avatar
  const getInitials = (prenom, nom) => {
    return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();
  };
  
  // Filtrer les conversations selon la recherche
  const filteredConversations = conversations.filter(conversation => {
    const fullName = `${conversation.otherUser.prenom} ${conversation.otherUser.nom}`.toLowerCase();
    const offreTitle = conversation.offre?.titre.toLowerCase() || '';
    const searchLower = search.toLowerCase();
    
    return fullName.includes(searchLower) || offreTitle.includes(searchLower);
  });
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" fontWeight="bold" mb={4}>
        Messages
      </Typography>
      
      <Paper elevation={1}>
        <Box p={2}>
          <TextField
            fullWidth
            placeholder="Rechercher une conversation..."
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        
        <Divider />
        
        {loading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : filteredConversations.length === 0 ? (
          <Box textAlign="center" p={4}>
            <Typography variant="body1" color="text.secondary">
              {search ? 'Aucune conversation ne correspond à votre recherche.' : 'Aucune conversation pour le moment.'}
            </Typography>
          </Box>
        ) : (
          <List sx={{ width: '100%', bgcolor: 'background.paper', p: 0 }}>
            {filteredConversations.map((conversation, index) => (
              <React.Fragment key={conversation.id}>
                <ListItem
                  alignItems="flex-start"
                  button
                  onClick={() => navigate(`/recruteur/messages/${conversation.id}`)}
                  sx={{
                    py: 2,
                    px: 3,
                    bgcolor: conversation.unreadCount > 0 ? 'action.hover' : 'inherit',
                  }}
                >
                  <ListItemAvatar>
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      badgeContent={
                        conversation.unreadCount > 0 ? (
                          <CircleIcon color="primary" sx={{ fontSize: 14 }} />
                        ) : null
                      }
                    >
                      <Avatar
                        alt={`${conversation.otherUser.prenom} ${conversation.otherUser.nom}`}
                        src={conversation.otherUser.photo}
                      >
                        {getInitials(conversation.otherUser.prenom, conversation.otherUser.nom)}
                      </Avatar>
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography
                          variant="subtitle1"
                          fontWeight={conversation.unreadCount > 0 ? 'bold' : 'normal'}
                        >
                          {conversation.otherUser.prenom} {conversation.otherUser.nom}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatRelativeDate(conversation.lastMessage.date)}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                          fontWeight={conversation.unreadCount > 0 ? 'medium' : 'normal'}
                        >
                          {conversation.lastMessage.sender === 'me' && 'Vous: '}
                          {truncateText(conversation.lastMessage.text)}
                        </Typography>
                        <Box mt={0.5}>
                          <Chip
                            label={`Pour: ${truncateText(conversation.offre.titre, 30)}`}
                            size="small"
                            variant="outlined"
                          />
                          {conversation.unreadCount > 0 && (
                            <Chip
                              label={`${conversation.unreadCount} non lu${conversation.unreadCount > 1 ? 's' : ''}`}
                              size="small"
                              color="primary"
                              sx={{ ml: 1 }}
                            />
                          )}
                        </Box>
                      </>
                    }
                  />
                </ListItem>
                {index < filteredConversations.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>
    </Container>
  );
};

export default MessagesPage;