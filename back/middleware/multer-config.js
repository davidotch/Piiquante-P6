const multer = require("multer");

//indique comment nous voulons écrire les types de médias
const MIME_TYPES = {
   "image/jpg": "jpg",
   "image/jpeg": "jpg",
   "image/png": "png",
};

//utilisation d'une méthode de multer our enresgistrer les images entrantes dans le dossier images
const storage = multer.diskStorage({
   destination: (req, file, callback) => {
      callback(null, "images");
   },

   filename: (req, file, callback) => {
      //création d'u nom unique pour la nouvelle images
      const name = file.originalname.split(" ").join("_");
      const extension = MIME_TYPES[file.mimetype];
      callback(null, name + Date.now() + "." + extension);
   },
});

module.exports = multer({ storage: storage }).single("image");
