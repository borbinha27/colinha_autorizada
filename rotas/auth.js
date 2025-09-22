// rotas/auth.js
const express = require('express');
const { generateToken } = require('../auth');

const router = express.Router();

// Usuários fixos para demonstração (em produção, use banco de dados)
const users = [
  { id: 1, username: 'admin', password: 'admin123', role: 'admin' },
  { id: 2, username: 'user', password: 'user123', role: 'user' }
];

// Rota de login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username && u.password === password);
  
  if (!user) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }

  const token = generateToken({ 
    id: user.id, 
    username: user.username, 
    role: user.role 
  });

  res.json({
    message: 'Login realizado com sucesso',
    token,
    user: { id: user.id, username: user.username, role: user.role }
  });
});

// Rota para verificar token
router.post('/verify', (req, res) => {
  const { token } = req.body;
  
  // A verificação real é feita no middleware, esta é simplificada
  if (token) {
    res.json({ valid: true });
  } else {
    res.json({ valid: false });
  }
});

module.exports = router;