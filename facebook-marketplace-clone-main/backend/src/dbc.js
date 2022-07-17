const {Pool} = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

exports.selectCategories = async (parent) => {
  let select = `SELECT id, category FROM category`;
  let queryValues = [];

  if (parent) {
    select += ` WHERE parent = $1`;
    queryValues = [`${parent}`];
  } else {
    select += ` WHERE parent is null`;
  }

  const query = {
    text: select,
    values: queryValues,
  };

  const {rows} = await pool.query(query);
  if (rows.length == 0) return undefined;
  const categories = [];
  for (const row of rows) {
    const categoryObj = {
      'name': row.category.name,
      'id': row.id,
    };
    categories.push(categoryObj);
  }
  return categories;
};
