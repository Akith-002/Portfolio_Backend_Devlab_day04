const express = require("express"); // create an express app
const app = express();
const port = 5000;

require("dotenv").config();
const Project = require("./Project");
const Blog = require("./Blog");
// there are two endpoints yet (/ , /project)

app.get("/", (req, res) => {
  // this is an endpoint
  res.send("Hello, World!");
});

app.get("/projects", async (req, res) => {
  // this is an endpoint
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/blogs", async (req, res) => {
  // this is an endpoint
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
