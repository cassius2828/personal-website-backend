const mongoose = require("mongoose");

const featuredProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  prodLink: { type: String, required: true },
  githubLink: { type: String, required: true },
  technologies: [
    {
      name: { type: String, required: true },
      icon: { type: String, required: true }
    }
  ]
});

const FeaturedProject = mongoose.model("FeaturedProject", featuredProjectSchema);

module.exports = FeaturedProject;