
 import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecentlyViewed } from "../context/RecentlyViewedContext";
import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";
import API from "../services/axios";
import { FaRegStar, FaStar } from "react-icons/fa";
import { FaTwitter, FaGithub, FaLinkedin } from 'react-icons/fa';
import { FaArrowRightLong } from "react-icons/fa6";
import { VscRepo, VscStarFull, VscRocket } from 'react-icons/vsc';
import TestimonialCard from "../components/Testimonials";

const Home = () => {
  const [trendingRepos, setTrendingRepos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const navigate = useNavigate();
  const { addRecentlyViewed } = useRecentlyViewed();
  const { user } = useAuth();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await fetch(
          "https://api.github.com/search/repositories?q=stars:>10000&sort=stars&order=desc&per_page=6"
        );
        const data = await res.json();
        setTrendingRepos(data.items);
      } catch (error) {
        console.error("Error fetching trending repos:", error);
      }
    };
    fetchTrending();
  }, []);

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/search?q=${query}`);
    }
  };

  const topics = [
    "Web Development",
    "Machine Learning",
    "Blockchain",
    "Mobile Apps",
    "Game Development",
    "Data Science",
  ];

  const handleFavoriteToggle = async (repo, e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      setModalMessage("You must be logged in to favorite a repository.");
      setModalOpen(true);
      return;
    }

    const isCurrentlyFavorite = isFavorite(repo.id);

    try {
      if (isCurrentlyFavorite) {
        await removeFavorite(repo.id);
      } else {
        await addFavorite(repo);
      }
    } catch (error) {
      console.error("Error toggling favorite status:", error);
      setModalMessage("Failed to update favorite status. Please try again.");
      setModalOpen(true);
    }
  };

  const testimonialsData = [
  {
    id: 1,
    name: "Alex Chen",
    title: "Software Engineer at TechSolutions",
    quote: "RepoScout completely transformed how my team discovers and manages open-source projects. The search filters are incredibly precise!",
    avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    id: 2,
    name: "Maria Rodriguez",
    title: "Lead Developer at Innovate Corp",
    quote: "Finding the right dependency used to take hours. With RepoScout, I can pinpoint the perfect repository in minutes. It's an indispensable tool.",
    avatarUrl: "https://randomuser.me/api/portraits/women/35.jpg"
  },
  {
    id: 3,
    name: "Ben Carter",
    title: "DevOps Specialist at CloudForge",
    quote: "The collaboration features on RepoScout are a game-changer. We now have a centralized place to share and track repos across our entire organization.",
    avatarUrl: "https://randomuser.me/api/portraits/men/38.jpg"
  },
];

  return (
    <div className="pb-10">
      {/* HERO SECTION */}
      <section className="hero h-[90vh] text-white py-20 px-6 md:px-12 text-center">
        <div className="w-full md:w-[50vw] flex flex-col md:ml-[0.5vw] items-center md:items-start justify-center h-full">
          <h1 className="text-4xl text-center md:text-start md:text-8xl font-bold mb-4">
            Discover<br /> Open-Source Projects
          </h1>
          <p className="text-lg text-center md:text-start md:text-xl max-w-2xl mb-6">
            Explore repositories based on your interests. Find trending projects,
            popular topics, and much more.
          </p>
          <button 
            className="px-7 py-2 text-sm font-semibold bg-emerald-700 rounded-full flex gap-2 items-center justify-center transition-all duration-300 hover:bg-emerald-800 group" 
            onClick={() => navigate('/search')}
          > 
            Start Exploring 
            <FaArrowRightLong className="text-2xl mt-1 ml-2 transform transition-transform duration-300 group-hover:translate-x-1"/>
          </button>
        </div>
      </section>

      {/* TOPICS SECTION */}
      <section className="py-20 px-6 md:px-12 w-full mx-auto">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold mb-8 text-[#01050A] tracking-tight">
            Explore by Topics
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {topics.map((topic, index) => (
              <button
                key={index}
                onClick={() => navigate(`/search?q=${topic}`)}
                className="group relative px-6 py-3 bg-white text-gray-700 font-medium rounded-full shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-xl overflow-hidden"
              >
          
                <span className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                  {topic}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* TRENDING REPOS */}
      <section className="py-16 px-6 md:px-12 max-w-7xl mx-auto rounded-xl">
        <h2 className="text-4xl font-extrabold mb-10 text-[#01050A] text-center tracking-tight">
          Featured Projects
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {trendingRepos.map((repo) => {
            const isRepoFavorite = isFavorite(repo.id);
            return (
              <a
                key={repo.id}
                onClick={() => addRecentlyViewed(repo)}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="relative block bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-8 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-lg border-b-4 border-emerald-800"
              >
                <div className="flex items-center justify-between mb-2 md:mb-4 ">
                  <div className="flex items-center gap-4">
                    <VscRepo className="text-emerald-500 text-2xl sm:text-3xl flex-shrink-0" />
                    <h3 className="text-xl font-bold text-gray-900 line-clamp-1">
                      {repo.name}
                    </h3>
                  </div>
                  <button
                    onClick={(e) => handleFavoriteToggle(repo, e)}
                    className="text-2xl text-emerald-500 hover:text-yellow-500 transition-colors duration-200"
                  >
                    {isRepoFavorite ? <FaStar /> : <FaRegStar />}
                  </button>
                </div>
                <p className="text-gray-500 text-base  mt-2 line-clamp-3">
                  {repo.description || "No description available"}
                </p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4 md:mt-6 pt-3 md:pt-4 border-t border-gray-400">
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
          })}
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <div className="py-16 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold text-[#01050A] text-center mb-15">
            Testimonials
          </h2>
          <div className="flex flex-col sm:flex-row items-center sm:items-stretch space-y-8 sm:space-y-0 sm:space-x-8">
            {testimonialsData.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className="w-full sm:flex-1 sm:min-w-0 max-w-sm sm:max-w-none relative"
              >
                <TestimonialCard
                  testimonial={testimonial}
                  isHovered={index === hoveredIndex}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Custom Modal */}
      <div
        className={`fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center ${
          modalOpen ? 'block' : 'hidden'
        }`}
      >
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
          <h3 className="text-lg font-bold mb-4">Error</h3>
          <p className="text-gray-700 mb-6">{modalMessage}</p>
          <div className="text-right">
            <button
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

