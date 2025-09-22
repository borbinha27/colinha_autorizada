// server.js
const express = require('express');
const path = require('path');
const authRoutes = require('./routes/auth');

const app = express();

// Middleware
app.use(express.json());
app.use(express.static('public')); // Serve arquivos estáticos da pasta 'public'

// Rotas
app.use('/api/auth', authRoutes);

// Rota para a página principal (após login)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota para servir o register.html diretamente
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// Rota para servir o login.html diretamente
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});