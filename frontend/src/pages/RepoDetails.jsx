
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import React from 'react'

const RepoDetails = () => {
  const { owner, repoName } = useParams();
  const [repo, setRepo] = useState(null);

  useEffect(() => {
    const fetchRepo = async () => {
      const res = await axios.get(`https://api.github.com/repos/${owner}/${repoName}`);
      setRepo(res.data);
    };
    fetchRepo();
  }, [owner, repoName]);

  if (!repo) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-blue-600">{repo.full_name}</h1>
      <p className="mt-2 text-gray-700">{repo.description}</p>

      <div className="mt-4 flex gap-6 text-gray-600">
        <span>⭐ Stars: {repo.stargazers_count}</span>
        <span>🍴 Forks: {repo.forks_count}</span>
        <span>🖥 Language: {repo.language}</span>
      </div>

      <div className="mt-6">
        <a
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          View on GitHub
        </a>
      </div>
    </div>
  );
}

export default RepoDetails



