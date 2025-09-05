
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Search from "./pages/Search";
import RepoDetails from "./pages/RepoDetails";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { useAuth } from "./context/AuthContext";
import Favourites from "./pages/Favourites";
import RecentlyViewed from "./pages/RecentlyViewed";
import Footer from "./components/Footer";

const PrivateRoute = ({ children }) => {
    const { user } = useAuth();
    return user ? children : <Navigate to="/login" />;
};



const App = () => {
  return (
    <>
      <Navbar />
      <div className="w-full mx-auto min-h-[90vh] bg-emerald-50 mt-[9vh] ">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/repo/:owner/:repoName" element={<RepoDetails />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/login" />} />
          <Route path="/favourites" element={<Favourites />} />
          <Route path="/recently-viewed" element={<RecentlyViewed />} />
        </Routes>
      </div>
         <Footer/>
    </>
  );
};

export default App;
