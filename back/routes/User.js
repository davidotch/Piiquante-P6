const express = require("express");
const router = express.Router(); //Permet de charger le middleware au niveau du routeur
const rateLimit = require("express-rate-limit");

const userCtrl = require("../controllers/user"); //Appel de la logique métier de nos routes
const controlPassword = require("../middleware/controlPassword"); //appel du middleware controlPassword

const limiter = rateLimit({
   windowsMs: 12000, //durée 120s
   max: 3, //limite les requêtes d'authntification à 3 toutes les 120s
   messsage: "limite de requête excéder !",
   // headers: true,
});

router.post("/signup", controlPassword, userCtrl.signup); //création d'un nouvel utilisateur
router.post("/login", limiter, userCtrl.login); //login d'un utilisateur existant

module.exports = router;
