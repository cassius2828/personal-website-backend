const express = require("express");
const router = express.Router();
const featuredRouter = require("../controllers/featured");
router.get("/", featuredRouter.getAllProjects);
router.get("/:projectId", featuredRouter.getProjectById);
router.post("/new", featuredRouter.postCreateProject);

module.exports = router;