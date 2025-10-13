const express = require('express');
const { pool, initializeDatabase } = require('./db');
const app = express();
const PORT = 3000;

// Middleware pour parser le JSON des requêtes
app.use(express.json());

// Middleware pour gérer les CORS (Cross-Origin Resource Sharing)
// Cela permet à votre frontend (localhost:8080 par exemple) de communiquer avec votre backend
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080'); // Remplacez par l'URL de votre frontend si différente
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Initialisation de la base de données et démarrage du serveur
initializeDatabase().then(() => {
  // Routes API
  // GET toutes les tâches
  app.get('/api/tasks', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM tasks ORDER BY id DESC');
      res.json(rows);
    } catch (err) {
      console.error('Erreur lors de la récupération des tâches:', err);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });

  // POST une nouvelle tâche
  app.post('/api/tasks', async (req, res) => {
    const { title, done, dueDate, dueTime } = req.body;
    if (!title || !dueDate || !dueTime) {
      return res.status(400).json({ message: 'Le titre, la date et l\'heure sont requis.' });
    }
    try {
      const [result] = await pool.query(
        'INSERT INTO tasks (title, done, dueDate, dueTime) VALUES (?, ?, ?, ?)',
        [title, done || false, dueDate, dueTime]
      );
      res.status(201).json({ id: result.insertId, title, done: done || false, dueDate, dueTime });
    } catch (err) {
      console.error('Erreur lors de l\'ajout de la tâche:', err);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });

  // PUT (mise à jour) une tâche existante (pour toggleDone)
  app.put('/api/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const { done } = req.body;
    if (typeof done !== 'boolean') {
      return res.status(400).json({ message: 'Le statut "done" est requis et doit être un booléen.' });
    }
    try {
      const [result] = await pool.query(
        'UPDATE tasks SET done = ? WHERE id = ?',
        [done, id]
      );
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Tâche non trouvée.' });
      }
      res.json({ id, done });
    } catch (err) {
      console.error('Erreur lors de la mise à jour de la tâche:', err);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });

  // DELETE une tâche
  app.delete('/api/tasks/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const [result] = await pool.query('DELETE FROM tasks WHERE id = ?', [id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Tâche non trouvée.' });
      }
      res.status(204).send(); // No Content
    } catch (err) {
      console.error('Erreur lors de la suppression de la tâche:', err);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });

  // POST pour supprimer plusieurs tâches
  app.post('/api/tasks/delete-multiple', async (req, res) => {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'Une liste d\'IDs est requise.' });
    }
    try {
      const placeholders = ids.map(() => '?').join(',');
      const [result] = await pool.query(`DELETE FROM tasks WHERE id IN (${placeholders})`, ids);
      res.json({ message: `${result.affectedRows} tâches supprimées.` });
    } catch (err) {
      console.error('Erreur lors de la suppression de plusieurs tâches:', err);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });

  // Démarrer le serveur
  app.listen(PORT, () => {
    console.log(`API REST démarrée sur http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Échec du démarrage du serveur:', err);
});
