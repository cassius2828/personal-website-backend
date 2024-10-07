const ProjectModel = require("../models/projects");
const projectData = require("../projectData");

const featuredProjects = [
  "Curate Sphere",
  "Sommelier Circle",
  "Lineup Legends",
];

const getAllProjects = async (req, res) => {
  try {
    const projects = await ProjectModel.find({});
    if (projects.length < 1) {
      return res.status(404).json({ error: "Could not find any projects" });
    }
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ error: `Unable to get all projects` });
  }
};

const getRegularProjects = async (req, res) => {
  try {
    const projects = await ProjectModel.find({
      title: { $nin: featuredProjects },
    });
    if (projects.length < 1) {
      return res.status(404).json({ error: "Could not find any projects" });
    }
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ error: `Unable to get all regular projects` });
  }
};

const getFeaturedProjects = async (req, res) => {
  try {
    const projects = await ProjectModel.find({
      title: { $in: featuredProjects },
    });
   
    if (projects.length < 3) {
      return res
        .status(404)
        .json({ error: "Could not find all featured projects" });
    }
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ error: `Unable to get all featured projects` });
  }
};

const getProjectById = async (req, res) => {
  const { id } = req.params;
  try {
    const project = await ProjectModel.findById(id);
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
    const newProject = await ProjectModel.create(req.body);
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

const addAllProjectsFromDataFile = async (req, res) => {
  let projects = [];
  try {
    projectData.forEach(async (project, idx) => {
      const newProject = await ProjectModel.create(project);
      if (!newProject) {
        console.log(`project of idx ${idx} could not be added to the database`);
      }
      projects.push(project);
    });
    res.status(200).json({
      message: "Added all projects to MongoDB successfully!",
      projects,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: `Unable to add projects to MongoDB. Error: ${err}` });
  }
};

const addImgFields = async (req, res) => {
  try {
    const projects = await ProjectModel.find({});
    if (!projects)
      return res.status(400).json({ error: "No projects were found" });
    projects.forEach(async (project) => {
      project.img = '';
      await project.save();
    });

    res
      .status(200)
      .json({ message: "Added img field to all projects", projects });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to add img field to projects" });
  }
};

module.exports = {
  getAllProjects,
  getProjectById,
  postCreateProject,
  addAllProjectsFromDataFile,
  getFeaturedProjects,
  getRegularProjects,
  addImgFields,
};
