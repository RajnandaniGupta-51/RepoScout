

import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import RepoCard from "../components/RepoCard";
import FilterBar from "../components/FilterBar";
import { IoSearch } from "react-icons/io5";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";


const Search = () => {
    const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [repos, setRepos] = useState([]);
  const [language, setLanguage] = useState("");
  const [sort, setSort] = useState("stars");

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const perPage = 10;

  const handleSearch = async (
    searchQuery = query,
    lang = language,
    sortOrder = sort,
    pageNumber = 1
  ) => {
    if (!searchQuery) return;
    setLoading(true);
    try {
      const langQuery = lang ? `+language:${lang}` : "";
      const res = await axios.get(
        `https://api.github.com/search/repositories?q=${searchQuery}${langQuery}&sort=${sortOrder}&order=desc&page=${pageNumber}&per_page=${perPage}`
      );
      setRepos(res.data.items);
      setHasMore(res.data.items.length === perPage);
    } catch (err) {
      console.error("Error fetching repos:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch on URL param change
  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      setQuery(q);
      setPage(1);
      handleSearch(q, language, sort, 1);
    }
  }, [searchParams]);

  // Refetch when filters change
  useEffect(() => {
    if (query) {
      setPage(1);
      handleSearch(query, language, sort, 1);
    }
  }, [language, sort]);

  // Handle page navigation
  const goToPage = (newPage) => {
    if (newPage < 1) return;
    setPage(newPage);
    handleSearch(query, language, sort, newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="p-4 sm:p-8 pt-15 pb-15 w-full md:pt-15 md:max-w-7xl mx-auto min-h-screen flex flex-col justify-center bg-emerald-50 text-gray-800">
      <h1 className="text-3xl sm:text-4xl text-center font-extrabold mb-4 text-gray-900">
        {searchParams.get("q") ? `Results for "${query}"` : "Search Repositories"}
      </h1>

      <div className="flex flex-col py-6 w-full max-w-4xl mx-auto justify-center items-center rounded-md mb-5 px-4 sm:px-0">
        <div className="flex gap-4 mb-8 items-center w-full">
          <input
            type="text"
            placeholder="Search for repositories..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="glass-emerald-400 text-zinc-600 px-4 py-3 flex-1 text-base sm:text-lg rounded-full shadow-inner"
          />
          <button
            onClick={() => handleSearch()}
            className="p-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition duration-300 shadow-md flex-shrink-0"
          >
            <IoSearch className="h-5 w-5" />
          </button>
        </div>
        <FilterBar
          language={language}
          setLanguage={setLanguage}
          sort={sort}
          setSort={setSort}
        />
      </div>

      {loading && repos.length === 0 && (
        <p className="text-center text-gray-500 mt-12 text-lg">Loading...</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8 md:px-4 px-0">
        {repos.length > 0 ? (
          repos.map((repo) => <RepoCard key={repo.id} repo={repo} />)
        ) : (
          !loading && (
            <p className="text-gray-500 text-center col-span-full mt-12 text-base sm:text-xl">
              No repositories found. Try a different search.
            </p>
          )
        )}
      </div>

      {repos.length > 0 && (
        <div className="flex justify-center items-center gap-6 mt-8">
          <button
            onClick={() => goToPage(page - 1)}
            disabled={page === 1}
            className="text-gray-800 pr-2 transition-transform duration-300 hover:scale-110 disabled:opacity-50"
          >
            <IoIosArrowBack className="h-6 w-6" />
          </button>
          <span className="text-lg font-bold text-gray-700">{page}</span>
          <button
            onClick={() => goToPage(page + 1)}
            disabled={!hasMore}
            className="text-gray-800 pl-2 transition-transform duration-300 hover:scale-110 disabled:opacity-50"
          >
            <IoIosArrowForward className="h-6 w-6" />
          </button>
        </div>
      )}
    </div>
  );
}

export default Search
