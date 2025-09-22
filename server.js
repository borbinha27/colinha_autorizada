// server.js
const express = require('express');
const path = require('path');
const alunosRoutes = require('./rotas/alunos');
const authRoutes = require('./rotas/auth');
const logMiddleware = require('./middleware/logMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(logMiddleware);

// Rotas públicas
app.use('/api/auth', authRoutes);

// Rotas protegidas
app.use('/api/alunos', alunosRoutes);

// Rota principal - serve o frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota de login
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});