const RegularProjectModel = require("../models/regularProject");

const getAllProjects = async (req, res) => {
  try {
    const projects = await RegularProjectModel.find({});
    if (projects.length < 1) {
      return res.status(404).json({ error: "Could not find any projects" });
    }
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ error: `Unable to get all regular projects` });
  }
};

const getProjectById = async (req, res) => {
  const { id } = req.params;
  try {
    const project = await RegularProjectModel.findById(id);
    if (!project)
      return res
        .status(404)
        .json({ error: `Could not find project with an id of ${id}` });
    res.status(200).json(project);
  } catch (err) {
    res.status(500).json({
      error: `Error trying to get project with an id of ${id}. Error: ${err}`,
    });
  }
};

const postCreateProject = async (req, res) => {
  try {
    const newProject = await RegularProjectModel.create(req.body);
    if (!newProject) {
      return res
        .status(404)
        .json({ error: "New project could not be created" });
    }

    res.status(200).json(newProject);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error creating new regular project. Error: ", err });
  }
};
module.exports = {
  getAllProjects,
  getProjectById,
  postCreateProject,
};
