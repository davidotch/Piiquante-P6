const express = require("express"); //import du framework express pour nodeJS
const mongoose = require("mongoose"); //package qui facilite les interactions avec notre base de données MongoDB
const hotOnesRoutes = require("./routes/HotOnes"); //Importe le routeur pour les sauces
const userRoutes = require("./routes/user"); //Importe le routeur pour les utilisateurs
const path = require("path"); //Permet d'accéder aux chemins d'accès des fichiers
const mongoSanitize = require("express-mongo-sanitize"); //protection contre les injections noSql
const xssClean = require("xss-clean"); //protection contre les injections type xss
const helmet = require("helmet"); //Protection des entêtes http
const dotenv = require("dotenv"); //Permet de créer un environnement de variables
dotenv.config();

mongoose.set("strictQuery", true); //suppression du warning mongoose au demarrage du serveur
mongoose //connexion à mongoDB
   .connect(process.env.MONGODB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
   })
   .then(() => console.log("Connexion à MongoDB réussie !"))
   .catch(() => console.log("Connexion à MongoDB échouée !"));

const app = express(); //Applique le framework express

//CORS (Cross-Origin Resource Sharing)
app.use((req, res, next) => {
   res.setHeader("Access-Control-Allow-Origin", "*"); //Permet l'accès à l'API depuis n'importe quelle origine
   res.setHeader(
      //Autorise les en-têtes spécifiés
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
   );
   res.setHeader(
      //Permet l'utilisation des méthodes définies ci-dessous
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, PATCH, OPTIONS"
   );
   next();
});

app.use(express.json()); //Permet de récupérer le corps de la requête au format json

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" })); //Middleware pour protéger contre les attaques de type Cross-Site-Scripting (XSS)
app.use(mongoSanitize()); //Middleware pour protéger contre les injections NoSQL, JavaScript et HTML (Insertion de caractères spéciaux)
app.use(xssClean()); //Middleware pour protéger contre les attaques de type Cross-Site-Scripting (XSS)

//routes
app.use("/api/sauces", hotOnesRoutes);
app.use("/api/auth", userRoutes);
app.use("/images", express.static(path.join(__dirname, "images"))); //Permet de servir les fichiers statiques présents dans le dossier images

module.exports = app;
