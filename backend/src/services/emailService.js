// Ajouter ces méthodes au service emailService existant

/**
 * Envoie une invitation d'entretien
 * @param {string} to - Email du candidat
 * @param {Object} entretien - Données de l'entretien
 * @param {Object} candidature - Données de la candidature
 * @param {Object} recruteur - Données du recruteur
 * @returns {Promise<Object>} Résultat de l'envoi
 */
exports.sendInterviewInvitation = async (to, entretien, candidature, recruteur) => {
  const dateEntretien = new Date(entretien.date_entretien).toLocaleString('fr-FR');
  const mode = entretien.mode === 'visio' ? 'en visioconférence' : 'en présentiel';
  
  const mailOptions = {
    from: config.email.from,
    to,
    subject: `Hereoz - Invitation à un entretien pour "${candidature.offre_id.titre}"`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Invitation à un entretien</h2>
        <p>Bonjour,</p>
        <p>Nous avons le plaisir de vous inviter à un entretien pour le poste "${candidature.offre_id.titre}".</p>
        <div style="background-color: #f8f8f8; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Date et heure:</strong> ${dateEntretien}</p>
          <p><strong>Mode:</strong> ${mode}</p>
          <p><strong>Durée:</strong> ${entretien.duree} minutes</p>
          ${entretien.lieu ? `<p><strong>Lieu:</strong> ${entretien.lieu}</p>` : ''}
          ${entretien.lien_visio ? `<p><strong>Lien de connexion:</strong> <a href="${entretien.lien_visio}">${entretien.lien_visio}</a></p>` : ''}
          ${entretien.notes ? `<p><strong>Notes:</strong> ${entretien.notes}</p>` : ''}
        </div>
        <p>Merci de confirmer votre participation en répondant à cet email ou via votre espace candidat.</p>
        <p>Cordialement,<br>${recruteur.prenom} ${recruteur.nom}</p>
      </div>
    `
  };
  
  return await transporter.sendMail(mailOptions);
};

/**
 * Envoie une notification de mise à jour d'entretien
 * @param {string} to - Email du destinataire
 * @param {Object} entretien - Données de l'entretien
 * @param {Object} candidature - Données de la candidature
 * @param {Object} recruteur - Données du recruteur
 * @returns {Promise<Object>} Résultat de l'envoi
 */
exports.sendInterviewUpdate = async (to, entretien, candidature, recruteur) => {
  const dateEntretien = new Date(entretien.date_entretien).toLocaleString('fr-FR');
  
  const mailOptions = {
    from: config.email.from,
    to,
    subject: `Hereoz - Modification de votre entretien pour "${candidature.offre_id.titre}"`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Modification d'entretien</h2>
        <p>Bonjour,</p>
        <p>Votre entretien pour le poste "${candidature.offre_id.titre}" a été modifié.</p>
        <div style="background-color: #f8f8f8; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Nouvelle date et heure:</strong> ${dateEntretien}</p>
          <p><strong>Mode:</strong> ${entretien.mode === 'visio' ? 'Visioconférence' : 'Présentiel'}</p>
          <p><strong>Durée:</strong> ${entretien.duree} minutes</p>
          ${entretien.lieu ? `<p><strong>Lieu:</strong> ${entretien.lieu}</p>` : ''}
          ${entretien.lien_visio ? `<p><strong>Lien:</strong> <a href="${entretien.lien_visio}">${entretien.lien_visio}</a></p>` : ''}
        </div>
        <p>Cordialement,<br>${recruteur.prenom} ${recruteur.nom}</p>
      </div>
    `
  };
  
  return await transporter.sendMail(mailOptions);
};

/**
 * Envoie une confirmation d'entretien
 * @param {string} to - Email du recruteur
 * @param {Object} entretien - Données de l'entretien
 * @param {Object} candidature - Données de la candidature
 * @returns {Promise<Object>} Résultat de l'envoi
 */
exports.sendInterviewConfirmation = async (to, entretien, candidature) => {
  const dateEntretien = new Date(entretien.date_entretien).toLocaleString('fr-FR');
  
  const mailOptions = {
    from: config.email.from,
    to,
    subject: `Hereoz - Entretien confirmé avec ${candidature.utilisateur_id.prenom} ${candidature.utilisateur_id.nom}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Entretien confirmé</h2>
        <p>Bonjour,</p>
        <p>${candidature.utilisateur_id.prenom} ${candidature.utilisateur_id.nom} a confirmé sa participation à l'entretien.</p>
        <div style="background-color: #f8f8f8; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Date et heure:</strong> ${dateEntretien}</p>
          <p><strong>Candidat:</strong> ${candidature.utilisateur_id.prenom} ${candidature.utilisateur_id.nom}</p>
          <p><strong>Poste:</strong> ${candidature.offre_id.titre}</p>
        </div>
        <p>L'entretien aura lieu comme prévu.</p>
      </div>
    `
  };
  
  return await transporter.sendMail(mailOptions);
};

/**
 * Envoie une notification d'annulation d'entretien
 * @param {string} to - Email du destinataire
 * @param {Object} entretien - Données de l'entretien
 * @param {Object} candidature - Données de la candidature
 * @param {string} cancelledBy - Qui a annulé ('candidat' ou 'recruteur')
 * @param {string} motif - Motif d'annulation
 * @returns {Promise<Object>} Résultat de l'envoi
 */
exports.sendInterviewCancellation = async (to, entretien, candidature, cancelledBy, motif) => {
  const dateEntretien = new Date(entretien.date_entretien).toLocaleString('fr-FR');
  const annulePar = cancelledBy === 'candidat' ? 'le candidat' : 'le recruteur';
  
  const mailOptions = {
    from: config.email.from,
    to,
    subject: `Hereoz - Entretien annulé pour "${candidature.offre_id.titre}"`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Entretien annulé</h2>
        <p>Bonjour,</p>
        <p>L'entretien prévu le ${dateEntretien} pour le poste "${candidature.offre_id.titre}" a été annulé par ${annulePar}.</p>
        ${motif ? `<p><strong>Motif:</strong> ${motif}</p>` : ''}
        <p>Vous pouvez reprendre contact pour reprogrammer un nouvel entretien si souhaité.</p>
      </div>
    `
  };
  
  return await transporter.sendMail(mailOptions);
};

/**
 * Envoie le résultat de validation d'une référence
 * @param {string} to - Email du candidat
 * @param {Object} referent - Données du référent
 * @param {string} validation - Résultat ('valide' ou 'refuse')
 * @param {string} commentaire - Commentaire du référent
 * @returns {Promise<Object>} Résultat de l'envoi
 */
exports.sendReferenceValidationResult = async (to, referent, validation, commentaire) => {
  const resultat = validation === 'valide' ? 'validée' : 'refusée';
  const couleur = validation === 'valide' ? '#4CAF50' : '#F44336';
  
  const mailOptions = {
    from: config.email.from,
    to,
    subject: `Hereoz - Votre référence a été ${resultat}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: ${couleur};">Référence ${resultat}</h2>
        <p>Bonjour,</p>
        <p>Votre référent ${referent.prenom} ${referent.nom} a ${resultat} votre expérience professionnelle.</p>
        <div style="background-color: #f8f8f8; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Référent:</strong> ${referent.prenom} ${referent.nom}</p>
          <p><strong>Poste:</strong> ${referent.poste}</p>
          <p><strong>Entreprise:</strong> ${referent.entreprise}</p>
          ${commentaire ? `<p><strong>Commentaire:</strong> "${commentaire}"</p>` : ''}
        </div>
        ${validation === 'valide' ? 
          '<p>Félicitations ! Cette validation renforce la crédibilité de votre profil.</p>' :
          '<p>Cette référence n\'a pas pu être validée. Vous pouvez contacter directement votre référent pour clarifier la situation.</p>'
        }
      </div>
    `
  };
  
  return await transporter.sendMail(mailOptions);
};

/**
 * Envoie un rappel à un référent
 * @param {string} to - Email du référent
 * @param {Object} referent - Données du référent
 * @param {Object} experience - Données de l'expérience
 * @param {Object} candidat - Données du candidat
 * @param {string} token - Token de validation
 * @returns {Promise<Object>} Résultat de l'envoi
 */
exports.sendReferenceReminder = async (to, referent, experience, candidat, token) => {
  const validationUrl = `${config.frontendUrls.main}/validate-reference?token=${token}`;
  
  const mailOptions = {
    from: config.email.from,
    to,
    subject: `Hereoz - Rappel: Validation d'expérience pour ${candidat.prenom} ${candidat.nom}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Rappel - Validation d'expérience</h2>
        <p>Bonjour ${referent.prenom} ${referent.nom},</p>
        <p>Ceci est un rappel concernant la demande de validation d'expérience de ${candidat.prenom} ${candidat.nom}.</p>
        <div style="background-color: #f8f8f8; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Poste:</strong> ${experience.poste}</p>
          <p><strong>Entreprise:</strong> ${experience.entreprise}</p>
          <p><strong>Période:</strong> ${new Date(experience.date_debut).toLocaleDateString()} - ${experience.date_fin ? new Date(experience.date_fin).toLocaleDateString() : 'Présent'}</p>
        </div>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${validationUrl}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Valider maintenant</a>
        </div>
        <p>Merci pour votre aide précieuse !</p>
      </div>
    `
  };
  
  return await transporter.sendMail(mailOptions);
};