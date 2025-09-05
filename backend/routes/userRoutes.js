
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  getFavourites,
  addFavourite,
  removeFavourite,
  getRecentlyViewed,
  addRecentlyViewed,
  getTopLanguages,
} = require("../controllers/userController");

// Favourites
router.get("/favourites", auth, getFavourites);
router.post("/favourites", auth, addFavourite);
router.delete("/favourites/:repoId", auth, removeFavourite);

// Recently viewed
router.get("/recently-viewed", auth, getRecentlyViewed);
router.post("/recently-viewed", auth, addRecentlyViewed);

// Top languages
router.get("/top-languages", auth, getTopLanguages);

module.exports = router;