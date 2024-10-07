const express = require("express");
const router = express.Router();
const projectRouter = require("../controllers/projects");
router.get("/", projectRouter.getAllProjects);
router.get("/featured", projectRouter.getFeaturedProjects);
router.get("/regular", projectRouter.getRegularProjects);
router.get("/:projectId", projectRouter.getProjectById);
router.post("/new", projectRouter.postCreateProject);
router.post("/seed", projectRouter.addAllProjectsFromDataFile);
router.put("/add-img", projectRouter.addImgFields);

module.exports = router;
