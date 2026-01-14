const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

let pool;

// Check if using connection string (Supabase provides this format)
if (process.env.DATABASE_URL) {
  // Use connection string if provided (Supabase format)
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
  console.log('Using DATABASE_URL connection string');
} else {
  // Validate required environment variables
  const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    console.error('Missing required environment variables:', missingVars.join(', '));
    console.error('Please create a .env file in the backend directory with your Supabase credentials.');
    console.error('Or use DATABASE_URL connection string format.');
  }

  // Log connection details (without password)
  if (process.env.DB_HOST) {
    console.log('Connecting to:', {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER,
      database: process.env.DB_NAME,
      ssl: process.env.DB_SSL === 'true'
    });
  }

  // Create PostgreSQL connection pool for Supabase
  pool = new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: process.env.DB_SSL === 'true' || process.env.DB_SSL === '1' 
      ? { rejectUnauthorized: false } 
      : false,
    max: 20, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 30000, // Increased timeout for Supabase
  });
}

// Fail fast if pool could not be created (misconfigured env)
if (!pool) {
  throw new Error(
    'Database pool was not created. Check your DATABASE_URL or DB_* environment variables.'
  );
}

// Handle pool errors
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Export pool with execute method for compatibility
pool.execute = async (query, params) => {
  const result = await pool.query(query, params);
  return [result.rows, result];
};

module.exports = pool;

