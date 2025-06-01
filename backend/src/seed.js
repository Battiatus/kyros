const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker/locale/fr'); // Using French locale for some data

// --- Placeholder Schemas (Replace with your actual models) ---
// User Schema (Placeholder - REPLACE WITH YOURS)
const userSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mot_de_passe: { type: String, required: true }, // In a real app, hash this
  role: { type: String, enum: ['candidat', 'recruteur', 'admin'], default: 'candidat' },
  entreprise_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Entreprise' },
  // Add other fields your User model has
}, { timestamps: true });
const User = mongoose.model('User', userSchema);

// Offre Schema (Placeholder - REPLACE WITH YOURS)
const offreSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  entreprise_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Entreprise', required: true },
  recruteur_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  description: String,
  // Add other fields your Offre model has
}, { timestamps: true });
const Offre = mongoose.model('Offre', offreSchema);

// --- Import Your Actual Models ---
const Candidature = require('./models/Candidature');
const Competence = require('./models/Competence');
const Conversation = require('./models/Conversation');
const Disponibilite = require('./models/Disponibilite');
const Entreprise = require('./models/Entreprise');
const Entretien = require('./models/Entretien');
const Experience = require('./models/Experience');
const Formation = require('./models/Formation');
const Langue = require('./models/Langue');
const Message = require('./models/Message');

// --- Configuration ---
const MONGO_URI = 'mongodb+srv://kronoco:929477As*@kyros.vmxekw4.mongodb.net/?retryWrites=true&w=majority&appName=kyros';
const NUM_USERS_CANDIDATS = 20;
const NUM_USERS_RECRUTEURS = 5;
const NUM_USERS_ADMINS = 2;
const NUM_ENTREPRISES = 5;
const NUM_OFFRES_PER_ENTREPRISE = 3;
const MAX_CANDIDATURES_PER_OFFRE = 10;
const MAX_ITEMS_PER_USER = 3; // For Competence, Experience, Formation, Langue, Disponibilite
const MAX_MESSAGES_PER_CONVERSATION = 5;

// Helper function to get a random element from an array
const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomSubset = (arr, count) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, shuffled.length));
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected...');

    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Entreprise.deleteMany({});
    await Offre.deleteMany({});
    await Candidature.deleteMany({});
    await Competence.deleteMany({});
    await Conversation.deleteMany({});
    await Disponibilite.deleteMany({});
    await Entretien.deleteMany({});
    await Experience.deleteMany({});
    await Formation.deleteMany({});
    await Langue.deleteMany({});
    await Message.deleteMany({});
    console.log('Existing data cleared.');

    // 1. Create Users
    const users = [];
    const candidateIds = [];
    const recruiterIds = [];
    const adminIds = [];

    for (let i = 0; i < NUM_USERS_ADMINS; i++) {
      const user = new User({
        nom: faker.person.lastName(),
        prenom: faker.person.firstName(),
        email: faker.internet.email({firstName: `admin${i}`}),
        mot_de_passe: 'password123', // Consider hashing
        role: 'admin',
      });
      users.push(user);
      adminIds.push(user._id);
    }
    console.log(`${adminIds.length} Admin users created.`);

    for (let i = 0; i < NUM_USERS_RECRUTEURS; i++) {
      const user = new User({
        nom: faker.person.lastName(),
        prenom: faker.person.firstName(),
        email: faker.internet.email({firstName: `recruteur${i}`}),
        mot_de_passe: 'password123',
        role: 'recruteur',
      });
      users.push(user);
      recruiterIds.push(user._id);
    }
    console.log(`${recruiterIds.length} Recruiter users created.`);

    for (let i = 0; i < NUM_USERS_CANDIDATS; i++) {
      const user = new User({
        nom: faker.person.lastName(),
        prenom: faker.person.firstName(),
        email: faker.internet.email({firstName: `candidat${i}`}),
        mot_de_passe: 'password123',
        role: 'candidat',
      });
      users.push(user);
      candidateIds.push(user._id);
    }
    console.log(`${candidateIds.length} Candidate users created.`);
    await User.insertMany(users);
    console.log('All users inserted.');


    // 2. Create Entreprises
    const entreprises = [];
    const entrepriseIds = [];
    if (adminIds.length === 0 && recruiterIds.length === 0) {
        console.error("Cannot create entreprises without admin or recruiter users.");
        return;
    }

    for (let i = 0; i < NUM_ENTREPRISES; i++) {
      const adminId = getRandomElement(adminIds.length > 0 ? adminIds : recruiterIds); // Prefer admin, fallback to recruiter
      const entreprise = new Entreprise({
        nom: faker.company.name(),
        logo: faker.image.urlLoremFlickr({ category: 'business' }),
        domaine_email: faker.internet.domainName(),
        admin_id: adminId,
        adresse: faker.location.streetAddress(true),
        secteur: faker.commerce.department(),
        taille: getRandomElement(['petite', 'moyenne', 'grande']),
        site_web: faker.internet.url(),
        description: faker.lorem.paragraph(),
        plan_actif: getRandomElement(['gratuit', 'basique', 'pro']),
      });
      entreprises.push(entreprise);
      entrepriseIds.push(entreprise._id);

      // Assign this entreprise_id to its admin/recruiter user
      const userToUpdate = users.find(u => u._id === adminId);
      if (userToUpdate) userToUpdate.entreprise_id = entreprise._id;
    }
    await Entreprise.insertMany(entreprises);
    // Update users with entreprise_id
    await Promise.all(users.filter(u => u.entreprise_id).map(u => User.findByIdAndUpdate(u._id, { entreprise_id: u.entreprise_id })));
    console.log(`${entreprises.length} entreprises created and users updated.`);


    // 3. Create Offres
    const offres = [];
    const offreIds = [];
    if (recruiterIds.length === 0) {
        console.error("Cannot create offres without recruiter users.");
    } else {
         for (const entrepriseId of entrepriseIds) { // Changed from forEach
        for (let i = 0; i < NUM_OFFRES_PER_ENTREPRISE; i++) {
            const recruteurUser = await User.findById(getRandomElement(recruiterIds)); // Now valid
            if (recruteurUser) {
                    // Assign recruiter to this company if not already
                    if (!recruteurUser.entreprise_id) {
                        recruteurUser.entreprise_id = entrepriseId;
                        await recruteurUser.save();
                    } else if (recruteurUser.entreprise_id.toString() !== entrepriseId.toString()) {
                        // If recruiter is from another company, create a new one or pick another
                        // For simplicity, we'll just log a note or you could assign them.
                        // console.log(`Note: Recruiter ${recruteurUser._id} reassigned to ${entrepriseId} for an offer.`);
                        // recruteurUser.entreprise_id = entrepriseId;
                        // await recruteurUser.save();
                    }

                    const offre = new Offre({
                        titre: faker.person.jobTitle(),
                        entreprise_id: entrepriseId,
                        recruteur_id: recruteurUser._id,
                        description: faker.lorem.paragraphs(2),
                    });
                    offres.push(offre);
                    offreIds.push(offre._id);
                }
            }
    };
        if (offres.length > 0) {
             await Offre.insertMany(offres);
             console.log(`${offres.length} offres created.`);
        } else {
            console.log("No offres created (likely no recruiters).");
        }
    }


    // 4. Create Candidatures
    const candidatures = [];
    const candidatureIds = [];
    const createdCandidaturePairs = new Set();

    if (offreIds.length > 0 && candidateIds.length > 0) {
        for (const offreId of offreIds) {
            const numCandidatures = faker.number.int({ min: 1, max: MAX_CANDIDATURES_PER_OFFRE });
            const selectedCandidates = getRandomSubset(candidateIds, numCandidatures);

            for (const candidateId of selectedCandidates) {
                const pairKey = `${candidateId}-${offreId}`;
                if (createdCandidaturePairs.has(pairKey)) continue; // Skip if already created

                const candidature = new Candidature({
                    utilisateur_id: candidateId,
                    offre_id: offreId,
                    statut: getRandomElement(['non_vue', 'vue', 'favori', 'acceptee', 'rejetee', 'entretien', 'contrat', 'embauchee']),
                    message_personnalise: faker.lorem.sentence(),
                    notes_recruteur: Math.random() > 0.7 ? faker.lorem.sentence() : undefined,
                    motif_refus: Math.random() > 0.8 && this.statut === 'rejetee' ? faker.lorem.words(5) : undefined,
                    score_matching: faker.number.int({min: 30, max: 95})
                });
                candidatures.push(candidature);
                candidatureIds.push(candidature._id);
                createdCandidaturePairs.add(pairKey);
            }
        }
        if (candidatures.length > 0) {
            await Candidature.insertMany(candidatures, { ordered: false }).catch(err => console.log("Some duplicate candidatures skipped."));
            console.log(`${candidatures.length} candidatures created.`);
        }
    }


    // 5. User-specific details (Competence, Disponibilite, Experience, Formation, Langue)
    if (candidateIds.length > 0) {
        const allUserDetails = [];

        for (const userId of candidateIds) {
            // Competences
            const createdCompetences = new Set();
            for (let i = 0; i < faker.number.int({ min: 1, max: MAX_ITEMS_PER_USER }); i++) {
                const competenceName = faker.person.jobSkill();
                if (createdCompetences.has(competenceName)) continue;
                allUserDetails.push(new Competence({
                    utilisateur_id: userId,
                    competence: competenceName,
                    niveau: getRandomElement(['debutant', 'intermediaire', 'expert']),
                }));
                createdCompetences.add(competenceName);
            }

            // Disponibilites
            for (let i = 0; i < faker.number.int({ min: 1, max: MAX_ITEMS_PER_USER }); i++) {
                const heureDebut = `${faker.number.int({ min: 8, max: 16 }).toString().padStart(2, '0')}:00`;
                const heureFin = `${faker.number.int({ min: parseInt(heureDebut.split(':')[0]) + 1, max: 18 }).toString().padStart(2, '0')}:00`;
                allUserDetails.push(new Disponibilite({
                    utilisateur_id: userId,
                    jour: faker.number.int({ min: 1, max: 5 }), // Mon-Fri
                    heure_debut: heureDebut,
                    heure_fin: heureFin,
                    recurrence: getRandomElement(['unique', 'hebdomadaire']),
                    date_specifique: this.recurrence === 'unique' ? faker.date.soon({days: 30}) : undefined,
                }));
            }

            // Experiences
            for (let i = 0; i < faker.number.int({ min: 1, max: MAX_ITEMS_PER_USER }); i++) {
                const dateDebut = faker.date.past({ years: 5 });
                allUserDetails.push(new Experience({
                    utilisateur_id: userId,
                    poste: faker.person.jobTitle(),
                    entreprise: faker.company.name(),
                    description: faker.lorem.sentence(),
                    date_debut: dateDebut,
                    date_fin: Math.random() > 0.3 ? faker.date.between({ from: dateDebut, to: new Date() }) : undefined,
                    validated: faker.datatype.boolean(0.7)
                }));
            }

            // Formations
            for (let i = 0; i < faker.number.int({ min: 1, max: MAX_ITEMS_PER_USER }); i++) {
                 const dateDebut = faker.date.past({ years: 8 });
                 const dateFin = Math.random() > 0.3 ? faker.date.between({ from: dateDebut, to: faker.date.past({ years: 1, refDate: dateDebut }) }) : undefined;
                allUserDetails.push(new Formation({
                    utilisateur_id: userId,
                    diplome: faker.person.jobType() + " " + faker.word.noun(),
                    etablissement: faker.company.name() + " University",
                    date_debut: dateDebut,
                    date_fin: dateFin,
                    description: faker.lorem.sentence(),
                    niveau: getRandomElement(['bac', 'bac+2', 'bac+3', 'bac+5', 'doctorat', 'autre']),
                    domaine: faker.person.jobArea(),
                    obtenu: dateFin ? faker.datatype.boolean(0.9) : false
                }));
            }

            // Langues
            const createdLangues = new Set();
            for (let i = 0; i < faker.number.int({ min: 1, max: MAX_ITEMS_PER_USER }); i++) {
                const langueName = faker.location.country(); // Using country names for variety
                if (createdLangues.has(langueName)) continue;
                allUserDetails.push(new Langue({
                    utilisateur_id: userId,
                    langue: langueName,
                    niveau: getRandomElement(['debutant', 'intermediaire', 'courant', 'bilingue', 'natif']),
                    certifie: faker.datatype.boolean(0.2)
                }));
                createdLangues.add(langueName);
            }
        }

        if (allUserDetails.filter(d => d instanceof Competence).length > 0) await Competence.insertMany(allUserDetails.filter(d => d instanceof Competence), { ordered: false }).catch(err => console.log("Some duplicate competences skipped."));
        if (allUserDetails.filter(d => d instanceof Disponibilite).length > 0) await Disponibilite.insertMany(allUserDetails.filter(d => d instanceof Disponibilite));
        if (allUserDetails.filter(d => d instanceof Experience).length > 0) await Experience.insertMany(allUserDetails.filter(d => d instanceof Experience));
        if (allUserDetails.filter(d => d instanceof Formation).length > 0) await Formation.insertMany(allUserDetails.filter(d => d instanceof Formation));
        if (allUserDetails.filter(d => d instanceof Langue).length > 0) await Langue.insertMany(allUserDetails.filter(d => d instanceof Langue), { ordered: false }).catch(err => console.log("Some duplicate langues skipped."));
        console.log('User-specific details (Competences, Disponibilites, Experiences, Formations, Langues) created.');
    }


    // 6. Create Conversations and Messages
    const conversations = [];
    const conversationIds = [];
    const messages = [];
    const createdConversationTriplets = new Set();

    if (candidatureIds.length > 0 && recruiterIds.length > 0 && candidateIds.length > 0) {
        const potentialCandidatures = await Candidature.find().populate('offre_id').limit(NUM_USERS_CANDIDATS * 2);

        for (const cand of potentialCandidatures) {
            if (!cand.offre_id || !cand.offre_id.recruteur_id || !cand.utilisateur_id) continue;

            const recruteurId = cand.offre_id.recruteur_id;
            const candidatId = cand.utilisateur_id;
            const offreId = cand.offre_id._id;

            const tripletKey = `${candidatId}-${recruteurId}-${offreId}`;
            if (createdConversationTriplets.has(tripletKey)) continue;

            const conversation = new Conversation({
                candidat_id: candidatId,
                recruteur_id: recruteurId,
                offre_id: offreId,
                statut: getRandomElement(['ouverte', 'fermee', 'archivee']),
            });
            conversations.push(conversation);
            conversationIds.push(conversation._id);
            createdConversationTriplets.add(tripletKey);

            // Messages for this conversation
            const participants = [candidatId, recruteurId];
            for (let j = 0; j < faker.number.int({ min: 1, max: MAX_MESSAGES_PER_CONVERSATION }); j++) {
                messages.push(new Message({
                    conversation_id: conversation._id,
                    expediteur_id: getRandomElement(participants),
                    contenu: faker.lorem.sentence(),
                    type: 'texte',
                    lu: faker.datatype.boolean(0.8)
                }));
            }
        }
        if (conversations.length > 0) {
            await Conversation.insertMany(conversations, { ordered: false }).catch(err => console.log("Some duplicate conversations skipped."));
            console.log(`${conversations.length} conversations created.`);
            if (messages.length > 0) {
                await Message.insertMany(messages);
                console.log(`${messages.length} messages created.`);
            }
        }
    }

    // 7. Create Entretiens
    const entretiens = [];
    if (candidatureIds.length > 0) {
        const candidaturesForEntretien = await Candidature.find({ statut: { $in: ['entretien', 'acceptee', 'contrat'] } }).limit(candidatureIds.length / 2);

        for (const candidature of candidaturesForEntretien) {
            const mode = getRandomElement(['visio', 'physique']);
            entretiens.push(new Entretien({
                candidature_id: candidature._id,
                date_entretien: faker.date.soon({ days: 15 }),
                duree: getRandomElement([30, 45, 60]),
                mode: mode,
                statut: getRandomElement(['planifie', 'confirme', 'realise', 'annule']),
                notes: faker.lorem.sentences(1),
                lien_visio: mode === 'visio' ? faker.internet.url() : undefined,
                lieu: mode === 'physique' ? faker.location.streetAddress() : undefined,
            }));
        }
        if (entretiens.length > 0) {
            await Entretien.insertMany(entretiens);
            console.log(`${entretiens.length} entretiens created.`);
        }
    }


    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB disconnected.');
  }
};

seedDatabase();