const router = require("express").Router();
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Créez le dossier 'uploads' si nécessaire
const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configuration de Multer pour l'upload des fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Dossier où les fichiers seront stockés
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Nom unique pour chaque fichier
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Vérifiez que le fichier est une image
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);

    if (extname && mimeType) {
      return cb(null, true);
    } else {
      return cb(new Error("Seuls les fichiers image sont autorisés."));
    }
  },
  limits: { fileSize: 2 * 1024 * 1024 }, // Limite à 2MB par fichier
});

// @route   POST api/users/register
// @desc    Register new user
// @access  Public
router.post("/register", upload.single("profilePicture"), async(req, res) => {
  if (req.fileValidationError) {
    return res.status(400).json({ status: "error", msg: req.fileValidationError });
  }
  if (!req.file) {
    return res.status(400).json({ status: "error", msg: "Aucun fichier téléchargé" });
  }
  // Vérifiez si une image a été uploadée
  const profilePicture = req.file ? req.file.path : null;

  // Destructure les champs requis de req.body
  const { firstname, lastname, email, password, phoneNumber } = req.body;

  // Vérifiez si des champs requis manquent
  if (!firstname || !lastname || !email || !password || !phoneNumber ) {
    return res.status(400).json({ status: "notok", msg: "Veuillez entrer toutes les données requises" });
  }

  // Vérifiez si l'email existe déjà
  User.findOne({ email })
    .then((user) => {
      if (user) {
        return res.status(400).json({ status: "notokmail", msg: "L'email existe déjà" });
      }

      // Créez une nouvelle instance de l'utilisateur
      const newUser = new User({
        firstname,
        lastname,
        email,
        password,
        phoneNumber,
        profilePicture,
      });

      // Génération du salt et hash du mot de passe
      bcrypt.genSalt(10, (err, salt) => {
        if (err) {
          return res.status(500).json({ status: "error", msg: "Erreur interne du serveur" });
        }

        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) {
            return res.status(500).json({ status: "error", msg: "Erreur interne du serveur" });
          }

          // Remplacez le mot de passe par son hash
          newUser.password = hash;

          // Sauvegardez l'utilisateur dans la base de données
          newUser.save()
            .then((user) => {
              // Générez un token JWT
              jwt.sign(
                { id: user.id },
                config.get("jwtSecret"),
                { expiresIn: config.get("tokenExpire") },
                (err, token) => {
                  if (err) {
                    return res.status(500).json({ status: "error", msg: "Erreur interne du serveur" });
                  }

                  // Envoyez la réponse avec le token et les détails de l'utilisateur
                  return res.status(200).json({
                    status: "ok",
                    msg: "Enregistrement réussi",
                    token,
                    user,
                  });
                }
              );
            })
            .catch((err) => {
              console.error(err);
              return res.status(500).json({ status: "error", msg: "Erreur interne du serveur" });
            });
        });
      });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ status: "error", msg: "Erreur interne du serveur" });
    });
});

module.exports = router;

// @route   POST api/users/login-user
// @desc    Login user
// @access  Public
router.post("/login-user", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Please provide email and password" });
  }

  User.findOne({ email: email }).then((user) => {
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    bcrypt.compare(password, user.password).then((isMatch) => {
      if (!isMatch) {
        return res.status(401).json({ error: "Incorrect password" });
      }

      // Ajoutez ici le rôle de l'utilisateur à la réponse
      jwt.sign(
        { id: user.id }, // Incluez le rôle dans le payload du token si nécessaire
        config.get("jwtSecret"),
        { expiresIn: config.get("tokenExpire") },
        (err, token) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal server error" });
          }

          // Retournez le token et le rôle dans la réponse
          return res.status(200).json({ token});
        }
      );
    });
  }).catch((err) => {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  });
});


//Lire tous les utilisateurs (READ)
router.get('/all', async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs', error });
    }
  });

  
// Lire un utilisateur par ID (READ)
router.get('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération de l\'utilisateur', error });
    }
  });
  
// Mettre à jour un utilisateur par ID (UPDATE)
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { firstname, lastname, email, password, phoneNumber, profilePicture } = req.body;
  
    try {
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { firstname, lastname, email, password, phoneNumber, profilePicture },
        { new: true }
      );
      if (!updatedUser) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
      res.status(200).json({ message: 'Utilisateur mis à jour avec succès', updatedUser });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'utilisateur', error });
    }
  });
  
// Supprimer un utilisateur par ID (DELETE)
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const deletedUser = await User.findByIdAndDelete(id);
      if (!deletedUser) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
      res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la suppression de l\'utilisateur', error });
    }
  });

  
module.exports = router;
