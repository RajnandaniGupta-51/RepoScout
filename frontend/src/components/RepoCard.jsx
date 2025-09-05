
import React from 'react';
import { useFavorites } from "../context/FavoritesContext";
import API from "../services/axios";
import { useRecentlyViewed } from "../context/RecentlyViewedContext";
import { FaRegStar, FaStar } from "react-icons/fa";
import { FaRegBookmark, FaBookmark } from "react-icons/fa6";
import { FiFolder } from "react-icons/fi"; // Importing the folder icon from react-icons/fi
import { VscRepo, VscStarFull, VscRocket } from 'react-icons/vsc';

const RepoCard = ({ repo }) => {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const { addRecentlyViewed } = useRecentlyViewed();

  const isFav = isFavorite(repo.id);

  const handleFavorite = (e) => {
    e.stopPropagation();
    if (isFav) {
      removeFavorite(repo.id);
    } else {
      addFavorite({
        id: repo.id,
        full_name: repo.full_name,
        html_url: repo.html_url,
        description: repo.description,
        stargazers_count: repo.stargazers_count,
        language: repo.language,
        owner: repo.owner
          ? { login: repo.owner.login, avatar_url: repo.owner.avatar_url }
          : null,
      });
    }
  };

  const handleOpen = async () => {
    addRecentlyViewed(repo);
    try {
      await API.post("/user/recently-viewed", { repo });
    } catch (err) {
      console.error("Failed to save recently viewed repo:", err);
    }
  };

  const MAX_DESCRIPTION_LENGTH = 150;

  const truncateText = (text, limit) => {
    if (!text) return "";
    if (text.length > limit) {
      return text.substring(0, limit) + "...";
    }
    return text;
  };

  const truncatedDescription = truncateText(repo.description, MAX_DESCRIPTION_LENGTH);

  return (
    <a
      key={repo.id}
      onClick={() => handleOpen(repo)}
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="relative block bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-6 sm:p-8 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-lg border-b-4 border-emerald-800"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4 min-w-0">
          <VscRepo className="text-emerald-500 text-3xl flex-shrink-0" />
          {/* Using min-w-0 and overflow-hidden to handle long repo names gracefully */}
          <h3 className="text-xl font-bold text-gray-900 truncate">
            {repo.name}
          </h3>
        </div>
        <button
          onClick={handleFavorite} // Corrected the function call to pass only the event object
          className="text-2xl text-emerald-500 hover:text-yellow-500 transition-colors duration-200"
        >
          {isFav ? <FaStar /> : <FaRegStar />}
        </button>
      </div>
      {/* Increased padding on smaller screens for a better look */}
      <p className="text-gray-500 text-base mt-2 line-clamp-3">
        {repo.description || "No description available"}
      </p>
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-400">
        <span className="flex items-center gap-2 text-base text-gray-600 font-medium">
          <VscStarFull className="text-yellow-500" />
          {repo.stargazers_count}
        </span>
        <span className="flex items-center gap-2 text-base text-gray-600 font-medium mt-2 sm:mt-0">
          <VscRocket className="text-blue-500" />
          {repo.language || "Unknown"}
        </span>
      </div>
    </a>
  );
};

export default RepoCard;
