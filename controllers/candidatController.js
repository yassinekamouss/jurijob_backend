const { findUserById } = require("../services/userService");
const { createCandidatProfile, updateCandidatProfile } = require("../services/candidatService");

exports.completeCandidatProfile = async (req, res) => {
  try {
    let candidatData = req.body;

    // Si la requête contient 'data' (envoyé via FormData), le parser
    if (req.body.data) {
      candidatData = JSON.parse(req.body.data);
    }

    const { userId } = candidatData;

    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    if (user.role !== "candidat") {
      return res.status(400).json({ message: "Ce user n'est pas un candidat" });
    }

    // Lier les chemins de fichiers uploadés aux formations correspondantes
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        // Le nom du champ depuis le frontend est 'diploma_ID'
        if (file.fieldname.startsWith('diploma_')) {
          const formationId = file.fieldname.replace('diploma_', '');
          const formation = candidatData.formations.find(f => f.id === formationId);
          if (formation) {
            // Remplacer les antislashs par des slashs pour un chemin web valide
            // On enlève "public/" pour que ce soit accessible via l'URL racine si Express sert "public" en statique
            let filePath = file.path.replace(/\\/g, '/');
            if (filePath.startsWith('public/')) {
              filePath = filePath.substring(7); // enlève 'public/'
            }
            formation.diplomaFile = '/' + filePath;
          }
        }
      });
    }

    const candidatProfile = await createCandidatProfile(candidatData);

    res.status(201).json({
      message: "Profil candidat complété avec succès",
      candidat: candidatProfile,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
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

