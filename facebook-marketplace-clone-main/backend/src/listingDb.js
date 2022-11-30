const {Pool} = require('pg');
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});
// fill db with proper sample data, route used for search bar too
exports.getListings = async (categoryId, keyword) => {
  let select = `SELECT * FROM listing`;
  let queryValues = [];

  if (categoryId && !keyword) {
    select += ` WHERE (listing.category_id = ANY
      (SELECT id FROM category WHERE parent=$1)) OR (listing.category_id=$1)`;
    queryValues = [`${categoryId}`];
  }
  if (!categoryId && keyword) {
    select += ` WHERE listing->>'title' ILIKE $1 or 
      listing->>'description' ILIKE $1 or listing->>'location' ILIKE $1`;
    queryValues = [`%${keyword}%`];
  }
  if (categoryId && keyword) {
    select += ` WHERE ((listing.category_id =
       ANY(SELECT id FROM category WHERE parent=$1))
        OR (listing.category_id=$1)) AND
    (listing->>'title' ILIKE $2 or listing->>'description'
     ILIKE $2 or listing->>'location' ILIKE $2)`;
    queryValues = [`${categoryId}`, `%${keyword}%`];
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
  if (listings.length == 0) {
    return [];
  } else {
    return listings;
  }
};
// gets the user's listings
exports.getUserListings = async (usersId) => {
  const select = `SELECT * FROM listing where users_id = $1`;
  const query = {
    text: select,
    values: [usersId],
  };
  const {rows} = await pool.query(query);
  const listings = [];
  for (r of rows) {
    const listing = {
      'id': r.id,
      'category': r.category_id,
      'users_id': r.users_id,
      'content': r.listing,
    };
    listings.push(listing);
  };
  return listings;
};

// Creates new listing
exports.insertListing = async (categoryId, userID, info) => {
  const insert = `INSERT INTO listing(category_id, users_id, listing) VALUES
    ($1, $2, $3) RETURNING *`;
  const query = {
    text: insert,
    values: [`${categoryId}`, `${userID}`, `${JSON.stringify(info)}`],
  };
  try {
    const {rows} = await pool.query(query);
    rows[0].user_id = rows[0].users_id; // user_id !== users_id 
    delete rows[0].users_id;
    rows[0].content = rows[0].listing;
    delete rows[0].listing;
    return rows[0];
  } catch {
    return undefined;
  };
};

