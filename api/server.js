const express = require('express');
const { pool, initializeDatabase } = require('./db');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Middleware pour parser le JSON des requêtes
app.use(express.json());

// Middleware pour gérer les CORS (Cross-Origin Resource Sharing)
// Le paquet `cors` gère automatiquement les en-têtes nécessaires,
// y compris les requêtes pre-flight (OPTIONS).
app.use(cors({
  origin: 'http://localhost:9000' // Autorise uniquement les requêtes de votre frontend
}));

// Initialisation de la base de données et démarrage du serveur
initializeDatabase().then(() => {
  // Wrapper pour gérer les erreurs des routes asynchrones
  const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

  // Routes API
  // GET toutes les tâches
  app.get('/api/tasks', asyncHandler(async (req, res) => {
    // Tri par défaut par date et heure
    const [rows] = await pool.query(`SELECT * FROM tasks ORDER BY dueDate ASC, dueTime ASC`);
    res.json(rows);
  }));

  // POST une nouvelle tâche
  app.post('/api/tasks', asyncHandler(async (req, res) => {
    const { title, done, dueDate, dueTime } = req.body;
    if (!title || !dueDate || !dueTime) {
      return res.status(400).json({ message: 'Le titre, la date et l\'heure sont requis.' });
    }
    const [result] = await pool.query(
      'INSERT INTO tasks (title, done, dueDate, dueTime) VALUES (?, ?, ?, ?)',
      [title, done || false, dueDate, dueTime]
    );
    res.status(201).json({ id: result.insertId, title, done: done || false, dueDate, dueTime });
  }));

  // PUT (mise à jour) une tâche existante (pour toggleDone)
  app.put('/api/tasks/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { done } = req.body;
    if (typeof done !== 'boolean') {
      return res.status(400).json({ message: 'Le statut "done" est requis et doit être un booléen.' });
    }
    const [result] = await pool.query(
      'UPDATE tasks SET done = ? WHERE id = ?',
      [done, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Tâche non trouvée.' });
    }
    res.json({ id, done });
  }));

  // DELETE une tâche
  app.delete('/api/tasks/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM tasks WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Tâche non trouvée.' });
    }
    res.status(204).send(); // No Content
  }));

  // POST pour supprimer plusieurs tâches
  app.post('/api/tasks/delete-multiple', asyncHandler(async (req, res) => {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'Une liste d\'IDs est requise.' });
    }
    const placeholders = ids.map(() => '?').join(',');
    const [result] = await pool.query(`DELETE FROM tasks WHERE id IN (${placeholders})`, ids);
    res.json({ message: `${result.affectedRows} tâches supprimées.` });
  }));

  // Middleware de gestion des erreurs (doit être à la fin)
  app.use((err, req, res, next) => {
    console.error(`[${req.method} ${req.path}]`, err);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  });

  // Démarrer le serveur
  const HOST = '127.0.0.1';
  app.listen(PORT, HOST, () => {
    console.log(`API REST démarrée sur http://${HOST}:${PORT}`);
  });
}).catch(err => {
  console.error('Échec du démarrage du serveur:', err);
});
