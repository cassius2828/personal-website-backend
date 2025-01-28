const express = require("express");
const router = express.Router();
const authRouter = require("../controllers/auth");
const verifyToken = require("../middleware/verify-token");

router.post("/register", authRouter.register);
router.post("/verify-2FA", authRouter.verify2FA);
router.post("/login", authRouter.login);
router.post("/enable-2FA", verifyToken, authRouter.enable2FA);
router.post("/change-password", authRouter.changePassTemp);

module.exports = router;

