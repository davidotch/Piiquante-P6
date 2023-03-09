const express = require("express");
const router = express.Router();

const stuffControllers = require("../controllers/stuff");

router.get("/", auth, saucesCtrl.getAllThings);
router.post("/", auth, multer, saucesCtrl.createThing);
router.get("/:id", auth, saucesCtrl.getOneThing);
router.put("/:id", auth, multer, saucesCtrl.modifyThing);
router.delete("/:id", auth, saucesCtrl.deleteThing);
router.post("/:id/like", auth, saucesCtrl.userLikes);

module.exports = router;
