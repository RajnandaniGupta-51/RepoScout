
import { createContext, useContext, useState, useEffect } from "react";
import API from "../services/axios";
import { useAuth } from "./AuthContext";

const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user || !token) {
        setFavorites([]);
        return;
      }
      try {
      
        const { data } = await API.get("/user/favourites");
        setFavorites(data.favourites);
      } catch (err) {
        console.error("Failed to load favourites", err);
      }
    };
    fetchFavorites();
  }, [user, token]);

  const addFavorite = async (repo) => {
    try {
      setFavorites((prev) => (prev.some((r) => r.id === repo.id) ? prev : [repo, ...prev]));
    
      const { data } = await API.post("/user/favourites", repo);
      if (data?.favourites) setFavorites(data.favourites);
    } catch (err) {
      console.error("Failed to add favourite", err);
    }
  };

  const removeFavorite = async (repoId) => {
    try {
      setFavorites((prev) => prev.filter((repo) => repo.id !== repoId));
      await API.delete(`/user/favourites/${repoId}`);
    } catch (err) {
      console.error("Failed to remove favourite", err);
    }
  };

  const isFavorite = (repoId) => {
    return favorites.some((repo) => repo.id === repoId);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};