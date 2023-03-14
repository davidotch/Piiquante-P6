const passWord = require("password-validator");

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

   module.exports = passWordSchema;