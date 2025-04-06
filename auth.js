require('dotenv').config();
require('./config/passport');
const express = require('express');
const path = require('path');
const cors = require('cors');
const { verifyToken, getAllStudents } = require('./controllers/UserController');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const authRoutes = require('./routes/UserRoutes');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
function isAdmin(req, res, next) {
    if (req.user.role === 'admin') {
        return next();  
    } else {
        res.redirect('/login');  
    }
}
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/', authRoutes);

app.get('/', (req, res) => res.render('index', { message: null }));
app.get('/dashboard', verifyToken ,(req, res) => {
    res.render('dashboard', { username: req.user.username, role:req.user.role });
   });

app.get('/students', async (req, res) => {
    try {
        const students = await User.getAllStudents();  
        console.log(students);
        res.render('students', { students });  
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur serveur');
    }
});
app.get('/intervenants', async (req, res) => {
    try {
        const intervenants = await User.getAllIntervenants();  
        console.log(intervenants);
        res.render('intervenants', { intervenants });  
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur serveur');
    }
});
app.get('/register', (req, res) => {
    res.render('register', { message: null });
});
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur démarré sur http://localhost:${PORT}`));
