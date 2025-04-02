const db = require('../config/db');
const bcrypt = require('bcrypt');

class User {
    static async create(username, password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        return new Promise((resolve, reject) => {
            db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }

    static async findByUsername(username) {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
                if (err) reject(err);
                else resolve(results[0]);
            });
        });
    }

    static async comparePassword(plainPassword, hashedPassword) {
        return bcrypt.compare(plainPassword, hashedPassword);
    }
}

module.exports = User;
