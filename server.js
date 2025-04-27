import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import multer from "multer";
import dotenv from "dotenv";
import mysql from "mysql2/promise";
import path from "path";
import fs from "fs";
import pkg from 'pg';



console.log("✅ Server file loaded, waiting for requests...");

dotenv.config();
const app = express();
const PORT = 5000;


// Secure CORS setup
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(bodyParser.json());

// Connexion MySQL
const { Pool } = pkg;
const db = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false } // Render
});
// Dossier upload
const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log("📂 Dossier 'uploads' créé avec succès !");
}

// Upload config
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });


// ✅ GET achievements avec filtres
app.get("/achievements", async (req, res) => {
  const { category, search } = req.query;
  try {
    let query = "SELECT * FROM achievements";
    const values = [];

    if (category || search) {
      query += " WHERE";
      if (category) {
        query += " LOWER(category) = ?";
        values.push(category.trim().toLowerCase());
      }
      if (search) {
        if (category) query += " AND";
        query += " (LOWER(title) LIKE ? OR LOWER(description) LIKE ? OR LOWER(category) LIKE ?)";
        const term = `%${search.trim().toLowerCase()}%`;
        values.push(term, term, term);
      }
    }

    query += " ORDER BY created_at DESC"; // 🔥 Ajouter ORDER BY uniquement à la fin

    const [rows] = await db.query(query, values);
    res.json(rows);
  } catch (err) {
    console.error("Erreur GET:", err);
    res.status(500).json({ error: "Erreur lors du chargement des données" });
  }
});


// ✅ POST - Ajouter un achievement
app.post("/achievements", upload.single("image"), async (req, res) => {
  const { title, description, category } = req.body;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const [result] = await db.query(
      "INSERT INTO achievements (id, title, description, category, img) VALUES (?, ?, ?, ?, ?)",
      [Date.now(), title, description, category || "Other", imagePath]
    );
    res.status(201).json({ message: "Réalisation ajoutée avec succès", id: result.insertId });
  } catch (err) {
    console.error("Erreur POST:", err);
    res.status(500).json({ error: "Erreur lors de l'ajout du projet" });
  }
});

// ✅ PUT - Modifier un achievement
app.put("/achievements/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, category } = req.body;

  try {
    const [result] = await db.query(
      "UPDATE achievements SET title = ?, description = ?, category = ? WHERE id = ?",
      [title, description, category, id]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Projet non trouvé" });
    res.json({ message: "Projet modifié avec succès" });
  } catch (err) {
    console.error("Erreur PUT:", err);
    res.status(500).json({ error: "Erreur lors de la modification" });
  }
});

// ✅ PUT - Like/unlike
app.put("/achievements/:id/like", async (req, res) => {
  const { id } = req.params;
  const { action } = req.body;

  try {
    const [rows] = await db.query("SELECT likes FROM achievements WHERE id = ?", [id]);
    if (rows.length === 0)
      return res.status(404).json({ error: "Projet non trouvé" });

    let likes = rows[0].likes;
    let liked = false;

    if (action === "like") {
      likes += 1;
      liked = true;
    } else if (action === "unlike" && likes > 0) {
      likes -= 1;
      liked = false;
    }

    await db.query("UPDATE achievements SET likes = ?, liked = ? WHERE id = ?", [likes, liked, id]);
    res.json({ message: `Like ${action} réussi`, likes, liked });
  } catch (err) {
    console.error("Erreur LIKE:", err);
    res.status(500).json({ error: "Erreur lors du traitement du like" });
  }
});

// ✅ DELETE - Supprimer un achievement
app.delete("/achievements/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("DELETE FROM achievements WHERE id = ?", [id]);
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Projet non trouvé" });

    res.json({ message: "Projet supprimé avec succès" });
  } catch (err) {
    console.error("Erreur DELETE:", err);
    res.status(500).json({ error: "Erreur lors de la suppression" });
  }
});


app.get("/categories", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT DISTINCT category FROM achievements ORDER BY category ASC");
    const categories = rows.map((row) => row.category);
    res.json(categories);
  } catch (err) {
    console.error("Erreur GET /categories:", err);
    res.status(500).json({ error: "Erreur lors du chargement des catégories" });
  }
});

// ✅ D'abord route fixe
app.get("/achievements/recent", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM achievements ORDER BY id DESC LIMIT 3");
    res.json(rows);
  } catch (err) {
    console.error("Erreur /achievements/recent:", err);
    res.status(500).json({ error: "Server issue" });
  }
});

// ✅ Ensuite seulement route paramétrée
app.get("/achievements/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query("SELECT * FROM achievements WHERE id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ error: "Project Not Found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("Erreur GET:id:", err);
    res.status(500).json({ error: "Server issue" });
  }
});

app.use("/uploads", express.static("uploads"));


// ✅ Lancer serveur
app.listen(PORT, () => {
  console.log(`✅ Serveur backend lancé sur http://localhost:${PORT}`);
});
