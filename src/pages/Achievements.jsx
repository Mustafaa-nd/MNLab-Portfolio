import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext"; 
import ProjectCard from "../components/ProjectCard";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Achievements = () => {
  const { user } = useAuth();  
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [achievementsData, setAchievementsData] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); 
  const [category, setCategory] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const handleThemeChange = () => {
      setTheme(localStorage.getItem("theme") || "light");
    };

    window.addEventListener("themeChange", handleThemeChange);
    return () => window.removeEventListener("themeChange", handleThemeChange);
  }, []);

  useEffect(() => {
    const fetchAchievements = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(`${API_BASE_URL}/achievements?search=${searchQuery}&category=${category}`);

        if (!response.ok) throw new Error("Erreur lors du chargement des données.");

        const data = await response.json();
        setAchievementsData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, [searchQuery, category]);  

  return (
    <div className={`min-h-screen p-8 mt-16 transition-colors duration-300 ${theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-900"}`}>
      
      {/* Breadcrumbs */}
      <div className="flex flex-col items-center justify-center breadcrumbs text-base mb-4">
        <ul className="flex space-x-2">
          <li>
            <Link to="/" className="text-green-700 hover:underline">Home</Link>
          </li>
          <li className="text-gray-500">Achievements</li>
        </ul>
      </div>

      <h1 className="text-4xl font-extrabold text-center mb-6">My Achievements</h1>

      {/* Bouton pour ajouter une réalisation (admin seulement) */}
      {user && user.role === "admin" && (
        <div className="flex justify-end mb-4">
          <Link to="/create-achievement">
            <button className="btn btn-wide border-l-4 border-r-4 border-green-500 bg-opacity-50">
              Add Achievement
            </button>
          </Link>
        </div>
      )}

      {/* Barre de recherche & filtre */}
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
          <option value="Development">Development</option>
          <option value="Design">Design</option>
          <option value="Data Science">Data Science</option>
          <option value="Security">Security</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Gestion des erreurs et du chargement */}
      {loading ? (
        <p className="text-center text-lg">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : achievementsData.length === 0 ? (
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
