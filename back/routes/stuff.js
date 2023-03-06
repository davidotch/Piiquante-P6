const express = require("express");
const router = express.Router();

const stuffControllers = require("../controllers/stuff");

router.post("/", stuffControllers.createThing);
router.put("/:id", stuffControllers.modifyThing);
router.delete("/:id", stuffControllers.deleteThing);
router.get("/:id", stuffControllers.getOneThing);
router.get("/", stuffControllers.getAllThing);

module.exports = router;
