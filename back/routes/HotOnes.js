const express = require("express");
const router = express.Router();

const auth = require("../middleware/authorize");
const multer = require("../middleware/multer-config");
const hotOnesCtrls = require("../controllers/hotOnes");

//liaison des routes vers les controllers
router.get("/", auth, hotOnesCtrls.getAllThings);
router.post("/", auth, multer, hotOnesCtrls.createThing);
router.get("/:id", auth, hotOnesCtrls.getOneThing);
router.put("/:id", auth, multer, hotOnesCtrls.modifyThing);
router.delete("/:id", auth, hotOnesCtrls.deleteThing);
router.post("/:id/like", auth, hotOnesCtrls.userLikes);

module.exports = router;
