const express = require('express');
const User = require('../models/User');
const router = express.Router();

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.render('index', { message: 'Tous les champs sont requis' });
    }

    try {
        const user = await User.findByUsername(username);
        if (!user) {
            return res.render('index', { message: 'Utilisateur non trouvé' });
        }

        const isMatch = await User.comparePassword(password, user.password);
        if (!isMatch) {
            return res.render('index', { message: 'Mot de passe incorrect' });
        }

        res.redirect('/dashboard');

    } catch (error) {
        console.error("Erreur serveur:", error);
        res.render('index', { message: 'Erreur serveur' });
    }
});

module.exports = router;
