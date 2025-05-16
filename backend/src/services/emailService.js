/**
 * Service d'envoi d'emails
 * @module services/emailService
 */

const nodemailer = require('nodemailer');
const config = require('../config/config');

/**
 * Crée un transporteur pour l'envoi d'emails
 * @type {nodemailer.Transporter}
 */
const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: config.email.port === 465,
  auth: {
    user: config.email.auth.user,
    pass: config.email.auth.pass
  }
});

/**
 * Envoie un email de validation d'adresse
 * @param {string} to - Adresse email destinataire
 * @param {string} token - Token de validation
 * @returns {Promise<Object>} Résultat de l'envoi
 */
exports.sendEmailValidation = async (to, token) => {
  const validationUrl = `${config.frontendUrls.main}/validate-email?token=${token}`;
  
  const mailOptions = {
    from: config.email.from,
    to,
    subject: 'Hereoz - Validez votre adresse email',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Bienvenue sur Hereoz!</h2>
        <p>Merci de vous être inscrit(e) sur notre plateforme. Pour activer votre compte, veuillez cliquer sur le bouton ci-dessous :</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${validationUrl}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Valider mon email</a>
        </div>
        <p>Si le bouton ne fonctionne pas, vous pouvez également copier et coller l'URL suivante dans votre navigateur :</p>
        <p>${validationUrl}</p>
        <p>Ce lien est valable pendant 24 heures.</p>
        <p>À bientôt sur Hereoz!</p>
      </div>
    `
  };
  
  return await transporter.sendMail(mailOptions);
};

/**
 * Envoie un email de réinitialisation de mot de passe
 * @param {string} to - Adresse email destinataire
 * @param {string} token - Token de réinitialisation
 * @returns {Promise<Object>} Résultat de l'envoi
 */
exports.sendPasswordReset = async (to, token) => {
  const resetUrl = `${config.frontendUrls.main}/reset-password?token=${token}`;
  
  const mailOptions = {
    from: config.email.from,
    to,
    subject: 'Hereoz - Réinitialisation de votre mot de passe',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Réinitialisation de votre mot de passe</h2>
        <p>Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Réinitialiser mon mot de passe</a>
        </div>
        <p>Si le bouton ne fonctionne pas, vous pouvez également copier et coller l'URL suivante dans votre navigateur :</p>
        <p>${resetUrl}</p>
        <p>Ce lien est valable pendant 1 heure.</p>
        <p>Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email.</p>
      </div>
    `
  };
  
  return await transporter.sendMail(mailOptions);
};

/**
 * Envoie un email de demande de validation de référence
 * @param {string} to - Adresse email destinataire
 * @param {Object} referent - Données du référent
 * @param {Object} experience - Détails de l'expérience à valider
 * @param {Object} candidat - Informations sur le candidat
 * @param {string} token - Token de validation
 * @returns {Promise<Object>} Résultat de l'envoi
 */
exports.sendReferenceValidation = async (to, referent, experience, candidat, token) => {
  const validationUrl = `${config.frontendUrls.main}/validate-reference?token=${token}`;
  
  const mailOptions = {
    from: config.email.from,
    to,
    subject: `Hereoz - ${candidat.prenom} ${candidat.nom} vous a ajouté comme référent professionnel`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Demande de validation d'expérience professionnelle</h2>
        <p>Bonjour ${referent.prenom} ${referent.nom},</p>
        <p>${candidat.prenom} ${candidat.nom} vous a ajouté comme référent pour valider son expérience professionnelle :</p>
        <div style="background-color: #f8f8f8; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Poste:</strong> ${experience.poste}</p>
          <p><strong>Entreprise:</strong> ${experience.entreprise}</p>
          <p><strong>Période:</strong> ${new Date(experience.date_debut).toLocaleDateString()} - ${experience.date_fin ? new Date(experience.date_fin).toLocaleDateString() : 'Présent'}</p>
        </div>
        <p>Pour valider cette expérience, veuillez cliquer sur le bouton ci-dessous :</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${validationUrl}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Valider l'expérience</a>
        </div>
        <p>Si le bouton ne fonctionne pas, vous pouvez également copier et coller l'URL suivante dans votre navigateur :</p>
        <p>${validationUrl}</p>
        <p>Merci de votre aide pour garantir la qualité des profils sur notre plateforme!</p>
      </div>
    `
  };
  
  return await transporter.sendMail(mailOptions);
};

/**
 * Envoie une notification pour une nouvelle candidature
 * @param {string} to - Adresse email destinataire
 * @param {Object} candidature - Détails de la candidature
 * @param {Object} candidat - Informations sur le candidat
 * @param {Object} offre - Détails de l'offre
 * @returns {Promise<Object>} Résultat de l'envoi
 */
exports.sendNewApplicationNotification = async (to, candidature, candidat, offre) => {
  const applicationUrl = `${config.frontendUrls.main}/recruteur/candidatures/${candidature._id}`;
  
  const mailOptions = {
    from: config.email.from,
    to,
    subject: `Hereoz - Nouvelle candidature pour "${offre.titre}"`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Nouvelle candidature reçue</h2>
        <p>Bonjour,</p>
        <p>Vous avez reçu une nouvelle candidature pour votre offre "${offre.titre}".</p>
        <div style="background-color: #f8f8f8; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Candidat:</strong> ${candidat.prenom} ${candidat.nom}</p>
          <p><strong>Score de matching:</strong> ${candidature.score_matching}%</p>
          ${candidature.message_personnalise ? `<p><strong>Message:</strong> "${candidature.message_personnalise}"</p>` : ''}
        </div>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${applicationUrl}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Voir la candidature</a>
        </div>
        <p>Ne manquez pas cette opportunité de découvrir ce candidat!</p>
      </div>
    `
  };
  
  return await transporter.sendMail(mailOptions);
};

/**
 * Envoie une notification de mise à jour de statut de candidature
 * @param {string} to - Adresse email destinataire
 * @param {Object} candidature - Détails de la candidature
 * @param {Object} offre - Détails de l'offre
 * @param {string} nouveauStatut - Nouveau statut de la candidature
 * @returns {Promise<Object>} Résultat de l'envoi
 */
exports.sendApplicationStatusUpdate = async (to, candidature, offre, nouveauStatut) => {
  const applicationUrl = `${config.frontendUrls.main}/candidat/candidatures/${candidature._id}`;
  
  let statusMessage = '';
  
  switch (nouveauStatut) {
    case 'vue':
      statusMessage = 'Votre candidature a été consultée par le recruteur.';
      break;
    case 'favori':
      statusMessage = 'Bonne nouvelle ! Votre candidature a été mise en favoris par le recruteur.';
      break;
    case 'acceptee':
      statusMessage = 'Félicitations ! Votre candidature a été acceptée. Le recruteur vous contactera prochainement.';
      break;
    case 'rejetee':
      statusMessage = 'Votre candidature n\'a malheureusement pas été retenue pour cette offre.';
      break;
    case 'entretien':
      statusMessage = 'Le recruteur souhaite vous rencontrer ! Consultez les détails de l\'entretien proposé.';
      break;
    case 'contrat':
      statusMessage = 'Félicitations ! Le recruteur vous propose un contrat. Consultez les détails dès que possible.';
      break;
    case 'embauchee':
      statusMessage = 'Félicitations ! Votre embauche a été confirmée pour ce poste.';
      break;
    default:
      statusMessage = 'Le statut de votre candidature a été mis à jour.';
  }
  
  const mailOptions = {
    from: config.email.from,
    to,
    subject: `Hereoz - Mise à jour de votre candidature pour "${offre.titre}"`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Mise à jour de candidature</h2>
        <p>Bonjour,</p>
        <p>${statusMessage}</p>
        <div style="background-color: #f8f8f8; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Offre:</strong> ${offre.titre}</p>
          <p><strong>Entreprise:</strong> ${offre.entreprise_nom}</p>
          ${candidature.motif_refus ? `<p><strong>Commentaire du recruteur:</strong> "${candidature.motif_refus}"</p>` : ''}
        </div>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${applicationUrl}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Voir les détails</a>
        </div>
        <p>Continuez à explorer d'autres opportunités sur Hereoz!</p>
      </div>
    `
  };
  
  return await transporter.sendMail(mailOptions);
};