const express = require("express"); // create an express app
const app = express();
const port = 5000;
const { GoogleGenerativeAI } = require("@google/generative-ai");

require("dotenv").config();
const cors = require("cors");
const path = require("path");

const imageRoutes = require("./routes/imageRoutes");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

const Project = require("./Project");
const Blog = require("./Blog");

const upload = require("./config/multerConfig");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// use the routes defined in imageRoutes.js
app.use("/images", imageRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// route for chatbot interactions
app.post("/chat", async (req, res) => {
  const { message } = req.body;

  const prompt = `You are a helpful and informative AI chatbot designed to answer questions about B. A. Akith Chandinu, an undergraduate from the University of Moratuwa, Faculty of IT. 
Here is a summary of who I am:
- I am skilled in data analysis, Python (programming language), statistics, data visualization, data structures, web scraping, computer programming, teamwork, IoT (Internet of Things), problem solving, user interface (UI) design, user experience (UX), C#, C (programming language), React.js, Tailwind CSS, JavaScript, CSS, and HTML.
- My key achievements include securing third place in DataStorm 5.0, reaching the semifinals of Idealize 24, and being selected for the third round of Tech Triathlon 24.
- Some of the projects I've worked on are DebateX (a revolutionary debate platform), the Interactive Rhyme Jacket (Rhyme Fit) as a first-year project, Cookpal, VisitSriLanka (your travel guide), and my portfolio.
- I am pursuing a Bachelor of Science Honours in Information Technology, currently in my second year.
- I hold certifications in 'Understanding and Visualizing Data with Python,' 'Using Python to Access Web Data,' 'Python (Basic) Certificate,' 'Programming for Everybody,' and 'Python Data Structures.'
- I am particularly interested in the fields of machine learning (ML) and artificial intelligence (AI).

Answer the following question: ${message}`;

  try {
    const result = await model.generateContent(prompt);
    console.log(result.response.text());

    res.json(result.response.text());

    console.log("Response generated successfully.");
  } catch (error) {
    console.error("Error generating response:", error);
    res.status(500).send("Error processing request.");
  }
});

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

//create an endpoint for creating a project
app.post("/projects", async (req, res) => {
  const project = new Project(req.body);

  try {
    const newProject = await project.save();
    res.status(201).json(newProject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//create an endpoint to update a project by id
app.patch("/projects/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (project) {
      project.set(req.body);
      const updatedProject = await project.save();
      res.json(updatedProject);
    } else {
      res.status(404).json({ message: "Project not found" });
    }
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

//create an endpoint to delete a project by id
app.delete("/projects/:id", async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (project) {
      res.json({ message: "Project deleted" });
    } else {
      res.status(404).json({ message: "Project not found" });
    }
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

//create an endpoint for creating a blog
app.post("/blogs", upload.single("image"), async (req, res) => {
  const blogData = {
    title: req.body.title,
    content: req.body.content,
    date: new Date(),
    image: req.file ? `/uploads/${req.file.filename}` : null, // Save image path
  };

  try {
    const blog = new Blog(blogData);
    const newBlog = await blog.save();
    res.status(201).json(newBlog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//create an endpoint to update a blog by id
app.patch("/blogs/:id", upload.single("image"), async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (blog) {
      blog.set({
        title: req.body.title,
        content: req.body.content,
        image: req.file ? `/uploads/${req.file.filename}` : blog.image,
      });

      const updatedBlog = await blog.save();
      res.json(updatedBlog);
    } else {
      res.status(404).json({ message: "Blog not found" });
    }
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

//create an endpoint to delete a blog by id
app.delete("/blogs/:id", async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (blog) {
      res.json({ message: "Blog deleted" });
    } else {
      res.status(404).json({ message: "Blog not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
