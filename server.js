// server.js
const express = require('express');
const path = require('path');
const authRoutes = require('./routes/auth');
const { authenticateToken } = require('./auth');

const app = express();

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Rotas de autenticação
app.use('/api/auth', authRoutes);

// Rota protegida exemplo
app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({ 
    message: 'Esta é uma rota protegida!',
    user: req.user
  });
});

// Rotas para páginas
app.get('/', (req, res) => {
  res.redirect('/login.html');
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// Rota para página principal (protegida)
app.get('/dashboard', authenticateToken, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Acesse: http://localhost:${PORT}`);
});