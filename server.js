import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs";
import multer from "multer";

const app = express();
const PORT = 5000;

// Servir les images stockées dans `uploads/` à la racine
app.use(express.static("uploads"));

// Servir les fichiers JSON du dossier public/data
app.use("/data", express.static("public/data"));

app.use(cors());
app.use(bodyParser.json());

const FILE_PATH = "./public/data/achievements.json";

// Vérifier et créer le dossier "uploads" s'il n'existe pas
const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log("📂 Dossier 'uploads' créé avec succès !");
}

// Configuration de multer pour stocker les images
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Réinitialiser tous les "liked" à false au démarrage
fs.readFile(FILE_PATH, "utf8", (err, data) => {
  if (!err) {
    let achievements = JSON.parse(data);
    achievements = achievements.map((proj) => ({ ...proj, liked: false }));

    fs.writeFile(FILE_PATH, JSON.stringify(achievements, null, 2), "utf8", (err) => {
      if (!err) console.log("✅ Tous les 'liked' ont été réinitialisés !");
    });
  }
});

// Charger les achievements avec recherche et filtrage
app.get("/achievements", (req, res) => {
  fs.readFile(FILE_PATH, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Erreur de lecture du fichier" });

    let achievements = JSON.parse(data);
    const { category, search } = req.query;

    if (category) {
      const normalizedCategory = category.trim().toLowerCase();
      achievements = achievements.filter(
        (proj) => proj.category && proj.category.toLowerCase() === normalizedCategory
      );
    }

    if (search) {
      const normalizedSearch = search.trim().toLowerCase();
      achievements = achievements.filter(
        (proj) =>
          proj.title.toLowerCase().includes(normalizedSearch) ||
          proj.description.toLowerCase().includes(normalizedSearch) ||
          (proj.category && proj.category.toLowerCase().includes(normalizedSearch))
      );
    }

    res.json(achievements);
  });
});

// Ajouter un achievement avec image
app.post("/achievements", upload.single("image"), (req, res) => {
  const { title, description, category } = req.body;
  const imagePath = req.file ? `${req.file.filename}` : null; 

  const newAchievement = {
    id: Date.now(),
    title,
    description,
    category: category || "Other",
    img: imagePath, 
  };

  fs.readFile(FILE_PATH, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Erreur de lecture du fichier" });

    const achievements = JSON.parse(data);
    achievements.push(newAchievement);

    fs.writeFile(FILE_PATH, JSON.stringify(achievements, null, 2), "utf8", (err) => {
      if (err) return res.status(500).json({ error: "Erreur d'écriture dans le fichier" });
      res.status(201).json({ message: "Réalisation ajoutée avec succès", achievement: newAchievement });
    });
  });
});

// Modifier un achievement
app.put("/achievements/:id", (req, res) => {
  const { id } = req.params;
  const { title, description, category } = req.body;

  fs.readFile(FILE_PATH, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Erreur de lecture du fichier" });

    let achievements = JSON.parse(data);
    const index = achievements.findIndex((proj) => proj.id.toString() === id);

    if (index === -1) return res.status(404).json({ error: "Projet non trouvé" });

    achievements[index].title = title;
    achievements[index].description = description;
    achievements[index].category = category || achievements[index].category;

    fs.writeFile(FILE_PATH, JSON.stringify(achievements, null, 2), "utf8", (err) => {
      if (err) return res.status(500).json({ error: "Erreur de modification du fichier" });
      res.status(200).json({ message: "Projet modifié avec succès" });
    });
  });
});

// Supprimer un achievement
app.delete("/achievements/:id", (req, res) => {
  const { id } = req.params;

  fs.readFile(FILE_PATH, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Erreur de lecture du fichier" });

    let achievements = JSON.parse(data);
    const updatedAchievements = achievements.filter((proj) => proj.id.toString() !== id);

    if (achievements.length === updatedAchievements.length)
      return res.status(404).json({ error: "Projet non trouvé" });

    fs.writeFile(FILE_PATH, JSON.stringify(updatedAchievements, null, 2), "utf8", (err) => {
      if (err) return res.status(500).json({ error: "Erreur lors de la suppression du projet" });
      res.status(200).json({ message: "Projet supprimé avec succès" });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Serveur backend lancé !`);
});
