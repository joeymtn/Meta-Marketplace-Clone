const fs = require('fs');
const outputFile = './data.sql';

// assumes a file mail.json is in the current directory
const tosql = (table, category, name) => {
  const items = require(`./${name}.json`);
  for (item of items) {
    delete item.id;
    // const mail = JSON.stringify(item).replace(/'/g, `''`);
    const insertCommand =
        `INSERT INTO category(id, parent, ${table}) ` +
        `VALUES ('${category}', '${JSON.stringify(item)}'); \n`;
    console.log(insertCommand);
    fs.appendFileSync(outputFile, insertCommand);
  }
};

/** Setup File output */
fs.writeFileSync(outputFile, '');
console.log(`DELETE FROM info;\n`);
fs.appendFileSync(outputFile, 'DELETE FROM info;\n');

/** Append JSON lists here */
// tosql('info', 'mock_data');
tosql('info', 'Vehicles', 'Boat Schema');
tosql('info', 'Vehicles', 'Car Schema');
tosql('info', 'Vehicles', 'MotorCycle Schema');
