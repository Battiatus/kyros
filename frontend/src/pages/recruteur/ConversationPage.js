import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Chip,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import {
  Send as SendIcon,
  ArrowBack as ArrowBackIcon,
  MoreVert as MoreVertIcon,
  AttachFile as AttachFileIcon,
  VideoCall as VideoCallIcon,
  Event as EventIcon,
  Block as BlockIcon,
  Delete as DeleteIcon,
  Check as CheckIcon,
  Person as PersonIcon,
  Work as WorkIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/slices/authSlice';

/**
 * Page de conversation
 */
const ConversationPage = () => {
  const { id: conversationId, candidatId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const messagesEndRef = useRef(null);
  const currentUser = useSelector(selectUser);
  
  const [loading, setLoading] = useState(true);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [attachDialogOpen, setAttachDialogOpen] = useState(false);
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Détermine s'il s'agit d'une nouvelle conversation
  const isNewConversation = location.pathname.includes('/nouveau/');
  
  // Charger la conversation et les messages
  useEffect(() => {
    // Dans une application réelle, nous ferions un appel API
    setLoading(true);
    
    // Simulation de délai réseau avec données fictives
    setTimeout(() => {
      if (isNewConversation && candidatId) {
        // Nouvelle conversation avec un candidat
        const mockNewConversation = {
          id: 'new',
          otherUser: {
            id: parseInt(candidatId),
            prenom: 'Nouveau',
            nom: 'Candidat',
            photo: null,
            titre: 'Titre du candidat',
          },
          offre: null,
        };
        
        setConversation(mockNewConversation);
        setMessages([]);
      } else if (conversationId) {
        // Conversation existante
        const mockConversation = {
          id: parseInt(conversationId),
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
        };
        
        const mockMessages = [
          {
            id: 1,
            sender: 'other',
            text: 'Bonjour, je suis intéressé(e) par votre offre d\'emploi pour le poste de Chef de Rang.',
            date: '2025-05-25T09:30:00',
            read: true,
          },
          {
            id: 2,
            sender: 'me',
            text: 'Bonjour Marie, merci pour votre intérêt ! Pouvez-vous me parler de votre expérience dans ce domaine ?',
            date: '2025-05-25T10:15:00',
            read: true,
          },
          {
            id: 3,
            sender: 'other',
            text: 'Bien sûr ! J\'ai travaillé comme chef de rang pendant 3 ans au restaurant "La Table d\'Or" à Paris, un établissement étoilé. J\'ai également une expérience de 2 ans en tant que serveuse dans un restaurant gastronomique.',
            date: '2025-05-25T10:30:00',
            read: true,
          },
          {
            id: 4,
            sender: 'me',
            text: 'C\'est très intéressant ! Nous recherchons justement quelqu\'un avec une expérience en restauration haut de gamme. Seriez-vous disponible pour un entretien la semaine prochaine ?',
            date: '2025-05-25T11:00:00',
            read: true,
          },
          {
            id: 5,
            sender: 'other',
            text: 'Oui, je suis disponible ! Je peux me libérer mercredi ou jeudi prochain dans la matinée. Qu\'en pensez-vous ?',
            date: '2025-05-26T09:15:00',
            read: false,
          },
        ];
        
        setConversation(mockConversation);
        setMessages(mockMessages);
      } else {
        // Conversation non trouvée
        setConversation(null);
        setMessages([]);
      }
      
      setLoading(false);
    }, 1000);
  }, [conversationId, candidatId, isNewConversation]);
  
  // Faire défiler automatiquement vers le dernier message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Envoyer un message
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    // Dans une application réelle, nous enverrions cette action à l'API
    const newMsg = {
      id: Date.now(),
      sender: 'me',
      text: newMessage,
      date: new Date().toISOString(),
      read: true,
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage('');
  };
  
  // Gérer l'appui sur Entrée pour envoyer le message
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Ouvrir le menu
  const handleMenuOpen = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };
  
  // Fermer le menu
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };
  
  // Planifier un entretien
  const handleScheduleInterview = () => {
    navigate(`/recruteur/entretiens/nouveau?candidat=${conversation.otherUser.id}`);
    handleMenuClose();
  };
  
  // Lancer un appel vidéo
  const handleVideoCall = () => {
    // Dans une application réelle, nous lancerions un appel vidéo
    console.log('Lancer un appel vidéo');
    handleMenuClose();
  };
  
  // Envoyer une pièce jointe
  const handleAttachFile = () => {
    setAttachDialogOpen(true);
    handleMenuClose();
  };
  
  // Bloquer la conversation
  const handleBlockConversation = () => {
    setBlockDialogOpen(true);
    handleMenuClose();
  };
  
  // Supprimer la conversation
  const handleDeleteConversation = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };
  
  // Confirmer le blocage
  const confirmBlock = () => {
    // Dans une application réelle, nous enverrions cette action à l'API
    console.log('Conversation bloquée');
    setBlockDialogOpen(false);
    navigate('/recruteur/messages');
  };
  
  // Confirmer la suppression
  const confirmDelete = () => {
    // Dans une application réelle, nous enverrions cette action à l'API
    console.log('Conversation supprimée');
    setDeleteDialogOpen(false);
    navigate('/recruteur/messages');
  };
  
  // Formater la date
  const formatMessageDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const options = { hour: '2-digit', minute: '2-digit' };
      return date.toLocaleTimeString('fr-FR', options);
    } else if (diffDays === 1) {
      return 'Hier';
    } else {
      const options = { day: 'numeric', month: 'short' };
      return date.toLocaleDateString('fr-FR', options);
    }
  };
  
  // Obtenir les initiales pour l'avatar
  const getInitials = (prenom, nom) => {
    return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();
  };
  
  // Regrouper les messages par date
  const groupMessagesByDate = (msgs) => {
    const groups = {};
    
    msgs.forEach(message => {
      const date = new Date(message.date).toLocaleDateString('fr-FR');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    return Object.entries(groups).map(([date, messages]) => ({
      date,
      messages,
    }));
  };
  
  const messageGroups = groupMessagesByDate(messages);
  
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }
  
  if (!conversation && !isNewConversation) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={1} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="error" gutterBottom>
            Conversation non trouvée
          </Typography>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/recruteur/messages')}
            sx={{ mt: 2 }}
          >
            Retour aux messages
          </Button>
        </Paper>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={1} sx={{ height: '75vh', display: 'flex', flexDirection: 'column' }}>
        {/* En-tête */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 2,
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Box display="flex" alignItems="center">
            <IconButton edge="start" onClick={() => navigate('/recruteur/messages')}>
              <ArrowBackIcon />
            </IconButton>
            <Avatar
              alt={`${conversation?.otherUser.prenom} ${conversation?.otherUser.nom}`}
              src={conversation?.otherUser.photo}
              sx={{ ml: 1, mr: 2 }}
            >
              {getInitials(conversation?.otherUser.prenom || 'U', conversation?.otherUser.nom || 'U')}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight="medium">
                {conversation?.otherUser.prenom} {conversation?.otherUser.nom}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {conversation?.otherUser.titre}
              </Typography>
            </Box>
          </Box>
          
          <Box>
            <IconButton onClick={handleMenuOpen}>
              <MoreVertIcon />
            </IconButton>
          </Box>
        </Box>
        
        {/* Menu */}
        <Menu
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleVideoCall}>
            <ListItemIcon>
              <VideoCallIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Appel vidéo</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleScheduleInterview}>
            <ListItemIcon>
              <EventIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Planifier un entretien</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleAttachFile}>
            <ListItemIcon>
              <AttachFileIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Joindre un fichier</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => {
            navigate(`/recruteur/candidats/${conversation.otherUser.id}`);
            handleMenuClose();
          }}>
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Voir le profil</ListItemText>
          </MenuItem>
          {conversation?.offre && (
            <MenuItem onClick={() => {
              navigate(`/recruteur/offres/${conversation.offre.id}`);
              handleMenuClose();
            }}>
              <ListItemIcon>
                <WorkIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Voir l'offre</ListItemText>
            </MenuItem>
          )}
          <Divider />
          <MenuItem onClick={handleBlockConversation}>
            <ListItemIcon>
              <BlockIcon fontSize="small" color="warning" />
            </ListItemIcon>
            <ListItemText>Bloquer</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleDeleteConversation}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>Supprimer la conversation</ListItemText>
          </MenuItem>
        </Menu>
        
        {/* Corps de la conversation */}
        <Box
          sx={{
            flexGrow: 1,
            overflow: 'auto',
            p: 2,
            bgcolor: 'grey.50',
          }}
        >
          {/* Informations sur l'offre si applicable */}
          {conversation?.offre && (
            <Box textAlign="center" mb={2}>
              <Chip
                label={`Conversation pour: ${conversation.offre.titre}`}
                color="primary"
                variant="outlined"
                onClick={() => navigate(`/recruteur/offres/${conversation.offre.id}`)}
              />
            </Box>
          )}
          
          {messageGroups.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
              }}
            >
              <Typography variant="body1" color="text.secondary" gutterBottom>
                Commencez la conversation
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Envoyez un message pour débuter la discussion.
              </Typography>
            </Box>
          ) : (
            messageGroups.map((group, groupIndex) => (
              <Box key={groupIndex}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    mb: 2,
                    mt: groupIndex > 0 ? 3 : 1,
                  }}
                >
                  <Chip label={group.date} size="small" />
                </Box>
                
                {group.messages.map((message) => (
                  <Box
                    key={message.id}
                    sx={{
                      display: 'flex',
                      justifyContent: message.sender === 'me' ? 'flex-end' : 'flex-start',
                      mb: 2,
                    }}
                  >
                    {message.sender !== 'me' && (
                      <Avatar
                        alt={`${conversation.otherUser.prenom} ${conversation.otherUser.nom}`}
                        src={conversation.otherUser.photo}
                        sx={{ width: 32, height: 32, mr: 1, mt: 0.5 }}
                      >
                        {getInitials(conversation.otherUser.prenom, conversation.otherUser.nom)}
                      </Avatar>
                    )}
                    
                    <Box
                      sx={{
                        maxWidth: '70%',
                        p: 2,
                        borderRadius: 2,
                        bgcolor: message.sender === 'me' ? 'primary.main' : 'background.paper',
                        color: message.sender === 'me' ? 'primary.contrastText' : 'text.primary',
                        boxShadow: 1,
                        position: 'relative',
                      }}
                    >
                      <Typography variant="body1">{message.text}</Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          display: 'block',
                          textAlign: 'right',
                          mt: 0.5,
                          color: message.sender === 'me' ? 'primary.light' : 'text.secondary',
                        }}
                      >
                        {formatMessageDate(message.date)}
                        {message.sender === 'me' && (
                          <CheckIcon
                            sx={{
                              ml: 0.5,
                              fontSize: 12,
                              verticalAlign: 'middle',
                              color: message.read ? 'success.main' : 'inherit',
                            }}
                          />
                        )}
                      </Typography>
                    </Box>
                    
                    {message.sender === 'me' && (
                      <Avatar
                        alt={currentUser?.prenom}
                        src={currentUser?.photo}
                        sx={{ width: 32, height: 32, ml: 1, mt: 0.5 }}
                      >
                        {currentUser?.prenom?.charAt(0)}
                      </Avatar>
                    )}
                  </Box>
                ))}
              </Box>
            ))
          )}
          <div ref={messagesEndRef} />
        </Box>
        
        {/* Zone de saisie */}
        <Box
          sx={{
            p: 2,
            bgcolor: 'background.paper',
            borderTop: 1,
            borderColor: 'divider',
          }}
        >
          <Box display="flex" gap={1}>
            <IconButton onClick={handleAttachFile}>
              <AttachFileIcon />
            </IconButton>
            <TextField
              fullWidth
              multiline
              maxRows={4}
              placeholder="Écrivez votre message..."
              variant="outlined"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              size="small"
            />
            <Button
              variant="contained"
              color="primary"
              endIcon={<SendIcon />}
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
            >
              Envoyer
            </Button>
          </Box>
        </Box>
      </Paper>
      
      {/* Dialog pour joindre un fichier */}
      <Dialog
        open={attachDialogOpen}
        onClose={() => setAttachDialogOpen(false)}
      >
        <DialogTitle>Joindre un fichier</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Sélectionnez un fichier à envoyer. Formats supportés : PDF, DOC, DOCX, JPG, PNG.
          </DialogContentText>
          <Box
            sx={{
              mt: 2,
              p: 3,
              border: '2px dashed',
              borderColor: 'primary.main',
              borderRadius: 1,
              textAlign: 'center',
              cursor: 'pointer',
            }}
          >
            <input
              type="file"
              id="file-upload"
              style={{ display: 'none' }}
            />
            <label htmlFor="file-upload">
              <AttachFileIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="body1" gutterBottom>
                Cliquez pour sélectionner un fichier
              </Typography>
              <Typography variant="caption" color="text.secondary">
                ou glissez-déposez ici
              </Typography>
            </label>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAttachDialogOpen(false)}>Annuler</Button>
          <Button variant="contained" onClick={() => setAttachDialogOpen(false)}>
            Envoyer
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Dialog pour bloquer la conversation */}
      <Dialog
        open={blockDialogOpen}
        onClose={() => setBlockDialogOpen(false)}
      >
        <DialogTitle>Bloquer cette conversation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir bloquer {conversation?.otherUser.prenom} {conversation?.otherUser.nom} ?
            Vous ne recevrez plus de messages de cette personne.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBlockDialogOpen(false)}>Annuler</Button>
          <Button variant="contained" color="warning" onClick={confirmBlock}>
            Bloquer
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Dialog pour supprimer la conversation */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Supprimer cette conversation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer définitivement cette conversation avec {conversation?.otherUser.prenom} {conversation?.otherUser.nom} ?
            Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Annuler</Button>
          <Button variant="contained" color="error" onClick={confirmDelete}>
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ConversationPage;