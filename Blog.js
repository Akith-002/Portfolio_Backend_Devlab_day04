const mongoose = require("./db");

const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
  date: Date,
  url: String,
  image: String,
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
