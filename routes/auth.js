// routes/auth.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const { generateToken, verifyToken } = require('../auth');

const router = express.Router();

// Caminho para o arquivo JSON de usuários
const usersFilePath = path.join(__dirname, '../data/users.json');

// Função para ler usuários do arquivo JSON
function readUsers() {
  try {
    if (!fs.existsSync(usersFilePath)) {
      // Criar diretório se não existir
      const dir = path.dirname(usersFilePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      // Criar arquivo com usuários padrão
      const defaultUsers = [
        { id: 1, username: 'admin', password: 'admin123', role: 'admin' },
        { id: 2, username: 'user', password: 'user123', role: 'user' }
      ];
      fs.writeFileSync(usersFilePath, JSON.stringify(defaultUsers, null, 2));
      return defaultUsers;
    }
    
    const data = fs.readFileSync(usersFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Erro ao ler arquivo de usuários:', error);
    return [];
  }
}

// Função para salvar usuários no arquivo JSON
function saveUsers(users) {
  try {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    return true;
  } catch (error) {
    console.error('Erro ao salvar usuários:', error);
    return false;
  }
}

// Rota de login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Validações básicas
  if (!username || !password) {
    return res.status(400).json({ error: 'Usuário e senha são obrigatórios' });
  }

  const users = readUsers();
  const user = users.find(u => u.username === username && u.password === password);
  
  if (!user) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }

  // Gerar token JWT
  const token = generateToken({ 
    id: user.id, 
    username: user.username, 
    role: user.role 
  });

  res.json({
    message: 'Login realizado com sucesso',
    token,
    user: { 
      id: user.id, 
      username: user.username, 
      role: user.role 
    }
  });
});

// Rota de cadastro
router.post('/register', (req, res) => {
  const { username, password } = req.body;

  // Validar campos obrigatórios
  if (!username || !password) {
    return res.status(400).json({ error: 'Usuário e senha são obrigatórios' });
  }

  // Validar tamanho mínimo
  if (username.length < 3) {
    return res.status(400).json({ error: 'Usuário deve ter pelo menos 3 caracteres' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Senha deve ter pelo menos 6 caracteres' });
  }

  try {
    const users = readUsers();

    // Verificar se usuário já existe
    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
      return res.status(400).json({ error: 'Usuário já cadastrado' });
    }

    // Criar novo usuário
    const newUser = {
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
      username,
      password, // Em produção, use bcrypt!
      role: 'user',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);

    // Salvar no arquivo JSON
    if (saveUsers(users)) {
      res.status(201).json({ 
        message: 'Usuário cadastrado com sucesso'
      });
    } else {
      res.status(500).json({ error: 'Erro ao salvar usuário' });
    }

  } catch (error) {
    console.error('Erro no cadastro:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para verificar token (usando JWT)
router.post('/verify', (req, res) => {
  const { token } = req.body;
  
  if (!token) {
    return res.json({ valid: false, error: 'Token não fornecido' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.json({ valid: false, error: 'Token inválido ou expirado' });
  }

  res.json({ 
    valid: true, 
    user: {
      id: decoded.id,
      username: decoded.username,
      role: decoded.role
    }
  });
});

// Rota protegida de exemplo (para testar JWT)
router.get('/profile', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ error: 'Token inválido' });
  }

  res.json({ 
    message: 'Acesso autorizado',
    user: decoded
  });
});

module.exports = router;  