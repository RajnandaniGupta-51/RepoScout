
const router = require("express").Router();
const protect = require("../middleware/authMiddleware");

// GET recently viewed
router.get("/", protect, async (req, res) => {
  const recent = [...req.user.recentlyViewed]
    .sort((a, b) => new Date(b.viewedAt) - new Date(a.viewedAt));
  res.json({ recentlyViewed: recent });
});

// POST add a viewed repo (keep unique, cap length)
router.post("/", protect, async (req, res) => {
  const { id, full_name, html_url } = req.body;
  const filtered = req.user.recentlyViewed.filter(r => r.id !== id);
  filtered.unshift({ id, full_name, html_url, viewedAt: new Date() });

  req.user.recentlyViewed = filtered.slice(0, 20);
  await req.user.save();

  res.json({ recentlyViewed: req.user.recentlyViewed });
});

module.exports = router;
