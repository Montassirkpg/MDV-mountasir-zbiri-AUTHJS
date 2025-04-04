require('dotenv').config();
require('./config/passport');
const express = require('express');
const path = require('path');
const cors = require('cors');
const { verifyToken } = require('./controllers/UserController');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const authRoutes = require('./routes/UserRoutes');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
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
