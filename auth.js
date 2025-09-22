// auth.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'seu_secret_jwt_aqui'; // Use uma variável de ambiente em produção

// Gerar token JWT
function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

// Verificar token JWT
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// Middleware de autenticação
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Token de acesso requerido' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ error: 'Token inválido ou expirado' });
  }

  req.user = decoded;
  next();
}

module.exports = {
  generateToken,
  verifyToken,
  authenticateToken
};