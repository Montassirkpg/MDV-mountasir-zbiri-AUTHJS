const db = require('../config/db');
const bcrypt = require('bcrypt');
//const { use } = require('../routes/UserRoutes');

class User {
    constructor(id,username,password,role){
        this.id=id;
        this.username=username;
        this.password=password;
        this.role=role;
    }
    async save() {
        return new Promise((resolve, reject) => {
            bcrypt.hash(this.password, 10, (err, hash) => {
                if (err) reject(err);
                const sql = "INSERT INTO users (username, password, role) VALUES (?, ?, ?)";
                db.query(sql, [this.username, hash, this.role], (err, result) => {
                    if (err) reject(err);
                    this.id = result.insertId;
                    resolve(this);
                });
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
