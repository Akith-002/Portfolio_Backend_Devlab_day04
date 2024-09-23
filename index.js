const compression = require("compression");
const express = require("express"); // create an express app
const app = express();
const port = 5000;
const { GoogleGenerativeAI } = require("@google/generative-ai");
app.use(compression());

require("dotenv").config();
const cors = require("cors");
const path = require("path");

const imageRoutes = require("./routes/imageRoutes");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const Project = require("./Project");
const Blog = require("./Blog");
const Competition = require("./Competition");

const upload = require("./config/multerConfig");
const { url } = require("inspector");
const { appendFileSync } = require("fs");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// use the routes defined in imageRoutes.js
app.use("/images", imageRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// route for chatbot interactions
app.post("/chat", async (req, res) => {
  const { message } = req.body;

  const prompt = `
You are a knowledgeable and helpful AI chatbot designed to answer questions about B. A. Akith Chandinu, an undergraduate from the University of Moratuwa, Faculty of IT. You specialize in providing clear, accurate, and informative answers based on the following details:

**Background**:
- B. A. Akith Chandinu, born on **March 1, 2002**, is currently pursuing a Bachelor of Science Honours in Information Technology, in his second year at the University of Moratuwa.
- He is passionate about technology, especially in the fields of machine learning (ML), artificial intelligence (AI), and data science.

**Skills**:
- Akith is proficient in several programming languages and technologies including Python, JavaScript, C#, C, React.js, Tailwind CSS, CSS, HTML, PHP, and Next.js.
- He also excels in data analysis, statistics, data visualization, web scraping, data structures, computer programming, problem solving, IoT, UI/UX design, and teamwork.

**Achievements**:
- He secured **third place** in the DataStorm 5.0 competition.
- He reached the **semifinals of Idealize 24** and was selected for the **third round of Tech Triathlon 24**.

**Certifications**:
- Akith holds certifications in Python, including 'Understanding and Visualizing Data with Python,' 'Using Python to Access Web Data,' 'Python (Basic) Certificate,' 'Programming for Everybody,' and 'Python Data Structures.'

**Projects**:
- He has worked on notable projects such as **DebateX** (an innovative debate platform), **Rhyme Fit** (an interactive rhyme jacket for children's physical activities), **Cookpal**, **VisitSriLanka** (a personalized travel recommendation engine), and his **personal portfolio**.

**Interests**:
- His key interests lie in **machine learning** and **artificial intelligence**, with a strong focus on applying these technologies to solve real-world problems.

**Social Media**:
- LinkedIn: [Akith Chandinu's LinkedIn](https://www.linkedin.com/in/akith-chandinu-14761a271)
- GitHub: [Akith Chandinu's GitHub](https://github.com/Akith-002)

With this information, answer the following question in a friendly, detailed, and accurate manner: "${message}".
`;

  try {
    const result = await model.generateContent(prompt);

    res.json(result.response.text());

    console.log("Response generated successfully.");
  } catch (error) {
    console.error("Error generating response:", error);
    res.status(500).send("Error processing request.");
  }
});

app.get("/", (req, res) => {
  // this is an endpoint
  res.send("The Backend Server is running!");
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
    url: req.body.url,
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
        url: req.body.url,
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

// create an endpoint for the user validation
app.post("/signin", (req, res) => {
  const { username, password } = req.body;

  if (
    username === process.env.Admin_user &&
    password === process.env.Admin_pass
  ) {
    res.json({ message: "Valid user" });
  } else {
    res.status(401).json({ message: "Invalid user" });
  }
});

// endpoint for competitions
app.get("/competitions", async (req, res) => {
  try {
    const competitions = await Competition.find();
    res.json(competitions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE competition
app.post("/competitions", upload.single("image"), async (req, res) => {
  const competitionData = {
    title: req.body.title,
    description: req.body.description,
    date: new Date(),
    url: req.body.url,
    image: req.file ? `/uploads/${req.file.filename}` : null, // Save image path
  };

  try {
    const competition = new Competition(competitionData);
    const newCompetition = await competition.save();
    res.status(201).json(newCompetition);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE competition by id
app.patch("/competitions/:id", upload.single("image"), async (req, res) => {
  try {
    const competition = await Competition.findById(req.params.id);
    if (competition) {
      competition.set({
        title: req.body.title,
        description: req.body.description,
        url: req.body.url,
        image: req.file ? `/uploads/${req.file.filename}` : competition.image, // Update image if provided
      });

      const updatedCompetition = await competition.save();
      res.json(updatedCompetition);
    } else {
      res.status(404).json({ message: "Competition not found" });
    }
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

// DELETE competition by id
app.delete("/competitions/:id", async (req, res) => {
  try {
    const competition = await Competition.findByIdAndDelete(req.params.id);
    if (competition) {
      res.json({ message: "Competition deleted" });
    } else {
      res.status(404).json({ message: "Competition not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
