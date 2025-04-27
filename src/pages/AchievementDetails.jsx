import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Share2, ArrowLeft, Edit, Trash, Save } from "lucide-react";
import { useAuth } from "../AuthContext";

const AchievementDetails = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const handleThemeChange = () => {
      setTheme(localStorage.getItem("theme") || "light");
    };
    window.addEventListener("themeChange", handleThemeChange);
    handleThemeChange();
    return () => window.removeEventListener("themeChange", handleThemeChange);
  }, []);

  useEffect(() => {
    fetch(`${BACKEND_URL}/achievements/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Project Not Found");
        return res.json();
      })
      .then((data) => {
        setProject(data);
        setEditedTitle(data.title);
        setEditedDescription(data.description);
      })
      .catch(() => navigate("/achievements"));
  }, [id, navigate, BACKEND_URL]);

  if (!project) return <p className="text-center text-lg">Loading...</p>;

  const formattedDescription = project.description.replace(/\n/g, "<br />");

  const handleEdit = async () => {
    const response = await fetch(`${BACKEND_URL}/achievements/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editedTitle, description: editedDescription }),
    });

    if (response.ok) {
      setProject({ ...project, title: editedTitle, description: editedDescription });
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    const response = await fetch(`${BACKEND_URL}/achievements/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      navigate("/achievements");
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Project link copied!");
  };

  return (
    <div className={`mt-20 min-h-screen flex flex-col items-center justify-center p-8 transition-colors duration-300 ${
      theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"
    }`}>
      <div className="flex flex-col items-center justify-center breadcrumbs text-base mb-4">
        <ul className="flex space-x-2">
          <li><Link to="/" className="text-green-700 hover:underline">Home</Link></li>
          <li><Link to="/achievements" className="text-green-700 hover:underline">Achievements</Link></li>
          <li className="text-gray-500">{project.title}</li>
        </ul>
      </div>

      <div className="w-full max-w-4xl bg-gradient-to-r from-green-400 to-gray-500 text-white p-6 rounded-t-3xl text-center shadow-lg">
        <h1 className="text-4xl font-extrabold uppercase">
          {isEditing ? (
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="w-full p-2 bg-transparent border-b-2 border-white focus:outline-none"
            />
          ) : project.title}
        </h1>
      </div>

      <div className={`max-w-4xl w-full p-6 rounded-b-3xl shadow-2xl border transition-all ${
        theme === "dark" ? "bg-gray-950 border-green-500 shadow-green-500/50" : "bg-gray-400 border-green-700 shadow-green-700/50"
      }`}>
        <div className="relative w-full overflow-hidden rounded-lg group">
          <img
            src={project.img}
            alt={project.title}
            className="w-full h-80 object-cover rounded-lg transform group-hover:scale-105 transition-all duration-300"
          />
        </div>

        {isEditing ? (
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            className="w-full mt-4 p-2 bg-transparent border border-gray-300 rounded-lg focus:outline-none"
          />
        ) : (
          <p className="mt-6 text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: formattedDescription }}></p>
        )}

        <p className="text-sm opacity-80 mt-4">
          Last update: {new Date(project.created_at).toLocaleDateString()}
        </p>

        <div className="flex justify-between mt-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-md transition-all"
          >
            <ArrowLeft size={20} />
            Back
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md transition-all"
          >
            <Share2 size={20} />
            Share
          </button>
        </div>

        {user && user.role === "admin" && (
          <div className="flex justify-between mt-6">
            {isEditing ? (
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg shadow-md transition-all"
              >
                <Save size={20} />
                Save
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg shadow-md transition-all"
              >
                <Edit size={20} />
                Edit
              </button>
            )}

            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-md transition-all"
            >
              <Trash size={20} />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AchievementDetails;
