const { createUser } = require("../services/userService");

exports.registerUser = async (req, res) => {
  try {
    const user = await createUser(req.body);

    res.status(201).json({
      message: "Utilisateur créé avec succès",
      userId: user._id,
      role: user.role,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
