const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const cryptoJs = require("crypto-js");

const dotenv = require("dotenv");
dotenv.config();
const cryptoEmail = process.env.CRYPTO_EMAIL;
const secretToken = process.env.TOKEN_SECRET;

exports.signup = (req, res, next) => {
   const secureEmail = cryptoJs
      .HmacSHA256(req.body.email, cryptoEmail)
      .toString();
   bcrypt
      .hash(req.body.password, 10)
      .then((hash) => {
         const user = new User({
            email: secureEmail,
            password: hash,
         });
         user
            .save()
            .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
            .catch((error) => res.status(400).json({ error }));
      })
      .catch((error) => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
   const secureEmail = cryptoJs
      .HmacSHA256(req.body.email, cryptoEmail)
      .toString();
   User.findOne({ email: secureEmail })
      .then((user) => {
         if (!user) {
            return res
               .status(401)
               .json({ message: "Paire login/mot de passe incorrecte" });
         }
         bcrypt
            .compare(req.body.password, user.password)
            .then((valid) => {
               if (!valid) {
                  return res
                     .status(401)
                     .json({ message: "Paire login/mot de passe incorrecte" });
               }
               res.status(200).json({
                  userId: user._id,
                  token: jwt.sign({ userId: user._id }, secretToken, {
                     expiresIn: "12h",
                  }),
               });
            })
            .catch((error) => res.status(500).json({ error }));
      })
      .catch((error) => res.status(500).json({ error }));
};
