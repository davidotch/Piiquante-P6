const saucesModel = require("../models/saucesModel");
const fs = require("fs");

exports.createThing = (req, res, next) => {
   const sauceObject = JSON.parse(req.body.sauce);
   delete sauceObject._id;
   delete sauceObject._userId;
   const sauce = new saucesModel({
      ...sauceObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get("host")}/images/${
         req.file.filename
      }`,
      likes: 0,
      dislikes: 0,
      usersLiked: [],
      usersDisliked: [],
   });
   sauce
      .save()
      .then(() => res.status(201).json({ message: "Sauce created !" }))
      .catch((error) => res.status(400).json({ error }));
};

exports.getOneThing = (req, res, next) => {
   saucesModel
      .findOne({ _id: req.params.id })
      .then((sauce) => {
         res.status(200).json(sauce);
      })
      .catch((error) => res.status(404).json({ error }));
};

exports.modifyThing = (req, res, next) => {
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
   saucesModel
      .findOne({ _id: req.params.id })
      .then((sauce) => {
         switch (req.body.like) {
            case 1:
               if (!sauce.usersLiked.includes(req.auth.userId)) {
                  saucesModel
                     .updateOne(
                        { _id: req.params.id },
                        {
                           $inc: { likes: 1 },
                           $push: { usersLiked: req.auth.userId },
                        }
                     )
                     .then(() =>
                        res.status(201).json({ message: "Sauce Liked !" })
                     )
                     .catch((error) => res.status(400).json({ error }));
               }
               break;

            case -1:
               if (!sauce.usersDisliked.includes(req.auth.userId)) {
                  saucesModel
                     .updateOne(
                        { _id: req.params.id },
                        {
                           $inc: { dislikes: 1 },
                           $push: { usersDisliked: req.auth.userId },
                        }
                     )
                     .then(() =>
                        res.status(201).json({ message: "Sauce disliked !" })
                     )
                     .catch((error) => res.status(400).json({ error }));
               }
               break;

            case 0:
               if (sauce.usersLiked.includes(req.auth.userId)) {
                  saucesModel
                     .updateOne(
                        { _id: req.params.id },
                        {
                           $inc: { likes: -1 },
                           $pull: { usersLiked: req.auth.userId },
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
                           $pull: { usersDisliked: req.auth.userId },
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
   saucesModel
      .find()
      .then((sauces) => res.status(200).json(sauces))
      .catch((error) => res.status(400).json({ error }));
};
