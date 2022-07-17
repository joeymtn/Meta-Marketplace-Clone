
const search = require('./searchDB');
/**
 * assumes req.categoryID exists
 * @param {*} req
 * @param {*} res
 */
exports.getListing = async (req, res) => {
  const listings = await search.searchListings(req.query.keyword);
  res.status(200).send(listings);
};
