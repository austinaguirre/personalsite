const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.cookies.accessToken; // Get the token from cookies

  if (!token) {
    return res.status(401).json({ msg: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (ex) {
    res.status(400).json({ msg: 'Invalid token.' });
  }
};

module.exports = auth;
