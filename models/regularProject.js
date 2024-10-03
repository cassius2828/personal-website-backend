const mongoose = require("mongoose");

const regularProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  prodLink: { type: String },
  githubLink: { type: String, required: true, unique:true },
  technologies: [
    {
      name: { type: String, required: true },
      icon: { type: String, required: true },
    },
  ],
});

const RegularProject = mongoose.model("regularProject", regularProjectSchema);

module.exports = RegularProject;
