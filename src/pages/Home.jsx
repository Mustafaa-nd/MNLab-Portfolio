import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProjectCard from "../components/ProjectCard";

const Home = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [achievementsData, setAchievementsData] = useState([]);

  useEffect(() => {
    const handleThemeChange = () => {
      setTheme(localStorage.getItem("theme") || "light");
    };

    window.addEventListener("themeChange", handleThemeChange);
    return () => window.removeEventListener("themeChange", handleThemeChange);
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/achievements/recent")
      .then((res) => res.json())
      .then((data) => {
        console.log("✅ Données chargées :", data);
        if (Array.isArray(data)) {
          setAchievementsData(data);
        } else {
          console.error("❌ Données reçues incorrectes :", data);
          setAchievementsData([]);
        }
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des données:", error);
        setAchievementsData([]);
      });
  }, []);

  return (
    <div className={`relative mt-20 w-full ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-green-900"}`}>
      
      {/* Image de fond en arrière-plan */}
      <div
        className="absolute top-0 left-0 w-full h-screen bg-cover bg-center bg-fixed"
        style={{ backgroundImage: "url('/images/MN.jpg')" }} 
      ></div>

      {/* Section Profil */}
      <section className="relative z-10 flex flex-col items-center justify-center h-screen text-center bg-black bg-opacity-60">
        <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden shadow-lg border-4 border-green-500">
          <img loading="lazy" src="/images/MN.jpg" alt="Profil" className="w-full h-full object-cover rounded-full" />
        </div>
        <div className={`mt-6 p-8 rounded-lg shadow-lg border backdrop-blur-md max-w-xl ${theme === "dark" ? "bg-gray-800 border-gray-600 text-gray-300" : "bg-white border-gray-300 text-gray-900"}`}>
          <h2 className="text-4xl font-bold">Mouhamadou Moustapha NDIAYE</h2>
          <p className="mt-4 text-lg leading-relaxed">
            "Mugiwara no Mustafaa" <br />
            If you don’t take risks, you can’t create a future. <br />
            You need to accept the fact that you're not the best and have all the will to strive to be better than anyone you face. <br />
            Push through the pain, giving up hurts more.
          </p>
        </div>
      </section>

      {/* Section Études (Timeline) */}
      <section className={`relative z-20 p-6 shadow-2xl ${theme === "dark" ? "bg-gray-800 text-gray-200" : "bg-gray-100 text-green-900"}`}>
        <h2 className="text-4xl font-bold text-center text-green-700">Study Level</h2>
        <div className="mt-6 flex justify-center">
          <ul className="timeline mt-8">
            <li className="timeline-item">
              <div className="timeline-start timeline-box text-center break-words max-w-[220px]">High School Diploma (Science Track)</div>
              <div className="timeline-middle">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="green" className="h-5 w-5">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                </svg>
              </div>
              <hr className="bg-green-700" />
            </li>
            <li>
              <hr className="bg-green-700" />
              <div className="timeline-middle">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="green" className="h-5 w-5">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="timeline-end timeline-box text-center break-words max-w-[270px]">Bachelor's Degree in Electronic Systems, Computer Science, and Telecommunications</div>
              <hr className="bg-green-700" />
            </li>
            <li>
              <hr />
              <div className="timeline-start timeline-box text-center break-words max-w-[270px]">Master's Degree in Information Systems and Data Engineering</div>
              <div className="timeline-middle">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                </svg>
              </div>
            </li>
          </ul>
        </div>
      </section>

      {/* Section Réalisations */}
      <section className={`relative z-20 text-center p-12 md:p-20 ${theme === "dark" ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-900"}`}>
        <h2 className="text-5xl font-bold mb-8 text-green-700">Some of my Achievements</h2>

        {/* Grille des cartes */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {achievementsData.slice(0, 3).map((project, index) => (
            <ProjectCard key={index} project={project} theme={theme} />
          ))}
        </div>

        {/* Bouton Voir Plus */}
        <div className="mt-8">
          <Link to="/achievements">
            <button className="btn glass">See all</button>
          </Link>
        </div>
      </section>

      {/* Call to Action */}
      <section className={`relative z-20 text-center  ${theme === "dark" ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-900"}`}>

      <div className="relative z-20  flex justify-center pb-4">
        <a href="/contact" className={`px-8 py-4 text-lg font-semibold rounded-full shadow-lg transition-transform transform hover:scale-105 ${theme === "dark" ? "bg-green-800 hover:bg-green-900 text-white" : "bg-green-600 hover:bg-green-700 text-white"}`}>
          Let's link up
        </a>
      </div>
      </section>
    </div>
  );
};

export default Home;
