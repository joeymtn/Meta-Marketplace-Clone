const dbc = require('./dbc');

exports.getCategory = async (req, res) => {
  const categories = await dbc.selectCategories(req.query.parent);

  if (categories) {
    res.status(200).send(categories);
  } else {
    res.status(200).send([]);
  }
};
