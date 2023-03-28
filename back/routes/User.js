const express = require("express");
const router = express.Router(); //Permet de charger le middleware au niveau du routeur
const rateLimit = require("express-rate-limit");

const userCtrl = require("../controllers/user"); //Appel de la logique métier de nos routes
const controlPassword = require("../middleware/controlPassword"); //appel du middleware controlPassword

const limiter = rateLimit({
   windowsMs: 60 * 60 * 1000, //durée de 5 min
   max: 10, //limite les requêtes d'authntification à 10 toutes les 60 mins
   messsage: "limite de requête excéder !",
   headers: true,
});

router.post("/signup", controlPassword, userCtrl.signup); //création d'un nouvel utilisateur
router.post("/login", limiter, userCtrl.login); //login d'un utilisateur existant

module.exports = router;
