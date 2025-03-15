/////////------------------------------------------------------------------------------------------
// Local Connection

// const { Pool } = require('pg');
// require('dotenv').config();

// const pool = new Pool({
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   database: process.env.DB_NAME,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
// });

// module.exports = pool;

/////////------------------------------------------------------------------------------------------
// Local Connection (using ORM)

// const { Sequelize } = require('sequelize');
// require('dotenv').config();

// const sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASSWORD,
//   {
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     dialect: 'postgres',
//     logging: false, // Set to console.log to see SQL queries
//     dialectOptions: {
//       ssl: {
//         require: true,
//         rejectUnauthorized: false // Only if you're using Heroku or similar
//       }
//     }
//   }
// );

// module.exports = sequelize;



/////////------------------------------------------------------------------------------------------
// using url and key

// const { createClient } = require('@supabase/supabase-js');
// require('dotenv').config();

// const supabaseClient = createClient(
//   process.env.SUPABASE_URL,
//   process.env.SUPABASE_KEY
// );

// module.exports = supabaseClient;



/////////------------------------------------------------------------------------------------------
// direct connection using supabase uri

// const { Pool } = require('pg');
// require('dotenv').config();

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL
//   // If you're using SSL (recommended for production):
//   // ssl: { rejectUnauthorized: false }
// });

// // Test connection
// async function testConnection() {
//   try {
//     const client = await pool.connect();
//     const result = await client.query('SELECT NOW()');
//     console.log('Connection successful:', result.rows[0]);
//     client.release();
//   } catch (error) {
//     console.error('Error connecting to the database:', error);
//   }
// }

// module.exports = pool;



/////////------------------------------------------------------------------------------------------
// direct connection using supabase uri (using ORM)
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

module.exports = sequelize;