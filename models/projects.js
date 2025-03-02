const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  prodLink: { type: String },
  videoLink: { type: String },
  githubLink: { type: String, required: true, unique: true },
  technologies: [
    {
      name: { type: String, required: true },
      icon: { type: String, required: false },
    },
  ],
  featured: { type: Boolean },
  img: { type: String },
  priorityLevel: { type: Number, required: true, default: 1 },
});

const Project = mongoose.model("Project", ProjectSchema);

module.exports = Project;
