const multer = require("multer"); //Multer est un package qui permet de gérer les fichiers entrants dans une requête http

//indique comment nous voulons écrire les types d'extensions.
const MIME_TYPES = {
   "image/jpg": "jpg",
   "image/jpeg": "jpg",
   "image/png": "png",
};

//utilisation d'une méthode de multer our enresgistrer les images entrantes dans le dossier images
const storage = multer.diskStorage({
   //la méthode diskStorage()  configure le chemin et le nom de fichier pour les fichiers entrants.
   destination: (req, file, callback) => {
      callback(null, "images");
   },

   // la fonction filename indique à multer d'utiliser le nom d'origine, de remplacer les espaces par des underscores et d'ajouter un timestamp Date.now() comme nom de fichier. Elle utilise ensuite la constante dictionnaire de type MIME pour résoudre l'extension de fichier appropriée.
   filename: (req, file, callback) => {
      const name = file.originalname.split(" ").join("_");
      const extension = MIME_TYPES[file.mimetype];
      callback(null, name + Date.now() + "." + extension);
   },
});

module.exports = multer({ storage: storage }).single("image"); //la méthode single() crée un middleware qui capture les fichiers d'un certain type (passé en argument), et les enregistre au système de fichiers du serveur à l'aide du storage configuré.
