
const mongoose = require("mongoose");

const repoSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  full_name: { type: String, required: true },
  html_url: { type: String, required: true },
  description: { type: String },
  stargazers_count: { type: Number, default: 0 },
  language: { type: String },
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  githubId: {
    type: String,
    unique: true,
    sparse: true,
  },
  favourites: [repoSchema],
  recentlyViewed: [repoSchema],
  topLanguages: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);