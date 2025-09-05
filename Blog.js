const mongoose = require("mongoose");

// Define schema
const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Create model
module.exports = mongoose.model("Blog", BlogSchema);
