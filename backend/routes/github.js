require('dotenv').config();

const express = require('express');
const router = express.Router();
const axios = require('axios');
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const githubApi = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    'Authorization': `token ${GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github.v3+json',
  },
});

// A new route to get a user's GitHub profile
router.get('/users/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const response = await githubApi.get(`/users/${username}`);
        res.json(response.data);
    } catch (error) {
        // Pass the error response back to the frontend
        res.status(error.response?.status || 500).json(error.response?.data || { message: 'Internal Server Error' });
    }
});

// A new route to get a user's repositories
router.get('/users/:username/repos', async (req, res) => {
    try {
        const { username } = req.params;
        const { per_page } = req.query;
        const response = await githubApi.get(`/users/${username}/repos`, { params: { per_page } });
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json(error.response?.data || { message: 'Internal Server Error' });
    }
});

// A new route to get a single repository by it ID
router.get('/repositories/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const response = await githubApi.get(`/repositories/${id}`);
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json(error.response?.data || { message: 'Internal Server Error' });
    }
});

module.exports = router;
