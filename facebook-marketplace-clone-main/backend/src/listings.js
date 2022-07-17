
const listingDB = require('./listingDb');
/**
 * assumes req.categoryID exists
 * @param {*} req
 * @param {*} res
 */
exports.getAllListings = async (req, res) => {
  const listings = await listingDB
    .getListings(req.query.category, req.query.keyword);
  res.status(200).send(listings);
};
exports.getUserListings = async (req, res) => {
  const listings = await listingDB.getUserListings(req.query.users_id);
  res.status(200).send(listings);
};

exports.createAListing = async (req, res) => {
  const query = await listingDB.insertListing(
    req.body.category_id,
    req.body.user_id,
    req.body.content);
  if (query !== undefined) {
    res.status(201).send(query);
  } else {
    res.status(404).json();
  }
};

