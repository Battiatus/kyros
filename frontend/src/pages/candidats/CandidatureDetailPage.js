import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Divider,
  Chip,
  Button,
  Avatar,
  Grid,
  Stepper,
  Step,
  StepLabel,
  IconButton,
  Card,
  CardContent,
  TextField,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Skeleton,
  Link
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  BusinessCenter as BusinessCenterIcon,
  LocationOn as LocationIcon,
  EuroSymbol as EuroSymbolIcon,
  AccessTime as AccessTimeIcon,
  Event as EventIcon,
  Chat as ChatIcon,
  CancelOutlined as CancelOutlinedIcon,
  CheckCircle as CheckCircleIcon,
  PersonOutline as PersonOutlineIcon,
  VisibilityOutlined as VisibilityOutlinedIcon,
  Schedule as ScheduleIcon,
  Send as SendIcon
} from '@mui/icons-material';

// Redux
import { fetchCandidatureById, selectCurrentCandidature, selectCandidatureLoading } from '../../redux/slices/candidatureSlice';
import { selectUser } from '../../redux/slices/authSlice';
import { fetchMessages, sendMessage, selectMessages, selectCurrentConversation, fetchConversation } from '../../redux/slices/chatSlice';

/**
 * Page de détail d'une candidature pour le candidat
 */
const CandidatureDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const user = useSelector(selectUser);
  const candidature = useSelector(selectCurrentCandidature);
  const loading = useSelector(selectCandidatureLoading);
  const messages = useSelector(selectMessages);
  const conversation = useSelector(selectCurrentConversation);
  
  const [messageContent, setMessageContent] = useState('');
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  
  // Charger les données de la candidature
  useEffect(() => {
    if (id) {
      dispatch(fetchCandidatureById(id));
    }
  }, [dispatch, id]);
  
  // Charger les messages lorsque la candidature est chargée
  useEffect(() => {
    if (candidature?.conversation_id) {
      dispatch(fetchConversation(candidature.conversation_id));
      dispatch(fetchMessages(candidature.conversation_id));
    }
  }, [dispatch, candidature?.conversation_id]);
  
  const handleSendMessage = () => {
    if (!messageContent.trim() || !conversation?.id) return;
    
    dispatch(sendMessage({
      conversationId: conversation.id,
      content: messageContent,
      tempId: Date.now().toString()
    }));
    
    setMessageContent('');
  };
  
  const handleWithdrawApplication = () => {
    // Implémenter la logique pour retirer la candidature
    setWithdrawDialogOpen(false);
  };
  
  // Déterminer l'étape active dans le stepper
  const getActiveStep = () => {
    switch (candidature?.statut) {
      case 'new':
        return 0;
      case 'viewed':
        return 1;
      case 'interview':
        return 2;
      case 'accepted':
        return 3;
      case 'rejected':
        return -1; // Cas spécial pour rejet
      default:
        return 0;
    }
  };
  
  if (loading || !candidature) {
    return (
      <Box sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <IconButton onClick={() => navigate('/candidat/candidatures')}>
            <ArrowBackIcon />
          </IconButton>
          <Skeleton variant="text" width={300} height={40} />
        </Box>
        <Paper elevation={1} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
          <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2, mb: 2 }} />
          <Skeleton variant="text" width="60%" height={30} />
          <Skeleton variant="text" width="40%" height={20} sx={{ mb: 2 }} />
          <Box display="flex" gap={1} mb={2}>
            <Skeleton variant="rectangular" width={100} height={30} sx={{ borderRadius: 16 }} />
            <Skeleton variant="rectangular" width={120} height={30} sx={{ borderRadius: 16 }} />
          </Box>
          <Skeleton variant="text" width="100%" height={100} />
        </Paper>
      </Box>
    );
  }
  
  const activeStep = getActiveStep();
  const rejected = candidature.statut === 'rejected';
  
  return (
    <Box sx={{ p: 3 }}>
      {/* En-tête */}
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={() => navigate('/candidat/candidatures')}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" component="h1" fontWeight="bold">
          Détail de candidature
        </Typography>
      </Box>
      
      {/* Carte offre */}
      <Paper elevation={1} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
        <Box display="flex" alignItems="flex-start" mb={2}>
          <Avatar 
            src={candidature.offre?.entreprise?.logo}
            alt={candidature.offre?.entreprise?.nom}
            sx={{ width: 64, height: 64, mr: 2 }}
          >
            {candidature.offre?.entreprise?.nom?.charAt(0) || 'E'}
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              {candidature.offre?.titre || 'Offre d\'emploi'}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {candidature.offre?.entreprise?.nom || 'Entreprise'}
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
              <Chip 
                icon={<LocationIcon fontSize="small" />} 
                label={candidature.offre?.localisation || 'Non spécifié'} 
                size="small"
              />
              <Chip 
                icon={<BusinessCenterIcon fontSize="small" />} 
                label={candidature.offre?.type_contrat || 'CDI'} 
                size="small"
              />
              {candidature.offre?.salaire_min && (
                <Chip 
                  icon={<EuroSymbolIcon fontSize="small" />} 
                  label={`${candidature.offre.salaire_min}€ - ${candidature.offre.salaire_max || '?'}€`} 
                  size="small"
                />
              )}
              {candidature.offre?.horaires && (
                <Chip 
                  icon={<AccessTimeIcon fontSize="small" />} 
                  label={candidature.offre.horaires} 
                  size="small"
                />
              )}
            </Box>
          </Box>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        {/* Statut et date */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Candidature envoyée le {new Date(candidature.date_candidature).toLocaleDateString('fr-FR')}
            </Typography>
            {candidature.message_personnalise && (
              <Typography variant="body2" mt={1}>
                <strong>Message joint :</strong> {candidature.message_personnalise}
              </Typography>
            )}
          </Box>
          <Chip 
            label={
              rejected ? "Candidature refusée" :
              activeStep === 3 ? "Candidature acceptée" :
              "Candidature en cours"
            }
            color={rejected ? "error" : activeStep === 3 ? "success" : "primary"}
            icon={
              rejected ? <CancelOutlinedIcon /> :
              activeStep === 3 ? <CheckCircleIcon /> :
              <ScheduleIcon />
            }
          />
        </Box>
        
        {/* Motif de refus si rejeté */}
        {rejected && candidature.motif_refus && (
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="subtitle2">Motif du refus :</Typography>
            <Typography variant="body2">{candidature.motif_refus}</Typography>
          </Alert>
        )}
        
        {/* Stepper de progression */}
        {!rejected && (
          <Box sx={{ width: '100%', my: 3 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              <Step>
                <StepLabel 
                  StepIconProps={{ 
                    icon: <SendIcon />,
                    active: activeStep >= 0
                  }}
                >
                  Candidature envoyée
                </StepLabel>
              </Step>
              <Step>
                <StepLabel 
                  StepIconProps={{ 
                    icon: <VisibilityOutlinedIcon />,
                    active: activeStep >= 1
                  }}
                >
                  Candidature consultée
                </StepLabel>
              </Step>
              <Step>
                <StepLabel 
                  StepIconProps={{ 
                    icon: <EventIcon />,
                    active: activeStep >= 2
                  }}
                >
                  Entretien
                </StepLabel>
              </Step>
              <Step>
                <StepLabel 
                  StepIconProps={{ 
                    icon: <CheckCircleIcon />,
                    active: activeStep >= 3
                  }}
                >
                  Acceptée
                </StepLabel>
              </Step>
            </Stepper>
          </Box>
        )}
        
        {/* Actions */}
        <Box display="flex" justifyContent="space-between" mt={3}>
          <Button
            variant="outlined"
            color="error"
            startIcon={<CancelOutlinedIcon />}
            onClick={() => setWithdrawDialogOpen(true)}
            disabled={rejected || activeStep === 3}
          >
            Retirer ma candidature
          </Button>
          
          <Box>
            <Button
              variant="outlined"
              startIcon={<BusinessCenterIcon />}
              onClick={() => navigate(`/candidat/offres/${candidature.offre_id}`)}
              sx={{ mr: 2 }}
            >
              Voir l'offre
            </Button>
            
            {activeStep >= 1 && !rejected && (
              <Button
                variant="contained"
                startIcon={<ChatIcon />}
                onClick={() => document.getElementById('messages-section').scrollIntoView({ behavior: 'smooth' })}
              >
                Échanger avec le recruteur
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
      
      {/* Section messagerie */}
      {activeStep >= 1 && !rejected && (
        <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }} id="messages-section">
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Messagerie
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Box sx={{ height: 400, overflowY: 'auto', mb: 2, p: 2 }}>
            {messages.length === 0 ? (
              <Box textAlign="center" py={4}>
                <ChatIcon sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.3 }} />
                <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                  Aucun message pour le moment
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Démarrez la conversation avec le recruteur
                </Typography>
              </Box>
            ) : (
              messages.map((message) => (
                <Box
                  key={message.id}
                  sx={{
                    display: 'flex',
                    justifyContent: message.expediteur_id === user.id ? 'flex-end' : 'flex-start',
                    mb: 2
                  }}
                >
                  {message.expediteur_id !== user.id && (
                    <Avatar
                      src={candidature.offre?.entreprise?.logo}
                      sx={{ mr: 1, width: 36, height: 36 }}
                    >
                      R
                    </Avatar>
                  )}
                  <Box
                    sx={{
                      maxWidth: '70%',
                      p: 2,
                      borderRadius: 2,
                      bgcolor: message.expediteur_id === user.id ? 'primary.light' : 'grey.100',
                      color: message.expediteur_id === user.id ? 'white' : 'inherit'
                    }}
                  >
                    <Typography variant="body2">{message.contenu}</Typography>
                    <Typography variant="caption" sx={{ display: 'block', mt: 0.5, opacity: 0.8 }}>
                      {new Date(message.date_envoi).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Typography>
                  </Box>
                  {message.expediteur_id === user.id && (
                    <Avatar
                      src={user.photo_profil}
                      sx={{ ml: 1, width: 36, height: 36 }}
                    >
                      {user.prenom?.charAt(0)}
                    </Avatar>
                  )}
                </Box>
              ))
            )}
          </Box>
          
          <Box display="flex" alignItems="center">
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Votre message..."
              size="small"
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              sx={{ mr: 1 }}
            />
            <Button
              variant="contained"
              endIcon={<SendIcon />}
              onClick={handleSendMessage}
              disabled={!messageContent.trim()}
            >
              Envoyer
            </Button>
          </Box>
        </Paper>
      )}
      
      {/* Dialog de confirmation pour retirer la candidature */}
      <Dialog
        open={withdrawDialogOpen}
        onClose={() => setWithdrawDialogOpen(false)}
      >
        <DialogTitle>Retirer ma candidature</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Êtes-vous sûr de vouloir retirer votre candidature pour le poste de "{candidature.offre?.titre}" ?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Cette action est définitive et vous ne pourrez plus postuler à cette offre.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setWithdrawDialogOpen(false)}>
            Annuler
          </Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={handleWithdrawApplication}
          >
            Confirmer le retrait
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CandidatureDetailPage;