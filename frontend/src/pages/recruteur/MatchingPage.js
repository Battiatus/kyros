import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  Avatar,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Slider,
  FormControlLabel,
  Switch,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Rating,
  ListItemIcon,
  Autocomplete,
  Tooltip,
} from "@mui/material";
import {
  Close as CloseIcon,
  Favorite as FavoriteIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  FilterList as FilterListIcon,
  SortByAlpha as SortIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  Language as LanguageIcon,
  LocationOn as LocationIcon,
  Timeline as TimelineIcon,
  Check as CheckIcon,
  Send as SendIcon,
  ExpandMore as ExpandMoreIcon,
  VideoLibrary as VideoIcon,
  Email as EmailIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import RefreshIcon from '@mui/icons-material/Refresh';
import { useNavigate } from "react-router-dom";
import Loader from "../../components/common/Loader";

/**
 * Page de matching des candidats avec système de swipe
 */
const MatchingPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cardRef = useRef(null);

  const [candidates, setCandidates] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [swiping, setSwiping] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [startX, setStartX] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const [openFilters, setOpenFilters] = useState(false);
  const [openCandidateDetails, setOpenCandidateDetails] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [filters, setFilters] = useState({
    experience: [0, 20],
    distance: 50,
    disponible: true,
    langues: [],
    competences: [],
    verifiedOnly: false,
  });

  // Charger les candidats (simulés pour l'exemple)
  useEffect(() => {
    // Dans une version réelle, nous ferions un appel API pour obtenir les candidats
    const fetchCandidates = async () => {
      setLoading(true);

      // Simulation de délai réseau
      setTimeout(() => {
        // Données fictives pour l'exemple
        const mockCandidates = [
          {
            id: 1,
            prenom: "Marie",
            nom: "Dupont",
            titre: "Chef de Rang expérimentée",
            photo: null,
            experience: 5,
            disponibilite: "Immédiate",
            langues: ["Français", "Anglais", "Espagnol"],
            competences: [
              "Service en salle",
              "Gestion de caisse",
              "Sommellerie",
            ],
            formation: "BTS Hôtellerie-Restauration",
            description:
              "Passionnée par l'art du service et l'expérience client. 5 ans d'expérience en tant que chef de rang dans des établissements étoilés.",
            localisation: "Paris, France",
            video: false,
            verified: true,
            matchScore: 92,
          },
          {
            id: 2,
            prenom: "Thomas",
            nom: "Martin",
            titre: "Barman créatif",
            photo: null,
            experience: 3,
            disponibilite: "Sous 2 semaines",
            langues: ["Français", "Anglais"],
            competences: ["Cocktails", "Gestion de bar", "Service client"],
            formation: "Formation Barman International",
            description:
              "Expert en mixologie avec une solide connaissance des spiritueux. Créatif et attentif aux détails, j'apporte une touche unique à chaque cocktail.",
            localisation: "Lyon, France",
            video: true,
            verified: false,
            matchScore: 85,
          },
          {
            id: 3,
            prenom: "Sophie",
            nom: "Bernard",
            titre: "Serveuse polyvalente",
            photo: null,
            experience: 2,
            disponibilite: "Immédiate",
            langues: ["Français", "Anglais"],
            competences: [
              "Service en salle",
              "Prise de commandes",
              "Gestion de caisse",
            ],
            formation: "CAP Service en restauration",
            description:
              "Dynamique et souriante, j'aime le contact client et le travail en équipe. Expérience en restauration rapide et traditionnelle.",
            localisation: "Marseille, France",
            video: false,
            verified: true,
            matchScore: 78,
          },
          {
            id: 4,
            prenom: "Lucas",
            nom: "Petit",
            titre: "Second de cuisine",
            photo: null,
            experience: 7,
            disponibilite: "Sous 1 mois",
            langues: ["Français"],
            competences: [
              "Cuisine traditionnelle",
              "Gestion des stocks",
              "Hygiène HACCP",
            ],
            formation: "BEP Cuisine",
            description:
              "Cuisinier passionné avec une expertise en cuisine française et italienne. Capable de gérer une équipe et d'organiser une cuisine efficacement.",
            localisation: "Bordeaux, France",
            video: false,
            verified: true,
            matchScore: 72,
          },
          {
            id: 5,
            prenom: "Emma",
            nom: "Leroy",
            titre: "Réceptionniste hôtel",
            photo: null,
            experience: 4,
            disponibilite: "Immédiate",
            langues: ["Français", "Anglais", "Allemand"],
            competences: [
              "Accueil client",
              "Logiciel de réservation",
              "Gestion des réclamations",
            ],
            formation: "BTS Tourisme",
            description:
              "Trilingue avec expérience en hôtellerie de luxe. Excellentes compétences relationnelles et capacité à gérer les situations complexes.",
            localisation: "Nice, France",
            video: true,
            verified: true,
            matchScore: 94,
          },
        ];

        setCandidates(mockCandidates);
        setLoading(false);
      }, 1500);
    };

    fetchCandidates();
  }, []);

  // Gestion du swipe tactile/souris
  const handleTouchStart = (e) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
  };

  const handleTouchMove = (e) => {
    if (!startX) return;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const newOffsetX = clientX - startX;

    // Limiter le déplacement
    if (Math.abs(newOffsetX) > 20) {
      setSwiping(true);
      setOffsetX(newOffsetX);

      // Déterminer la direction du swipe
      if (newOffsetX > 50) {
        setSwipeDirection("right");
      } else if (newOffsetX < -50) {
        setSwipeDirection("left");
      } else {
        setSwipeDirection(null);
      }
    }
  };

  const handleTouchEnd = () => {
    if (!swiping) return;

    // Si le swipe est suffisamment prononcé, déclencher l'action
    if (swipeDirection === "right") {
      handleLike();
    } else if (swipeDirection === "left") {
      handleReject();
    } else {
      // Reset sans action
      setOffsetX(0);
    }

    setSwiping(false);
    setStartX(0);
    setSwipeDirection(null);
  };

  // Actions sur les candidats
  const handleLike = () => {
    if (currentIndex >= candidates.length) return;

    // Animation de swipe à droite
    setOffsetX(500);

    setTimeout(() => {
      // Dans une application réelle, nous enverrions cette action à l'API
      console.log(
        `Liked candidate: ${candidates[currentIndex].prenom} ${candidates[currentIndex].nom}`
      );

      // Passer au candidat suivant
      setCurrentIndex((prevIndex) => prevIndex + 1);
      setOffsetX(0);
    }, 300);
  };

  const handleReject = () => {
    if (currentIndex >= candidates.length) return;

    // Animation de swipe à gauche
    setOffsetX(-500);

    setTimeout(() => {
      // Dans une application réelle, nous enverrions cette action à l'API
      console.log(
        `Rejected candidate: ${candidates[currentIndex].prenom} ${candidates[currentIndex].nom}`
      );

      // Passer au candidat suivant
      setCurrentIndex((prevIndex) => prevIndex + 1);
      setOffsetX(0);
    }, 300);
  };

  // Voir les détails d'un candidat
  const handleViewDetails = () => {
    if (currentIndex >= candidates.length) return;

    setSelectedCandidate(candidates[currentIndex]);
    setOpenCandidateDetails(true);
  };

  // Gérer l'envoi d'un message
  const handleSendMessage = (candidateId) => {
    // Dans une application réelle, nous ouvririons une conversation
    console.log(`Sending message to candidate ${candidateId}`);
    navigate(`/recruteur/messages/nouveau/${candidateId}`);
  };

  // Gérer le changement de filtres
  const handleFilterChange = (name, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  // Appliquer les filtres
  const applyFilters = () => {
    // Dans une application réelle, nous enverrions les filtres à l'API
    console.log("Applying filters:", filters);
    setOpenFilters(false);

    // Simuler un rechargement des candidats
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Reset pour voir de nouveaux candidats
      setCurrentIndex(0);
    }, 1000);
  };

  // Obtenir les initiales pour l'avatar
  const getInitials = (prenom, nom) => {
    return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();
  };

  // Rendu du candidat actuel
  const renderCurrentCandidate = () => {
    if (currentIndex >= candidates.length) {
      return (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          p={4}
          height="400px"
        >
          <Typography variant="h6" gutterBottom>
            Vous avez vu tous les candidats
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Il n'y a plus de profils correspondant à vos critères pour le
            moment.
          </Typography>
          <Button
            variant="outlined"
            onClick={() => setCurrentIndex(0)}
            startIcon={<RefreshIcon />}
          >
            Revoir les candidats
          </Button>
        </Box>
      );
    }

    const candidate = candidates[currentIndex];

    return (
      <Card
        ref={cardRef}
        elevation={3}
        sx={{
          maxWidth: 600,
          width: "100%",
          transform: `translateX(${offsetX}px) rotate(${offsetX * 0.05}deg)`,
          transition: swiping ? "none" : "transform 0.3s ease",
          position: "relative",
          overflow: "visible",
        }}
        onMouseDown={handleTouchStart}
        onMouseMove={handleTouchMove}
        onMouseUp={handleTouchEnd}
        onMouseLeave={handleTouchEnd}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Badge de score de matching */}
        <Box
          sx={{
            position: "absolute",
            top: -15,
            right: -15,
            zIndex: 1,
          }}
        >
          <Tooltip title="Score de matching">
            <Avatar
              sx={{
                bgcolor: "primary.main",
                width: 56,
                height: 56,
                border: "3px solid white",
                boxShadow: 2,
              }}
            >
              <Typography variant="h6">{candidate.matchScore}%</Typography>
            </Avatar>
          </Tooltip>
        </Box>

        {/* En-tête avec photo/avatar */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            p: 3,
            bgcolor: "primary.light",
            color: "white",
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
        >
          <Avatar
            src={candidate.photo}
            alt={`${candidate.prenom} ${candidate.nom}`}
            sx={{ width: 80, height: 80, border: "2px solid white" }}
          >
            {getInitials(candidate.prenom, candidate.nom)}
          </Avatar>
          <Box ml={2}>
            <Typography variant="h5" component="div" fontWeight="bold">
              {candidate.prenom} {candidate.nom}
            </Typography>
            <Typography variant="subtitle1">{candidate.titre}</Typography>
            <Box display="flex" alignItems="center" mt={0.5}>
              <LocationIcon fontSize="small" sx={{ mr: 0.5 }} />
              <Typography variant="body2">{candidate.localisation}</Typography>
            </Box>
          </Box>
        </Box>

        <CardContent>
          {/* Badges */}
          <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
            <Chip
              icon={<TimelineIcon />}
              label={`${candidate.experience} ans d'expérience`}
              size="small"
              color="primary"
              variant="outlined"
            />
            <Chip
              icon={<CheckIcon />}
              label={`Disponibilité ${candidate.disponibilite.toLowerCase()}`}
              size="small"
              color="success"
            />
            {candidate.verified && (
              <Chip
                icon={<CheckCircleIcon />}
                label="Profil vérifié"
                size="small"
                color="info"
              />
            )}
            {candidate.video && (
              <Chip
                icon={<VideoIcon />}
                label="Vidéo"
                size="small"
                color="secondary"
              />
            )}
          </Box>

          {/* Description */}
          <Typography variant="body2" color="text.secondary" paragraph>
            {candidate.description}
          </Typography>

          {/* Compétences */}
          <Typography variant="subtitle2" gutterBottom>
            Compétences
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={0.5} mb={2}>
            {candidate.competences.map((skill, index) => (
              <Chip key={index} label={skill} size="small" />
            ))}
          </Box>

          {/* Langues */}
          <Typography variant="subtitle2" gutterBottom>
            Langues
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={0.5} mb={1}>
            {candidate.langues.map((language, index) => (
              <Chip
                key={index}
                label={language}
                size="small"
                icon={<LanguageIcon fontSize="small" />}
                variant="outlined"
              />
            ))}
          </Box>

          {/* Formation */}
          <Box display="flex" alignItems="center" mt={2}>
            <SchoolIcon
              fontSize="small"
              sx={{ mr: 1, color: "text.secondary" }}
            />
            <Typography variant="body2" color="text.secondary">
              {candidate.formation}
            </Typography>
          </Box>
        </CardContent>

        <Divider />

        <CardActions sx={{ justifyContent: "space-between", p: 2 }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleViewDetails}
            endIcon={<ExpandMoreIcon />}
          >
            Détails
          </Button>

          <Box>
            <IconButton
              size="large"
              color="error"
              onClick={handleReject}
              sx={{ mr: 1 }}
            >
              <CloseIcon />
            </IconButton>
            <IconButton size="large" color="success" onClick={handleLike}>
              <FavoriteIcon />
            </IconButton>
          </Box>
        </CardActions>
      </Card>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography variant="h4" component="h1" fontWeight="bold">
          Matching candidats
        </Typography>

        <Button
          variant="outlined"
          startIcon={<FilterListIcon />}
          onClick={() => setOpenFilters(true)}
        >
          Filtres
        </Button>
      </Box>

      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="60vh"
        >
          <CircularProgress />
        </Box>
      ) : (
        <Box display="flex" flexDirection="column" alignItems="center">
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              mb: 4,
            }}
          >
            {renderCurrentCandidate()}
          </Box>

          <Box display="flex" gap={2} mt={2}>
            <Button
              variant="outlined"
              color="error"
              startIcon={<CloseIcon />}
              onClick={handleReject}
              disabled={currentIndex >= candidates.length}
            >
              Passer
            </Button>
            <Button
              variant="contained"
              color="success"
              startIcon={<FavoriteIcon />}
              onClick={handleLike}
              disabled={currentIndex >= candidates.length}
            >
              Intéressé
            </Button>
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            mt={3}
            align="center"
          >
            Swipez à droite pour montrer votre intérêt, à gauche pour passer.
          </Typography>
        </Box>
      )}

      {/* Drawer de filtres */}
      <Drawer
        anchor="right"
        open={openFilters}
        onClose={() => setOpenFilters(false)}
      >
        <Box sx={{ width: 320, p: 3 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Typography variant="h6">Filtres</Typography>
            <IconButton onClick={() => setOpenFilters(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Typography variant="subtitle2" gutterBottom>
            Expérience (années)
          </Typography>
          <Slider
            value={filters.experience}
            onChange={(e, newValue) =>
              handleFilterChange("experience", newValue)
            }
            valueLabelDisplay="auto"
            min={0}
            max={20}
            marks={[
              { value: 0, label: "0" },
              { value: 5, label: "5" },
              { value: 10, label: "10" },
              { value: 20, label: "20+" },
            ]}
          />

          <Typography variant="subtitle2" gutterBottom sx={{ mt: 3 }}>
            Distance maximum (km)
          </Typography>
          <Slider
            value={filters.distance}
            onChange={(e, newValue) => handleFilterChange("distance", newValue)}
            valueLabelDisplay="auto"
            min={5}
            max={100}
            marks={[
              { value: 5, label: "5" },
              { value: 25, label: "25" },
              { value: 50, label: "50" },
              { value: 100, label: "100+" },
            ]}
          />

          <Typography variant="subtitle2" gutterBottom sx={{ mt: 3 }}>
            Compétences
          </Typography>
          <Autocomplete
            multiple
            options={competencesSuggestions}
            value={filters.competences}
            onChange={(event, newValue) =>
              handleFilterChange("competences", newValue)
            }
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                placeholder="Sélectionner des compétences"
                fullWidth
                size="small"
                sx={{ mb: 2 }}
              />
            )}
          />

          <Typography variant="subtitle2" gutterBottom>
            Langues
          </Typography>
          <Autocomplete
            multiple
            options={langues}
            value={filters.langues}
            onChange={(event, newValue) =>
              handleFilterChange("langues", newValue)
            }
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                placeholder="Sélectionner des langues"
                fullWidth
                size="small"
                sx={{ mb: 2 }}
              />
            )}
          />

          <FormControlLabel
            control={
              <Switch
                checked={filters.disponible}
                onChange={(e) =>
                  handleFilterChange("disponible", e.target.checked)
                }
              />
            }
            label="Disponible immédiatement"
            sx={{ display: "block", mt: 2 }}
          />

          <FormControlLabel
            control={
              <Switch
                checked={filters.verifiedOnly}
                onChange={(e) =>
                  handleFilterChange("verifiedOnly", e.target.checked)
                }
              />
            }
            label="Profils vérifiés uniquement"
            sx={{ display: "block", mt: 1 }}
          />

          <Box mt={4} display="flex" justifyContent="space-between">
            <Button
              variant="outlined"
              onClick={() =>
                setFilters({
                  experience: [0, 20],
                  distance: 50,
                  disponible: true,
                  langues: [],
                  competences: [],
                  verifiedOnly: false,
                })
              }
            >
              Réinitialiser
            </Button>
            <Button variant="contained" onClick={applyFilters}>
              Appliquer
            </Button>
          </Box>
        </Box>
      </Drawer>

      {/* Dialog de détails du candidat */}
      <Dialog
        open={openCandidateDetails}
        onClose={() => setOpenCandidateDetails(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedCandidate && (
          <>
            <DialogTitle>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h6">
                  {selectedCandidate.prenom} {selectedCandidate.nom}
                </Typography>
                <IconButton onClick={() => setOpenCandidateDetails(false)}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Box textAlign="center" mb={2}>
                    <Avatar
                      src={selectedCandidate.photo}
                      alt={`${selectedCandidate.prenom} ${selectedCandidate.nom}`}
                      sx={{ width: 120, height: 120, mx: "auto", mb: 2 }}
                    >
                      {getInitials(
                        selectedCandidate.prenom,
                        selectedCandidate.nom
                      )}
                    </Avatar>
                    <Typography variant="h6">
                      {selectedCandidate.prenom} {selectedCandidate.nom}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedCandidate.titre}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <LocationIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="Localisation"
                        secondary={selectedCandidate.localisation}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <WorkIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="Expérience"
                        secondary={`${selectedCandidate.experience} ans`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <SchoolIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="Formation"
                        secondary={selectedCandidate.formation}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="Disponibilité"
                        secondary={selectedCandidate.disponibilite}
                      />
                    </ListItem>
                    {selectedCandidate.verified && (
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircleIcon color="info" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Profil vérifié"
                          secondary="Expériences validées par des référents"
                        />
                      </ListItem>
                    )}
                  </List>

                  <Divider sx={{ my: 2 }} />

                  <Box textAlign="center">
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Score de matching
                    </Typography>
                    <Box
                      sx={{
                        position: "relative",
                        display: "inline-flex",
                      }}
                    >
                      <CircularProgress
                        variant="determinate"
                        value={selectedCandidate.matchScore}
                        size={80}
                        thickness={4}
                        sx={{ color: "success.main" }}
                      />
                      <Box
                        sx={{
                          top: 0,
                          left: 0,
                          bottom: 0,
                          right: 0,
                          position: "absolute",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography
                          variant="h6"
                          component="div"
                          color="text.primary"
                        >
                          {`${selectedCandidate.matchScore}%`}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} md={8}>
                  <Typography variant="h6" gutterBottom>
                    À propos
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {selectedCandidate.description}
                  </Typography>

                  <Typography variant="h6" gutterBottom>
                    Compétences
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={1} mb={3}>
                    {selectedCandidate.competences.map((skill, index) => (
                      <Chip key={index} label={skill} />
                    ))}
                  </Box>

                  <Typography variant="h6" gutterBottom>
                    Langues
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={1} mb={3}>
                    {selectedCandidate.langues.map((language, index) => (
                      <Chip
                        key={index}
                        label={language}
                        icon={<LanguageIcon />}
                      />
                    ))}
                  </Box>

                  {selectedCandidate.video && (
                    <>
                      <Typography variant="h6" gutterBottom>
                        Vidéo de présentation
                      </Typography>
                      <Box
                        sx={{
                          width: "100%",
                          height: 200,
                          bgcolor: "grey.200",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: 1,
                          mb: 3,
                        }}
                      >
                        <VideoIcon
                          sx={{ fontSize: 40, color: "text.secondary" }}
                        />
                      </Box>
                    </>
                  )}
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button
                variant="outlined"
                color="error"
                onClick={() => {
                  setOpenCandidateDetails(false);
                  handleReject();
                }}
                startIcon={<CloseIcon />}
              >
                Passer
              </Button>
              <Button
                variant="outlined"
                startIcon={<EmailIcon />}
                onClick={() => handleSendMessage(selectedCandidate.id)}
              >
                Contacter
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={() => {
                  setOpenCandidateDetails(false);
                  handleLike();
                }}
                startIcon={<FavoriteIcon />}
              >
                Intéressé
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

const competencesSuggestions = [
  "Service en salle",
  "Barista",
  "Gestion de caisse",
  "Prise de commandes",
  "Cocktails",
  "Sommellerie",
  "Cuisine traditionnelle",
  "Pâtisserie",
  "Accueil client",
  "Management d'équipe",
  "Gestion des stocks",
  "Hygiène HACCP",
  "Organisation d'événements",
  "Facturation",
  "Logiciel de caisse",
];

const langues = [
  "Français",
  "Anglais",
  "Espagnol",
  "Allemand",
  "Italien",
  "Portugais",
  "Arabe",
  "Chinois",
];

export default MatchingPage;
