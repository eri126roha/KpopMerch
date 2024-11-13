const router = require("express").Router();
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");


// @route   POST api/users/register
// @desc    Register new user
// @access  Public
router.post("/register", (req, res) => {
    // Destructure required fields from req.body
    const { username, email, password, role } = req.body;

    // Check if any required fields are missing
    if (!username || !email || !password) {
        return res.status(400).json({ status: "notok", msg: "Please enter all required data" });
    }

    // Check if email already exists
    User.findOne({ email })
        .then((user) => {
            if (user) {
                return res.status(400).json({ status: "notokmail", msg: "Email already exists" });
            }

            // Create a new user instance
            const newUser = new User({
                username,
                email,
                password,
                role,
            });

            // Generate salt and hash password
            bcrypt.genSalt(10, (err, salt) => {
                if (err) {
                    return res.status(500).json({ status: "error", msg: "Internal server error" });
                }

                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) {
                        return res.status(500).json({ status: "error", msg: "Internal server error" });
                    }

                    // Replace plain password with hashed password
                    newUser.password = hash;

                    // Save the user to the database
                    newUser.save()
                        .then((user) => {
                            // Generate JWT token
                            jwt.sign(
                                { id: user.id },
                                config.get("jwtSecret"),
                                { expiresIn: config.get("tokenExpire") },
                                (err, token) => {
                                    if (err) {
                                        return res.status(500).json({ status: "error", msg: "Internal server error" });
                                    }

                                    // Send response with token and user details
                                    return res.status(200).json({ status: "ok", msg: "Successfully registered", token, user });
                                }
                            );
                        })
                        .catch(err => {
                            console.error(err);
                            return res.status(500).json({ status: "error", msg: "Internal server error" });
                        });
                });
            });
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ status: "error", msg: "Internal server error" });
        });
});

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
        { id: user.id, role: user.role }, // Incluez le rôle dans le payload du token si nécessaire
        config.get("jwtSecret"),
        { expiresIn: config.get("tokenExpire") },
        (err, token) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal server error" });
          }

          // Retournez le token et le rôle dans la réponse
          return res.status(200).json({ token, role: user.role });
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
    const { username, email, password, role } = req.body;
  
    try {
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { username, email, password, role },
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
