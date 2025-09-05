
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logoutUser } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const hideMenu = ["/login", "/signup"].includes(location.pathname);

  // New link classes for the dark emerald theme
  const linkClasses = ({ isActive }) =>
    `px-4 py-2 transition-colors ${
      isActive
        ? "text-white font-semibold border-b-2 border-emerald-400"
        : "text-gray-300 hover:text-white"
    }`;

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>

      <div className="bg-[#01050A] shadow-xl p-6 md:px-15 flex justify-between items-center fixed top-0 left-0 w-full z-50">
        
        <NavLink to="/" className="text-2xl font-bold text-white">
          <span className="text-emerald-400">Repo</span>
          <span className="text-white">Scout</span>
        </NavLink>

        {!hideMenu && (
          <>
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="text-white hover:text-emerald-400"
              >
                {isMenuOpen ? (
                  <FaTimes className="h-6 w-6" />
                ) : (
                  <FaBars className="h-6 w-6" />
                )}
              </button>
            </div>

        
            <div className="hidden md:flex items-center space-x-6">
              <NavLink to="/" className={linkClasses}>
                Home
              </NavLink>
              <NavLink to="/search" className={linkClasses}>
                Explore
              </NavLink>
              {user ? (
                <>
                  <NavLink to="/dashboard" className={linkClasses}>
                    Dashboard
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-4 py-2 rounded-full  hover:bg-red-700 transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink to="/login" className={linkClasses}>
                    Login
                  </NavLink>
                  <NavLink to="/signup" className={linkClasses}>
                    Signup
                  </NavLink>
                </>
              )}
            </div>
          </>
        )}
      </div>

  
      <div
        className={`md:hidden fixed w-full bg-emerald-800 shadow-lg z-40 transition-all duration-300 ${
          isMenuOpen ? "top-[80px] visible opacity-100" : "top-[-100%] invisible opacity-0"
        }`}
      >
        <div className="flex flex-col py-6 space-y-6 px-6">
          <NavLink to="/" className={linkClasses} onClick={() => setIsMenuOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/search" className={linkClasses} onClick={() => setIsMenuOpen(false)}>
            Explore
          </NavLink>
          {user ? (
            <>
              <NavLink to="/dashboard" className={linkClasses} onClick={() => setIsMenuOpen(false)}>
                Dashboard
              </NavLink>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="w-26 bg-red-600 text-white py-2 rounded-full hover:bg-red-700 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClasses} onClick={() => setIsMenuOpen(false)}>
                Login
              </NavLink>
              <NavLink to="/signup" className={linkClasses} onClick={() => setIsMenuOpen(false)}>
                Signup
              </NavLink>
            </>
          )}
        </div>
      </div>
      
      {isMenuOpen && (
        <div 
          onClick={toggleMenu} 
          className="md:hidden fixed inset-0 bg-black opacity-50 z-30"
        ></div>
      )}
    </>
  );
};

export default Navbar;