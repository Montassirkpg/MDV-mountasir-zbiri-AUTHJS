require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

const authRoutes = require('./routes/UserRoutes');
app.use('/auth', authRoutes);

app.get('/', (req, res) => res.render('index', { message: null }));

app.get('/dashboard', (req, res) => res.render('dashboard'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur démarré sur http://localhost:${PORT}`));
