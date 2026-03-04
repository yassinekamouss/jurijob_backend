const { findUserById } = require("../services/userService");
const { createCandidatProfile, updateCandidatProfile } = require("../services/candidatService");

exports.completeCandidatProfile = async (req, res) => {
  try {
    // Ensure multipart body exists
    if (!req.body || !req.body.data) {
      return res.status(400).json({
        message: "Champ 'data' manquant dans la requête",
        debug: {
          body: req.body,
          files: req.files?.map(f => f.fieldname),
          contentType: req.headers["content-type"]
        }
      });
    }

    //  Parse JSON safely
    let candidatData;
    try {
      candidatData = JSON.parse(req.body.data);
    } catch (error) {
      return res.status(400).json({
        message: "Erreur lors du parsing du champ 'data'",
        error: error.message
      });
    }

    //  Validate userId
    const userId = candidatData.userId;
    if (!userId) {
      return res.status(400).json({
        message: "userId manquant dans les données candidat",
        keysReceived: Object.keys(candidatData)
      });
    }

    //  Validate user
    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({
        message: "Utilisateur introuvable"
      });
    }

    if (user.role !== "candidat") {
      return res.status(400).json({
        message: "Cet utilisateur n'est pas un candidat"
      });
    }

    // Attach uploaded PDFs to formations
    if (Array.isArray(req.files)) {
      req.files.forEach(file => {
        if (!file.fieldname.startsWith("diploma_")) return;

        const formationId = file.fieldname.replace("diploma_", "");
        const formation = candidatData.formations?.find(
          f => f.id === formationId
        );

        if (formation) {
          let filePath = file.path.replace(/\\/g, "/");
          if (filePath.startsWith("public/")) {
            filePath = filePath.slice(7);
          }
          formation.diplomaFile = `/${filePath}`;
        }
      });
    }

    // Validate that each formation has a diploma
    if (Array.isArray(candidatData.formations)) {
      const missing = candidatData.formations.filter(f => !f.diplomaFile);
      if (missing.length > 0) {
        return res.status(400).json({
          message: "Certains diplômes sont manquants",
          missingFormationIds: missing.map(f => f.id)
        });
      }
    }

    // 7️⃣ Create candidate profile
    const candidatProfile = await createCandidatProfile(candidatData);

    return res.status(201).json({
      message: "Profil candidat complété avec succès",
      candidat: candidatProfile
    });

  } catch (error) {
    console.error("completeCandidatProfile error:", error);

    let details = error.message;
    if (error.name === "ValidationError") {
      details = Object.values(error.errors)
        .map(e => e.message)
        .join(", ");
    }

    return res.status(500).json({
      message: "Erreur serveur",
      details,
      errorType: error.name
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

