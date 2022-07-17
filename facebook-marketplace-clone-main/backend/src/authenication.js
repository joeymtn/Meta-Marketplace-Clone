/**
 * Sources:
 * - Followed template from lecture 14: Authenication
 */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const authDB = require('./authDB');

exports.authenticate = async (req, res) => {
  const {email, password} = req.body;
  const query = await authDB.getPasswordByEmail(email);
  if (query === undefined) {
    res.status(401).send('Username or password incorrect');
    return;
  }
  const {id, users} = query;
  if (users && bcrypt.compareSync(password, users.password)) {
    const accessToken = jwt.sign(
      {id: id, email: users.email, name: users.name},
      process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES,
        algorithm: process.env.JWT_ALGORITHM,
      });
    res.status(201)
      .json({id: id, name: users.name, accessToken: accessToken});
  } else {
    res.status(401).send('Username or password incorrect');
  }
};

exports.check = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).send('Invalid token');
    }
    req.user = user;
    next();
  });
};

exports.signUp = async (req, res) => {
  const {name, email, password, phone} = req.body;
  const isExist = await authDB.getPasswordByEmail(email);
  if (isExist === undefined) {
    const hashPass = bcrypt.hashSync(password, 10);
    await authDB.insertUser({
      name: name,
      email: email,
      password: hashPass,
      phone: phone,
    });
    res.status(200).send('Signup successful');
  } else {
    res.status(409).send('user and email already exists');
  }
};
