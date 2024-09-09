const mongoose = require("./db");

const projectSchema = new mongoose.Schema({
  index: Number,
  name: String,
  description: String,
  linkedIn: String,
  github: String,
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
