// rotas/alunos.js
const express = require('express');
const { getAlunos, getAlunoById, addAluno, updateAluno, deleteAluno } = require('../database');
const { authenticateToken } = require('../auth');

const router = express.Router();

// Aplicar autenticação em todas as rotas
router.use(authenticateToken);

// GET /api/alunos - Listar todos os alunos
router.get('/', (req, res) => {
  try {
    const alunos = getAlunos();
    res.json(alunos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar alunos' });
  }
});

// GET /api/alunos/:id - Buscar aluno por ID
router.get('/:id', (req, res) => {
  try {
    const aluno = getAlunoById(req.params.id);
    
    if (!aluno) {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }
    
    res.json(aluno);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar aluno' });
  }
});

// POST /api/alunos - Criar novo aluno
router.post('/', (req, res) => {
  try {
    const { nome, cpf, telefone, email, matricula, aluno: tipoAluno, escola } = req.body;
    
    // Validação básica
    if (!nome || !cpf || !email) {
      return res.status(400).json({ error: 'Nome, CPF e email são obrigatórios' });
    }
    
    const novoAluno = addAluno({
      nome,
      cpf,
      telefone,
      email,
      matricula,
      aluno: tipoAluno,
      escola
    });
    
    res.status(201).json(novoAluno);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar aluno' });
  }
});

// PUT /api/alunos/:id - Atualizar aluno
router.put('/:id', (req, res) => {
  try {
    const aluno = getAlunoById(req.params.id);
    
    if (!aluno) {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }
    
    const alunoAtualizado = updateAluno(req.params.id, req.body);
    res.json(alunoAtualizado);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar aluno' });
  }
});

// DELETE /api/alunos/:id - Deletar aluno
router.delete('/:id', (req, res) => {
  try {
    const aluno = getAlunoById(req.params.id);
    
    if (!aluno) {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }
    
    const deleted = deleteAluno(req.params.id);
    
    if (deleted) {
      res.json({ message: 'Aluno deletado com sucesso' });
    } else {
      res.status(500).json({ error: 'Erro ao deletar aluno' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar aluno' });
  }
});

module.exports = router;