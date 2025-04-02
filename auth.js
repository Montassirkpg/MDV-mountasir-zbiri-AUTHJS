require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const { verifyToken } = require('./controllers/UserController');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const authRoutes = require('./routes/UserRoutes');
app.use('/auth', authRoutes);

app.get('/', (req, res) => res.render('index', { message: null }));
app.get('/dashboard', verifyToken ,(req, res) => {
    res.render('dashboard', { username: req.user.username });
   });
   
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur démarré sur http://localhost:${PORT}`));
