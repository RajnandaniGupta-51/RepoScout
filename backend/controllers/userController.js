
const User = require("../models/User");

exports.getFavourites = async (req, res) => {
  try {
    const userId = req.user._id;
    const userWithFavourites = await User.findById(userId).select('favourites');

    if (!userWithFavourites) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({ favourites: userWithFavourites.favourites });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.addFavourite = async (req, res) => {
  try {
    const user = req.user;
    const repoData = req.body;

    const repo = {
        id: parseInt(repoData.id, 10),
      full_name: repoData.full_name,
      html_url: repoData.html_url,
      description: repoData.description,
      stargazers_count: repoData.stargazers_count,
      language: repoData.language,
    };

    if (!user.favourites.find(r => r.id === repo.id)) {
      user.favourites.unshift(repo);
      user.favourites = user.favourites.slice(0, 20);
      await user.save();
    }

    res.json({ favourites: user.favourites });
  } catch (err) {
    console.error("Error adding favourite:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// 📌 Remove a repo from favourites
exports.removeFavourite = async (req, res) => {
  try {
    const user = req.user;
    const { repoId } = req.params;

    user.favourites = user.favourites.filter(r => r.id !== parseInt(repoId, 10));
    await user.save();

    res.json({ favourites: user.favourites });
  } catch (err) {
    console.error("Error removing favourite:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// 📌 Get recently viewed repos
exports.getRecentlyViewed = async (req, res) => {
  try {
    const user = req.user;
    res.json({ recentlyViewed: user.recentlyViewed });
  } catch (err) {
    console.error("Error fetching recently viewed:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// 📌 Get top languages from favourites

exports.addRecentlyViewed = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
        console.warn("Authentication failed: User not found or missing ID.");
        return res.status(401).json({ msg: "Authentication failed: User not found in request" });
    }
    const userId = req.user._id;
    const { repo } = req.body;

    if (!repo || !repo.id) {
      return res.status(400).json({ msg: "Invalid repository data provided" });
    }
    const sanitizedRepo = {
        id: repo.id,
        full_name: repo.full_name,
        html_url: repo.html_url,
        description: repo.description,
        stargazers_count: repo.stargazers_count,
        language: repo.language,
        topics: repo.topics || [], 
        owner: {
            login: repo.owner?.login,
            avatar_url: repo.owner?.avatar_url,
        }
    };
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    
    if (!user.recentlyViewed) {
        user.recentlyViewed = [];
    }
    user.recentlyViewed = user.recentlyViewed.filter(
      (item) => item.id !== sanitizedRepo.id
    );
    user.recentlyViewed.unshift(sanitizedRepo);
    if (user.recentlyViewed.length > 10) {
      user.recentlyViewed = user.recentlyViewed.slice(0, 10);
    }

    await user.save();

    res.json({ recentlyViewed: user.recentlyViewed });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};



exports.getTopLanguages = async (req, res) => {
  try {
    const user = req.user;

    const counts = {};
    user.favourites.forEach(repo => {
      if (repo.language) {
        counts[repo.language] = (counts[repo.language] || 0) + 1;
      }
    });

    const sorted = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([lang]) => lang);

    res.json({ topLanguages: sorted });
  } catch (err) {
    console.error("Error fetching top languages:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};