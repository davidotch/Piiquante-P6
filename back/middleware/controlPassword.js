const passWordSchema = require('../models/password');

module.exports = (req, res, next) => {
    if (!passWordSchema.validate(req.body.password)) {
        res.status(400).json({ message: 'Le mot de passe doit contenir 8 caratères, avec majuscules, minuscules et au moins un chiffres'});
    } else {
        next();
    }
};