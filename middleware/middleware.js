
// middlewares/authenticate.js
const jwt = require('jsonwebtoken');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const app = express();

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer')) {
    return res.status(401).json({ message: 'Missing or invalid token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to request
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token invalid or expired' });
  }
};

// middlewares/check role only admin
const authAdmin = (...allowedRoles) => {
  return (req, res, next) => {
    const user = req.user;
    if (!user) return res.status(403).json({ message: 'Unauthorized' });

    if (!allowedRoles.includes(user.role_id)) {
      return res.status(403).json({ message: 'Permission denied' });
    }

    next();
  };
};

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors())
app.use(bodyParser.json());
app.use(helmet({
  hidePoweredBy: true, 
  frameguard: { action: 'sameorigin' }, 
  hsts: { 
    maxAge: 31536000, 
    includeSubDomains: true, 
    preload: true 
  }, 
}));
// Adding the CORS headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

//use bodyParser
app.use(bodyParser.json({extended: true}))
app.use(bodyParser.urlencoded({extended: true,limit: "500mb",parameterLimit: 500}))


module.exports = {
  verifyToken,
  authAdmin
};