const passWord = require("password-validator");

//création d'un schéma de données grâce amongoose avec les propriété désirées
const passWordSchema = new passWord();

passWordSchema
   .is()
   .min(8) // Minimum length 8
   .is()
   .max(100) // Maximum length 100
   .has()
   .uppercase() // Must have uppercase letters
   .has()
   .lowercase() // Must have lowercase letters
   .has()
   .digits(2) // Must have at least 2 digits
   .has()
   .symbols(1) //must have 1 symbol
   .has()
   .not()
   .spaces(); // Should not have spaces

   //exportation en tant que modèle
   module.exports = passWordSchema;