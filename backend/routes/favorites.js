
const router = require("express").Router();
const protect = require("../middleware/authMiddleware");

// GET favourites
router.get("/", protect, async (req, res) => {
  res.json({ favourites: req.user.favourites || [] });
});

// ADD favourite
router.post("/", protect, async (req, res) => {
  const repo = req.body;
  if (!repo || !repo.id) {
    return res.status(400).json({ msg: "Invalid repository data" });
  }

  const exists = req.user.favourites.some(r => r.id === repo.id);
  if (!exists) {
    req.user.favourites.unshift(repo);
    await req.user.save();
  }

  res.json({ favourites: req.user.favourites });
});

// DELETE favourite by id
router.delete("/:id", protect, async (req, res) => {
  const id = Number(req.params.id);
  if (!id) {
    return res.status(400).json({ msg: "Invalid repository ID" });
  }

  req.user.favourites = req.user.favourites.filter(r => r.id !== id);
  await req.user.save();

  res.json({ favourites: req.user.favourites });
});

module.exports = router;
