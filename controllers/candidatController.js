const { findUserById } = require("../services/userService");
const { createCandidatProfile, updateCandidatProfile } = require("../services/candidatService");

exports.completeCandidatProfile = async (req, res) => {
  try {
    // Diagnostique de base pour le frontend
    if (!req.body) {
      return res.status(400).json({
        message: "Erreur critique : le corps de la requête (req.body) est inexistant.",
        debug: {
          contentType: req.headers["content-type"],
          hasFiles: !!(req.files && req.files.length > 0)
        }
      });
    }

    let candidatData = req.body;

    // Si la requête contient 'data' (envoyé via FormData), le parser
    if (req.body.data) {
      try {
        candidatData = JSON.parse(req.body.data);
      } catch (parseError) {
        return res.status(400).json({
          message: "Erreur lors du parsing des données JSON (champ 'data')",
          error: parseError.message,
          receivedValue: req.body.data
        });
      }
    }

    // Accès sécurisé à userId sans déstructuration directe qui pourrait planter
    const userId = candidatData ? candidatData.userId : null;

    if (!userId) {
      return res.status(400).json({
        message: "L'identifiant de l'utilisateur (userId) est manquant dans les données reçues.",
        debug: {
          hasCandidatData: !!candidatData,
          keysReceived: candidatData ? Object.keys(candidatData) : []
        }
      });
    }

    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable dans la base de données." });
    }

    if (user.role !== "candidat") {
      return res.status(400).json({ message: "Cet utilisateur n'est pas enregistré en tant que candidat." });
    }

    // Lier les chemins de fichiers uploadés aux formations correspondantes
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        // Le nom du champ depuis le frontend est 'diploma_ID'
        if (file.fieldname.startsWith('diploma_')) {
          const formationId = file.fieldname.replace('diploma_', '');

          if (candidatData.formations) {
            const formation = candidatData.formations.find(f => f.id === formationId);
            if (formation) {
              let filePath = file.path.replace(/\\/g, '/');
              if (filePath.startsWith('public/')) {
                filePath = filePath.substring(7); // enlève 'public/'
              }
              formation.diplomaFile = '/' + filePath;
            }
          }
        }
      });
    }

    // Vérification finale : chaque formation doit avoir son diplomaFile
    if (candidatData.formations && candidatData.formations.length > 0) {
      const missingFiles = candidatData.formations.filter(f => !f.diplomaFile);
      if (missingFiles.length > 0) {
        return res.status(400).json({
          message: "Certains diplômes (PDF) n'ont pas été reçus ou n'ont pas pu être associés aux formations.",
          missingFormationIds: missingFiles.map(f => f.id)
        });
      }
    }

    const candidatProfile = await createCandidatProfile(candidatData);

    res.status(201).json({
      message: "Profil candidat complété avec succès",
      candidat: candidatProfile,
    });
  } catch (error) {
    console.error("Error in completeCandidatProfile:", error);

    // Retourner un message d'erreur détaillé au frontend
    let errorMsg = error.message;
    if (error.name === 'ValidationError') {
      errorMsg = Object.values(error.errors).map(err => err.message).join(', ');
    }

    res.status(400).json({
      message: "Une erreur est survenue sur le serveur",
      details: errorMsg,
      errorType: error.name,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};


exports.updateCandidatProfile = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    if (user.role !== "candidat") {
      return res.status(400).json({ message: "Ce user n'est pas un candidat" });
    }

    let updateData = req.body;

    // Si la requête contient 'data' (envoyé via FormData), le parser au cas où
    if (req.body.data) {
      updateData = JSON.parse(req.body.data);
    }

    // On retire formations et experiences de updateData pour éviter la modification via cet endpoint
    delete updateData.formations;
    delete updateData.experiences;

    const updatedProfile = await updateCandidatProfile(userId, updateData);

    res.status(200).json({
      message: "Profil candidat mis à jour avec succès",
      candidat: updatedProfile,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateCandidatParcours = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    if (user.role !== "candidat") {
      return res.status(400).json({ message: "Ce user n'est pas un candidat" });
    }

    let updateData = req.body;

    // Si la requête contient 'data' (envoyé via FormData), le parser
    if (req.body.data) {
      updateData = JSON.parse(req.body.data);
    }

    // Lier les chemins de fichiers uploadés aux formations correspondantes
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        // Le nom du champ depuis le frontend est 'diploma_ID'
        if (file.fieldname.startsWith('diploma_')) {
          const formationId = file.fieldname.replace('diploma_', '');
          if (updateData.formations) {
            const formation = updateData.formations.find(f => f.id === formationId);
            if (formation) {
              let filePath = file.path.replace(/\\/g, '/');
              if (filePath.startsWith('public/')) {
                filePath = filePath.substring(7); // enlève 'public/'
              }
              formation.diplomaFile = '/' + filePath;
            }
          }
        }
      });
    }

    // Ne mettre à jour que les formations et expériences
    const parcoursData = {};
    if (updateData.formations) parcoursData.formations = updateData.formations;
    if (updateData.experiences) parcoursData.experiences = updateData.experiences;

    const updatedProfile = await updateCandidatProfile(userId, parcoursData);

    res.status(200).json({
      message: "Parcours (formations/expériences) mis à jour avec succès",
      candidat: updatedProfile,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

