const User =require('../models/User');

exports.register=async(req,res)=>{
    const{ username,password} =req.body;
    if(!username || !password){
        return res.status(400).json({message:'Tous les sont requis'});
    }

    try{
        await User.create(username,password);
        res.status(201).json({message:'Utilisateur inscrit avec succes'});
    }catch (error){
        res.status(500).json({message:'Erreur'});
    }
};

exports.login = async (req, res) => {
    console.log("Requête reçue pour /login:", req.body); 

    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    try {
        const user = await User.findByUsername(username);
        if (!user) {
            return res.status(401).json({ message: 'Utilisateur non trouve' });
        }

        const isMatch = await User.comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Mot de passe incorrect' });
        }

        res.status(200).json({ message: 'Connexion reussie' });
    } catch (error) {
        console.error("Erreur serveur:", error); 
        res.status(500).json({ message: 'Erreur serveur' });
    }
};
