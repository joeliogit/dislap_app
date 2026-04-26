const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers['authorization'];
  
  if (!bearerHeader) {
    return res.status(403).json({ message: 'Token requerido para autenticación', success: false });
  }

  const token = bearerHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'disslapp_super_secret_key_change_in_production_2026');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido o expirado', success: false });
  }
};

module.exports = verifyToken;
