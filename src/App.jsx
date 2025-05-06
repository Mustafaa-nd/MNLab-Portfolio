import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from "./AuthContext"; 
import ProtectedRoute from "./ProtectedRoute"; 

import Home from './pages/Home';
import Achievements from './pages/Achievements'; 
import Contact from './pages/Contact';
import Studies from './pages/Studies';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CreateAchievements from "./pages/CreateAchievements";
import AchievementDetails from "./pages/AchievementDetails"; 
import Login from "./pages/Login"; 
import NotFound from "./pages/NotFound";

function AppContent() {
  const location = useLocation();

  return (
    <>
      <Navbar />
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/achievements" element={<Achievements />} /> 
          <Route path="/achievements/:id" element={<AchievementDetails />} />
          <Route path="/studies" element={<Studies />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/laboratory" element={<Login />} /> 
          <Route path="/create-achievement" element={<ProtectedRoute component={CreateAchievements} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
      <Footer />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
