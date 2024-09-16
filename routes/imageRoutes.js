const express = require("express");
const fs = require("fs");
const path = require("path");
const upload = require("../config/multerConfig");
const Blog = require("../Blog");

const router = express.Router();

router.post("/update/:id", upload.single("image"), async (req, res) => {
  const { id } = req.params; // ID of the image resource (from database)

  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).send("Blog not found.");
    }

    // Get the old image filename
    const oldImageFilename = blog.image;

    // Remove the old image if it exists
    const oldImagePath = path.join(__dirname, "../uploads", oldImageFilename);
    fs.unlink(oldImagePath, (err) => {
      if (err) {
        console.error("Failed to delete old image:", err);
        return res.status(500).send("Failed to update image.");
      }

      // New image is uploaded successfully by multer
      if (!req.file) {
        return res.status(400).send("No file uploaded.");
      }

      //   update the blog with the new image filename
      blog.image = req.file.filename;
      blog.save();

      res.send("Image updated successfully!");
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error.");
  }
});

module.exports = router;
