
import { createContext, useContext, useState, useEffect } from "react";
import API from "../services/axios";
import { useAuth } from "./AuthContext";

const RecentlyViewedContext = createContext();

export const useRecentlyViewed = () => useContext(RecentlyViewedContext);

export const RecentlyViewedProvider = ({ children }) => {
  const { user } = useAuth();
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    const fetchRecentlyViewed = async () => {
      if (!user) return setRecentlyViewed([]);
      try {
      
        const { data } = await API.get("/user/recently-viewed");
        setRecentlyViewed(data.recentlyViewed);
      } catch (err) {
        console.error("Failed to load recently viewed", err);
      }
    };
    fetchRecentlyViewed();
  }, [user]);

  const addRecentlyViewed = async (repo) => {
    if (!user) return;
    try {
      setRecentlyViewed((prev) => {
        const filtered = prev.filter((r) => r.id !== repo.id);
        return [repo, ...filtered].slice(0, 10);
      });
      
      await API.post("/user/recently-viewed", {repo});
    } catch (err) {
      console.error("Failed to add recently viewed", err);
    }
  };

  return (
    <RecentlyViewedContext.Provider value={{ recentlyViewed, addRecentlyViewed }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
};