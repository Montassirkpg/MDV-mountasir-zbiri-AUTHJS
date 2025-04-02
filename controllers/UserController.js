const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
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

        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie('token', token, { httpOnly: true });
        res.redirect('/dashboard');

    } catch (error) {
        console.error("Erreur serveur:", error);
        res.render('index', { message: 'Erreur serveur' });
    }
};

exports.verifyToken = (req, res, next) => {
    const token = req.cookies?.token;
    if (!token) {
        return res.status(401).send('Accès refusé');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).send('Token invalide');
    }
};
