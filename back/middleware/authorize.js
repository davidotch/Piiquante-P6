const jwt = require("jsonwebtoken");
require("dotenv").config();
const secretToken = process.env.TOKEN_SECRET;

module.exports = (req, res, next) => {
   try {
      const token = req.headers.authorization.split(" ")[1]; //On extrait le token de la requête
      const decodedToken = jwt.verify(token, secretToken); //On décrypte le token grâce à la clé secrète
      const userId = decodedToken.userId; //On récupère l'userId du token décrypté
      req.auth = {
         userId: userId,
      };
      next();
   } catch (error) {
      res.status(401).json({ error });
   }
};
