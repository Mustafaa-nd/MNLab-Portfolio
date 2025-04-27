import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import ProjectCard from "../components/ProjectCard";

const Achievements = () => {
  const { user } = useAuth();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [achievementsData, setAchievementsData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const handleThemeChange = () => {
      setTheme(localStorage.getItem("theme") || "light");
    };

    window.addEventListener("themeChange", handleThemeChange);
    return () => window.removeEventListener("themeChange", handleThemeChange);
  }, []);

  useEffect(() => {
    fetch(`${BACKEND_URL}/achievements?search=${searchQuery}&category=${category}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Achievements fetched:", data);
        setAchievementsData(data);
      })
      .catch((error) => console.error("Error loading achievements:", error));
  }, [searchQuery, category, BACKEND_URL]);

  useEffect(() => {
    fetch(`${BACKEND_URL}/categories`)
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Erreur chargement catégories:", err));
  }, [BACKEND_URL]);

  return (
    <div className={`min-h-screen p-10 mt-16 transition-colors duration-300 ${theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-900"}`}>
      <div className="flex flex-col items-center justify-center breadcrumbs text-base mb-4">
        <ul className="flex space-x-2">
          <li>
            <Link to="/" className="text-green-700 hover:underline">Home</Link>
          </li>
          <li className="text-gray-500">Achievements</li>
        </ul>
      </div>

      <h1 className="text-4xl font-extrabold text-center mb-6">My Achievements</h1>

      {user && user.role === "admin" && (
        <div className="flex justify-end mb-4">
          <Link to="/create-achievement">
            <button className="btn btn-wide border-l-4 border-r-4 border-green-500 bg-opacity-50">
              Add Achievement
            </button>
          </Link>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 mt-4 md:mt-0"
        >
          <option value="">All Categories</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {achievementsData.length === 0 ? (
        <p className="text-center text-lg">No projects found...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {achievementsData.map((project, index) => (
            <ProjectCard key={index} project={project} theme={theme} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Achievements;
