import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Switch,
  FormControlLabel,
  Divider,
  Chip,
  IconButton,
  LinearProgress,
  Alert,
  Autocomplete,
  InputAdornment,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import {
  Save as SaveIcon,
  Send as SendIcon,
  Build as BuildIcon,
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Clear as ClearIcon,
  Help as HelpIcon,
  FormatBold as FormatBoldIcon,
  FormatItalic as FormatItalicIcon,
  FormatListBulleted as FormatListBulletedIcon,
} from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { createOffre, selectOffreLoading } from "../../redux/slices/offreSlice";
import Loader from "../../components/common/Loader";

/**
 * Page de création d'une offre d'emploi
 */
const OffreCreationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isOptimizing, setIsOptimizing] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  const [competenceInput, setCompetenceInput] = useState("");
  const [competencesList, setCompetencesList] = useState([]);

  const loading = useSelector(selectOffreLoading);

  // Liste des types de contrat
  const typesContrat = [
    "CDI",
    "CDD",
    "Intérim",
    "Stage",
    "Alternance",
    "Freelance",
    "Extra",
    "Saisonnier",
  ];

  // Liste des niveaux d'expérience
  const niveauxExperience = [
    "Débutant accepté",
    "1 à 2 ans",
    "2 à 5 ans",
    "5 à 10 ans",
    "Plus de 10 ans",
  ];

  // Liste des langues
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

  // Suggestions de compétences pour l'hôtellerie-restauration
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

  // Validation du formulaire
  const validationSchema = Yup.object({
    titre: Yup.string()
      .min(3, "Le titre doit contenir au moins 5 caractères")
      .max(100, "Le titre ne peut pas dépasser 100 caractères")
      .required("Titre requis"),
    type_contrat: Yup.string().required("Type de contrat requis"),
    localisation: Yup.string().required("Localisation requise"),
    description: Yup.string()
      .min(50, "La description doit contenir au moins 50 caractères")
      .required("Description requise"),
    salaire_min: Yup.number().positive("Le salaire doit être positif"),
    salaire_min: Yup.number().required("Salaire minimum est requise"),
    salaire_max: Yup.number().required("Salaire maximum est requise"),
    salaire_max: Yup.number()
      .positive("Le salaire doit être positif")
      .when("salaire_min", (salaire_min, schema) =>
        salaire_min
          ? schema.min(
              salaire_min,
              "Le salaire maximum doit être supérieur au salaire minimum"
            )
          : schema
      ),
    experience_requise: Yup.string().required("Niveau d'expérience requis"),
    date_embauche_souhaitee: Yup.date().min(
      new Date(Date.now() - 86400000),
      "La date d'embauche doit être future"
    ),
    date_expiration: Yup.date().min(
      new Date(Date.now() - 86400000),
      "La date d'expiration doit être future"
    ),
  });

  // Gestion du formulaire
  const formik = useFormik({
    initialValues: {
      titre: "",
      type_contrat: "",
      description: "",
      salaire_min: "",
      salaire_max: "",
      localisation: "",
      remote: "non",
      horaires: "",
      experience_requise: "",
      date_embauche_souhaitee: "",
      date_expiration: "",
      entretien_ia_auto: false,
      urgence: false,
      langues_requises: [],
    },
    validationSchema,
    onSubmit: (values) => {
      // Préparer les données pour l'API
      const offreData = {
        ...values,
        tags_competences: competencesList,
      };

      // Dispatche l'action pour créer l'offre
      dispatch(createOffre(offreData)).then((resultAction) => {
        if (resultAction.type === "offre/createOffre/fulfilled") {
          navigate("/recruteur/offres");
        }
      });
    },
  });

  // Gérer l'ajout d'une compétence
  const handleAddCompetence = () => {
    if (competenceInput && !competencesList.includes(competenceInput)) {
      setCompetencesList([...competencesList, competenceInput]);
      setCompetenceInput("");
    }
  };

  // Gérer la suppression d'une compétence
  const handleRemoveCompetence = (competence) => {
    setCompetencesList(competencesList.filter((c) => c !== competence));
  };

  // Optimiser la description avec l'IA
  const handleOptimizeDescription = () => {
    if (!formik.values.description) {
      return;
    }

    setIsOptimizing(true);

    // Simulation d'une optimisation IA
    setTimeout(() => {
      const optimizedDescription = `${formik.values.description}\n\n
NOTRE RESTAURANT :
Situé au cœur de Paris, notre établissement offre une cuisine raffinée dans un cadre élégant et convivial. Notre équipe dynamique recherche un talent supplémentaire pour renforcer sa qualité de service.

CE QUE NOUS OFFRONS :
- Un environnement de travail stimulant et collaboratif
- Des opportunités d'évolution et de formation continue
- Une rémunération attractive avec avantages (mutuelle, tickets restaurant)
- Une équipe passionnée et bienveillante

REJOIGNEZ-NOUS si vous êtes passionné, rigoureux et avez l'esprit d'équipe. Nous avons hâte de vous rencontrer !`;

      formik.setFieldValue("description", optimizedDescription);
      setIsOptimizing(false);
    }, 2000);
  };

  // Afficher l'aperçu de l'offre
  const handlePreview = () => {
    setOpenPreview(true);
  };

  // Formater le texte dans la description
  const handleFormatText = (format) => {
    const textarea = document.getElementById("description");
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formik.values.description.substring(start, end);

    let formattedText = "";
    let newCursorPosition = end;

    switch (format) {
      case "bold":
        formattedText = `**${selectedText}**`;
        newCursorPosition = start + formattedText.length;
        break;
      case "italic":
        formattedText = `*${selectedText}*`;
        newCursorPosition = start + formattedText.length;
        break;
      case "list":
        formattedText = selectedText
          .split("\n")
          .map((line) => (line.trim() ? `• ${line}` : line))
          .join("\n");
        newCursorPosition = start + formattedText.length;
        break;
      default:
        break;
    }

    const newDescription =
      formik.values.description.substring(0, start) +
      formattedText +
      formik.values.description.substring(end);

    formik.setFieldValue("description", newDescription);

    // Remettre le focus et repositionner le curseur
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPosition, newCursorPosition);
    }, 0);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={1} sx={{ p: 4 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h4" component="h1" fontWeight="bold">
            Nouvelle offre d'emploi
          </Typography>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/recruteur/offres")}
          >
            Retour
          </Button>
        </Box>

        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            {/* Informations principales */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Informations principales
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                id="titre"
                name="titre"
                label="Titre du poste"
                value={formik.values.titre}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.titre && Boolean(formik.errors.titre)}
                helperText={formik.touched.titre && formik.errors.titre}
                placeholder="Ex: Chef de Rang, Sous-Chef, Réceptionniste..."
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl
                fullWidth
                required
                error={
                  formik.touched.type_contrat &&
                  Boolean(formik.errors.type_contrat)
                }
              >
                <InputLabel id="type-contrat-label">Type de contrat</InputLabel>
                <Select
                  labelId="type-contrat-label"
                  id="type_contrat"
                  name="type_contrat"
                  value={
                    formik.values.type_contrat
                      ? formik.values.type_contrat.toLowerCase()
                      : ""
                  }
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  label="Type de contrat"
                >
                  {typesContrat.map((type) => (
                    <MenuItem key={type} value={type.toLowerCase()}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.type_contrat && formik.errors.type_contrat && (
                  <FormHelperText>{formik.errors.type_contrat}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl
                fullWidth
                required
                error={
                  formik.touched.experience_requise &&
                  Boolean(formik.errors.experience_requise)
                }
              >
                <InputLabel id="experience-requise-label">
                  Expérience requise
                </InputLabel>
                <Select
                  labelId="experience-requise-label"
                  id="experience_requise"
                  name="experience_requise"
                  value={formik.values.experience_requise}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  label="Expérience requise"
                >
                  {niveauxExperience.map((niveau) => (
                    <MenuItem key={niveau} value={niveau}>
                      {niveau}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.experience_requise &&
                  formik.errors.experience_requise && (
                    <FormHelperText>
                      {formik.errors.experience_requise}
                    </FormHelperText>
                  )}
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="salaire_min"
                name="salaire_min"
                label="Salaire minimum (€)"
                type="number"
                value={formik.values.salaire_min}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.salaire_min &&
                  Boolean(formik.errors.salaire_min)
                }
                helperText={
                  formik.touched.salaire_min && formik.errors.salaire_min
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">€</InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="salaire_max"
                name="salaire_max"
                label="Salaire maximum (€)"
                type="number"
                value={formik.values.salaire_max}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.salaire_max &&
                  Boolean(formik.errors.salaire_max)
                }
                helperText={
                  formik.touched.salaire_max && formik.errors.salaire_max
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">€</InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                id="localisation"
                name="localisation"
                label="Localisation"
                value={formik.values.localisation}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.localisation &&
                  Boolean(formik.errors.localisation)
                }
                helperText={
                  formik.touched.localisation && formik.errors.localisation
                }
                placeholder="Ex: 123 rue de Paris, 75001 Paris"
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel id="remote-label">Télétravail</InputLabel>
                <Select
                  labelId="remote-label"
                  id="remote"
                  name="remote"
                  value={formik.values.remote}
                  onChange={formik.handleChange}
                  label="Télétravail"
                >
                  <MenuItem value="non">Non</MenuItem>
                  <MenuItem value="hybride">Hybride</MenuItem>
                  <MenuItem value="full_remote">100% télétravail</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="horaires"
                name="horaires"
                label="Horaires de travail"
                value={formik.values.horaires}
                onChange={formik.handleChange}
                placeholder="Ex: Mardi au Samedi, 9h-17h / Service du soir"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="date_embauche_souhaitee"
                name="date_embauche_souhaitee"
                label="Date d'embauche souhaitée"
                type="date"
                value={formik.values.date_embauche_souhaitee}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.date_embauche_souhaitee &&
                  Boolean(formik.errors.date_embauche_souhaitee)
                }
                helperText={
                  formik.touched.date_embauche_souhaitee &&
                  formik.errors.date_embauche_souhaitee
                }
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="date_d'expiration"
                name="date_expiration"
                label="Date d'expiration de l'offre"
                type="date"
                value={formik.values.date_expiration}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.date_expiration &&
                  Boolean(formik.errors.date_expiration)
                }
                helperText={
                  formik.touched.date_expiration &&
                  formik.errors.date_expiration
                }
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Description du poste
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Box position="relative">
                <Box display="flex" gap={1} mb={1}>
                  <Tooltip title="Mettre en gras">
                    <IconButton
                      size="small"
                      onClick={() => handleFormatText("bold")}
                    >
                      <FormatBoldIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Mettre en italique">
                    <IconButton
                      size="small"
                      onClick={() => handleFormatText("italic")}
                    >
                      <FormatItalicIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Ajouter une liste à puces">
                    <IconButton
                      size="small"
                      onClick={() => handleFormatText("list")}
                    >
                      <FormatListBulletedIcon />
                    </IconButton>
                  </Tooltip>
                </Box>

                <TextField
                  fullWidth
                  id="description"
                  name="description"
                  label="Description du poste"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.description &&
                    Boolean(formik.errors.description)
                  }
                  helperText={
                    (formik.touched.description && formik.errors.description) ||
                    "Décrivez les responsabilités, les tâches, l'environnement de travail, les avantages..."
                  }
                  multiline
                  rows={10}
                  required
                />

                {isOptimizing && (
                  <LinearProgress
                    sx={{
                      position: "absolute",
                      bottom:
                        formik.touched.description && formik.errors.description
                          ? "24px"
                          : "0",
                      left: 0,
                      right: 0,
                    }}
                  />
                )}
              </Box>

              <Button
                variant="outlined"
                startIcon={<BuildIcon />}
                onClick={handleOptimizeDescription}
                disabled={!formik.values.description || isOptimizing}
                sx={{ mt: 1 }}
              >
                {isOptimizing
                  ? "Optimisation en cours..."
                  : "Optimiser avec l'IA"}
              </Button>
              <Tooltip title="L'IA améliore la structure et le contenu de votre offre pour la rendre plus attractive">
                <IconButton size="small" sx={{ ml: 1 }}>
                  <HelpIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Compétences et langues
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Compétences requises
              </Typography>
              <Box display="flex" alignItems="flex-start" gap={1} mb={2}>
                <Autocomplete
                  freeSolo
                  options={competencesSuggestions}
                  inputValue={competenceInput}
                  onInputChange={(event, newValue) => {
                    setCompetenceInput(newValue);
                  }}
                  sx={{ flexGrow: 1 }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Ajouter une compétence"
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleAddCompetence}
                  disabled={!competenceInput}
                >
                  Ajouter
                </Button>
              </Box>

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {competencesList.map((competence) => (
                  <Chip
                    key={competence}
                    label={competence}
                    onDelete={() => handleRemoveCompetence(competence)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
                {competencesList.length === 0 && (
                  <Typography variant="body2" color="text.secondary">
                    Aucune compétence ajoutée.
                  </Typography>
                )}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Autocomplete
                multiple
                id="langues-requises"
                options={langues}
                value={formik.values.langues_requises}
                onChange={(event, newValue) => {
                  formik.setFieldValue("langues_requises", newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Langues requises"
                    placeholder="Sélectionner des langues"
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip label={option} {...getTagProps({ index })} />
                  ))
                }
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Options avancées
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formik.values.entretien_ia_auto}
                    onChange={(e) =>
                      formik.setFieldValue(
                        "entretien_ia_auto",
                        e.target.checked
                      )
                    }
                    name="entretien_ia_auto"
                    color="primary"
                  />
                }
                label="Activer l'entretien IA automatisé"
              />
              <Typography
                variant="caption"
                display="block"
                color="text.secondary"
              >
                Les candidats passeront un premier entretien avec notre IA avant
                contact humain
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formik.values.urgence}
                    onChange={(e) =>
                      formik.setFieldValue("urgence", e.target.checked)
                    }
                    name="urgence"
                    color="error"
                  />
                }
                label="Marquer comme urgent"
              />
              <Typography
                variant="caption"
                display="block"
                color="text.secondary"
              >
                L'offre sera mise en avant dans les recherches des candidats
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Box display="flex" justifyContent="space-between" mt={2}>
                <Button variant="outlined" onClick={handlePreview}>
                  Aperçu
                </Button>
                <Box>
                  <Button
                    variant="outlined"
                    sx={{ mr: 2 }}
                    onClick={() => navigate("/recruteur/offres")}
                  >
                    Annuler
                  </Button>
                  <Button
                    variant="contained"
                    type="submit"
                    startIcon={<SendIcon />}
                    disabled={loading || !formik.isValid}
                  >
                    {loading ? "Publication..." : "Publier l'offre"}
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Dialog d'aperçu */}
      <Dialog
        open={openPreview}
        onClose={() => setOpenPreview(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Aperçu de l'offre</DialogTitle>
        <DialogContent dividers>
          <Typography variant="h5" gutterBottom>
            {formik.values.titre || "Titre du poste"}
          </Typography>

          <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
            {formik.values.type_contrat && (
              <Chip
                label={formik.values.type_contrat}
                color="primary"
                size="small"
              />
            )}
            {formik.values.experience_requise && (
              <Chip label={formik.values.experience_requise} size="small" />
            )}
            {formik.values.localisation && (
              <Chip label={formik.values.localisation} size="small" />
            )}
            {formik.values.remote !== "non" && (
              <Chip
                label={
                  formik.values.remote === "hybride" ? "Hybride" : "Télétravail"
                }
                size="small"
                color="secondary"
              />
            )}
            {formik.values.urgence && (
              <Chip label="Urgent" size="small" color="error" />
            )}
          </Box>

          {(formik.values.salaire_min || formik.values.salaire_max) && (
            <Typography variant="subtitle1" gutterBottom>
              Salaire :
              {formik.values.salaire_min && ` ${formik.values.salaire_min}€`}
              {formik.values.salaire_min && formik.values.salaire_max && " - "}
              {formik.values.salaire_max && `${formik.values.salaire_max}€`}
            </Typography>
          )}

          <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
            Description du poste
          </Typography>
          <Typography variant="body1" paragraph sx={{ whiteSpace: "pre-wrap" }}>
            {formik.values.description || "Aucune description fournie."}
          </Typography>

          {competencesList.length > 0 && (
            <>
              <Typography variant="subtitle2" gutterBottom>
                Compétences requises
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                {competencesList.map((competence) => (
                  <Chip key={competence} label={competence} size="small" />
                ))}
              </Box>
            </>
          )}

          {formik.values.langues_requises &&
            formik.values.langues_requises.length > 0 && (
              <>
                <Typography variant="subtitle2" gutterBottom>
                  Langues requises
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                  {formik.values.langues_requises.map((langue) => (
                    <Chip key={langue} label={langue} size="small" />
                  ))}
                </Box>
              </>
            )}

          {formik.values.horaires && (
            <>
              <Typography variant="subtitle2" gutterBottom>
                Horaires
              </Typography>
              <Typography variant="body2" paragraph>
                {formik.values.horaires}
              </Typography>
            </>
          )}

          {formik.values.date_embauche_souhaitee && (
            <Typography variant="body2">
              Date d'embauche souhaitée :{" "}
              {new Date(
                formik.values.date_embauche_souhaitee
              ).toLocaleDateString()}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPreview(false)}>Fermer</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default OffreCreationPage;
