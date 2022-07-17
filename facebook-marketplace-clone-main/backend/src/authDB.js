
const {Pool} = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});


/**
 * This function queries for user info given an email string
 * @param {String} email - A correctly formatted email of a user
 * @return {String} - user Object associated with email.
 */
exports.getPasswordByEmail = async (email) => {
  const select = `SELECT * FROM users WHERE ` +
    `users->>'email' LIKE $1`;
  const query = {
    text: select,
    values: [email],
  };
  const {rows} = await pool.query(query);
  if (rows.length > 0) {
    return rows[0];
  } else {
    return undefined;
  }
};

/**
 * This function inserts a new user into the system
 * @param {Object} user - A new user object
 */
exports.insertUser = async (user) => {
  const insert = `INSERT INTO users(users) VALUES ($1)`;
  const query = {
    text: insert,
    values: [user],
  };
  await pool.query(query);
};

