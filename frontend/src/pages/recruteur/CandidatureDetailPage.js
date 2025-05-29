import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Grid,
  Avatar,
  Chip,
  Divider,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Tabs,
  Tab,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Menu,
  MenuItem,
  Badge,
} from "@mui/material";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from "@mui/lab";
import { CircularProgress, Tooltip, FormControl, InputLabel, Select } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CircleIcon     from '@mui/icons-material/Circle';
import {
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  School as SchoolIcon,
  Check as CheckIcon,
  Language as LanguageIcon,
  Event as EventIcon,
  Note as NoteIcon,
  VideoCall as VideoCallIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  MoreVert as MoreVertIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Send as SendIcon,
  Assignment as AssignmentIcon,
  Save as SaveIcon,
} from "@mui/icons-material";

/**
 * Page de détail d'une candidature
 */
const CandidatureDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [candidature, setCandidature] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);

  // Statuts possibles des candidatures
  const statuses = [
    { value: "new", label: "Nouvelle", color: "primary" },
    { value: "viewed", label: "Consultée", color: "default" },
    { value: "contacted", label: "Contactée", color: "info" },
    { value: "interview", label: "Entretien", color: "secondary" },
    { value: "offer", label: "Offre", color: "success" },
    { value: "hired", label: "Embauché", color: "success" },
    { value: "rejected", label: "Refusé", color: "error" },
  ];

  // Charger les données de la candidature
  useEffect(() => {
    // Dans une application réelle, nous ferions un appel API
    setLoading(true);

    // Simulation de délai réseau avec données fictives
    setTimeout(() => {
      const mockCandidature = {
        id: Number(id),
        candidat: {
          id: 101,
          prenom: "Marie",
          nom: "Dupont",
          photo: null,
          titre: "Chef de Rang expérimentée",
          email: "marie.dupont@email.com",
          telephone: "06 12 34 56 78",
          localisation: "Paris, France",
          langues: ["Français", "Anglais", "Espagnol"],
          competences: ["Service en salle", "Sommellerie", "Gestion de caisse"],
          formation: "BTS Hôtellerie-Restauration",
          experiences: [
            {
              poste: "Chef de Rang",
              entreprise: "Restaurant Le Grand Paris",
              description:
                "Service en salle, gestion des commandes, accueil clients",
              date_debut: "2020-01-01",
              date_fin: "2023-01-01",
              verified: true,
            },
            {
              poste: "Serveuse",
              entreprise: "Café des Arts",
              description: "Service en salle, préparation des boissons",
              date_debut: "2018-06-01",
              date_fin: "2019-12-31",
              verified: false,
            },
          ],
          description:
            "Passionnée par l'art du service et l'expérience client. 5 ans d'expérience en tant que chef de rang dans des établissements étoilés.",
          matchScore: 92,
          video: false,
          verified: true,
        },
        offre: {
          id: 201,
          titre: "Chef de Rang - Restaurant Le Gourmet",
          type_contrat: "CDI",
          localisation: "Paris",
          entreprise: {
            id: 301,
            nom: "Restaurant Le Gourmet",
          },
        },
        status: "viewed",
        date: "2025-05-28T10:30:00",
        messagePerso:
          "Je suis très intéressée par votre offre et je pense que mon expérience correspondrait parfaitement au poste. Passionnée par la gastronomie et le service de qualité, j'ai travaillé pendant 3 ans dans un restaurant étoilé.",
        notes:
          "Profil intéressant, expérience dans des établissements similaires.",
        history: [
          {
            date: "2025-05-28T10:30:00",
            action: "candidature",
            description: "Candidature reçue",
          },
          {
            date: "2025-05-28T14:45:00",
            action: "view",
            description: "Candidature consultée",
          },
        ],
        entretiens: [],
      };

      setCandidature(mockCandidature);
      setNewStatus(mockCandidature.status);
      setNewNote(mockCandidature.notes);
      setLoading(false);
    }, 1000);
  }, [id]);

  // Changer l'onglet
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Ouvrir le dialog de note
  const handleOpenNoteDialog = () => {
    setNoteDialogOpen(true);
  };

  // Sauvegarder la note
  const handleSaveNote = () => {
    // Dans une application réelle, nous enverrions cette action à l'API
    setCandidature((prev) => ({
      ...prev,
      notes: newNote,
    }));
    setNoteDialogOpen(false);
  };

  // Ouvrir le dialog de changement de statut
  const handleOpenStatusDialog = () => {
    setStatusDialogOpen(true);
  };

  // Changer le statut
  const handleChangeStatus = () => {
    // Dans une application réelle, nous enverrions cette action à l'API
    setCandidature((prev) => ({
      ...prev,
      status: newStatus,
      history: [
        ...prev.history,
        {
          date: new Date().toISOString(),
          action: "status",
          description: `Statut changé en "${statuses.find((s) => s.value === newStatus)?.label}"`,
        },
      ],
    }));
    setStatusDialogOpen(false);
  };

  // Ouvrir le dialog de refus
  const handleOpenRejectDialog = () => {
    setRejectDialogOpen(true);
  };

  // Refuser la candidature
  const handleReject = () => {
    // Dans une application réelle, nous enverrions cette action à l'API
    setCandidature((prev) => ({
      ...prev,
      status: "rejected",
      rejectReason,
      history: [
        ...prev.history,
        {
          date: new Date().toISOString(),
          action: "reject",
          description: "Candidature refusée",
        },
      ],
    }));
    setRejectDialogOpen(false);
  };

  // Planifier un entretien
  const handleScheduleInterview = () => {
    navigate(`/recruteur/entretiens/nouveau?candidature=${id}`);
  };

  // Contacter le candidat
  const handleContact = () => {
    if (candidature) {
      navigate(`/recruteur/messages/nouveau/${candidature.candidat.id}`);
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

  // Formater la date
  const formatDate = (dateString) => {
    if (!dateString) return "";

    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("fr-FR", options);
  };

  // Formater l'heure
  const formatTime = (dateString) => {
    if (!dateString) return "";

    const options = { hour: "2-digit", minute: "2-digit" };
    return new Date(dateString).toLocaleTimeString("fr-FR", options);
  };

  // Obtenir les initiales pour l'avatar
  const getInitials = (prenom, nom) => {
    return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();
  };

  // Rendu du statut avec une puce colorée
  const renderStatus = (status) => {
    const statusObj = statuses.find((s) => s.value === status) || statuses[0];
    return <Chip label={statusObj.label} color={statusObj.color} />;
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="60vh"
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!candidature) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={1} sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="error" gutterBottom>
            Candidature non trouvée
          </Typography>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/recruteur/candidatures")}
            sx={{ mt: 2 }}
          >
            Retour aux candidatures
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* En-tête */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/recruteur/candidatures")}
        >
          Retour aux candidatures
        </Button>

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
        <MenuItem
          onClick={() => {
            handleOpenStatusDialog();
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Changer le statut</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleOpenNoteDialog();
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            <NoteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Ajouter une note</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleScheduleInterview();
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            <EventIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Planifier un entretien</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            handleOpenRejectDialog();
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            <CancelIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText
            primary="Refuser la candidature"
            primaryTypographyProps={{ color: "error" }}
          />
        </MenuItem>
      </Menu>

      {/* Contenu principal */}
      <Grid container spacing={3}>
        {/* Informations du candidat */}
        <Grid item xs={12} md={4}>
          <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
            <Box textAlign="center" mb={3}>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                badgeContent={
                  <Avatar
                    sx={{
                      width: 30,
                      height: 30,
                      border: "2px solid white",
                      bgcolor:
                        candidature.candidat.matchScore >= 80
                          ? "success.main"
                          : "warning.main",
                    }}
                  >
                    {candidature.candidat.matchScore}
                  </Avatar>
                }
              >
                <Avatar
                  src={candidature.candidat.photo}
                  alt={`${candidature.candidat.prenom} ${candidature.candidat.nom}`}
                  sx={{ width: 100, height: 100, mb: 1, mx: "auto" }}
                >
                  {getInitials(
                    candidature.candidat.prenom,
                    candidature.candidat.nom
                  )}
                </Avatar>
              </Badge>
              <Typography variant="h5" gutterBottom>
                {candidature.candidat.prenom} {candidature.candidat.nom}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {candidature.candidat.titre}
              </Typography>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                mt={1}
              >
                <LocationIcon
                  fontSize="small"
                  sx={{ mr: 0.5, color: "text.secondary" }}
                />
                <Typography variant="body2" color="text.secondary">
                  {candidature.candidat.localisation}
                </Typography>
              </Box>
              {candidature.candidat.verified && (
                <Chip
                  icon={<CheckCircleIcon />}
                  label="Profil vérifié"
                  color="info"
                  size="small"
                  sx={{ mt: 2 }}
                />
              )}
            </Box>

            <Divider sx={{ my: 2 }} />

            <List dense>
              <ListItem>
                <ListItemIcon>
                  <MailIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Email"
                  secondary={candidature.candidat.email}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <PhoneIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Téléphone"
                  secondary={candidature.candidat.telephone}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <SchoolIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Formation"
                  secondary={candidature.candidat.formation}
                />
              </ListItem>
            </List>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" gutterBottom>
              Langues
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
              {candidature.candidat.langues.map((langue, index) => (
                <Chip
                  key={index}
                  label={langue}
                  icon={<LanguageIcon />}
                  variant="outlined"
                  size="small"
                />
              ))}
            </Box>

            <Typography variant="subtitle2" gutterBottom>
              Compétences
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {candidature.candidat.competences.map((competence, index) => (
                <Chip key={index} label={competence} size="small" />
              ))}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box display="flex" flexDirection="column" gap={1}>
              <Button
                variant="contained"
                startIcon={<MailIcon />}
                onClick={handleContact}
                fullWidth
              >
                Contacter
              </Button>
              <Button
                variant="outlined"
                startIcon={<EventIcon />}
                onClick={handleScheduleInterview}
                fullWidth
              >
                Planifier un entretien
              </Button>
              <Button
                variant="outlined"
                startIcon={<PersonIcon />}
                onClick={() =>
                  navigate(`/recruteur/candidats/${candidature.candidat.id}`)
                }
                fullWidth
              >
                Voir profil complet
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Détails de la candidature */}
        <Grid item xs={12} md={8}>
          <Paper elevation={1} sx={{ mb: 3 }}>
            <Box p={3}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="flex-start"
              >
                <Box>
                  <Typography variant="h5" gutterBottom>
                    Candidature pour {candidature.offre.titre}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {candidature.offre.type_contrat} •{" "}
                    {candidature.offre.localisation}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Reçue le {formatDate(candidature.date)}
                  </Typography>
                </Box>
                <Box>{renderStatus(candidature.status)}</Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle1" gutterBottom>
                Message de candidature
              </Typography>
              <Typography
                variant="body1"
                paragraph
                sx={{ whiteSpace: "pre-wrap" }}
              >
                {candidature.messagePerso}
              </Typography>

              {candidature.notes && (
                <>
                  <Typography variant="subtitle1" gutterBottom>
                    Notes internes
                  </Typography>
                  <Card variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography
                        variant="body2"
                        sx={{ whiteSpace: "pre-wrap" }}
                      >
                        {candidature.notes}
                      </Typography>
                    </CardContent>
                  </Card>
                </>
              )}

              <Box display="flex" gap={1} mt={2}>
                <Button
                  variant="outlined"
                  startIcon={<NoteIcon />}
                  onClick={handleOpenNoteDialog}
                >
                  {candidature.notes ? "Modifier la note" : "Ajouter une note"}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={handleOpenStatusDialog}
                >
                  Changer le statut
                </Button>
              </Box>
            </Box>
          </Paper>

          {/* Onglets */}
          <Paper elevation={1}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab label="Expériences" />
              <Tab label="Entretiens" />
              <Tab label="Historique" />
            </Tabs>

            <Divider />

            <Box p={3}>
              {tabValue === 0 && (
                <>
                  <Typography variant="h6" gutterBottom>
                    Expériences professionnelles
                  </Typography>

                  {candidature.candidat.experiences.map((experience, index) => (
                    <Card key={index} variant="outlined" sx={{ mb: 2 }}>
                      <CardHeader
                        title={experience.poste}
                        subheader={`${experience.entreprise} · ${formatDate(experience.date_debut)} - ${formatDate(experience.date_fin)}`}
                        action={
                          experience.verified && (
                            <Tooltip title="Expérience vérifiée">
                              <CheckCircleIcon color="info" />
                            </Tooltip>
                          )
                        }
                      />
                      <CardContent>
                        <Typography variant="body2">
                          {experience.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </>
              )}

              {tabValue === 1 && (
                <>
                  <Typography variant="h6" gutterBottom>
                    Entretiens
                  </Typography>

                  {candidature.entretiens.length === 0 ? (
                    <Box textAlign="center" py={3}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        paragraph
                      >
                        Aucun entretien planifié.
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleScheduleInterview}
                      >
                        Planifier un entretien
                      </Button>
                    </Box>
                  ) : (
                    <List>
                      {candidature.entretiens.map((entretien, index) => (
                        <ListItem
                          key={index}
                          button
                          onClick={() =>
                            navigate(`/recruteur/entretiens/${entretien.id}`)
                          }
                        >
                          <ListItemIcon>
                            {entretien.type === "video" ? (
                              <VideoCallIcon color="primary" />
                            ) : (
                              <EventIcon color="primary" />
                            )}
                          </ListItemIcon>
                          <ListItemText
                            primary={`Entretien ${entretien.type === "video" ? "visio" : "en personne"}`}
                            secondary={`${formatDate(entretien.date)} à ${formatTime(entretien.date)}`}
                          />
                          {entretien.status === "scheduled" ? (
                            <Chip
                              label="Planifié"
                              size="small"
                              color="primary"
                            />
                          ) : entretien.status === "completed" ? (
                            <Chip
                              label="Réalisé"
                              size="small"
                              color="success"
                            />
                          ) : (
                            <Chip label="Annulé" size="small" color="error" />
                          )}
                        </ListItem>
                      ))}
                    </List>
                  )}
                </>
              )}

              {tabValue === 2 && (
                <>
                  <Typography variant="h6" gutterBottom>
                    Historique de la candidature
                  </Typography>

                  <Timeline position="alternate">
                    {[...candidature.history].reverse().map((event, index) => (
                      <TimelineItem key={index}>
                        <TimelineOppositeContent color="text.secondary">
                          {formatDate(event.date)} à {formatTime(event.date)}
                        </TimelineOppositeContent>
                        <TimelineSeparator>
                          <TimelineDot
                            color={
                              event.action === "candidature"
                                ? "primary"
                                : event.action === "view"
                                  ? "secondary"
                                  : event.action === "status"
                                    ? "info"
                                    : event.action === "interview"
                                      ? "success"
                                      : event.action === "reject"
                                        ? "error"
                                        : "grey"
                            }
                          >
                            {event.action === "candidature" ? (
                              <PersonIcon />
                            ) : event.action === "view" ? (
                              <VisibilityIcon />
                            ) : event.action === "status" ? (
                              <EditIcon />
                            ) : event.action === "interview" ? (
                              <EventIcon />
                            ) : event.action === "reject" ? (
                              <CancelIcon />
                            ) : (
                              <CircleIcon />
                            )}
                          </TimelineDot>
                          {index < candidature.history.length - 1 && (
                            <TimelineConnector />
                          )}
                        </TimelineSeparator>
                        <TimelineContent>
                          <Typography variant="body1">
                            {event.description}
                          </Typography>
                        </TimelineContent>
                      </TimelineItem>
                    ))}
                  </Timeline>
                </>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Dialog d'ajout de note */}
      <Dialog
        open={noteDialogOpen}
        onClose={() => setNoteDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {candidature.notes ? "Modifier la note" : "Ajouter une note"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            placeholder="Note interne visible uniquement par l'équipe de recrutement..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNoteDialogOpen(false)}>Annuler</Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSaveNote}
          >
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de changement de statut */}
      <Dialog
        open={statusDialogOpen}
        onClose={() => setStatusDialogOpen(false)}
      >
        <DialogTitle>Changer le statut</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel id="status-select-label">Nouveau statut</InputLabel>
            <Select
              labelId="status-select-label"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              label="Nouveau statut"
            >
              {statuses.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  <Box display="flex" alignItems="center">
                    <Chip
                      label={status.label}
                      color={status.color}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)}>Annuler</Button>
          <Button variant="contained" onClick={handleChangeStatus}>
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de refus */}
      <Dialog
        open={rejectDialogOpen}
        onClose={() => setRejectDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Refuser la candidature</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Vous êtes sur le point de refuser la candidature de{" "}
            {candidature.candidat.prenom} {candidature.candidat.nom}. Une
            notification sera envoyée au candidat.
          </DialogContentText>
          <TextField
            autoFocus
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            label="Motif du refus (optionnel)"
            placeholder="Expliquez pourquoi cette candidature n'est pas retenue..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectDialogOpen(false)}>Annuler</Button>
          <Button variant="contained" color="error" onClick={handleReject}>
            Refuser la candidature
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CandidatureDetailPage;
