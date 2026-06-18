// Import pg-promise and initialize it
const pgp = require('pg-promise')();

// Tell the underlying 'pg' library to allow SSL (Required for Neon)
pgp.pg.defaults.ssl = { rejectUnauthorized: false };

// Connect to the database using your connection string
const db = pgp(process.env.DATABASE_URL);

// Test the connection
db.one('SELECT $1 AS value', 123)
  .then((data) => {
    console.log('Successfully connected to Postgres! Test Data:', data.value);
  })
  .catch((error) => {
    console.error('Failed to connect to Postgres:', error);
  });

// Export it so index.js can use it!
module.exports = db;