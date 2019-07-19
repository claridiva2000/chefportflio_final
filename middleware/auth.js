const jwt =require('jsonwebtoken');
const secrets = require('../config/secrets.js');


module.exports = function(req, res, next){
  const token = req.header('x-auth-token');

  if(!token){
    return res.status(401).json({message: 'No token. Authorization Denied'})
  }

  try{
    const decoded = jwt.verify(token,  secrets.jwtSecret );
    req.chef = decoded.chef;
    next();
  } catch(err){
res.status(401).json({message: "token is not valid"})
  }
}