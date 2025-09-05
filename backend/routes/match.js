
const router = require("express").Router();
const protect = require("../middleware/authMiddleware");
const axios = require("axios");

const gh = axios.create({
  baseURL: "https://api.github.com",
  headers: process.env.GITHUB_TOKEN
    ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
    : {},
});


async function getTopLanguages(username) {
  const { data: repos } = await gh.get(`/users/${username}/repos?per_page=100&sort=updated`);
  const counts = {};
  repos.forEach(r => {
    if (r.language) counts[r.language] = (counts[r.language] || 0) + 1;
  });
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([lang]) => lang)
    .slice(0, 3);
}

async function searchCandidateRepos(langs) {

  const searchPromises = [];
  for (const lang of langs) {
    for (const label of ["good first issue", "help wanted"]) {
      const q = encodeURIComponent(`label:"${label}" language:${lang} state:open`);
      searchPromises.push(gh.get(`/search/issues?q=${q}&sort=updated&order=desc&per_page=10`));
    }
  }

  const searchResults = await Promise.all(searchPromises);

  const results = new Set();
  searchResults.forEach(res => {
    res.data.items.forEach(item => {
      const repo = item.repository_url.replace("https://api.github.com/repos/", "");
      results.add(repo);
    });
  });

  const repoPromises = [];
  for (const full of Array.from(results).slice(0, 20)) {
    repoPromises.push(gh.get(`/repos/${full}`));
  }

  const repoResponses = await Promise.all(repoPromises);
  const repoInfos = [];
  repoResponses.forEach(response => {
    const data = response.data;
    repoInfos.push({
      id: data.id,
      full_name: data.full_name,
      html_url: data.html_url,
      description: data.description,
      topics: data.topics || [], 
      stargazers_count: data.stargazers_count,
      language: data.language,
      owner: { login: data.owner?.login, avatar_url: data.owner?.avatar_url },
      open_issues: data.open_issues_count,
    });
  });

  return repoInfos;
}

// routes/matchRoutes.js
router.get("/", protect, async (req, res) => {
  try {
    console.log("User from token:", req.user);

    const githubId = req.user?.githubId;
    if (!githubId) {
      console.warn("⚠ No GitHub ID for this user");
      return res.json({ matches: [], languages: [] });
    }

    const languages = await getTopLanguages(githubId).catch(err => {
      console.error("Error fetching top languages:", err.message);
      return [];
    });

    if (!languages.length) {
      console.warn("⚠ No languages found, skipping match search");
      return res.json({ matches: [], languages: [] });
    }

    const matches = await searchCandidateRepos(languages).catch(err => {
      console.error("Error searching candidate repos:", err.message);
      return [];
    });

    res.json({ matches, languages });
  } catch (err) {
    console.error("MATCH ROUTE ERROR:", err.message, err.stack);
    res.json({ matches: [], languages: [] }); 
  }
});

module.exports = router;
