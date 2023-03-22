const saucesModel = require("../models/saucesModel"); //importation du modèle de sauce
const fs = require("fs"); //Système de gestion de fichier de Node

exports.createThing = (req, res, next) => {
   //création d'une sauce
   const sauceObject = JSON.parse(req.body.sauce); //extraire l'object JSON
   delete sauceObject._id; //retire l'id généré automatiquement par MongoDb
   delete sauceObject._userId;
   const sauce = new saucesModel({
      ...sauceObject, //Utilise l'opérateur spread pour copier les infos du corps de la requête
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get("host")}/images/${
         req.file.filename //On génère l'url par rapport à son nom de fichier
      }`,
      likes: 0,
      dislikes: 0,
      usersLiked: [],
      usersDisliked: [],
   });
   sauce
      .save() //Sauvegarde la nouvelle sauce dans la base de données
      .then(() => res.status(201).json({ message: "Sauce created !" }))
      .catch((error) => res.status(400).json({ error }));
};

exports.getOneThing = (req, res, next) => {
   //récupération d'une sauce
   saucesModel
      .findOne({ _id: req.params.id })
      .then((sauce) => {
         res.status(200).json(sauce);
      })
      .catch((error) => res.status(404).json({ error }));
};

exports.modifyThing = (req, res, next) => {
   //modification et suppression d'une sauce
   const sauceObject = req.file
      ? {
           ...JSON.parse(req.body.thing),
           imageUrl: `${req.protocol}://${req.get("host")}/images/${
              req.file.filename
           }`,
        }
      : { ...req.body };

   delete sauceObject._userId;
   saucesModel
      .findOne({ _id: req.params.id })
      .then((sauce) => {
         let oldImage = sauce.imageUrl.split("/images/")[1];
         if (sauce.userId != req.auth.userId) {
            res.status(401).json({ message: "Unauthorized user !" });
         } else if (oldImage == sauceObject.imageUrl) {
            saucesModel
               .updateOne(
                  { _id: req.params.id },
                  {
                     ...sauceObject,
                     _id: req.params.id,
                  }
               )
               .then(() =>
                  res.status(200).json({ message: "Sauce modified !" })
               )
               .catch((error) => res.status(401).json({ error }));
         } else {
            const filename = oldImage;
            fs.unlink(`images/${filename}`, () => {
               //on supprime l'ancienne image
               saucesModel
                  .updateOne(
                     { _id: req.params.id },
                     {
                        ...sauceObject,
                     }
                  )
                  .then(() =>
                     res.status(200).json({ message: "Sauce modified !" })
                  )
                  .catch((error) => res.status(401).json({ error }));
            });
         }
      })
      .catch((error) => res.status(400).json({ error }));
};

exports.userLikes = (req, res, next) => {
   //incrémentation des likes et dislikes des sauces
   saucesModel
      .findOne({ _id: req.params.id })
      .then((sauce) => {

         //définit le status de like
         switch (req.body.like) {
            case 1: //utilisateur aime la sauce
               if (!sauce.usersLiked.includes(req.auth.userId)) {
                  saucesModel
                     .updateOne(
                        // Recherche la sauce avec l'ID fourni dans la requête
                        { _id: req.params.id },
                        {
                           $inc: { likes: 1 }, // Incrémente le nombre de likes de 1
                           $push: { usersLiked: req.auth.userId }, // Ajoute l'ID de l'utilisateur dans le tableau usersLiked
                        }
                     )
                     .then(() =>
                        res.status(201).json({ message: "Sauce Liked !" })
                     )
                     .catch((error) => res.status(400).json({ error }));
               }
               break;

            case -1: //utilisteur n'aime pas la sauce
               if (!sauce.usersDisliked.includes(req.auth.userId)) {
                  saucesModel
                     .updateOne(
                        { _id: req.params.id },
                        {
                           $inc: { dislikes: 1 }, // Incrémente le nombre de dislikes de 1
                           $push: { usersDisliked: req.auth.userId }, // Ajoute l'ID de l'utilisateur dans le tableau
                        }
                     )
                     .then(() =>
                        res.status(201).json({ message: "Sauce disliked !" })
                     )
                     .catch((error) => res.status(400).json({ error }));
               }
               break;

            case 0: //utilisateur supprime son vote
               if (sauce.usersLiked.includes(req.auth.userId)) {
                  saucesModel
                     .updateOne(
                        { _id: req.params.id },
                        {
                           $inc: { likes: -1 },
                           $pull: { usersLiked: req.auth.userId }, //On sort l'utilisateur du tableau usersLiked
                        }
                     )
                     .then(() =>
                        res.status(201).json({ message: "Sauce unliked !" })
                     )
                     .catch((error) => res.status(400).json({ error }));
               } else if (sauce.usersDisliked.includes(req.auth.userId)) {
                  saucesModel
                     .updateOne(
                        { _id: req.params.id },
                        {
                           $inc: { dislikes: -1 },
                           $pull: { usersDisliked: req.auth.userId }, //On sort l'utilisateur du tableau usersDisliked
                        }
                     )
                     .then(() =>
                        res.status(201).json({ message: "Sauce undisliked !" })
                     )
                     .catch((error) => res.status(400).json({ error }));
               }
               break;
         }
      })
      .catch((error) => res.status(404).json({ error }));
};

exports.deleteThing = (req, res, next) => {
   //supprimer une sauce
   saucesModel
      .findOne({ _id: req.params.id })
      .then((sauce) => {
         if (sauce.userId != req.auth.userId) {
            res.status(401).json({ message: "Unauthorized user !" });
         } else {
            const filename = sauce.imageUrl.split("/images/")[1];
            fs.unlink(`images/${filename}`, () => {
               saucesModel
                  .deleteOne({ _id: req.params.id })
                  .then(() => {
                     res.status(200).json({ message: "Sauce deleted !" });
                  })
                  .catch((error) => res.status(401).json({ error }));
            });
         }
      })
      .catch((error) => {
         res.status(500).json({ error });
      });
};

exports.getAllThings = (req, res, next) => {
   //récupérer toutes les sauces
   saucesModel
      .find()
      .then((sauces) => res.status(200).json(sauces))
      .catch((error) => res.status(400).json({ error }));
};
