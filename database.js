// database.js
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'alunos.json');

// Carregar dados do arquivo
const loadAlunos = () => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
  }
  return { alunos: [], nextId: 1 };
};

// Salvar dados no arquivo
const saveAlunos = (data) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Erro ao salvar dados:', error);
    return false;
  }
};

let { alunos, nextId } = loadAlunos();

// Funções para manipular os dados
const getAlunos = () => alunos;

const getAlunoById = (id) => {
  const alunoId = parseInt(id);
  return alunos.find(aluno => aluno.id === alunoId);
};

const addAluno = (alunoData) => {
  const novoAluno = {
    id: nextId++,
    ...alunoData
  };
  alunos.push(novoAluno);
  
  // Salvar no arquivo
  saveAlunos({ alunos, nextId });
  return novoAluno;
};

const updateAluno = (id, alunoData) => {
  const alunoId = parseInt(id);
  const index = alunos.findIndex(aluno => aluno.id === alunoId);
  
  if (index !== -1) {
    alunos[index] = { id: alunoId, ...alunoData };
    
    // Salvar no arquivo
    saveAlunos({ alunos, nextId });
    return alunos[index];
  }
  
  return null;
};

const deleteAluno = (id) => {
  const alunoId = parseInt(id);
  const index = alunos.findIndex(aluno => aluno.id === alunoId);
  
  if (index !== -1) {
    alunos.splice(index, 1);
    
    // Salvar no arquivo
    saveAlunos({ alunos, nextId });
    return true;
  }
  
  return false;
};

module.exports = {
  getAlunos,
  getAlunoById,
  addAluno,
  updateAluno,
  deleteAluno
};