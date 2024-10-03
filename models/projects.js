const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  prodLink: { type: String },
  githubLink: { type: String, required: true, unique: true },
  technologies: [
    {
      name: { type: String, required: true },
      icon: { type: String, required: true },
    },
  ],
  featured: { type: Boolean },
});

const Project = mongoose.model("Project", ProjectSchema);

module.exports = Project;
