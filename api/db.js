const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: '127.0.0.1', // Ou l'adresse IP de votre serveur MariaDB
  user: 'root', // Votre nom d'utilisateur MariaDB
  password: 'Voiturevelo10!', // Votre mot de passe MariaDB
  database: 'MyTodoAppli', // Le nom de votre base de données
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Ajout de la conversion de type pour les booléens
  typeCast: function (field, next) {
    if (field.type === 'TINY' && field.length === 1) {
      return (field.string() === '1'); // '1' => true, '0' => false
    }
    return next();
  }
});

async function initializeDatabase() {
  try {
    const connection = await pool.getConnection();
    await connection.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        done BOOLEAN DEFAULT FALSE,
        dueDate DATE,
        dueTime TIME
      )
    `);
    console.log('Table "tasks" vérifiée/créée.');
    connection.release();
  } catch (err) {
    console.error('Erreur lors de l\'initialisation de la base de données:', err);
    process.exit(1); // Quitte l'application si la connexion échoue
  }
}

module.exports = {
  pool,
  initializeDatabase
};
