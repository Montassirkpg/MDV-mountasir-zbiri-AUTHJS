const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
require('dotenv').config();

(async () => {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
    });
    await connection.query(`
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(100) NOT NULL,
            password VARCHAR(255),
            role ENUM('admin', 'intervenant', 'etudiant') NOT NULL,
            googleId VARCHAR(255) DEFAULT NULL
        );
    `);

    await connection.query('DELETE FROM users');

    const users = [];
    users.push({
        username: 'admin',
        password: await bcrypt.hash('admin', 10),
        role: 'admin',
        googleId: null
    });


    for (let i = 1; i <= 5; i++) {
        users.push({
            username: `intervenant${i}`,
            password: await bcrypt.hash(`pass${i}`, 10),
            role: 'intervenant',
            googleId: null
        });
    }

    for (let i = 1; i <= 10; i++) {
        users.push({
            username: `etudiant${i}`,
            password: await bcrypt.hash(`etu${i}`, 10),
            role: 'etudiant',
            googleId: null
        });
    }

    for (const user of users) {
        await connection.query(
            'INSERT INTO users (username, password, role, googleId) VALUES (?, ?, ?, ?)',
            [user.username, user.password, user.role, user.googleId]
        );
    }

    console.log('Données insérées avec succès.');
    await connection.end();
})();
