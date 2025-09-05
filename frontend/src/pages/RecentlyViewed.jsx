
import { useRecentlyViewed } from "../context/RecentlyViewedContext";


const RecentlyViewed = () => {
    const { recentlyViewed } = useRecentlyViewed();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Recently Viewed</h1>
      {recentlyViewed.length > 0 ? (
        <div className="flex flex-col gap-4">
          {recentlyViewed.map((repo) => (
            <div
              key={repo.id}
              className="border p-4 rounded-lg flex justify-between items-start"
            >
              <div>
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 font-medium hover:underline"
                >
                  {repo.full_name}
                </a>
                <p className="text-sm text-gray-600">{repo.description}</p>
                <div className="text-xs text-gray-500 mt-1">
                  ⭐ {repo.stargazers_count} • {repo.language || "Unknown"}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No recently viewed repos yet.</p>
      )}
    </div>
  );
}

export default RecentlyViewed
