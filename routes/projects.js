const express = require("express");
const router = express.Router();
const projectRouter = require('../controllers/projects')
router.get('/', projectRouter.getAllProjects)
router.get('/:projectId', projectRouter.getProjectById)
router.post("/new", projectRouter.postCreateProject);



module.exports = router