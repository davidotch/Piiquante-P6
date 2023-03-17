const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");

const userCtrl = require("../controllers/user");
const controlPassword = require("../middleware/controlPassword");

const limiter = rateLimit({
   windowsMs: 5 * 60 * 1000,
   max: 3,
   messsage: "limite de requête excéder !",
   headers: true,
});

router.post("/signup", controlPassword, userCtrl.signup);
router.post("/login", limiter, userCtrl.login);

module.exports = router;
