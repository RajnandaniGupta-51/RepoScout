
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../services/axios";
import RepoCard from "../components/RepoCard";
import ContributorMatchCard from "../components/ContributorMatchCard";
import { FaExternalLinkAlt, FaGithub } from 'react-icons/fa';
import { useRecentlyViewed } from "../context/RecentlyViewedContext";
import { useFavorites } from "../context/FavoritesContext";
import { BiGitBranch, BiStar, BiUserPlus, BiUserCheck, BiPackage } from 'react-icons/bi';
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';

const Dashboard = () => {
    const { recentlyViewed } = useRecentlyViewed();
    const { favorites } = useFavorites();
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [apiError, setApiError] = useState(null);
    const [matches, setMatches] = useState([]);
    const [activeTab, setActiveTab] = useState("favourites");
    const [currentPage, setCurrentPage] = useState(1);
    const projectsPerPage = 6;

    useEffect(() => {
        const fetchGitHubData = async () => {
            if (!user?.githubId) {
                setLoading(false);
                return;
            }
            try {
                const profileRes = await API.get(`/github/users/${user.githubId}`);
                const profileData = profileRes.data;

                const reposRes = await API.get(
                    `/github/users/${user.githubId}/repos?per_page=100`
                );
                const reposData = reposRes.data;

                if (Array.isArray(reposData)) {
                    const totalStars = reposData.reduce((sum, repo) => sum + repo.stargazers_count, 0);
                    const totalForks = reposData.reduce((sum, repo) => sum + repo.forks_count, 0);
                    setAnalytics({
                        followers: profileData.followers,
                        following: profileData.following,
                        publicRepos: profileData.public_repos,
                        totalStars,
                        totalForks,
                    });
                } else {
                    throw new Error("Unexpected API response for repositories.");
                }

                setProfile(profileData);
            } catch (error) {
                console.error("Error fetching GitHub data", error);
                setApiError(error.message);
            } finally {
                setLoading(false);
            }
        };

        const fetchExtraData = async () => {
            try {
                const matchRes = await API.get("/match");

                const enrichedMatches = (matchRes.data.matches || []).map(repo => ({
                    ...repo,
                    matchScore: Math.floor(Math.random() * (100 - 80 + 1)) + 80,
                    skillFit: Math.floor(Math.random() * (99 - 85 + 1)) + 85,
                    interestMatch: Math.floor(Math.random() * (95 - 80 + 1)) + 80,
                    availabilityFit: Math.floor(Math.random() * (95 - 80 + 1)) + 80,
                }));

                setMatches(enrichedMatches);

            } catch (err) {
                console.error("Error fetching dashboard extras", err);
                setApiError(err.message);
            }
        };

        fetchGitHubData();
        fetchExtraData();
    }, [user?.githubId]);
    
    // Reset page to 1 when tab changes
    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab]);

    const handleViewProject = (url) => {
        window.open(url, '_blank');
    };

    const handleCollaborate = (project) => {
        const email = project.owner?.email || `${project.owner?.login}@example.com`;
        const subject = encodeURIComponent(`Collaboration request for "${project.name}"`);
        const body = encodeURIComponent(`Hi ${project.owner?.login},\n\nI came across your project "${project.name}" and was really impressed. I'm a developer with skills in ${project.topics?.join(', ')}. I'm interested in the possibility of contributing to your project.\n\nPlease let me know if you're open to collaboration and what the next steps might be.\n\nBest regards,\n[Your Name]`);

        window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    };

    const formatNumber = (num) => {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
        }
        return num.toLocaleString();
    };

    // Pagination Logic
    const indexOfLastProject = currentPage * projectsPerPage;
    const indexOfFirstProject = indexOfLastProject - projectsPerPage;
    const currentMatches = matches.slice(indexOfFirstProject, indexOfLastProject);

    const totalPages = Math.ceil(matches.length / projectsPerPage);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
          window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen text-lg text-gray-700 bg-emerald-50">Loading...</div>;
    }

    if (apiError) {
        return (
            <div className="flex justify-center items-center h-screen text-red-500 text-lg bg-emerald-50">
                <p>An error occurred: {apiError}. Please try again later.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-emerald-50 text-gray-800 pb-10">
            <div className="w-full md:max-w-[90vw] mx-auto  md:p-0.5 relative z-10 space-y-10">
                {/* User Profile and Stats Card */}
                <div className="bg-gradient-to-br  from-[#1b222c] to-[#14532d] rounded-b-lg shadow-2xl text-gray-200 p-8 pt-12 md:p-10 group relative overflow-hidden transition-all duration-500 hover:shadow-3xl md:mt-6 mt-1">
    
                    <div className="absolute inset-0 z-0 rounded-2xl bg-[#36D399]/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100 animate-pulse"></div>

                    <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start md:space-x-8">
                        <div className="flex-shrink-0 relative">
                    
                            <div className="absolute inset-0 flex justify-center items-center">
                                <div className="md:w-32 md:h-32  h-24 w-24 rounded-full bg-[#1A2328] transform transition-all duration-500 group-hover:scale-125 group-hover:blur-sm"></div>
                            </div>
                
                            <span className="absolute bottom-2 right-2 h-4 w-4 bg-[#36D399] rounded-full z-20 transition-transform duration-300 transform scale-100 group-hover:scale-125 group-hover:ring-2 group-hover:ring-white group-hover:animate-ping"></span>
                            
                            <img
                                src={profile?.avatar_url}
                                alt="User Avatar"
                                className="md:w-28 md:h-28 w-20 h-20 rounded-full border-[6px] border-[#36D399] shadow-lg relative z-10 transform transition-all duration-300 group-hover:scale-105"
                            />
                        </div>
                        <div className="text-center md:text-left mt-4 md:mt-0 flex-1">
                            <h2 className="text-3xl font-bold text-gray-100">{profile?.name || profile?.login}</h2>
                            <p className="text-gray-400 mt-1">{profile?.bio}</p>
                            <a
                                href={profile?.html_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center mt-3 text-[#36D399] hover:text-[#289670] font-medium transition-colors"
                            >
                                <FaGithub className="mr-2 text-xl" />
                                View GitHub Profile
                                <FaExternalLinkAlt className="ml-2 text-xs" />
                            </a>
                        </div>
                    </div>
                    
                    {/* GitHub Analytics Section */}
                    {analytics && (
                        <div className="relative z-10  grid place-content-center grid-cols-3 sm:grid-cols-3 md:grid-cols-5 md:gap-6 gap:4 md:mt-8 md:pt-6 mt-4 pt-4 border-t border-[#364d42]">
                            <div className="p-4 rounded-xl text-center transition-all duration-300 hover:bg-[#1A2328] hover:scale-[1.02] cursor-pointer">
                                <div className="flex justify-center items-center h-12 w-12 mx-auto rounded-full bg-[#122620] shadow-md transition-all duration-300 group-hover:shadow-lg group-hover:shadow-[#36D399]/20 group-hover:scale-110">
                                    <BiStar className="text-[#36D399] text-2xl" />
                                </div>
                                <p className="text-2xl font-bold text-gray-100 mt-2">{formatNumber(analytics.totalStars)}</p>
                                <p className="text-sm text-gray-400">Total Stars</p>
                            </div>
                            <div className="p-4 rounded-xl text-center transition-all duration-300 hover:bg-[#1A2328] hover:scale-[1.02] cursor-pointer">
                                <div className="flex justify-center items-center h-12 w-12 mx-auto rounded-full bg-[#122620] shadow-md transition-all duration-300 group-hover:shadow-lg group-hover:shadow-[#36D399]/20 group-hover:scale-110">
                                    <BiPackage className="text-[#36D399] text-2xl" />
                                </div>
                                <p className="text-2xl font-bold text-gray-100 mt-2">{formatNumber(analytics.publicRepos)}</p>
                                <p className="text-sm text-gray-400">Public Repos</p>
                            </div>
                            <div className="p-4 rounded-xl text-center transition-all duration-300 hover:bg-[#1A2328] hover:scale-[1.02] cursor-pointer">
                                <div className="flex justify-center items-center h-12 w-12 mx-auto rounded-full bg-[#122620] shadow-md transition-all duration-300 group-hover:shadow-lg group-hover:shadow-[#36D399]/20 group-hover:scale-110">
                                    <BiUserPlus className="text-[#36D399] text-2xl" />
                                </div>
                                <p className="text-2xl font-bold text-gray-100 mt-2">{formatNumber(analytics.followers)}</p>
                                <p className="text-sm text-gray-400">Followers</p>
                            </div>
                            <div className="p-4 rounded-xl text-center transition-all duration-300 hover:bg-[#1A2328] hover:scale-[1.02] cursor-pointer">
                                <div className="flex justify-center items-center h-12 w-12 mx-auto rounded-full bg-[#122620] shadow-md transition-all duration-300 group-hover:shadow-lg group-hover:shadow-[#36D399]/20 group-hover:scale-110">
                                    <BiUserCheck className="text-[#36D399] text-2xl" />
                                </div>
                                <p className="text-2xl font-bold text-gray-100 mt-2">{formatNumber(analytics.following)}</p>
                                <p className="text-sm text-gray-400">Following</p>
                            </div>
                            <div className="p-4 rounded-xl text-center transition-all duration-300 hover:bg-[#1A2328] hover:scale-[1.02] cursor-pointer">
                                <div className="flex justify-center items-center h-12 w-12 mx-auto rounded-full bg-[#122620] shadow-md transition-all duration-300 group-hover:shadow-lg group-hover:shadow-[#36D399]/20 group-hover:scale-110">
                                    <BiGitBranch className="text-[#36D399] text-2xl" />
                                </div>
                                <p className="text-2xl font-bold text-gray-100 mt-2">{formatNumber(analytics.totalForks)}</p>
                                <p className="text-sm text-gray-400">Total Forks</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Tabbed Project Section */}
                <div className="space-y-6 px-5 md:px-0">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-800">
                            {
                                {
                                    "favourites": "Favourites",
                                    "recent": "Recently Viewed",
                                    "matches": "Matched Projects"
                                }[activeTab] || "Your Projects"
                            }
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setActiveTab("favourites")}
                                className={`px-4 py-2 text-sm sm:px-5 sm:py-2 rounded-full font-semibold transition-all duration-300 ${activeTab === "favourites" ? "bg-emerald-700 text-white shadow-lg" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                            >
                                Favourites
                            </button>
                            <button
                                onClick={() => setActiveTab("recent")}
                                className={`px-4 py-2 text-sm sm:px-5 sm:py-2 rounded-full font-semibold transition-all duration-300 ${activeTab === "recent" ? "bg-emerald-700 text-white shadow-lg" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                            >
                                Recently Viewed
                            </button>
                            <button
                                onClick={() => setActiveTab("matches")}
                                className={`px-4 py-2 text-sm sm:px-5 sm:py-2 rounded-full font-semibold transition-all duration-300 ${activeTab === "matches" ? "bg-emerald-700 text-white shadow-lg" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                            >
                                Matched Projects
                            </button>
                        </div>
                    </div>

                    <div className="mt-6">
                        {/* Display projects based on the active tab */}
                        {activeTab === "favourites" && (
                            favorites.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                                    {favorites.map((item, index) => <RepoCard key={item.id} repo={item} onViewProject={handleViewProject} onCollaborate={handleCollaborate} isFeatured={index === 0}/>)}
                                </div>
                            ) : (
                                <p className="col-span-full text-center text-gray-500 py-10">You have no favorite repositories yet.</p>
                            )
                        )}
                        {activeTab === "recent" && (
                            recentlyViewed.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                                    {recentlyViewed.map((item, index) => <RepoCard key={item.id} repo={item} onViewProject={handleViewProject} onCollaborate={handleCollaborate} isFeatured={index === 0}/>)}
                                </div>
                            ) : (
                                <p className="col-span-full text-center text-gray-500 py-10">No recently viewed repositories.</p>
                            )
                        )}
                        {activeTab === "matches" && (
                            matches.length > 0 ? (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                                        {currentMatches.map(item => <ContributorMatchCard key={item.id} project={item} onViewProject={handleViewProject} onCollaborate={handleCollaborate} user={user}/>)}
                                    </div>
                                    
                                    {/* Pagination Controls */}
                                    {totalPages > 1 && (
                                        <div className="flex justify-center items-center gap-4 mt-8">
                                            <button
                                                onClick={() => paginate(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className="text-gray-800 pr-2 disabled:opacity-50 transition-transform duration-300 hover:scale-110"
                                            >
                                                <BiChevronLeft size={24} />
                                            </button>
                                            
                                            <span className="text-lg font-medium text-gray-700">{currentPage}</span>
                                            
                                            <button
                                                onClick={() => paginate(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                                className="text-gray-800 pl-2 disabled:opacity-50 transition-transform duration-300 hover:scale-110"
                                            >
                                                <BiChevronRight size={24} />
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <p className="col-span-full text-center text-gray-500 py-10">No project matches found. Please update your profile or try again later.</p>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
