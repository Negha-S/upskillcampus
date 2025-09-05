require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// ✅ Serve static frontend files from "public" folder
app.use(express.static("public"));

const Blog = require("./models/Blog");

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Atlas Connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Test route
app.get('/', (req, res) => {
  res.send('Backend is working!');
});

// -------------------- CRUD ROUTES --------------------

// Create blog
app.post("/blogs", async (req, res) => {
  try {
    const blog = new Blog({
      title: req.body.title,
      content: req.body.content
    });
    await blog.save();
    res.status(201).send(blog);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Get all blogs (latest first)
app.get("/blogs", async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Get one blog by ID
app.get("/blogs/:id", async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid blog id" });
  }
  try {
    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update blog by ID
app.put("/blogs/:id", async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid blog id" });
  }
  try {
    const updates = {
      title: req.body.title,
      content: req.body.content
    };
    Object.keys(updates).forEach(k => updates[k] === undefined && delete updates[k]);

    const updated = await Blog.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    });
    if (!updated) return res.status(404).json({ error: "Blog not found" });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete blog by ID
app.delete("/blogs/:id", async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid blog id" });
  }
  try {
    const deleted = await Blog.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Blog not found" });
    res.json({ message: "Blog deleted", deleted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -------------------- START SERVER --------------------
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
