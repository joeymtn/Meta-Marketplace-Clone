const tosql = (table) => {
  console.log(`DELETE FROM ${table};`);
  const items = require(`./${table}.json`);
  for (item of items) {
    const id = item.id;
    const parent = item.parent;
    delete item.parent;
    delete item.id;
    const insertCommand =
        `INSERT INTO ${table}(id, parent, ${table}) ` +
        `VALUES ('${id}', ${parent}, '${JSON.stringify(item)}');`;
    console.log(insertCommand);
  }
};
tosql('category');
