import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";


const Studies = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    const handleThemeChange = () => {
      setTheme(localStorage.getItem("theme") || "light");
    };

    window.addEventListener("themeChange", handleThemeChange);
    return () => window.removeEventListener("themeChange", handleThemeChange);
  }, []);

    return (

    <div className={`min-h-screen p-4 transition-colors duration-300 ${theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-100 text-black"}`}>
      <div className=" flex flex-col items-center justify-center breadcrumbs text-base mt-16">
        <ul className="flex space-x-2">
          <li>
            <Link to="/" className="text-green-700 hover:underline">Home</Link>
          </li>
          <li className="text-gray-500">Studies</li>
        </ul>
      </div>

      <section className="mt-16">
        <h2 className="text-4xl font-extrabold text-center mb-6">My Interests</h2>
        <div className="flex flex-col md:flex-row justify-center gap-6">
          
          <div className={`shadow-lg rounded-lg p-6 border w-full md:w-1/3 transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${theme === "dark" ? "bg-gray-700 border-green-500 text-white" : "bg-gray-400 border-green-500 text-gray-900"}`}>
            <div className="flex items-center space-x-3">
              <img src="/src/images/cyber-security.png" alt="Cybersecurity Icon" className="w-12 h-12"/>
              <h3 className="text-2xl font-bold">Cybersecurity</h3>
            </div>
            <p className="mt-2">
              Since no system is fully secure, my commitment to this field would significantly contribute 
              to a safer use of information and communication technologies for all users.
            </p>
          </div>

          <div className={`shadow-lg rounded-lg p-6 border w-full md:w-1/3 transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${theme === "dark" ? "bg-gray-700 border-green-500 text-white" : "bg-gray-400 border-green-500 text-gray-900"}`}>
            <div className="flex items-center space-x-3">
              <img src="/src/images/artificial-intelligence.png" alt="AI Icon" className="w-12 h-12"/>
              <h3 className="text-2xl font-bold">Artificial Intelligence</h3>
            </div>
            <p className="mt-2">
              Artificial intelligence attracts me because it opens up infinite possibilities for solving 
              complex problems and improving decision-making.
            </p>
          </div>

          <div className={`shadow-lg rounded-lg p-6 border w-full md:w-1/3 transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${theme === "dark" ? "bg-gray-700 border-green-500 text-white" : "bg-gray-400 border-green-500 text-gray-900"}`}>
            <div className="flex items-center space-x-3">
              <img src="/src/images/app-development.png" alt="Development Icon" className="w-12 h-12"/>
              <h3 className="text-2xl font-bold">Development</h3>
            </div>
            <p className="mt-2">
              By specializing in development, I want to contribute to digital transformation 
              by creating innovative solutions through powerful and intuitive tools that 
              facilitate users' daily lives.
            </p>
          </div>

        </div>
      </section>

      <section className="mt-16">
        <h1 className="text-4xl font-extrabold text-center mb-12">My Journey</h1>

        <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">

          <div className={`w-full md:w-1/3 p-6 shadow-lg rounded-lg transition-colors duration-300 
            ${theme === "dark" ? "bg-gray-800 text-white border-gray-600" : "bg-white text-gray-900 border-gray-300"}`}>
            <h2 className="text-2xl font-bold bg-green-900 text-white text-center py-2 rounded-t-lg">SKILLS</h2>
            <div className="p-4">
              <ul className="space-y-4">
                
                <li>
                  <div className="flex items-center space-x-3">
                    <img src="/src/images/flash.png" alt="Development Icon" className="w-8 h-8"/>
                    <h3 className="font-bold text-green-700">Programming</h3>
                  </div>
                  <ul className="ml-4 list-disc">
                    <li>Python</li>
                    <li>C</li>
                    <li>R</li>
                  </ul>
                </li>

                <li>
                  <div className="flex items-center space-x-3">
                    <img src="/src/images/flash.png" alt="Development Icon" className="w-8 h-8"/>
                    <h3 className="font-bold text-green-700">Database Administration</h3>
                  </div>
                  <ul className="ml-4 list-disc">
                    <li>MySQL</li>
                    <li>MongoDB</li>
                    <li>Oracle</li>
                  </ul>
                </li>

                <li>
                  <div className="flex items-center space-x-3">
                    <img src="/src/images/flash.png" alt="Development Icon" className="w-8 h-8"/>
                    <h3 className="font-bold text-green-700">Web Development</h3>
                  </div>
                  <ul className="ml-4 list-disc">
                    <li>HTML</li>
                    <li>CSS</li>
                    <li>JavaScript</li>
                    <li>WordPress</li>
                  </ul>
                </li>

                <li>
                  <div className="flex items-center space-x-3">
                    <img src="/src/images/flash.png" alt="Development Icon" className="w-8 h-8"/>
                    <h3 className="font-bold text-green-700">System Administration</h3>
                  </div>
                  <ul className="ml-4 list-disc">
                    <li>Linux</li>
                    <li>Windows</li>
                  </ul>
                </li>

                <li>
                  <div className="flex items-center space-x-3">
                    <img src="/src/images/flash.png" alt="Development Icon" className="w-8 h-8"/>
                    <h3 className="font-bold text-green-700">Network Services</h3>
                  </div>
                  <ul className="ml-4 list-disc">
                    <li>Routing Protocols</li>
                    <li>Client-Server Interactions</li>
                  </ul>
                </li>

                <li>
                  <div className="flex items-center space-x-3">
                    <img src="/src/images/flash.png" alt="Development Icon" className="w-8 h-8"/>
                    <h3 className="font-bold text-green-700">Security</h3>
                  </div>
                  <ul className="ml-4 list-disc">
                    <li>Security Mindset</li>
                    <li>Cybersecurity Awareness</li>
                  </ul>
                </li>
                
              </ul>
            </div>
          </div>


          <div className="w-full md:w-2/3">
            <h2 className="text-2xl font-bold border-b pb-2">🎓 Degrees and Certificates</h2>
            <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical">
              <li>
                <div className="timeline-middle">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="timeline-start mb-10 md:text-end">
                  <time className="font-mono italic">May 2024 - Present</time>
                  <div className="text-lg font-black">Master's in Information Systems and Data Engineering</div>
                  Amadou Mahtar Mbow University of Diamniadio
                </div>
                <hr />
              </li>
              <li>
                <hr className="bg-green-700"/>
                <div className="timeline-middle">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="green" className="h-5 w-5">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="timeline-end md:mb-10">
                  <time className="font-mono italic">January 2021 - May 2024</time>
                  <div className="text-lg font-black">Bachelor’s in Electronic, Computer, and Telecommunication Systems</div>
                  Amadou Mahtar Mbow University of Diamniadio
                </div>
                <hr className="bg-green-700"/>
              </li>
              <li>
                <hr className="bg-green-700" />
                <div className="timeline-middle">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="green" className="h-5 w-5">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="timeline-start mb-10 md:text-end">
                  <time className="font-mono italic">March 2023</time>
                  <div className="text-lg font-black">Computer and Internet Certificate</div>
                  ForceN Program - Cheikh Hamidou Kane Digital University & Mastercard Foundation
                </div>
                <hr className="bg-green-700"/>
              </li>
              <li>
                <hr className="bg-green-700"/>
                <div className="timeline-middle">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="green" className="h-5 w-5">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="timeline-end md:mb-10">
                  <time className="font-mono italic">December 2022</time>
                  <div className="text-lg font-black">Introduction to Cybersecurity</div>
                  Cisco Networking Academy
                </div>
                <hr className="bg-green-700"/>
              </li>
              <li>
                <hr className="bg-green-700" />
                <div className="timeline-middle">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="green" className="h-5 w-5">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="timeline-start mb-10 md:text-end">
                  <time className="font-mono italic">September 2020</time>
                  <div className="text-lg font-black">Scientific Baccalaureate, Option S2</div>
                  Cardinal Hyacinthe Thiandoum High School
                </div>
                <hr className="bg-green-700"/>
              </li>
            </ul>
          </div>
        </div>
      </section> 

      <section className="mt-16 pt-24 pb-24 relative">
        <div className="container mx-auto">
          
          <div className="flex justify-center items-center">
            <div className="relative w-36 h-36 bg-transparent rounded-full flex justify-center items-center">
              <img src="/src/images/icon-accomplishments.png" alt="Accomplishments Icon" className="relative z-1 w-24 h-24 mb-80" />
            </div>
          </div>

          <div className="relative text-center mt-6">
            <h1 className="text-6xl font-extrabold text-gray-300 inset-0 flex justify-center items-center opacity-30">
              Distinctions
            </h1>
            <div className="mt-16 relative z-10">
              <img src="/src/images/Backgroundmn-2.png" alt="Background" className="absolute opacity-70 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  w-full max-w-xl" />
            </div>
          </div>

          <div className="relative z-10 flex flex-col md:flex-row justify-center items-center gap-6 mt-26">
            
            <div className="w-64 transform transition-transform duration-300 hover:scale-105">
              <a href="/certificates">
                <img src="/src/images/certif-forceN.png" alt="ForceN Certificate" className="w-full rounded-lg shadow-lg" />
              </a>
            </div>

            <div className="w-64 transform transition-transform duration-300 hover:scale-105 bg-gradient-to-t">
              <a href="/certificates">
                <img src="/src/images/Decoration-clubhumanitaire.png" alt="Club Humanitaire Award" className="w-full  rounded-lg shadow-lg" />
              </a>
            </div>

            <div className="w-64 transform transition-transform duration-300 hover:scale-105">
              <a href="/certificates">
                <img src="/src/images/Certif-netacad.png" alt="Cisco Netacad Certificate" className="w-full rounded-lg shadow-lg" />
              </a>
            </div>

          </div>
        </div>
      </section>

      <div className="relative w-full h-screen">
  
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: "url('/src/images/mn_contact_background.jpg')" }}
        ></div>

        <div className="relative z-10 flex justify-end items-center h-screen w-full pr-12">
          
          <section className="flex flex-col items-center justify-center text-center w-1/2 h-2/4 p-6 rounded-lg">

            <div className={`mt-6 p-8 rounded-lg shadow-lg border backdrop-blur-md w-full 
              ${theme === "dark" ? "bg-gray-800 border-gray-600 text-gray-300" : "bg-gray-200 border-gray-300 text-gray-900"}`}>

              <h2 className="text-4xl font-bold text-center">Let's link up</h2>

              <div className="mt-6 flex flex-col items-center space-y-4">

                <div className="flex items-center space-x-3">
                  <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.94 5.34A2 2 0 014.92 4h10.16a2 2 0 011.98 1.34L10 9.58 2.94 5.34zM2 7.16v7.34A2 2 0 004 17h12a2 2 0 002-2V7.16l-8 4.57-8-4.57z"></path>
                  </svg>
                  <a href="mailto:moustaphand1502@gmail.com" className="text-lg font-medium hover:underline">
                  moustaphand1502@gmail.com
                  </a>
                </div>

                <div className="flex items-center space-x-3">
                  <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 2h4c.6 0 1 .4 1 1v3c0 .6-.4 1-1 1H5.4c.3 1.3.9 2.5 1.7 3.6l.9-.9c.4-.4 1-.4 1.4 0l3 3c.4.4.4 1 0 1.4l-.9.9c1.1.8 2.3 1.4 3.6 1.7V15c0-.6.4-1 1-1h3c.6 0 1 .4 1 1v4c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1z"/>
                  </svg>
                  <a href="tel:+221778860293" className="text-lg font-medium hover:underline">
                    +221 77 886 02 93
                  </a>
                </div>

              </div>
            </div>


            
          </section>
        </div>
      </div>


    </div>
  );
}
export default Studies;