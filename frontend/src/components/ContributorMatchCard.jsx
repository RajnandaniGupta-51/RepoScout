
import React from 'react';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { useRecentlyViewed } from "../context/RecentlyViewedContext";

const ContributorMatchCard = ({ project, onViewProject, onCollaborate, user }) => {
    const { addRecentlyViewed } = useRecentlyViewed();
    
    // Helper function to truncate the description
    const truncateDescription = (text, wordLimit) => {
        if (!text) return '';
        const words = text.split(' ');
        if (words.length <= wordLimit) {
            return text;
        }
        return words.slice(0, wordLimit).join(' ') + '...';
    };

    const ProgressBar = ({ label, score }) => (
        <div className="flex items-center mb-2">
            <span className="w-24 text-sm text-gray-600 font-medium">{label}</span>
            <div className="flex-1 h-2 bg-gray-200 rounded-full mx-2">
                <div
                    className="h-full rounded-full bg-emerald-500 transition-all duration-300 ease-in-out"
                    style={{ width: `${score}%` }}
                ></div>
            </div>
            <span className="text-sm text-gray-600 font-semibold">{score}%</span>
        </div>
    );

    const handleViewClick = () => {
        addRecentlyViewed(project);
        onViewProject(project.html_url);
    };

    const handleCollaborateClick = () => {
        const email = project.owner?.email || `${project.owner?.login}@example.com`;
        const subject = encodeURIComponent(`Collaboration request for "${project.name}"`);
        const body = encodeURIComponent(`Hi ${project.owner?.login},\n\nI came across your project "${project.name}" and was really impressed. I'm a developer with skills in ${project.topics?.join(', ')}. I'm interested in the possibility of contributing to your project.\n\nPlease let me know if you're open to collaboration and what the next steps might be.\n\nBest regards,\n${user?.username}`);
        
        window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg border-b-4 border-emerald-800 transform transition-all duration-300 ease-in-out hover:scale-[1.01] hover:shadow-lg group">
            <div className="flex flex-col gap-4">
                {/* Project Title and Truncated Description */}
                {project.description && <p className="text-gray-800 md:text-lg text-md font-normal mb-2">
                    {truncateDescription(project.description, 15)}
                </p>}
                
                {/* Skill Tags */}
                {project.topics && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {project.topics.map((topic, index) => (
                            <span key={index} className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full font-medium">
                                {topic}
                            </span>
                        ))}
                    </div>
                )}
                
                {/* Main Content Area */}
                <div className="flex flex-col md:flex-row items-stretch gap-6">
                    {/* Match Score Section */}
                    <div className="flex-1 bg-gray-50 p-5 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-xl text-gray-800 font-bold">Your Match Score</h4>
                            <span className="text-3xl font-bold text-emerald-500">{project.matchScore}%</span>
                        </div>
                        <ProgressBar label="Skill Fit" score={project.skillFit} />
                        <ProgressBar label="Interest Match" score={project.interestMatch} />
                        <ProgressBar label="Availability Fit" score={project.availabilityFit} />
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex-1 flex md:flex-col flex-row items-stretch md:items-start justify-center gap-4">
                        <button
                            onClick={handleViewClick}
                            className="w-full h-12 bg-white text-emerald-500 font-semibold border-2 border-emerald-500 rounded-lg transition-all duration-200 hover:bg-emerald-50 hover:border-emerald-600 hover:text-emerald-600 flex items-center justify-center gap-2"
                        >
                            View Project <FaExternalLinkAlt />
                        </button>
                        <button
                            onClick={handleCollaborateClick} 
                            className="w-full h-12 bg-emerald-500 text-white font-semibold rounded-lg transition-all duration-200 hover:bg-emerald-600 shadow-md hover:shadow-lg"
                        >
                            Collaborate
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContributorMatchCard;