const express = require('express');
const passport = require('passport');
const UserController = require('../controllers/UserController');

const router = express.Router();


router.post('/register', UserController.register);
router.post('/login', UserController.login);

router.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));
router.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/',
    successRedirect: '/dashboard'
}));

router.get('/logout', (req, res) => {
    res.clearCookie('token');
    req.logout(() => {
        res.redirect('/');
    });
});

module.exports = router;
