// middleware/auth.middleware.js
const jwt = require('jsonwebtoken');

function authenticateBusiness(req, res, next) {
  const authHeader = req.headers['authorization'];

  // The header should look like: "Bearer eyJhbGciOi..."
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or malformed authorization header' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach the business id to the request so later route handlers can use it.
    req.businessId = decoded.businessId;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = authenticateBusiness;