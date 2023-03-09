const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

const stuffControllers = require("../controllers/stuff");

router.get("/", auth, stuffControllers.getAllThings);
router.post("/", auth, multer, stuffControllers.createThing);
router.get("/:id", auth, stuffControllers.getOneThing);
router.put("/:id", auth, multer, stuffControllers.modifyThing);
router.delete("/:id", auth, stuffControllers.deleteThing);
// router.post("/:id/like", auth, stuffControllers.userLikes);

module.exports = router;
