const express = require("express");
const router = express.Router();
const regularRouter = require('../controllers/regular')
router.get('/', regularRouter.getAllProjects)
router.get('/:projectId', regularRouter.getProjectById)
router.post("/new", regularRouter.postCreateProject);



module.exports = router