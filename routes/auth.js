const express = require("express");
const router = express.Router();

const authRouter = require("../controllers/auth");

router.post("/register", authRouter.register);
router.post("/login", authRouter.login);
router.post("/change-password", authRouter.changePassTemp);

module.exports = router;
