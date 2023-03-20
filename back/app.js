const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const hotOnesRoutes = require("./routes/HotOnes");
const userRoutes = require("./routes/user");

const helmet = require("helmet"); //Protection des entêtes http
const dotenv = require("dotenv");
dotenv.config();

const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

mongoose.set("strictQuery", true); //suppression du warning mongoose au demarrage du serveur
mongoose //connexion à mongoDB
   .connect(process.env.MONGODB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
   })
   .then(() => console.log("Connexion à MongoDB réussie !"))
   .catch(() => console.log("Connexion à MongoDB échouée !"));

const app = express();

//Configuration des en-têtes CORS
app.use((req, res, next) => {
   res.setHeader("Access-Control-Allow-Origin", "*");
   res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
   );
   res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, PATCH, OPTIONS"
   );
   next();
});

app.use(express.json());

app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" })); //Prtection des entêtes http avec helmet

app.use(mongoSanitize()); //Middleware pour protéger contre les injections NoSQL, JavaScript et HTML (Insertion de caractères spéciaux)
app.use(xss());

app.use("/api/sauces", hotOnesRoutes);
app.use("/api/auth", userRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;
