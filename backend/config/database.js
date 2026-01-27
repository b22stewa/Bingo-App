const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

// Validate required environment variables for MySQL
const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
const missingVars = requiredEnvVars.filter((name) => !process.env[name]);

if (missingVars.length > 0) {
  console.error('Missing required environment variables for MySQL:', missingVars.join(', '));
  console.error('Please create a .env file in the backend directory with your MySQL credentials.');
}

// Log connection details (without password)
if (process.env.DB_HOST) {
  console.log('Connecting to MySQL with:', {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
  });
}

// Create MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// For compatibility with existing code that expects `pool.query`
// and some parts that expect `pool.execute`.
// mysql2 already provides both with the same signature.

module.exports = pool;

