const express = require("express");
const router = express.Router();
const certificationRouter = require("../controllers/certifications");
router.get("/", certificationRouter.getAllCerts);
router.get("/:certId", certificationRouter.getCertById);
router.post("/new", certificationRouter.postCreateCert);

module.exports = router;
