const {Pool} = require('pg');
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});


exports.searchListings = async (keyword) => {
  let select = `SELECT * FROM listing`;
  let queryValues = [];

  if (keyword) {
    select += ` WHERE listing->>'title'
     ILIKE $1 OR listing->>'description'
      ILIKE $1 OR listing->>'location' ILIKE $1`;
    queryValues = [`%${keyword}%`];
  }

  const query = {
    text: select,
    values: queryValues,
  };
  const {rows} = await pool.query(query);
  const listings = [];
  for (r of rows) {
    const listing = {
      'id': r.id,
      'category': r.category_id,
      'user': r.user_id,
      'content': r.listing,
    };
    listings.push(listing);
  }
  return listings;
};
