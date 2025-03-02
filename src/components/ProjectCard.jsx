import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ProjectCard = ({ project, theme }) => {
  const navigate = useNavigate();
  const [likes, setLikes] = useState(project.likes || 0);
  const [liked, setLiked] = useState(project.liked || false); 
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    // ✅ Mise à jour du chemin de l'image en ligne
    if (project.img.startsWith("/uploads")) {
      setImageUrl(`${API_BASE_URL}${project.img}`);
    } else {
      setImageUrl(project.img);
    }

    // ✅ Récupérer les likes depuis l'API
    const fetchLikes = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/achievements`);
        if (!response.ok) throw new Error("Erreur lors du chargement des likes");

        const achievements = await response.json();
        const currentProject = achievements.find((proj) => proj.id === project.id);

        if (currentProject) {
          setLikes(currentProject.likes || 0);
          setLiked(currentProject.liked || false);
        }
      } catch (error) {
        console.error("❌ Impossible de récupérer les likes :", error);
      }
    };

    fetchLikes();
  }, [project.id, project.img]);

  const handleLike = async () => {
    const action = liked ? "unlike" : "like";

    try {
      const response = await fetch(`${API_BASE_URL}/achievements/${project.id}/like`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) throw new Error("Erreur lors de l'ajout du like");

      const data = await response.json();
      setLikes(data.likes);
      setLiked(data.liked);
    } catch (error) {
      console.error("❌ Impossible de modifier le like :", error);
    }
  };

  return (
    <div
      className={`relative card glass w-96 mx-auto shadow-xl transform transition hover:scale-105 ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-600 to-gray-900 text-white"
          : "bg-gradient-to-br from-white to-green-100 text-gray-900"
      }`}
    >
      <figure className="relative">
        <img src={imageUrl} alt={project.title} className="object-cover w-full h-56" />
      </figure>

      <div className="card-body relative">
        <div className="absolute bottom-4 left-4 flex items-center space-x-2">
          <span
            onClick={handleLike}
            className="cursor-pointer text-2xl transition-transform transform hover:scale-110"
          >
            {liked ? "❤️" : "🤍"}
          </span>
          <span className="text-lg font-semibold">{likes}</span>
        </div>

        {project.category && (
          <span
            className={`px-3 py-1 text-xs font-semibold uppercase rounded-full ${
              theme === "dark" ? "bg-green-700 text-white" : "bg-green-300 text-green-900"
            }`}
          >
            {project.category}
          </span>
        )}

        <h2 className="card-title mt-2">{project.title}</h2>

        <p className="text-sm opacity-80">{project.description}</p>

        <div className="card-actions justify-end">
          <button onClick={() => navigate(`/achievements/${project.id}`)} className="btn glass">
            See more
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
