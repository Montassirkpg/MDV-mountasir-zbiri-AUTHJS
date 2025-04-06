const db = require('../config/db'); 
const bcrypt = require('bcrypt');

class User {
    constructor(id, username, password, role, googleId = null) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.role = role;
        this.googleId = googleId;
    }

    static async findByUsername(username) {
        const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
        return rows.length ? new User(rows[0].id, rows[0].username, rows[0].password, rows[0].role, rows[0].googleId) : null;
    }

    static async findByGoogleId(googleId) {
        try {
            const [rows] = await db.query('SELECT * FROM users WHERE googleId = ?', [googleId]);
            return rows.length ? new User(rows[0].id, rows[0].username, null, rows[0].role, rows[0].googleId) : null;
        } catch (error) {
            console.error("Erreur MySQL:", error);
            return null;
        }
    }
    
    async create({ username, password, role, googleId = null }) {
        const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
    
        try {
            const [result] = await db.query( 
                'INSERT INTO users (username, password, role, googleId) VALUES (?, ?, ?, ?)',
                [username, hashedPassword, role, googleId]
            );
    
            console.log("Résultat SQL:", result); 
    
            if (!result || !result.insertId) {
                throw new Error("Insertion échouée");
            }
    
            return new User(result.insertId, username, hashedPassword, role, googleId);
        } catch (error) {
            console.error("Erreur MySQL lors de l'insertion :", error);
            return null;
        }
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
    
        
    static async comparePassword(plainPassword, hashedPassword) {
        return bcrypt.compare(plainPassword, hashedPassword);
    }
    static async getAllStudents() {
        const [rows] = await db.query('SELECT * FROM users WHERE role = ?', ['etudiant']);
        return rows;  
    }
    static async getAllIntervenants() {
        const [rows] = await db.query('SELECT * FROM users WHERE role = ?', ['intervenant']);
        return rows;  
    }
    
}

module.exports = User;
