const express = require("express");
const router = express.Router(); //Permet de charger le middleware au niveau du routeur

const userCtrl = require("../controllers/user"); //Appel de la logique métier de nos routes
const controlPassword = require("../middleware/controlPassword"); //appel du middleware controlPassword

router.post("/signup", controlPassword, userCtrl.signup); //création d'un nouvel utilisateur
router.post("/login", userCtrl.login); //login d'un utilisateur existant

module.exports = router;
