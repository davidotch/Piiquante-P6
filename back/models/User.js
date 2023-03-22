const mongoose = require('mongoose');
//permet de vérifier que le champ avec la propriété unique n'est pas déja présent dans la base de données
const uniqueValidator = require("mongoose-unique-validator");

//création d'un schéma de données grâce a mongoose avec les propriété désirées
const userSchema = mongoose.Schema({
   email: { type: String, required: true, unique: true },
   password: { type: String, required: true },
});

//applicarion d'un uniqueValidator au schéma
userSchema.plugin(uniqueValidator);

//exportation du schéma en tant que modèle
module.exports = mongoose.model("User", userSchema);