require('dotenv').config();
const db = require('../config/db');

async function createTables() {
  try {
    console.log('Connecting to Neon and creating tables...');

    await db.none(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        text TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log(' Tables created successfully!');
    process.exit(0); // Exit the script when finished
  } catch (error) {
    console.error(' Error creating tables:', error);
    process.exit(1);
  }
}

createTables();
